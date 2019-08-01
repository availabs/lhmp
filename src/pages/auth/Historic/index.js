import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import { createMatchSelector } from 'react-router-redux'
import Element from 'components/light-admin/containers/Element'
import CountyHeroStats from "./components/CountyHeroStats"
import GeographyScoreBarChart from "./components/GeographyScoreBarChart"
import MunicipalityStats from "./components/MunicipalityStats"
import HazardList from "./components/HazardListNew"
import CousubTotalLossTable from "./components/CousubTotalLossTable"
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
            geoLevel: 'counties',
            dataType: 'severeWeather',
            colorScale: getColorScale([1, 2])
        }
    }

    fetchFalcorDeps({ geoid, geoLevel, dataType }=this.state) {
        return this.props.falcor.get(
            ['geo', geoid, 'name'],
            ['geo', geoid, 'cousubs'],
            ['riskIndex', 'hazards']
        )
            .then(response => {
                console.log('response',response)
                const geoids = response.json.geo[geoid]['cousubs'],
                    hazards = response.json.riskIndex.hazards,
                    requests = [];
                this.setState({ colorScale: getColorScale(hazards) });
                return this.props.falcor.get(
                    ['riskIndex', 'meta', hazards, ['id', 'name']],
                    ['geo', geoids, ['name']],
                    ['riskIndex', 'meta', hazards, ['id', 'name']],
                    [dataType, geoid, hazards, { from:EARLIEST_YEAR, to: LATEST_YEAR }, ['property_damage', 'total_damage']],
                )
            })
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
                                <div className='col-sm-12 col-xxxl-9'>
                                    <div className='element-wrapper'>
                                        <div className='element-box'>
                                            <div className=''>
                                                <HazardList { ...this.state }
                                                            standardScale={ false }
                                                            threeD={ false }/>
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
                        </div>
                    </div>
                </Element>
            </div>
        )
    }
}

const mapStateToProps = (state,ownProps) => {
    console.log('ownProps', ownProps)
    return {
        geoGraph: state.graph.geo,
        router: state.router,
        geoid: ownProps.computedMatch.params.geoid ? ownProps.computedMatch.params.geoid : '36001'
    };
};

const mapDispatchToProps = {};
export default [{
    icon: 'os-icon-pencil-2',
    path: '/historic/',
    exact: true,
    name: 'Historic',
    auth: true,
    mainNav: true,
    breadcrumbs: [
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

