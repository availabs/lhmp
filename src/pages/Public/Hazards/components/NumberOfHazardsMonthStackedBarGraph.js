import React from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import {falcorChunkerNice} from "store/falcorGraph"

import get from "lodash.get"

import {ResponsiveBar} from "@nivo/bar"
import * as d3format from "d3-format"
import ElementBox from 'components/light-admin/containers/ElementBox'

import {getHazardName, processDataForBarChart} from 'utils/sheldusUtils'

import {EARLIEST_YEAR, LATEST_YEAR} from "./yearsOfSevereWeatherData";

import hazardcolors from "constants/hazardColors";

class NumberOfHazardsStackedBarGraph extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            geoid: this.props.geoid,
            geoLevel: this.props.geoLevel,
            dataType: this.props.dataType
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.geoid !== this.props.geoid || prevProps.hazard !== this.props.hazard) {
            this.setState({geoid: this.props.geoid});
            this.fetchFalcorDeps(this.props.geoLevel, this.props.dataType, this.props.geoid)
        }
    }

    getHazardName(hazard) {
        try {
            return this.props.riskIndexGraph.meta[hazard].name;
        } catch (e) {
            return getHazardName(hazard)
        }
    }

    fetchFalcorDeps(geoLevel, dataType, geoid) {
        if (!geoid) geoid = this.props.geoid;
        if (!geoLevel) geoLevel = this.props.geoLevel;
        if (!dataType) dataType = this.props.dataType;
        //const { geoLevel, dataType, geoid } = this.state;

        return this.props.falcor.get(
            ['riskIndex', 'hazards'],
            ['geo', geoid, geoLevel]
        )
            .then(res => res.json.riskIndex.hazards)
            .then(hazards => {
                hazards = this.props.hazards ? this.props.hazards : hazards;
                return geoLevel === 'state' ? Promise.resolve({hazards, geoids: [geoid]})
                    : this.props.falcor.get(['geo', geoid, geoLevel]).then(res => ({
                        hazards,
                        geoids: res.json.geo[geoid][geoLevel]
                    }))
            })
            .then(({hazards, geoids}) => {
                hazards = this.props.hazards ? this.props.hazards : hazards;
                return this.props.falcor.get(
                    ['riskIndex', 'meta', hazards, ['id', 'name']]
                    //['geo', geoids, ['name']],
                    //['riskIndex', geoids, hazards, ['score', 'value']],
                    //[dataType, geoids, hazards, { from: EARLIEST_YEAR, to: LATEST_YEAR }, ['property_damage', 'total_loss', 'num_events','num_episodes', 'num_loans']]
                )
                    .then(d => falcorChunkerNice(['geo', geoids, 'name']))
                    .then(d => falcorChunkerNice(['riskIndex', geoids, hazards, ['score', 'value']]))
                    .then(d => falcorChunkerNice(
                        [dataType,'byMonth', geoids, hazards, ['January','February', 'March', 'April', 'May','June','July',
                            'August','September', 'October', 'November', 'December'],
                            ['property_damage', 'total_damage', 'num_events', 'num_episodes']]
                    ))
            })
    }

    processData() {
        const {geoid, geoLevel, dataType, hazard, lossType} = this.props;
        try {
            let geoids = [];
            if (geoLevel === 'state' || geoLevel === 'counties') {
                geoids = [geoid];
            } else {
                geoids = this.props.geoGraph[geoid][geoLevel].value;
            }
            return processDataForBarChart(get(this.props, `${dataType}.byMonth`, {}), geoids, lossType, hazard);
        } catch (e) {
            return {data: [], keys: []}
        }
    }

    render() {
        const {data, keys} = this.processData(),
            format = d3format.format(this.props.format);

        if (!data.length && this.props.geoid.length === 5) {
            return <ElementBox>Loading...</ElementBox>;
        } else if (this.props.geoid.length > 5) {
            return null;
        }
        return (
            <div style={{height: `${this.props.height}px`, background: '#fff'}}>
                <ResponsiveBar
                    data={data}
                    keys={keys}
                    indexBy="year"
                    colorBy={'id'}
                    colors={(d) => hazardcolors[d.id]}
                    enableLabel={false}
                    tooltipFormat={this.props.format}
                    margin={{
                        "top": 25,
                        "right": this.props.showYlabel ? 25 : 0,
                        "bottom": this.props.showXlabel ? 50 : 40,
                        "left": this.props.showYlabel ? 90 : 50
                    }}
                    axisBottom={{
                        "orient": "bottom",
                        "tickSize": 5,
                        "tickPadding": 5,
                        "legend": this.props.showXlabel ? "Month" : undefined,
                        "legendPosition": "middle",
                        "legendOffset": 40,
                        "tickRotation": this.props.showYlabel ? 0 : 30
                    }}
                    axisLeft={{
                        "orient": "left",
                        "tickSize": 5,
                        "tickPadding": 5,
                        "tickRotation": 0,
                        "legend": this.props.showYlabel ? this.props.lossType : undefined,
                        "legendPosition": "middle",
                        "legendOffset": -100,
                        "format": format
                    }}
                    tooltip={
                        d => (
                            <div>
                                <div style={{
                                    display: "inline-block",
                                    width: "15px",
                                    height: "15px",
                                    backgroundColor: hazardcolors[d.id]
                                }}/>
                                <span style={{paddingLeft: "5px"}}>{this.getHazardName(d.id)}</span>
                                <span style={{paddingLeft: "5px"}}>{format(d.value)}</span>
                            </div>
                        )
                    }
                    theme={{
                        "axis": {
                            "legendFontSize": "18px"
                        }
                    }}/>
            </div>
        )
    }
}

NumberOfHazardsStackedBarGraph.defaultProps = {
    height: 500,
    lossType: "property_damage",
    format: "d",
    hazard: null,
    hazards: [],
    showYlabel: true,
    showXlabel: true,
    geoid: '36',
    geoLevel: 'state',
    hazardcolors: hazardcolors,
    dataType: "severeWeather"
};

const mapStateToProps = state => {
    return {
        riskIndexGraph: state.graph.riskIndex || {},
        sheldus: state.graph.sheldus || {},
        severeWeather: state.graph.severeWeather || {},
        sba: state.graph.sba || {},
        geoGraph: state.graph.geo || {},
        router: state.router
    }
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(NumberOfHazardsStackedBarGraph))