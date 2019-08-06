import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import * as d3scale from "d3-scale";

import get from "lodash.get"

import { ResponsiveBar } from "@nivo/bar"

// import * as d3color from "d3-color"
import * as d3format from "d3-format"
// import * as d3scale from "d3-scale"

import ElementBox from 'components/light-admin/containers/ElementBox'

import {
    processDataForBarChart,
    getHazardName,
    fnum,
    getColorScale
} from 'utils/sheldusUtils'

import {
    EARLIEST_YEAR,
    LATEST_YEAR
} from "./yearsOfSevereWeatherData";

const D3_CATEGORY20 = [
    "#1f77b4",
    "#aec7e8",
    "#ff7f0e",
    "#ffbb78",
    "#2ca02c",
    "#98df8a",
    "#d62728",
    "#ff9896",
    "#9467bd",
    "#c5b0d5",
    "#8c564b",
    "#c49c94",
    "#e377c2",
    "#f7b6d2",
    "#7f7f7f",
    "#c7c7c7",
    "#bcbd22",
    "#dbdb8d",
    "#17becf",
    "#9edae5"
];

const COLOR_SCALE = d3scale.scaleOrdinal()
    .range(D3_CATEGORY20);

class GeographyScoreBarChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            geoid: this.props.geoid,
            geoLevel: this.props.geoLevel,
            dataType: this.props.dataType
        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps.geoid !== this.props.geoid){
            this.setState({geoid: this.props.geoid})
            this.fetchFalcorDeps(this.props.geoLevel, this.props.dataType, this.props.geoid)
        }
    }
    getHazardName(hazard) {
        try {
            return this.props.riskIndexGraph.meta[hazard].name;
        }
        catch (e) {
            return getHazardName(hazard)
        }
    }

    fetchFalcorDeps(geoLevel, dataType, geoid) {
        if(!geoid)geoid = this.props.geoid;
        if(!geoLevel)geoLevel = this.props.geoLevel;
        if(!dataType)dataType = this.props.dataType;
        //const { geoLevel, dataType, geoid } = this.state;
        console.log('FFD_GSbarChart', geoLevel, dataType, geoid)

        return this.props.falcor.get(
            ['riskIndex', 'hazards'],
            ['geo', geoid, geoLevel]
        )
            .then(res => res.json.riskIndex.hazards)
            .then(hazards => geoLevel === 'state' ? Promise.resolve({ hazards, geoids: [geoid] })
                : this.props.falcor.get(['geo', geoid, geoLevel]).then(res => ({ hazards, geoids: res.json.geo[geoid][geoLevel] })))
            .then(({ hazards, geoids }) => {
                console.log('FFD_GSbarChartRes', { hazards, geoids })
                this.props.colorScale.domain(hazards);
                return this.props.falcor.get(
                    ['riskIndex', 'meta', hazards, ['id', 'name']],
                    ['geo', geoids, ['name']],
                    ['riskIndex', geoids, hazards, ['score', 'value']],
                    [dataType, geoids, hazards, { from: EARLIEST_YEAR, to: LATEST_YEAR }, ['property_damage', 'total_loss', 'num_events','num_episodes', 'num_loans']]
                )
            })
    }

    processData() {
        const { geoid, geoLevel, dataType,  hazard, lossType } = this.props;
        console.log('PD_GSbarChart', geoLevel, dataType, geoid)
        try {
            let geoids = []
            if (geoLevel === 'state' || geoLevel === 'counties') {
                geoids = [geoid];
            }
            else {
                geoids = this.props.geoGraph[geoid][geoLevel].value;
            }
            return processDataForBarChart(get(this.props, dataType, {}), geoids, lossType, hazard);
        }
        catch (e) {
            return { data: [], keys: [] }
        }
    }
    render() {
        console.log('data on render barChart', this.state)
        const { data, keys } = this.processData(),
            format = d3format.format(this.props.format);
        if (!data.length && this.props.geoid.length === 5) {
            return <ElementBox>Loading...</ElementBox>;
        } else if (this.props.geoid.length > 5){
            return null;
        }
        return (
            <div style={ { height: `${ this.props.height }px`, background: '#fff'} }>
                <ResponsiveBar
                    data={ data }
                    keys={ keys }
                    indexBy="year"
                    colorBy={ d => this.props.colorScale(d.id) }
                    enableLabel={ false }
                    tooltipFormat={ this.props.format }
                    margin={ {
                        "top": 25,
                        "right": this.props.showYlabel ? 25 : 0,
                        "bottom": this.props.showXlabel ? 50 : 40,
                        "left": this.props.showYlabel ? 90 : 50
                    } }
                    axisBottom={ {
                        "orient": "bottom",
                        "tickSize": 5,
                        "tickPadding": 5,
                        "legend": this.props.showXlabel ? "Year" : undefined,
                        "legendPosition": "center",
                        "legendOffset": 40,
                        "tickRotation": this.props.showYlabel ? 0 : 45
                    } }
                    axisLeft={ {
                        "orient": "left",
                        "tickSize": 5,
                        "tickPadding": 5,
                        "tickRotation": 0,
                        "legend": this.props.showYlabel ? this.props.lossType : undefined,
                        "legendPosition": "center",
                        "legendOffset": -100,
                        "format": fnum
                    } }
                    tooltip={
                        d => (
                            <div>
                                <div style={ { display: "inline-block", width: "15px", height: "15px", backgroundColor: this.props.colorScale(d.id) } }/>
                                <span style={ { paddingLeft: "5px" } }>{ this.getHazardName(d.id) }</span>
                                <span style={ { paddingLeft: "5px" } }>{ format(d.value) }</span>
                            </div>
                        )
                    }
                    theme={ {
                        "axis": {
                            "legendFontSize": "18px"
                        }
                    } }/>
            </div>
        )
    }
}
GeographyScoreBarChart.defaultProps = {
    height: 500,
    lossType: "property_damage",
    format: "$,d",
    hazard: null,
    showYlabel: true,
    showXlabel: true,
    geoid: '36',
    geoLevel: 'state',
    colorScale: getColorScale(),
    dataType: "severeWeather"
}

const mapStateToProps = state => {
    return {
        riskIndexGraph: state.graph.riskIndex || {},
        sheldus: state.graph.sheldus || {},
        severeWeather: state.graph.severeWeather || {},
        sba: state.graph.sba || {},
        geoGraph: state.graph.geo || {},
        router: state.router
    }
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(GeographyScoreBarChart))