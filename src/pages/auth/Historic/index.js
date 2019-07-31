import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import { createMatchSelector } from 'react-router-redux'

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

        const { params } = createMatchSelector({ path: '/historic/:geoid' })(props) || {},
            { geoid } = params;

        this.state = {
            geoid,
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
            <div className='property-single'>

                <div className='property-info-w'>
                    <div className="property-info-main" style={ { maxWidth: '60%' } }>

                        <h1>{ this.getGeoidName() }</h1>

                        <div className="property-section">
                            <Content content_id={ `${ this.state.geoid }-about` }
                                     top={ -20 } right={ 0 }/>
                        </div>

                        <div className="property-section">
                            <GeographyScoreBarChart
                                showYlabel={ false }
                                showXlabel={ false }
                                lossType={ 'total_damage' }
                                { ...this.state }/>
                        </div>

                        <div className="property-section">
                            <CousubTotalLossTable
                                { ...this.state }/>
                        </div>

                    </div>

                    <div className='property-info-side' style={ { maxWidth: 398 } }>
                        <div className='side-section-content' style={ { paddingTop: 60 } }>

                            <div className='projects-list row'>
                                <MunicipalityStats { ...this.state }/>
                            </div>

                            <div className='projects-list row'>
                                <CountyHeroStats { ...this.state }/>
                            </div>

                        </div>
                    </div>

                </div>

                <div className="property-info-w">
                    <div className="property-info-main" style={ { paddingLeft: 0, paddingRight: 0 } }>
                        <HazardList { ...this.state }
                                    standardScale={ false }
                                    threeD={ false }/>
                    </div>
                </div>

                <div className='row'>
                    <div className= 'col-12'>
                        <HMGPTable { ...this.state }/>
                    </div>
                </div>

            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        geoGraph: state.graph.geo,
        router: state.router
    };
};

const mapDispatchToProps = {};
export default [{
    icon: 'os-icon-pencil-2',
    path: '/historic/:geoid',
    exact: true,
    name: 'Historic',
    auth: true,
    mainNav: true,
    breadcrumbs: [
        { param: 'geoid', path: '/historic/' }
    ],
    menuSettings: { image: 'none', scheme: 'color-scheme-light' },
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Historic))
}];

