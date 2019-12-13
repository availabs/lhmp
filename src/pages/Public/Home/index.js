import React from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import {createMatchSelector} from 'react-router-redux'

import SideMenu from 'pages/Public/theme/SideMenu'
import { Link, Element } from 'react-scroll'

import Analysis from './components/Analysis/'
import PlanningTeam from './components/planningTeam'
import Introduction from './components/introduction'

import LocalContext from './components/localContext/'
import HazardEvents from 'pages/Public/Hazards/components/hazardEvents/'
import NFIP from './components/NFIP'
import Assets from './components/Assets/'

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
    backgroundColor
} from 'pages/Public/theme/components'


let sideMenuConfig = [
    {
        label: 'Planning Context',
        items:  [
            {
                name:'Introduction',
                component:Introduction,
                icon: 'os-icon-layout'
            },
            {
                name:'Local Context',
                component:LocalContext,
                icon: 'os-icon-fingerprint'
            },
            {
                name:'Planning Team',
                component:PlanningTeam,
                icon: 'os-icon-users'
            },
        ]
    },
    {
        label: 'Risk',
        items: [
            {
                name:'Analysis',
                component:Analysis,
                icon: 'os-icon-layers'
            },
            {
                name:'HazardEvents',
                component:HazardEvents,
                icon: 'os-icon-others-43'
            },
            {
                name:'NFIP',
                component:NFIP,
                icon: 'os-icon-phone-21'
            },
            {
                name:'Assets',
                component:Assets,
                icon: 'os-icon-home'
            }
        ]
    },
    {
        label: 'Strategies', 
        items: [
            {
                name:'Overview',
                component:Narrative,
                icon:'os-icon-newspaper'
            },
            {
                name:'Goals & Objectives',
                component:Goals,
                icon:'os-icon-tasks-checked'
            },
            {
                name:'Capabilities',
                component:Capabilities,
                icon:'os-icon-donut-chart-1'
            },
            {
                name:'Actions',
                component:Actions,
                icon:'os-icon-grid-circles'
            },
            {
                name:'Participation',
                component:Participation,
                icon:'os-icon-cv-2'
            }
        ]
    }
]

class Public extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activePlan: this.props.user.activePlan
        }
    }

    render() {
        return (
            <div style={{backgroundColor: backgroundColor}}>
                <div style={{position: 'fixed', left: 0, top: 0, paddingTop: 20,width: '220px', height: '100%'}}>
                    <SideMenu config={sideMenuConfig}/>
                </div>
                <div style={{marginLeft: 220}}>
                    {
                        sideMenuConfig.map(section => {
                            return section.items.map(item=>{
                                let Comp = item.component
                                return (
                                    <Element name={item.name}>
                                        <Comp />
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

    //  
    // 
    // 
    // 
                    
               

const mapStateToProps = (state, ownProps) => {
    return {
        graph: state.graph.plans || {},
        router: state.router
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

