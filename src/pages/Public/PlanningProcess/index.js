import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import config from "pages/auth/Plan/config/about-config";
import {RenderConfig} from 'pages/Public/theme/ElementFactory'

import GraphFactory from "components/displayComponents/graphFactory";
import geoDropdown from 'pages/auth/Plan/functions'
import {falcorGraph} from "store/falcorGraph";
import {setActiveCousubid} from 'store/modules/user'

import { Element } from 'react-scroll'
import SideMenu from 'pages/Public/theme/SideMenu'

import ElementFactory from 'pages/Public/theme/ElementFactory'

import {
    PageContainer,
    PageHeader,
    StatementText, 
    HeaderImage,
    HeaderContainer,
    SectionBox,
    SectionHeader,
    ContentHeader,
    ContentContainer,
    SectionBoxMain,
    SectionBoxSidebar,
    SidebarCallout,
    HeaderImageContainer
} 
from 'pages/Public/theme/components'
import get from "lodash.get";
const COLS = ['body'];
const emptyBody = ['<p></p>', '']
class About extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            imageReq: 'planning-image'
        }
        this.getCurrentImageKey = this.getCurrentImageKey.bind(this)
        this.getCurrentKey = this.getCurrentKey.bind(this)
    }
    getCurrentImageKey = (requirement, county= false) =>
        this.props.scope === 'global' ?
            requirement :
            requirement + '-' + this.props.user.activePlan + '-' + `${county ? this.props.user.activeGeoid : this.props.user.activeCousubid}`

    getCurrentKey = (requirement, county = false) =>
        this.props.scope === 'global' ?
            requirement :
            requirement + '-' + this.props.user.activePlan + '-' + `${county ? this.props.user.activeGeoid : this.props.user.activeCousubid}`

    async fetchFalcorDeps(){
        if (!this.props.activeCousubid || this.props.activeCousubid === 'undefined' || !this.props.user.activePlan) return Promise.resolve();
        let contentId = this.getCurrentImageKey(this.state.imageReq);
        let contentIdCounty = this.getCurrentImageKey(this.state.imageReq, true);
        let allRequirements = [];

        // get reqs to filter by jurisdictions
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

        Object.keys(config)
            .filter(section => config[section].filter(item => !item.onlyAdmin).length > 0)
            .map(section => config[section]
                .filter(item => !item.onlyAdmin)
                .map(requirement => allRequirements.push(['content', 'byId', this.getCurrentKey(requirement.requirement), COLS])))

        return this.props.falcor.get(
            ['geo', parseInt(this.props.activeCousubid), 'name'],
            ['content', 'byId', [contentId, contentIdCounty], COLS],
            ...allRequirements
        ).then(contentRes => {
            let tmpImg = get(contentRes, `json.content.byId.${contentId}.body`, null)
            tmpImg = tmpImg && !emptyBody.includes(tmpImg.trim()) ? tmpImg :
                get(config["Planning Image"][0], `pullCounty`) ?
                    get(contentRes, `json.content.byId.${contentIdCounty}.body`, '/img/sullivan-min.png') :
                    tmpImg || '/img/sullivan-min.png'

            this.setState({
                image: tmpImg,
                'currentKey': contentId,
                status: get(contentRes.json.content.byId[contentId], `attributes.status`, ''),
            })
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.activeCousubid !== this.props.activeCousubid || prevState.currentKey !== this.getCurrentImageKey(this.state.imageReq)){
            this.fetchFalcorDeps()
        }
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
                                .filter(tr => tr === this.props.activeCousubid && tmpReqs[tr])
                                .forEach(tr => a.push(...tmpReqs[tr].slice(2,-2).split(',').filter(r => r!== "")))
                            return a
                        }, [])
            }
        }
        return reqToFilter
    }
    render() {
        let emptyBody = ['<p></p>', ''];
        let reqToFilter = this.getReqsToFilter();
        let updatedConfig =
            Object.keys(config)
                .reduce((aS,section) => {
                    aS[section] = config[section]
                                    .reduce((aR, requirement) => {
                                        let tmpBody =
                                                    get(this.props.contentGraph,
                                                        [this.getCurrentKey(requirement.requirement), 'body', 'value'],
                                                        null)
                                        let shouldHide =
                                            reqToFilter.includes(requirement.requirement) ||
                                            (this.props.activeCousubid.length > 5 && requirement.showOnlyOnCounty ? requirement.showOnlyOnCounty :
                                                requirement.hideIfNull ? !(tmpBody && !emptyBody.includes(tmpBody.trim())) : false)
                                        aR.push({...requirement, onlyAdmin: requirement.onlyAdmin || shouldHide})
                                        return aR
                                    }, [])
                    return aS
            }, {})

        return (
            <PageContainer>
                <div style={{position: 'fixed', left: 0, top: 0, paddingTop: 20,width: '220px', height: '100%'}}>
                    <SideMenu config={updatedConfig} filterAdmin={true}/>
                </div>
                <div style={{marginLeft: 220}}>
                    <HeaderImageContainer img={this.state.image}>
                        <div style={{width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)', padding: 50}}>
                            <PageHeader style={{color: '#efefef'}}>Planning Process</PageHeader>
                            <div className="row">
                                <div className="col-12">
                                    <StatementText>
                                        <RenderConfig
                                            config={{'Planning Context Quote':updatedConfig['Header'].filter(f => f.title === 'Planning Process Quote')}}
                                            user={this.props.user}
                                            showTitle={false}
                                            showHeader={false}
                                            pureElement={true}
                                            autoLoad={true}
                                        />
                                    </StatementText>
                                </div>
                            </div>
                        </div>
                    </HeaderImageContainer>
                    <ContentContainer>
                            
                            
                            <div className="row">
                                <div className="col-12">
                                    <div className="element-wrapper">
                                        {
                                            Object.keys(updatedConfig)
                                                .filter(section => updatedConfig[section].filter(item => !item.onlyAdmin).length > 0)
                                                .map(section => {
                                                return (
                                                    <div>
                                                        <SectionHeader>{section}</SectionHeader>
                                                        {
                                                            updatedConfig[section]
                                                                .filter(item => !item.onlyAdmin)
                                                                .map(requirement => {
                                                                return (
                                                                    <ElementFactory 
                                                                        element={requirement} 
                                                                        user={this.props.user}
                                                                        autoLoad={true}
                                                                        showCMSFlagNotesPublic={true}
                                                                    />
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        
                    </ContentContainer>
                </div>
            </PageContainer>
        )
    }
}

const mapStateToProps = (state,ownProps) => {
    return {
        geoGraph: state.graph.geo,
        router: state.router,
        activePlan: state.user.activePlan,
        activeGeoid: state.user.activeGeoid,
        activeCousubid: state.user.activeCousubid,
        graph: state.graph,
        contentGraph: get(state.graph, `content.byId`, {}),
        formData: get(state.graph, [`forms`, 'filterRequirements'], null)
    };
};

const mapDispatchToProps = {setActiveCousubid};
export default [{
    icon: 'os-icon-pencil-2',
    path: '/planning-process',
    exact: true,
    name: 'Planning Process',
    auth: false,
    mainNav: true,
    menuSettings: {
        image: 'none',
        scheme: 'color-scheme-dark',
        position: 'menu-position-top',
        layout: 'menu-layout-full',
        style: 'color-style-default'
    },
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(About))
}];

