import React from 'react';
import moment from "moment";
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {setActiveCousubid} from 'store/modules/user'
import config from "./config/review-config";
import commentsConfig from "./config/comments-config";
import megaConfig from "./config/megaConfig"
import Element from "../../../components/light-admin/containers/Element";
import ElementBox from "../../../components/light-admin/containers/ElementBox";
import styled from "styled-components";
import {RenderConfig} from "../../Public/theme/ElementFactory";
import {sendSystemMessage} from 'store/modules/messages';
import AvlFormsNewData from 'components/AvlForms/editComponents/newData.js'
import get from "lodash.get";
import AvlFormsViewData from "../../../components/AvlForms/displayComponents/viewData";
import functions, {GeoDropdown} from "./functions";
import SearchableDropDown from "../../../components/filters/searchableDropDown";

const COLS = ['content_id', 'attributes', 'body'];
const format_with_time = {
    sameDay: 'YYYY-MM-DD HH:mm:ss',
    nextDay: 'YYYY-MM-DD HH:mm:ss',
    nextWeek: 'YYYY-MM-DD HH:mm:ss',
    lastDay: 'YYYY-MM-DD HH:mm:ss',
    lastWeek: 'YYYY-MM-DD HH:mm:ss',
    sameElse: 'YYYY-MM-DD HH:mm:ss'
};

const DIV = styled.div`
* {
                      
                        border: none;
                        font-size: 1.3rem;
                        font-weight: 500;
                        text-transform: uppercase;
                        white-space: nowrap;
                        letter-spacing: 2px;
                        padding: 0px;
                        background-color: none;
                        }
`

const DIVSTATUS = styled.div`
.hoverable {
    float: right;

    position: relative;
    opacity: 0.5;
    color: #fafafa !important;
}
.hoverable:hover {
    opacity: 1;
    color: #fafafa !important;
}
.dropdownSelect {
    padding: 5px !important;
    margin-left: 5px !important;
    color: black !important;
}

.selectLabel {
    padding: 5px !important;
    margin-right: 1px !important;
    margin-bottom: 0px;
    color: black !important;
}
`
class ReviewRequirement extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            geoData: [],
            form_ids: []
        }
        this.renderComments = this.renderComments.bind(this)
        this.deleteItem = this.deleteItem.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.renderStatusTracker = this.renderStatusTracker.bind(this)
    }

    getReqsToFilter(){
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
                                .filter(tr => tr === this.props.match.params.geo && tmpReqs[tr])
                                .forEach(tr => a.push(...tmpReqs[tr].slice(2,-2).split(',').filter(r => r!== "")))
                            return a
                        }, [])
            }
        }
        return reqToFilter
    }
    async fetchFalcorDeps() {
        if (!this.props.activeGeoid) return Promise.resolve();

        // get reqs to filter by jurisdictions
        let formTypeFR = 'filterRequirements',
            formAttributesFR = ['municipality', 'hiddenRequirements']

        let response = await this.props.falcor.get(['forms', formTypeFR, 'byPlanId', this.props.activePlan, 'length'])
        let length = get(response, ['json', 'forms', formTypeFR, 'byPlanId', this.props.activePlan, 'length'], 0);
        if (length > 0) {
            await this.props.falcor.get(['forms', formTypeFR, 'byPlanId', this.props.activePlan, 'byIndex', [{
                from: 0,
                to: length - 1
            }], ...formAttributesFR])
        }

        // get element status
        let contentId = this.props.match.params.req + '-' + this.props.user.activePlan + '-' + this.props.match.params.geo

        let formType = commentsConfig[0].type,
            formAttributes = Object.keys(get(commentsConfig, `[0].attributes`, {})),
            ids = [];

        return this.props.falcor.get(['forms', formType, 'byPlanId', this.props.activePlan, 'length'], ['content', 'byId', [contentId], COLS])
            .then(response => {
                let length = response.json.forms[formType].byPlanId[this.props.activePlan].length;

                let status = get(response.json.content.byId[contentId], `attributes`, null); //"{"status": "Requirement not met"}"
                status = typeof status === 'string' ? get(JSON.parse(status), `status`, null) : get(status, `status`, null);
                this.setState({statusFromDb: status, status: status || ''});

                if (length) {
                    this.props.falcor.get(['forms', formType, 'byPlanId', this.props.activePlan, 'byIndex', [{
                        from: 0,
                        to: length - 1
                    }], ...formAttributes])
                        .then(response => {
                            let graph = response.json.forms[formType].byPlanId[this.props.activePlan].byIndex;
                            Object.keys(graph).filter(d => d !== '$__path').forEach(id => {
                                if (graph[id] &&
                                    get(graph[id], `attributes.element`, null) === this.props.match.params.req
                                    // && get(graph[id], `attributes.geoid`, null) === this.props.match.params.geo
                                ) {
                                    ids.push(graph[id])
                                }

                            })
                            ids = ids.sort((a,b) => a.id - b.id)
                            this.setState({
                                form_ids: ids
                            })
                            return response
                        })
                }
            })
    }

    deleteItem (e){
        e.persist()
        let id = e.target.id;
        this.props.sendSystemMessage(
            `Are you sure you want to delete this form with id "${ id }"?`,
            {
                onConfirm: () => this.props.falcor.call(['forms','remove'],[id])
                    .then(() => this.fetchFalcorDeps()),
                id: `delete-content-${ id }`,
                type: "danger",
                duration: 0
            }
        )
    }

    renderComments() {
        return this.state.form_ids.length ? (
            <div>
                <div>Comments</div>
                {this.state.form_ids.map((id,idI) =>
                    <React.Fragment>
                        {
                            get(this.state.form_ids[idI], `attributes.user`, null) === this.props.user.id ||
                            get(this.state.form_ids[idI], `attributes.user`, null) === this.props.user.email ?
                                <div>
                                    <label>You:</label>
                                    <span style={{float: 'right'}}>
                                        {
                                            this.state.editComment === id.id ?
                                                <button id= {id.id} className="btn btn-sm btn-outline-danger"
                                                        onClick={() => this.setState({editComment: null})}> Close </button> :
                                                <button id= {id.id} className="btn btn-sm btn-outline-primary"
                                                        onClick={() => this.setState({editComment: id.id})}> Edit </button>
                                        }
                                        <button id= {id.id} className="btn btn-sm btn-outline-danger"
                                                onClick={this.deleteItem}> Delete </button>
                                    </span>
                                </div> :
                                ['AVAIL', 'DHSES'].includes(this.props.user.activeGroup) ?
                                    <div>
                                        <label>{get(this.state.form_ids[idI], `attributes.user`, null)}:</label>
                                        <span style={{float: 'right'}}>
                                            <button id= {id.id} className="btn btn-sm btn-outline-danger"
                                                    onClick={this.deleteItem}> Delete </button>
                                        </span>
                                    </div> :
                                <div>
                                    <label>{get(this.state.form_ids[idI], `attributes.user`, null)}:</label>
                                </div>
                        }
                        {
                            this.state.editComment === id.id ?
                                <AvlFormsNewData
                                    json={commentsConfig}
                                    id={[id.id]}
                                    data = {{
                                        user: this.props.user.email,
                                        element: this.props.match.params.req,
                                        geoid: this.props.match.params.geo,
                                        created_at: moment().calendar(null,format_with_time),
                                    }}
                                    returnValue= {(e) => {
                                        this.setState({editComment: null})
                                    }}
                                /> :
                                <AvlFormsViewData
                                    json = {commentsConfig}
                                    id = {[id.id]}
                                    showHeader={false}
                                />
                        }

                    </React.Fragment>
                    )}
            </div>
        ) : null
    }

    handleSubmit(e) {
        e.preventDefault()

        if (this.state.statusFromDb !== this.state.status) {
            let contentId = this.props.match.params.req + '-' + this.props.user.activePlan + '-' + this.props.match.params.geo;

            if (this.state.statusFromDb || this.state.statusFromDb === ""){

                let attributes = this.state.status ? JSON.stringify({status: this.state.status}) : JSON.stringify({status: ''});
                let args = {'content_id': `${contentId}`, 'attributes': attributes, 'body': null};
                this.props.falcor.set({
                    paths: [
                        ['content', 'byId', [contentId], COLS]
                    ],
                    jsonGraph: {
                        content: {
                            byId: {
                                [contentId]: args
                            }
                        }
                    }
                }).then(response => {
                    response.error ?
                        this.props.sendSystemMessage(`Error occurred during editing. Please try again later.`, {type: "danger"}) :
                        this.props.sendSystemMessage(`Content successfully edited.`, {type: "success"});
                })
            }else{
                // insert

                let attributes = this.state.status ? JSON.stringify({status: this.state.status}) : JSON.stringify({status: ''});
                this.props.falcor.call(
                    ['content', 'insert'], [contentId, attributes, 'null'], [], []
                ).then(response => {
                        response.error ?
                            this.props.sendSystemMessage(`Error occurred. Please try again later.`, {type: "danger"}) :
                            this.props.sendSystemMessage(`Content successfully added.`, {type: "success"})
                    this.forceUpdate()
                    }
                )
            }
        }
    }
    renderStatusTracker(){
        return (
            <React.Fragment>
                <DIVSTATUS style={{ paddingRight: '0', display:'flex'}}>
                    <select
                        className='dropdownSelect hoverable quarterToFullWidth left btn btn-outline-primary btn-primary step-trigger-btn'
                        id={'status'}
                        value={this.state.status}
                        onChange={(e)=> this.setState({status: e.target.value})}
                    >
                        <option key={0} value={''}>Set Status</option>
                        {this.props.user.authLevel > 5 ?
                            <React.Fragment>
                                <option key={1} value={'Requirement not met'}>Requirement not met</option>
                                <option key={2} value={'Requirement met'}>Requirement met</option>
                            </React.Fragment> : null
                        }
                    </select>
                    <a className='hoverable left quarterWidth btn btn-primary step-trigger-btn'
                       onClick={this.handleSubmit}
                       style={{paddingTop: '1em'}}
                    >Submit</a>
                </DIVSTATUS>
            </React.Fragment>
        )
    }

    render() {
        let element = config.elements.filter(element => element.element === this.props.match.params.req).pop(),
            requirements = element ? element.requirements_from_software : null;
        if (!requirements) return null;
        let reqToFilter = this.getReqsToFilter();
        return (
            <div className='container'>
                <Element>
                    <DIV>
                        <h4 className='element-header' style={{display: 'flex', justifyContent: 'start'}}>
                            <span style={{'paddingTop': '0.5em'}}> Review Requirement - </span>
                            <SearchableDropDown
                                style={ {fontSize: 'small'} }
                                className={'element-header'}
                                id={'requirement'}
                                data={config.elements.map(e => ({label: e.element, value: e.element}))}
                                placeholder={'Select a Requirement'}
                                value={{label: element.element, value: element.element}}
                                hideValue={false}
                                onChange={(e) => window.location.href = `/review_requirement/${e}/${this.props.match.params.geo}`}
                            />
                            <span className='text-muted' style={{'paddingTop': '0.5em', 'paddingLeft': '0.5em'}}> Jurisdiction:</span>
                            <GeoDropdown
                                className={'text-muted'}
                                pureElement={true}
                                value={this.props.match.params.geo}
                                onChange={(e) => window.location.href = `/review_requirement/${this.props.match.params.req}/${e.target.value}`}
                            />
                            {this.renderStatusTracker()}
                        </h4>
                    </DIV>
                    <ElementBox>
                        <h6>Element Requirements</h6>
                        <div className='text-justify'>
                            {element.element_requirements}
                        </div>
                    </ElementBox>
                    {requirements.split(',')
                        .filter(r => !reqToFilter.includes(r))
                        .map(r => {
                        r = r.trim();
                        let fullElement = megaConfig.filter(mc => {
                            return mc.requirement === r
                        })[0]
                        return (
                            <ElementBox>
                                <RenderConfig
                                    config={{
                                        [r]:
                                            [{
                                                title: r,
                                                ...fullElement,
                                                requirement: r,
                                                geoId: this.props.match.params.geo,
                                                intent: element.intent,
                                            }]
                                    }
                                    }
                                    user={{...this.props.user, activeCousubid: this.props.match.params.geo}}
                                    geoGraph={this.props.geoGraph}
                                    showTitle={true}
                                    showLocation={true}
                                    // showCMSFlagNotes={true}
                                    showEdit={true}
                                    showStatusTracker={true}
                                    showHeader={false}
                                    pureElement={true}
                                />
                            </ElementBox>
                        )
                    })}
                    <ElementBox>
                        {this.renderComments()}
                        <AvlFormsNewData
                            json={commentsConfig}
                            id={[]}
                            data = {{
                                user: this.props.user.email,
                                element: this.props.match.params.req,
                                geoid: this.props.match.params.geo,
                                created_at: moment().calendar(null,format_with_time),
                            }}
                        />
                    </ElementBox>
                </Element>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        geoGraph: state.graph.geo,
        router: state.router,
        activeGeoid: state.user.activeGeoid,
        activeCousubid: state.user.activeCousubid,
        activePlan: state.user.activePlan,
        user: state.user,
        allGeo: state.geo.allGeos,
        formData: get(state.graph, [`forms`, 'filterRequirements'], null)
    };
};

const mapDispatchToProps = {setActiveCousubid, sendSystemMessage};
export default [{
    icon: 'os-icon-pencil-2',
    path: '/review_requirement/:req/:geo',
    exact: true,
    name: 'Plan Review',
    auth: true,
    authLevel: 5,
    mainNav: false,
    breadcrumbs: [
        {name: 'Review Requirement', path: '/plan_review/'},
        {param: 'req', path: '/review_requirement/'},
        {param: 'geo', path: '/review_requirement/req/'},
    ],
    menuSettings: {
        image: 'none',
        scheme: 'color-scheme-light',
        position: 'menu-position-left',
        layout: 'menu-layout-mini',
        style: 'color-style-default'
    },
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(ReviewRequirement))
}];

