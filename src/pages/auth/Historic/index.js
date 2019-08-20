import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import { createMatchSelector } from 'react-router-redux'
import Element from 'components/light-admin/containers/Element'
import {authGeoid} from "../../../store/modules/user";
import CountyHeroStats from "./components/CountyHeroStats"
import GeographyScoreBarChart from "./components/GeographyScoreBarChart"
import MunicipalityStats from "./components/MunicipalityStats"
import HazardList from "./components/HazardListNew"
import HazardScoreTable from "./components/HazardScoreTable"
import CousubTotalLossTable from "./components/CousubTotalLossTable"
import FemaDisasterDeclarationsTable from "./components/FemaDisasterDeclarationsTable"
import HazardEventsTable from "./components/HazardEventsTable"
import HMGPTable from "./components/HMGPTable"

import Content from "components/cms/Content"

import {
    getColorScale,
    getColors
} from 'utils/sheldusUtils'

import {
    EARLIEST_YEAR,
    LATEST_YEAR
} from "./components/yearsOfSevereWeatherData";

class Historic extends React.Component {

    constructor(props) {
        super(props);

        /*const { params } = createMatchSelector({ path: '/historic/:geoid' })(props) || {},
            { geoid } = params;*/

        this.state = {
            geoid: this.props.geoid,
            geoLevel: this.setGeoLevel(this.props.geoid.length),
            dataType: 'severeWeather',
            colorScale: getColorScale([1, 2]),
            hazards: ['riverine']
        }
    }

    fetchFalcorDeps(geoid, geoLevel, dataType ) {
            if(!geoid)geoid = this.props.geoid;
            if(!geoLevel)geoLevel = this.state.geoLevel;
            if(!dataType)dataType = this.state.dataType;
            return this.props.falcor.get(
                ['geo', geoid, 'name'],
                ['geo', geoid, 'cousubs'],
                ['riskIndex', 'hazards'],
            )
                .then(response => {
                    const geoids = response.json.geo[geoid]['cousubs'],
                        hazards = response.json.riskIndex.hazards,
                        requests = [];
                    this.setState({ colorScale: getColorScale(hazards) });
                    this.setState({ hazards: hazards });
                    return this.props.falcor.get(
                        ['riskIndex', 'meta', hazards, ['id', 'name']],
                        ['geo', geoids, ['name']],
                        ['riskIndex', 'meta', hazards, ['id', 'name']],
                        [dataType, geoid, hazards, { from:EARLIEST_YEAR, to: LATEST_YEAR }, ['property_damage', 'total_damage']],
                    )
                })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.geoid !== this.props.geoid){
            this.setState(
                {
                    geoid: this.props.geoid,
                    geoLevel: this.setGeoLevel(this.props.geoid.length)
                });
            this.fetchFalcorDeps(this.props.geoLevel, this.props.dataType, this.props.geoid)
        }
    }

    setGeoLevel(geoid_len){
        return geoid_len < 5 ? 'state'
            : geoid_len === 5 ? 'counties'
                : geoid_len === 10 ? 'cousubs'
                    : geoid_len === 11 ? 'tracts'
                        : geoid_len === 12 ? 'blockgroup' : ''
    }
    getGeoidName() {
        try {
            return this.props.geoGraph[this.state.geoid].name;
        }
        catch (e) {
            return "Loading...";
        }
    }

    render() {
        return (
            <div className='container'>
                <Element>
                    <div className='content-i'>
                        <div className="content-box">
                            <h4 className="element-header">{ this.getGeoidName() }</h4>
                            <div className="row">
                                <div className="col-sm-8 col-xxxl-6">
                                    <div className="element-wrapper">
                                        <div className="element-box">

                                            <div className="element-box-content">
                                                <Content content_id={ `${ this.state.geoid }-about` }
                                                         top={ -20 } right={ 0 }/>
                                            </div>

                                            <div className="el-chart-w">
                                                <GeographyScoreBarChart
                                                    showYlabel={ false }
                                                    showXlabel={ false }
                                                    lossType={ 'total_damage' }
                                                    { ...this.state }/>
                                            </div>

                                            <div className="table-responsive">
                                                <CousubTotalLossTable
                                                    { ...this.state }/>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                <div className='col-sm-4 d-xxxl-none'>
                                    <div className='element-wrapper'>
                                            <div className='element-box'>
                                                <div className='row'>
                                                    <MunicipalityStats { ...this.state }/>
                                                </div>
                                            </div>

                                            <div className='element-box'>
                                                <div className='row'>
                                                    <CountyHeroStats { ...this.state }/>
                                                </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className='row'>
                                <div className= 'col-12'>
                                    <HMGPTable { ...this.state }/>
                                </div>
                            </div>

                            <div className='row'>
                                <div className= 'col-12'>
                                    <strong>1996-2017</strong>
                                    <div>The table below summarizes the loss amount due to Hazards in dollars for {this.getGeoidName() }.
                                        Severe events are considered those which caused more than $1M in damage.</div>

                                    <HazardScoreTable
                                        hazard={this.state.hazards}
                                        //hazard={'riverine'}
                                        geoid={this.state.geoid}
                                        geoLevel={'cousubs'}
                                        dataType={this.state.dataType}
                                    />

                                    <i style={{color: '#afafaf'}}>
                                        Source: <a href="https://www.ncdc.noaa.gov/stormevents/" target="_blank"> NOAA NCEI Storm Events Dataset</a>
                                    </i>
                                </div>
                            </div>

                            <div className='row'>
                                <div className= 'col-12'>
                                    {(['wildfire' , 'heatwave' , 'tsunami' , 'volcano', 'lightning'].includes(this.state.hazards)) ?
                                     ''
                                    :
                                        (
                                            <div>
                                                <h5>Presidential Disaster Declarations</h5>
                                                <Content content_id={'hazards-presidential-disaster-declarations'} />
                                                <FemaDisasterDeclarationsTable
                                                    hazard={this.state.hazards}
                                                />
                                                <i style={{color: '#afafaf'}}>Source: <a href="https://www.fema.gov/disasters" target="_blank">FEMA Disaster Declarations</a></i>
                                            </div>
                                        )
                                }
                                </div>
                            </div>

                            <div className='row'>
                                <div className= 'col-12'>
                                    {(['wildfire' , 'avalanche' , 'tsunami' , 'volcano' , '' , 'earthquake'].includes(this.state.hazards)) ?
                                     ''
                                    :
                                        (
                                            <div>
                                                <h5>Events with Highest Reported Loss in Dollars</h5>
                                                <strong>1996-2017</strong>
                                                <div>The table below summarizes the top 50 hazard events by loss in dollars. Click on a row to view the event description.</div>
                                                <HazardEventsTable
                                                    hazard={this.state.hazards}
                                                    geoid={this.state.geoid}
                                                />
                                                <i style={{color: '#afafaf'}}>Source: <a href="https://www.ncdc.noaa.gov/stormevents/" target="_blank"> NOAA NCEI Storm Events Dataset</a></i>
                                            </div>
                                        )
                                }
                                </div>
                            </div>


                        </div>
                    </div>
                </Element>
            </div>
        )
    }
}

const mapStateToProps = (state,ownProps) => {
    return {
        geoGraph: state.graph.geo,
        router: state.router,
        geoid: ownProps.computedMatch.params.geoid ?
                ownProps.computedMatch.params.geoid
                : state.user.activeGeoid ?
                    state.user.activeGeoid :
                    localStorage.getItem('geoId')
};
};

const mapDispatchToProps = {
    authGeoid
};
export default [{
    icon: 'os-icon-pencil-2',
    path: '/historic/',
    exact: true,
    name: 'Historic',
    auth: true,
    mainNav: true,
    breadcrumbs: [
        { name: 'Historic', path: '/historic' },
        { param: 'geoid', path: '/historic/' }
    ],
    menuSettings: {
        image: 'none',
        scheme: 'color-scheme-light',
        position: 'menu-position-left',
        layout: 'menu-layout-compact',
        style: 'color-style-default'
    },
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Historic))
},
    {
        icon: 'os-icon-pencil-2',
        path: '/historic/:geoid',
        exact: true,
        name: 'Historic',
        auth: true,
        mainNav: false,
        breadcrumbs: [
            { name: 'Historic', path: '/historic' },
            { param: 'geoid', path: '/historic/' }
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Historic))
    }];

