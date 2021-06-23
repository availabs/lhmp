import React from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import {createMatchSelector} from 'react-router-redux'

import SideMenu from 'pages/Public/theme/SideMenu'
import { Link, Element } from 'react-scroll'

import Analysis from './components/Risk/HazardLoss/'
import PlanningTeam from './components/PlanningContext/planningTeam'
import Introduction from './components/PlanningContext/introduction'

import LocalContext from './components/PlanningContext/localContext/'
import HazardEvents from 'pages/Public/Hazards/components/hazardEvents/'
import NFIP from './components/Risk/NFIP'
import Assets from './components/Risk/Assets/'
import CapabilitiesOverview from './components/Strategy/Capabilities-Overview'
import Narrative from './components/Strategy/Narrative'
import Goals from './components/Strategy/Goals'
import Capabilities from './components/Strategy/Capabilities'
import Actions from './components/Strategy/Actions'

import Participation from './components/Strategy/Participation'

import {
    VerticalAlign,
    ContentHeader,
    PageContainer,
    HeaderContainer,
    backgroundColor, PageHeader, SectionBox, SectionBoxMain, ContentContainer
} from 'pages/Public/theme/components'
import ElementFactory, {RenderConfig} from "../theme/ElementFactory";
import HMGPTable from "./components/Strategy/Actions/HMGPTable";
import config from "../../auth/Plan/config/landing-config";
import get from "lodash.get";

let sideMenuConfig = {
    'Planning Context' : [
        {
            title:'Introduction',
            component: Introduction,
            icon: 'os-icon-layout'
        },
        {
            title:'Local Context',
            component:LocalContext,
            icon: 'os-icon-fingerprint'
        },
        {
            title:'Planning Team',
            component:PlanningTeam,
            icon: 'os-icon-users'
        },
    ],
    'Risk' : [
        {
            title:'Hazard Loss',
            component:Analysis,
            icon: 'os-icon-layers'
        },
        {
            title:'Hazard Events',
            component:HazardEvents,
            icon: 'os-icon-others-43'
        },
        {
            title:'NFIP',
            component:NFIP,
            defaultSortCol: 'Jurisdiction',
            // defaultSortOrder: 'desc',
            colOrder: ['Jurisdiction', 'total claims', 'paid claims', 'total payments'],
            // minHeight: '80vh',
            icon: 'os-icon-phone-21'
        },
        {
            title:'Assets',
            component:Assets,
            defaultSortCol: 'Municipality',
            // defaultSortOrder: 'desc',
            colOrder: ['Municipality', 'Total #', 'Total Replacement $', 'Flood 100 #', 'Flood 100 Replacement $', 'Flood 500 #', 'Flood 500 Replacement $'],
            minHeight: '80vh',
            icon: 'os-icon-home'
        }
    ],
    'Strategies' : [
        {
            title:'Overview',
            component:Narrative,
            icon:'os-icon-newspaper',
            // showOnlyOnCounty: true
        },
        {
            title:'Goals & Objectives',
            component:Goals,
            icon:'os-icon-tasks-checked',
            // showOnlyOnCounty: true
        },
        // {
        //     title:'Capabilities Overview',
        //     component:CapabilitiesOverview,
        //     icon:'os-icon-donut-chart-1'
        // },
        // {
        //     title:'Capabilities Table',
        //     component:Capabilities,
        //     defaultSortCol: 'Capability Region',
        //     // defaultSortOrder: 'desc',
        //     colOrder: ['Capability Region', 'Population', 'Education and outreach',	'Planning/Regulatory', 'Financial', 'Administrative and Technical'],
        //     // minHeight: '80vh',
        //     icon:'os-icon-donut-chart-1'
        // },
        {
            title: 'Capabilities Table',
            icon:'os-icon-donut-chart-1',
            // showOnlyOnCounty: true,
            component:
                () => (
                    <PageContainer>
                        <HeaderContainer>
                            {/*<ContentContainer>
                                <SectionBox>

                                    <SectionBoxMain>
                                        <RenderConfig
                                            config={{'Goals and Objectives Text':config['Goals and Objectives Text']}}
                                            user={this.props.user}
                                            showTitle={false}
                                            showHeader={false}
                                        />
                                    </SectionBoxMain>

                                </SectionBox>
                            </ContentContainer>*/}
                            <div className='row'>
                                <div className='col-12'>
                                    <VerticalAlign>
                                        <div>
                                            <ElementFactory
                                                element={
                                                    {
                                                        title: 'Capabilities',
                                                        requirement: 'Req-C-1A',
                                                        type: 'formTable',
                                                        fontSize: '0.70em',
                                                        height: '600px',
                                                        align: 'full',
                                                        config: {
                                                            description: 'Capabilities are the tools and resources used by a community to minimize hazard impacts. Capabilities are categorized as: Planning and Regulatory, Administrative and Technical, Education and Outreach, and Financial assets. The information displayed in the table below includes the selected jurisdiction’s hazard mitigation capabilities. When the county is selected, the table includes capabilities for all jurisdictions in the plan, otherwise the table filters to the selected jurisdiction.', 
                                                            type: 'capabilities',
                                                            //filters:[{column:'capability_category',value:'planning and regulatory'}],
                                                            columns : [
                                                                {
                                                                    Header: 'Jurisdiction',
                                                                    accessor: 'municipality',
                                                                    sort: true,
                                                                    filter: 'default'
                                                                },
                                                                {
                                                                    Header: 'Name',
                                                                    accessor: 'capability_name',
                                                                    sort: true,
                                                                    filter: 'default'
                                                                },
                                                                {
                                                                    Header: 'category',
                                                                    accessor: 'capability_category',
                                                                    sort: true,
                                                                    filter: 'multi'
                                                                },
                                                                {
                                                                    Header: 'type',
                                                                    accessor: 'capability_type',
                                                                    sort: true,
                                                                    filter: 'multi'
                                                                },

                                                              /*  {
                                                                    Header: 'adopting authority',
                                                                    accessor: 'adopting_authority',
                                                                    sort: true,
                                                                    filter: 'default'
                                                                },*/
                                                                {
                                                                    Header: 'responsible authority',
                                                                    accessor: 'responsible_authority',
                                                                    sort: true,
                                                                    filter: 'default'
                                                                },
                                                                {
                                                                    Header: 'Link',
                                                                    accessor: 'upload',
                                                                    width: 50,
                                                                    expandable: 'true',
                                                                    expandableHeader: true
                                                                },
                                                                {
                                                                    Header: 'capability_description',
                                                                    accessor: 'capability_description',
                                                                    width: 50,
                                                                    expandable: 'true',
                                                                    expandableHeader: true
                                                                },
                                                                {
                                                                    Header: 'viewLink',
                                                                    accessor: 'viewLink',
                                                                    width: 50,
                                                                    expandable: 'true',
                                                                    expandableHeader: true
                                                                },
                                                            ]
                                                        },
                                                        prompt: 'Document each jurisdiction’s existing authorities, policies, programs and resources and its ability' +
                                                            ' to expand on and improve these existing policies and program ' +
                                                            ' a. Examples: Staff involved local planning activities,' +
                                                            ' public works/emergency management, funding through taxing authority and annual budgets, regulatory authorities' +
                                                            ' for comp. Planning building codes and ordinances',
                                                        intent: 'To ensure that each jurisdiction evaluates its capabilities to accomplish hazard mitigation actions,' +
                                                            ' through existing mechanisms. This is especially useful for multi‐jurisdictional plans where local' +
                                                            ' capability varies widely.',
                                                        viewLink: true,
                                                        flex: false,
                                                        activeGeoFilter: 'true',
                                                        defaultSortCol: 'adopting_authority',
                                                        // defaultSortOrder: 'desc',
                                                        colOrder: ['Jurisdiction','Name', 'category', 'type', 'Link', 'responsible authority', 'capability_description', 'viewLink'],
                                                        minHeight: '80vh',
                                                        icon: 'os-icon-tasks-checked'
                                                    }
                                                }
                                                autoLoad={true}
                                            />
                                        </div>
                                    </VerticalAlign>
                                </div>
                            </div>
                        </HeaderContainer>
                    </PageContainer>
                )
        },
        // {
        //     title:'Actions',
        //     component:Actions,
        //     defaultSortCol: 'Jurisdiction',
        //     // defaultSortOrder: 'desc',
        //     colOrder: ['Jurisdiction', 'Approved', 'Finished', 'Completed'],
        //     minHeight: '80vh',
        //     icon:'os-icon-grid-circles'
        // }
        {
            title:'Actions',
            component:
                () => (
                    <PageContainer>
                        <HeaderContainer>
                            {/*<ContentContainer>
                                <SectionBox>

                                    <SectionBoxMain>
                                        <RenderConfig
                                            config={{'Goals and Objectives Text':config['Goals and Objectives Text']}}
                                            user={this.props.user}
                                            showTitle={false}
                                            showHeader={false}
                                        />
                                    </SectionBoxMain>

                                </SectionBox>
                            </ContentContainer>*/}
                            <div className='row'>
                                <div className='col-12'>
                                    <VerticalAlign>
                                        <div>
                                            <ElementFactory
                                                element={
                                                    {
                                                        title: 'Proposed Actions',
                                                        requirement: 'Req-C-4',
                                                        type: 'actionsFilteredListTable',
                                                        filterBy: ['Proposed-HMP'],
                                                        filterCol: ['action_status_update'],
                                                        align: 'full',
                                                        prompt: 'Action form to be designed later. The plan must include a mitigation strategy that 1) analyzes actions' +
                                                            ' and/or projects that the jurisdiction considered to reduce the impacts of hazards identified in the risk' +
                                                            ' assessment, and 2) identifies the actions and/or projects that the jurisdiction intends to implement.' +
                                                            ' a. Each jurisdiction participating in the plan must have mitigation actions specific to that jurisdiction' +
                                                            ' that are based on the community’s risk and  vulnerabilities, as well as community priorities.' +
                                                            ' b. The plan must identify the position, office, department, or agency responsible for implementing and' +
                                                            ' administering the action (for each jurisdiction), and identify potential funding sources and expected' +
                                                            ' timeframes for completion. ',
                                                        intent: 'To ensure the hazard mitigation actions are based on the identified hazard vulnerabilities, are within' +
                                                            ' the capability of each jurisdiction, and reduce or avoid future losses.  This is the heart of the' +
                                                            ' mitigation plan, and is essential to leading communities to reduce their risk.  Communities, not FEMA,' +
                                                            ' “own” the hazard mitigation actions in the strategy.' +
                                                            ' a. Mitigation actions and projects means a hazard mitigation action, activity or process (for example,' +
                                                            '  adopting a building code) or it can be a physical project (for example, elevating structures or retrofitting' +
                                                            ' critical  infrastructure) designed to reduce or eliminate the long term risks from hazards.' +
                                                            ' b. Integrate elements of Req-C-5 and Req-C-6',
                                                        viewLink: true,
                                                        activeGeoFilter: 'true',
                                                        defaultSortCol: 'action_jurisdiction',
                                                        // defaultSortOrder: 'desc',
                                                        //renameCols: {'viewLink': 'view'}, // new name should match colOrder names.
                                                        colOrder: ['viewLink','action_jurisdiction', 'action_name', 'associated_hazards', 'priority_score', 'estimated_timeframe_for_action_implementation', 'estimated_cost_range', 'lead_agency_name_text', 'action_status_update', 'action_description', 'description_of_problem_being_mitigated', 'problem_statement'],
                                                        minHeight: '80vh',
                                                        icon: 'os-icon-activity',

                                                    }
                                                }
                                                autoLoad={true}
                                            />
                                        </div>
                                    </VerticalAlign>
                                </div>
                            </div>
                        </HeaderContainer>
                    </PageContainer>
                ),
            icon:'os-icon-grid-circles',
            // showOnlyOnCounty: true
        }
    ]
}
class Public extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activePlan: this.props.user.activePlan
        }
    }

    render() {
        let updatedConfig =
            Object.keys(sideMenuConfig)
                .reduce((aS,section) => {
                    aS[section] = sideMenuConfig[section]
                        .reduce((aR, requirement) => {

                            let shouldHide = this.props.activeCousubid && this.props.activeCousubid.length > 5 && requirement.showOnlyOnCounty ? requirement.showOnlyOnCounty : false
                            aR.push({...requirement, onlyAdmin: requirement.onlyAdmin || shouldHide})
                            return aR
                        }, [])
                    return aS
                }, {})
        return (
            <div style={{backgroundColor: backgroundColor}}>
                <div style={{position: 'fixed', left: 0, top: 0, paddingTop: 20,width: '220px', height: '100%'}}>
                    <SideMenu config={updatedConfig} filterAdmin={true}/>
                </div>
                <div style={{marginLeft: 220}}>
                    {
                        Object.keys(updatedConfig)
                            .filter(section => this.props.activeCousubid && this.props.activeCousubid.length > 5 ? updatedConfig[section].filter(item => !item.showOnlyOnCounty).length > 0 : true)
                            .map(section => {
                            return updatedConfig[section]
                                .filter(f => this.props.activeCousubid && this.props.activeCousubid.length > 5 ? !f.showOnlyOnCounty : true)
                                .map(item=>{
                                let Comp = item.component
                                return (
                                    <Element name={item.title} key={item.title}>
                                        <Comp {...item} user={this.props.user}/>
                                    </Element>
                                )
                            })
                        })
                    }
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state, ownProps) => {
    return {
        graph: state.graph.plans || {},
        router: state.router,
        activePlan:state.user.activePlan,
        activeCousubid:state.user.activeCousubid,
        user: state.user
    };
};

const mapDispatchToProps = {};
export default [{
    icon: 'os-icon-home',
    path: '/',
    exact: true,
    name: 'Home',
    auth: false,
    mainNav: true,
    breadcrumbs: [
        {name: 'Home', path: '/'},
        {param: 'geoid', path: '/'}
    ],
    menuSettings: {
        image: 'none',
        scheme: 'color-scheme-dark',
        position: 'menu-position-top',
        layout: 'menu-layout-full',
        style: 'color-style-default'
    },
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Public))
}];

