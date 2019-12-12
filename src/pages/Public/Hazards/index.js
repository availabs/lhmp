import React from 'react';
import { connect } from 'react-redux';
import styled from "styled-components";
import { reduxFalcor } from 'utils/redux-falcor'
import {authGeoid} from "store/modules/user";
import {getColorScale} from 'utils/sheldusUtils'
import {falcorChunkerNice} from "store/falcorGraph"
import ElementBox from "components/light-admin/containers/ElementBox";
import GraphFactory from "components/displayComponents/graphFactory";
import Content from "components/cms/Content"
import Element from 'components/light-admin/containers/Element'

import config from "pages/auth/Plan/config/hazards-config";
import {SectionBoxMain} from 'pages/Public/theme/components'

import GeographyScoreBarChart from "./components/GeographyScoreBarChart";
import CousubTotalLossTable from "./components/CousubTotalLossTable";
import MunicipalityStats from "./components/MunicipalityStats";
import CountyHeroStats from "./components/CountyHeroStats";
import HazardEvents from '../Hazards/components/hazardEvents/'
import HazardScoreTable from "./components/HazardScoreTable";
import FemaDisasterDeclarationsTable from "./components/FemaDisasterDeclarationsTable";
import HazardEventsTable from "./components/HazardEventsTable";
import {EARLIEST_YEAR, LATEST_YEAR} from "./components/yearsOfSevereWeatherData";
import NumberOfHazardsMonthStackedBarGraph from "./components/NumberOfHazardsMonthStackedBarGraph";

const STICKYDROPDOWN = styled.div`
                       select {
                       height: 5vh;
                       width: 250px;
                       float: right;
                       z-index:100;
                       position:fixed;
                       background: rgba(0,0,0,0.3);
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
            hazard: null
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
                <STICKYDROPDOWN>
                    <select
                        style={{right:10}}
                        className="ae-side-menu"
                        id='hazard'
                        data-error="Please select county"
                        onChange={(e) => {
                            if (e.target.value !== 'none'){
                                e.target.value === 'all' ?
                                    this.setState({hazard: null}) :
                                    this.setState({hazard: e.target.value})
                            }
                        }}
                        value={this.state.hazard}
                    >
                        <option key={0} value={'none'}>--Select Hazard--</option>
                        <option key={1} value={'all'}> All Hazards </option>
                        {this.state.hazards.map((h,h_i) => <option key={h_i+2} value={h}>{h}</option>)}
                    </select>
                </STICKYDROPDOWN>
            ) : null
    }
    renderElement (element) {
        return (
            <ElementBox>
                <SectionBoxMain>
                    <strong>{element.title}</strong>
                    <GraphFactory
                        graph={{type: element.type + 'Viewer'}}
                        {...element}
                        user={this.props.user}/>
                </SectionBoxMain>
            </ElementBox>
        )
    }
    render() {
        return (
            this.props.geoid ? (
                <div className='container'>
                    <Element>
                        {
                           this.stickyHazards()
                        }
                        <h4 className="element-header">{this.getGeoidName()}</h4>
                        <div className="row">
                            <div className="col-8">
                                <div className="element-wrapper">
                                    <div className="element-box">

                                        <div className="element-box-content">
                                            <Content content_id={`${this.state.geoid}-about`}
                                                     top={-20} right={0}/>
                                        </div>

                                        <div className="el-chart-w">
                                            <GeographyScoreBarChart
                                                showYlabel={false}
                                                showXlabel={false}
                                                lossType={'total_damage'}
                                                {...this.state}/>
                                        </div>

                                        <div className="table-responsive">
                                            <h4>Hazard Loss by Municipality</h4>
                                            <span> From 1996 to 2017</span>
                                            <CousubTotalLossTable
                                                {...this.state}/>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div className='col-sm-4'>
                                <div className='element-wrapper'>
                                    <div className='element-box'>
                                        <div className='row'>
                                            <MunicipalityStats {...this.state}/>
                                        </div>
                                    </div>

                                    <div className='element-box'>
                                        <div className='row'>
                                            <CountyHeroStats {...this.state}/>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className='row'>
                            <div className='col-12'>
                                <h4>Hazard Loss by Type</h4>
                                <strong>1996-2017</strong>
                                <div>The table below summarizes the loss amount due to Hazards in dollars
                                    for {this.getGeoidName()}.
                                    Severe events are considered those which caused more than $1M in damage.
                                </div>

                                <HazardScoreTable
                                    hazards={this.state.hazards}
                                    hazard={this.state.hazard}
                                    geoid={this.state.geoid}
                                    geoLevel={'cousubs'}
                                    dataType={this.state.dataType}
                                />

                                <i style={{color: '#afafaf'}}>
                                    Source: <a href="https://www.ncdc.noaa.gov/stormevents/" target="_blank"> NOAA NCEI
                                    Storm Events Dataset</a>
                                </i>
                            </div>
                        </div>

                        <div className='row'>
                            <div className='col-12'>
                                {(['wildfire', 'heatwave', 'tsunami', 'volcano', 'lightning'].includes(this.state.hazards)) ?
                                    ''
                                    :
                                    (
                                        <div>
                                            <h5>Presidential Disaster Declarations</h5>
                                            <Content content_id={'hazards-presidential-disaster-declarations'}/>
                                            <FemaDisasterDeclarationsTable
                                                hazard={this.state.hazard}
                                                hazards={this.state.hazards}
                                               // geoid={'36'} // only works on state
                                            />
                                            <i style={{color: '#afafaf'}}>Source: <a href="https://www.fema.gov/disasters"
                                                                                     target="_blank">FEMA Disaster
                                                Declarations</a></i>
                                        </div>
                                    )
                                }
                            </div>
                        </div>

                        <div className='row'>
                            <div className='col-12'>
                                {(['wildfire', 'avalanche', 'tsunami', 'volcano', '', 'earthquake'].includes(this.state.hazards)) ?
                                    ''
                                    :
                                    (
                                        <div>
                                            <h5>Events with Highest Reported Loss in Dollars</h5>
                                            <strong>1996-2017</strong>
                                            <div>The table below summarizes the top 50 hazard events by loss in dollars.
                                                Click on a row to view the event description.
                                            </div>
                                            <HazardEventsTable
                                                hazards={this.state.hazards}
                                                hazard={this.state.hazard}
                                                geoid={this.state.geoid}
                                            />
                                            <i style={{color: '#afafaf'}}>Source: <a
                                                href="https://www.ncdc.noaa.gov/stormevents/" target="_blank"> NOAA NCEI
                                                Storm Events Dataset</a></i>
                                        </div>
                                    )
                                }
                            </div>
                        </div>

                        <div className='row'>
                            <div className='col-12'>
                                <div>
                                    <h5>Hazard Events</h5>
                                    <strong>1996-2017</strong>
                                    <div> Total number of events and Damage caused.
                                    </div>
                                    <HazardEvents />
                                </div>
                            </div>
                        </div>


                        <div className='row'>
                            <div className='col-12'>
                                <div>
                                    <h5>Number of Hazards per Month</h5>
                                    <strong>1996-2017</strong>
                                    <ElementBox>
                                        <NumberOfHazardsMonthStackedBarGraph
                                            showYlabel={false}
                                            showXlabel={false}
                                            lossType={'num_events'}
                                            geoid={this.props.geoid}
                                            geoLevel={this.setGeoLevel(this.props.geoid.length)}
                                            dataType='severeWeather'
                                            colorScale={getColorScale([1, 2])}
                                            hazards={this.state.hazards}
                                            hazard={this.state.hazard}
                                        />
                                    </ElementBox>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-12">
                                {
                                    Object.keys(config).map(section => {
                                        return (
                                            <ElementBox>
                                                <strong>{section}</strong>
                                                {
                                                    config[section]
                                                        .filter(r =>
                                                            this.state.hazard ?
                                                                this.state.hazard.toLowerCase() === r.title.toLowerCase() :
                                                                this.state.hazards.length > 0 ?
                                                                    this.state.hazards.map(f => f.toLowerCase()).includes(r.title.toLowerCase()) :
                                                                    true
                                                        )
                                                        .map(requirement => {
                                                        return this.renderElement(requirement)
                                                    })
                                                }
                                            </ElementBox>
                                        )
                                    })
                                }
                            </div>
                        </div>

                    </Element>
                </div>
            ) : ( null )
        )
    }
}

const mapStateToProps = (state,ownProps) => {
    return {
        geoGraph: state.graph.geo,
        router: state.router,
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
    path: '/hazards',
    exact: true,
    name: 'Hazards',
    auth: false,
    mainNav: true,
    breadcrumbs: [
        { name: 'Hazards', path: '/hazards' }],
    menuSettings: {
        image: 'none',
        scheme: 'color-scheme-light',
        position: 'menu-position-top',
        layout: 'menu-layout-full',
        style: 'color-style-default'
    },
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Hazards))
},{
    icon: 'os-icon-pencil-2',
    path: '/hazards/:geoid',
    exact: true,
    name: 'Hazards',
    auth: false,
    mainNav: false,
    breadcrumbs: [
        { name: 'Hazards', path: '/hazards' },
        { name: 'geoid', path: '/hazards/' }],
    menuSettings: {
        image: 'none',
        scheme: 'color-scheme-light',
        position: 'menu-position-top',
        layout: 'menu-layout-full',
        style: 'color-style-default'
    },
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Hazards))
}];

