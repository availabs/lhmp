import React, {Component} from "react";
import GraphFactory from "components/displayComponents/graphFactory";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Element from "components/light-admin/containers/Element";
import ElementBox from "components/light-admin/containers/ElementBox";
import styled from "styled-components";
import {connect} from "react-redux";
import {reduxFalcor} from 'utils/redux-falcor'
import {setActiveCousubid} from 'store/modules/user'
import {getAllGeo} from 'store/modules/geo'
import SideMenu from 'pages/Public/theme/SideMenu'
import {Pagers} from "@stickyroll/pagers";
import CSS_CONFIG from 'pages/auth/css-config'
import get from "lodash.get";
import _ from 'lodash'
import SearchableDropDown from "../../../components/filters/searchableDropDown";


const DIV = styled.div`
${props => props.theme.panelDropdownScrollBar};
`;
class GD extends Component {
    constructor(props) {
        super(props);
        // getAllGeo(props.activeGeoid)
        this.state={
            geoToFilter: []
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.state.geoToFilter !== prevState.geoToFilter ||
            this.props.activeGeoid !== prevProps.activeGeoid ||
            this.props.activeCousubid !== prevProps.activeCousubid ||
            this.props.activePlan !== prevProps.activePlan || !_.isEqual(this.props.allGeo, prevProps.allGeo)){
            this.forceUpdate()
        }
    }

    // shouldComponentUpdate(nextProps, nextState): boolean {
    //     return this.state.geoToFilter !== nextState.geoToFilter ||
    //         this.props.activeGeoid !== nextProps.activeGeoid ||
    //         this.props.activeCousubid !== nextProps.activeCousubid ||
    //         nextProps.activePlan !== this.props.activePlan ||
    //         !_.isEqual(this.props.allGeo, nextProps.allGeo)
    // }

    fetchFalcorDeps(){
        if (! this.props.activePlan) return Promise.resolve();

        let formType = 'filterJurisdictions',
            formAttributes = ['county', 'municipality']
        return this.props.falcor.get(
            ['forms', formType, 'byPlanId', this.props.activePlan, 'length']
                )
                    .then(response => {
                        let length = get(response, ['json', 'forms', formType, 'byPlanId', this.props.activePlan, 'length'], 0);
                        if (length > 0) {
                            return this.props.falcor.get(['forms', formType, 'byPlanId', this.props.activePlan, 'byIndex', [{
                                from: 0,
                                to: length - 1
                            }], ...formAttributes])
                        }
                    })
    }
    getGeoToFilter(){
        let formType = 'filterJurisdictions'
        let graph = get(this.props.falcor.getCache(), [`forms`], null);
        let id = get(graph, [formType, 'byPlanId', this.props.activePlan, 'byIndex'], {})
        if(id){
            id = Object.keys(id)
                    .map(i => get(id[i], ['value', 2], null))
                    .filter(i => i)
            let data = id.map(i => get(graph, ['byId', i], {}))
            if (data){
                let geoToFilter =
                    Object.keys(data)
                        .reduce((a,g) => {
                            let tmpGeos = get(data[g], `value.attributes.municipality`, null)
                            tmpGeos = tmpGeos && typeof tmpGeos === "string" && tmpGeos.includes('[') ?
                                tmpGeos.slice(1,-1).split(',') : tmpGeos
                            if(tmpGeos) a.push(...tmpGeos)
                            return a;
                        }, [])
                return geoToFilter;
            }
        }

        return []
    }
    render(){
        const geoInfo = this.props.allGeo,
            setActiveCousubid = this.props.setActiveCousubid,
            activecousubId = this.props.activeCousubid,
            allowedGeos = Object.keys(get(this.props, `allGeo`, {}));
        let geoToFilter = this.getGeoToFilter(this.props.formData);
        let list = geoInfo ? Object.keys(geoInfo)
                    .filter(f => allowedGeos.includes(f))
                    .filter(f => !geoToFilter.includes(f))
                    .map((county, county_i) =>
                        ({
                            'label': formatName(geoInfo[county].name || geoInfo[county], county),
                            'value': county,
                        })).sort((a,b) => a.label.localeCompare(b.label)) :
            []
        return geoInfo ? (
            <div className={this.props.className || "ae-side-menu"}>
                <SearchableDropDown
                    style={this.props.pureElement ? null : {/*...{height: '5vh', width:'250px'},*/ ...this.props.colorScheme}}
                    className={this.props.className || "ae-side-menu"}
                    id={this.props.id || 'contact_county'}

                    data={list}
                    placeholder={'Select a Municipality'}
                    value={list.filter(f => f.value === (this.props.value || activecousubId))[0]}
                    hideValue={false}
                    onChange={(e) => {
                        this.props.onChange ? this.props.onChange({target:{value: e, id: this.props.id || 'contact_county'}}) : setActiveCousubid(e)
                    }}
                />

            </div>
        ) : <div>Loading...</div>
    }
}
const mapStateToProps = (state, ownProps) => {
    return {
        geoGraph: state.graph.geo,
        router: state.router,
        activePlan: state.user.activePlan,
        activeGeoid: state.user.activeGeoid,
        activeCousubid: state.user.activeCousubid,
        allGeo: state.geo.allGeos,
        formData: get(state.graph, [`forms`, 'filterJurisdictions'], null)
    };
};
const mapDispatchToProps = {setActiveCousubid, getAllGeo};

export const GeoDropdown = connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(GD));


// toggle visibility begin
class TV extends Component {
    constructor(props) {
        super(props);
        this.toggleVisibility = this.toggleVisibility.bind(this)
    }
    async fetchFalcorDeps(){
        let formType = 'filterRequirements',
            formAttributes = ['municipality', 'hiddenRequirements']

        let response = await this.props.falcor.get(['forms', formType, 'byPlanId', this.props.activePlan, 'length'])
        let length = get(response, ['json', 'forms', formType, 'byPlanId', this.props.activePlan, 'length'], 0);
        if (length > 0) {
            await this.props.falcor.get(['forms', formType, 'byPlanId', this.props.activePlan, 'byIndex', [{
                from: 0,
                to: length - 1
            }], ...formAttributes])
        }
    }

    async toggleVisibility(id, reqToFilter, element){
        let formType = 'filterRequirements'
        let edit_attributes = {
            [this.props.activeCousubid]:
                `"[${
                    reqToFilter.includes(element.requirement) ?
                        reqToFilter.length === 1 ? [] :
                            reqToFilter.filter(f => f!== element.requirement).toString()
                        : [...reqToFilter, element.requirement].toString()
                }]"`
        }

        if(!edit_attributes[this.props.activeCousubid]) return;

        let args = [formType, parseInt(this.props.activePlan), edit_attributes]
        let res = id && id.length ? await this.props.falcor.set({
                                                paths: [
                                                    ['forms', 'byId',id[0],'attributes',Object.keys(edit_attributes)]
                                                ],
                                                jsonGraph: {
                                                    forms:{
                                                        byId:{
                                                            [id[0]] : {
                                                                attributes : edit_attributes
                                                            }
                                                        }
                                                    }
                                                }
                                            }) :
                     this.props.falcor.call(['forms','insert'], args, [], [])
        return res
    }
    render() {
        let formType = 'filterRequirements'
        let graph = get(this.props.falcor.getCache(), [`forms`], null);
        let id = get(graph, [formType, 'byPlanId', this.props.activePlan, 'byIndex'], {});
        let reqToFilter;

        if(id){
            id = Object.keys(id)
                .map(i => get(id[i], ['value', 2], null))
                .filter(i => i)
            let data = id.map(i => get(graph, ['byId', i], {}))
            if (data){
                reqToFilter =
                    Object.keys(data)
                        .reduce((a,g) => {
                            let tmpReqs = get(data[g], `value.attributes`, {})
                            Object.keys(tmpReqs)
                                .filter(tr => tr === this.props.activeCousubid && tmpReqs[tr])
                                .forEach(tr => a.push(...tmpReqs[tr].slice(2,-2).split(',').filter(r => r!== "")))
                            return a
                        }, [])
            }
        }

        // add visible property in all for
        return <button className="mr-2 mb-2 btn btn-sm btn-outline-primary disabled"
                       style={{float: 'right'}}
                       onClick={() => this.toggleVisibility(id, reqToFilter, this.props.element)}
        > {id && reqToFilter.includes(this.props.element.requirement) ? `Hidden` : `Visible`}</button>
    }
}
const mapStateToPropsTV = (state, ownProps) => {
    return {
        geoGraph: state.graph.geo,
        router: state.router,
        activePlan: state.user.activePlan,
        activeGeoid: state.user.activeGeoid,
        activeCousubid: state.user.activeCousubid,
        allGeo: state.geo.allGeos,
        formData: get(state.graph, [`forms`, 'filterRequirements'], null)
    };
};

const mapDispatchToPropsTV = {setActiveCousubid, getAllGeo};

export const ToggleVisibility = connect(mapStateToPropsTV, mapDispatchToPropsTV)(reduxFalcor(TV));
// toggle visibility end


const formatName = function(name= 'no name', geoid){
    if(typeof name !== "string" || !geoid) return ''
    if (name.toLowerCase() === 'countywide') return name
    let jurisdiction =
            geoid.length === 2 ? 'State' :
                geoid.length === 5 ? 'County' :
                    geoid.length === 7 ? 'Village' :
                        geoid.length === 10 ? name.toLowerCase().includes('city') ? ' City' : 'Town' :
                            geoid.length === 11 ? 'Tract' : '';

    if (name.toLowerCase().includes(` ${jurisdiction.toLowerCase()}`)){
        name = name.toLowerCase().replace(` ${jurisdiction.toLowerCase()}`, ' (' + jurisdiction + ')')
    }else{
        name  += ' (' + jurisdiction + ')';
    }
    return name.replace(name.charAt(0), name.charAt(0).toUpperCase())
}
const renderReqNav = function(allRequirenments, pageIndex){
    return (
        <ul className='ae-main-menu '>
            {
                allRequirenments.map((f, f_i) =>
                    <li className={f_i === pageIndex ? 'active' : ''}><a href={'#' + (parseInt(f_i) + 1)}>
                        <span style={{marginLeft: 0, 'word-break': 'break-word'}}>{f}</span>
                    </a></li>
                )
            }
        </ul>
    )
}

const renderElement = function(element, section, index, user) {
    element = Object.assign(element, {title: element.title.replace('::activeGeo -', '')})
    return (
        <div
             style={{
            width: '100%',
            height: '100%',
        }}>
            <Element >
            <label style={{'width': '100%'}} className='element-header'> <h4>{section} |
                <small className='text-muted'> {element.title}
                    <span style={{padding: '5px'}}>
                        <button className="mr-2 mb-2 btn btn-sm btn-outline-info btn-rounded" type="button"
                                onClick={
                                    (e) => document.getElementById('closeMe').style.display =
                                        document.getElementById('closeMe').style.display === 'block' ? 'none' : 'block'
                                }
                        > ?
                    </button>
                    </span>
                </small>
                <ToggleVisibility
                    element={element}
                />
            </h4>
            </label>
            <div aria-labelledby="mySmallModalLabel"
                 className="onboarding-modal modal fade animated show" role="dialog"
                 id='closeMe'
                 tabIndex="0"
                 style={{display: 'none', margin: '0vh 0vw'}}
                 onClick={(e) => {
                     if (e.target.id === `closeMe`){
                         e.target.closest(`#closeMe`).style.display = 'none'
                     }
                 }}
                 aria-hidden="true">
                <div className="modal-dialog modal-centered modal-bg" style={{width: '100%', height: '50%', padding: '5vh 5vw'}}>
                    <DIV className="modal-content text-center" style={{width: '100%', height: '100%', overflow: 'auto'}}>

                        <div className="modal-header"><h6 className="modal-title">Prompt</h6>
                            <button aria-label="Close" className="close" data-dismiss="modal" type="button"
                                    onClick={(e) => e.target.closest('#closeMe').style.display = 'none'}>
                                <span aria-hidden="true"> ×</span></button>
                        </div>
                        <div className="modal-body" style={{textAlign: 'justify'}}>{element.prompt}</div>

                        <div className="modal-header"><h6 className="modal-title">Intent</h6></div>
                        <div className="modal-body" style={{textAlign: 'justify'}}>{element.intent}</div>

                        {
                            element.example ?
                                <React.Fragment>
                                    <div className="modal-header"><h6 className="modal-title">Example</h6></div>
                                    <div className="modal-body" style={{textAlign: 'justify'}}>
                                        <div>{element.example}</div>
                                    </div>
                                </React.Fragment> : null
                        }
                    </DIV>
                </div>
            </div>
                <i>
                    {
                        element.pullCounty ?
                            `This element allows you to enter jurisdiction specific content when necessary. When no jurisdiction content is entered this element pulls content from the county.` : null
                    }
                    {
                        element.nullMessage ?
                            `This element requires jurisdiction specific content.` : null
                    }
                    {
                        element.hideIfNull ?
                            `This element only applies to the county, it does not require jurisdiction specific content` : null
                    }
                </i>
                <ElementBox>
                <GraphFactory
                    graph={{type: element.type + 'Editor'}}
                    {...element}
                    user={user}
                    index={index}
                />
                    {element.callout  ?
                        (<React.Fragment>
                            <h6>Callout</h6>
                            <GraphFactory
                                graph={{type: 'content' + 'Editor'}}
                                {...{requirement: element.requirement + 'callout'}}
                                user={user}
                                index={index}
                            />
                        </React.Fragment>) : <React.Fragment/>}
                </ElementBox>
            </Element>
        </div>
    )
}

const render = function(config, user, geoInfo, setActiveCousubid, activecousubId,allowedGeos, reqId, baseLink){
    let PageList = [];
    let sections = {};
    let allRequirenments = [];
    let initReqId = null
    Object.keys(config)
        .filter(f => typeof config[f] !== "string")
        .map((section,sectionI) => {
        sections[section] = [];
        config[section]
            .filter((f,fI) => {if (reqId){ return f.requirement === reqId }else if(sectionI === 0 && fI === 0) {initReqId = f.requirement; return true}})
            .map((requirement, req_i) => {
            allRequirenments.push(requirement.title);
            PageList.push(renderElement({...requirement, scope: config['scope']}, section, req_i, user));
            sections[section].push(PageList.length - 1)

        })
    });
    return (
        <div key={reqId} name={reqId} id={reqId}>
            <div style={{position: 'fixed', left: 50, top: 0, paddingTop: 0,width:  CSS_CONFIG.reqNavWidth, height: '100%'}}>
                <div
                    className='ae-side-menu'
                    style={{
                        height: '5vh',
                        width: CSS_CONFIG.reqNavWidth,
                        position: 'fixed',
                        display: 'block',
                        zIndex:100
                    }}>
                    {<GeoDropdown />}
                </div>
                <SideMenu config={config} linkToReq={true} linkPath={baseLink} currReq={reqId || initReqId}/>
            </div>
            <div
                style={{
                    width: `calc(100% - ${CSS_CONFIG.reqNavWidth}))`,
                    height: '100%',
                    marginLeft: `calc(${CSS_CONFIG.reqNavWidth})`,
                    display: 'absolute',
                    alignContent: 'stretch',
                    alignItems: 'stretch',
                }}>
                <Pagers useContext={true}/>


                <div style={{
                    height: '100vh',
                    width: '100%',
                }}>

                    {PageList.pop()}
                </div>
            </div>
        </div>
    );

}
export default {
    renderReqNav: renderReqNav,
    renderElement: renderElement,
    render : render,
    //geoDropdown: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(geoDropdown)),
    formatName: formatName
}

