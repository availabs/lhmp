import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import {authGeoid} from "store/modules/user";
import {getColorScale} from 'utils/sheldusUtils'
import {falcorChunkerNice} from "store/falcorGraph"
import ElementBox from "components/light-admin/containers/ElementBox";
import GraphFactory from "components/displayComponents/graphFactory";
import Content from "components/cms/Content"

import config from "pages/auth/Plan/config/hazards-config";
import hazardConfig from './hazard-config'

import {EARLIEST_YEAR, LATEST_YEAR} from "./components/yearsOfSevereWeatherData";


import ElementFactory, {RenderConfig}  from 'pages/Public/theme/ElementFactory'

import SideMenu from 'pages/Public/theme/SideMenu'
import HazardsOfConcernContent from './new_components/HazardsOfConcernContent'


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
   width: 100%;
   z-index:100;
   
   }
`;

class Hazards extends React.Component {

    constructor(props) {
        super(props);
        authGeoid(this.props.user);
        this.state = {
            geoid: this.props.geoid,
            geoLevel: this.setGeoLevel(this.props.geoid.length),
            dataType: 'severeWeather',
            colorScale: getColorScale([1, 2]),
            hazards: [],
            hazard: undefined
        }
    }

    fetchFalcorDeps(geoid, geoLevel, dataType) {
        if (!geoid) geoid = this.props.geoid;
        if (!geoLevel) geoLevel = this.state.geoLevel;
        if (!dataType) dataType = this.state.dataType;
        if (!geoid || !geoLevel || !dataType) return Promise.resolve();
        return this.props.falcor.get(
            ['geo', geoid, 'name'],
            ['geo', geoid, 'cousubs'],
            ['riskIndex', 'hazards'],
        )
            .then(response => {
                const geoids = response.json.geo[geoid]['cousubs'],
                    hazards = response.json.riskIndex.hazards,
                    requests = [];
                this.setState({colorScale: getColorScale(hazards)});
                this.setState({hazards: hazards});
                return this.props.falcor.get(
                    ['riskIndex', 'meta', hazards, ['id', 'name']],
                    [dataType, geoid, hazards, {
                        from: EARLIEST_YEAR,
                        to: LATEST_YEAR
                    }, ['property_damage', 'total_damage']],
                ).then(d => {
                    return falcorChunkerNice(['geo', geoids, ['name']])
                })
            })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.geoid !== this.props.geoid) {
            this.setState(
                {
                    geoid: this.props.geoid,
                    geoLevel: this.setGeoLevel(this.props.geoid.length)
                });
            this.fetchFalcorDeps(this.props.geoLevel, this.props.dataType, this.props.geoid)
        }
    }

    setGeoLevel(geoid_len) {
        return geoid_len < 5 ? 'state'
            : geoid_len === 5 ? 'counties'
                : geoid_len === 10 ? 'cousubs'
                    : geoid_len === 11 ? 'tracts'
                        : geoid_len === 12 ? 'blockgroup' : ''
    }

    getGeoidName() {
        try {
            return this.props.geoGraph[this.state.geoid].name;
        } catch (e) {
            return "Loading...";
        }
    }

    stickyHazards(){
        return this.state.hazards && this.state.hazards.length > 0 ?
            (
                <StickySelect>
                    <select
                        style={{right:10}}
                        className="ae-side-menu"
                        id='hazard'
                        data-error="Please select county"
                        onChange={(e) => {
                            if (e.target.value !== 'none'){
                                e.target.value === 'all' ?
                                    this.setState({hazard: undefined}) :
                                    this.setState({hazard: e.target.value})
                            }
                        }}
                        value={this.state.hazard}
                    >
                        <option key={0} value={'none'}>--Select Hazard--</option>
                        <option key={1} value={'all'}> All Hazards </option>
                        {this.state.hazards.map((h,h_i) => <option key={h_i+2} value={h}>{h}</option>)}
                    </select>
                </StickySelect>
            ) : null
    }

    render() {
        if(!this.props.geoid) {
            return <React.Fragment />
        }
        return (
            <PageContainer>
                <div style={{position: 'fixed', left: 0, top: 0, paddingTop: 20,width: '220px', height: '100%'}}>
                    {this.stickyHazards()}
                    <SideMenu config={hazardConfig}/>
                </div>
                <div style={{marginLeft: 220}}>
                    <ContentContainer>
                        <SectionHeader>Hazards of Concern</SectionHeader>
                        <HazardsOfConcernContent geoid={this.props.geoid} hazard={this.state.hazard}/>
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
        geoid: ownProps.computedMatch.params.geoid ?
            ownProps.computedMatch.params.geoid
            : state.user.activeCousubid && state.user.activeCousubid !== 'undefined' ?
                state.user.activeCousubid :
                state.user.activeGeoid ?
                state.user.activeGeoid :
                localStorage.getItem('geoId')
    };
};

const mapDispatchToProps = {authGeoid};
export default [{
    icon: 'os-icon-pencil-2',
    path: '/hazards2',
    exact: true,
    name: 'Hazards2',
    auth: false,
    mainNav: true,
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

