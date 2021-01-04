import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import {authGeoid} from "store/modules/user";
import {getColorScale} from 'utils/sheldusUtils'
import get from 'lodash.get'
import {falcorChunkerNice} from "store/falcorGraph"
import ElementBox from "components/light-admin/containers/ElementBox";
import GraphFactory from "components/displayComponents/graphFactory";
import Content from "components/cms/Content"

import config from "pages/auth/Plan/config/hazards-config";
import hazardConfig from './hazard-config'

import {EARLIEST_YEAR, LATEST_YEAR} from "./components/yearsOfSevereWeatherData";


import ElementFactory, {RenderConfig}  from 'pages/Public/theme/ElementFactory'

import SideMenu from 'pages/Public/theme/SideMenu'
import HazardSideMenu from './new_components/HazardSideMenu'
import Hazard from './new_components/Hazard'
import HazardHeroStats from './new_components/HazardHeroStats'


import styled from "styled-components";


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


const StickySelect = styled.div`
   margin-top: 30px
   select {
   
   height: 5vh;
   width: 90%;
   z-index:100;
   
   }
`;

class Hazards extends React.Component {

    constructor(props) {
        super(props);
        authGeoid(this.props.user);
        this.state = {
            geoLevel: this.setGeoLevel(this.props.activeGeoid.length),
            dataType: 'severeWeather',
            colorScale: getColorScale([1, 2]),
            hazards: [],
            hazard: undefined,
            firstLoad: true
        }
        this.changeHazard = this.changeHazard.bind(this)
    }


    fetchFalcorDeps(geoLevel, dataType,geoid) {
        if (!geoid) geoid = this.props.geoid;
        if (!dataType) dataType = this.state.dataType;
        return this.props.falcor.get(
            ['riskIndex', 'hazards'],
        )
        .then(response => {
           
            let hazards = response.json.riskIndex.hazards
            let contentIds = []
                hazards.map(req => {
                contentIds.push(`req-B1-${req}-${this.props.planId}-${this.props.geoid}`, `req-B1-${req}-${this.props.planId}-${this.props.geoid}-image`)
            })
            
            return this.props.falcor.get(
                ['riskIndex', 'meta', hazards, ['id', 'name']],
                ['content', 'byId', contentIds, ['body']],
                [dataType, geoid, hazards, 'allTime', 'total_damage']
            ).then(response => {
                let data = response.json[dataType][geoid]
                let hazards = Object.keys(data)
                    .filter(k => k !== '$__path')
                    .filter(k => data[k].allTime.total_damage > 0)
                    .sort((a,b) => data[b].allTime.total_damage - data[a].allTime.total_damage)

                if(!this.state.hazard){
                    this.setState({
                        hazards,
                        hazard : '',//hazards[0]
                    })
                }else{
                    this.setState({hazards})
                }

            })
        })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.geoid !== this.props.geoid) {
            this.setState(
                {
                    geoLevel: this.setGeoLevel(this.props.geoid.length)
                });
            this.fetchFalcorDeps(this.props.geoLevel, this.props.dataType, this.props.geoid)
        }
    }

    setGeoLevel(geoid_len) {
        return geoid_len === 2 ? 'state'
            : geoid_len === 5 ? 'counties'
                : geoid_len === 7 ? 'villages'
                    : geoid_len === 10 ? 'cousubs'
                        : geoid_len === 11 ? 'tracts'
                            : geoid_len === 12 ? 'blockgroup' : ''
    }

    getGeoidName() {
        try {
            return this.props.geoGraph[this.props.geoid].name;
        } catch (e) {
            return "Loading...";
        }
    }

    changeHazard(e, a) {
        console.log('haz changed', e.target.value, a)
        this.setState({hazard:e.target.value, firstLoad: false})
    }
    render() {
        if(!this.props.geoid) {
            return <React.Fragment />
        }
        return (
            <PageContainer>
                <div style={{position: 'fixed', left: 0, top: 0, paddingTop: 20,width: '230px', height: '100%'}}>
                   
                    <HazardSideMenu 
                        config={hazardConfig}
                        geoid={this.props.activeGeoid}
                        changeHazard={this.changeHazard}
                        {...this.state}
                    />
                </div>
                <div >
                    <ContentContainer style={{maxWidth:900}}>
                        <section>
                          {this.state.hazard}  
                        </section>
                        <section>
                            <SectionHeader>
                                {get(this.props.geoGraph, [this.props.activeGeoid, 'name'])} Hazards of Concern</SectionHeader>
                            <HazardHeroStats
                                {...this.state}
                                geoid={this.props.activeGeoid}
                                changeHazard={this.changeHazard}
                            />
                           <Hazard 
                                geoid={this.props.geoid}
                                activeGeoid={this.props.activeGeoid}
                                hazard={this.state.hazard}
                                geoLevel={'counties'} 
                                hazards={this.state.hazards}
                                riskIndexMeta={this.props.riskIndexMeta}
                            />
                        {/*this.state.geoLevel*/ }
                        </section>
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
        planId: state.user.activePlan,
        activeGeoid: state.user.activeGeoid,
        geoid: ownProps.computedMatch.params.geoid ?
            ownProps.computedMatch.params.geoid
            : state.user.activeCousubid && state.user.activeCousubid !== 'undefined' ?
                state.user.activeCousubid :
                state.user.activeGeoid ?
                state.user.activeGeoid :
                localStorage.getItem('geoId'),
        riskIndexMeta: get(state.graph, `riskIndex.meta`, {})
    };
};

const mapDispatchToProps = {authGeoid};
export default [{
    icon: 'os-icon-pencil-2',
    path: '/hazards2',
    exact: true,
    name: 'Hazards',
    auth: false,
    mainNav: false,
    breadcrumbs: [
        { name: 'Hazards', path: '/hazards' }],
     menuSettings: {
        image: 'none',
        scheme: 'color-scheme-dark',
        position: 'menu-position-top',
        layout: 'menu-layout-full',
        style: 'color-style-default'
    },
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Hazards))
},{
    icon: 'os-icon-pencil-2',
    path: '/hazards2/:geoid',
    exact: true,
    name: 'Hazards 2',
    auth: false,
    mainNav: false,
    
    menuSettings: {
        image: 'none',
        scheme: 'color-scheme-dark',
        position: 'menu-position-top',
        layout: 'menu-layout-full',
        style: 'color-style-default'
    },
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Hazards))
}];

