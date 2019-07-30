import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import * as d3scale from 'd3-scale'

import MapBoxMap from "components/mapping/escmap/MapBoxMap.react"

import {
    getHazardName,
    ftypeMap,
    fnum,
    scaleCk
} from 'utils/sheldusUtils'

class TestMap extends React.Component {

    state = {
        fillColor: null,
        hoverData: null,
        scores: {},
        scale: d3scale.scaleThreshold()
            .domain([50000, 500000, 2500000, 5000000])
            .range(["#f2efe9", "#fadaa6", "#f7c475", "#f09a10", "#cf4010"])
    }

    componentDidUpdate(oldProps) {
        if (oldProps.hazard !== this.props.hazard) {
            this.fetchFalcorDeps()
        }
    }

    fetchFalcorDeps({ geoid, geoLevel, hazard } = this.props) {
        return this.props.falcor.get(
            ['geo', geoid, geoLevel],
            ['geo', '36', 'counties'],
            ['riskIndex', 'meta', hazard, 'name']
        )
            .then(res => res.json.geo[geoid][geoLevel])
            .then(geoids => this.props.falcor.get(
                ['severeWeather', geoids, hazard, 'tract_totals', 'total_damage']
            ))
            .then(() => this.processData())
    }

    processData({ geoid, geoLevel, hazard, scaleType } = this.props) {
        let scale;
        switch (scaleType) {
            case "thresholds":
                scale = d3scale.scaleThreshold()
                    .domain(this.props.thresholds);
                break;
            case "quantile":
                scale = d3scale.scaleQuantile();
                break;
            case "quantize":
                scale = d3scale.scaleQuantize();
                break;
            case "ckmeans":
                scale = scaleCk();
                break;
        }
        scale.range(["#f2efe9", "#fadaa6", "#f7c475", "#f09a10", "#cf4010"])
        try {
            const geoids = this.props.geoGraph[geoid][geoLevel].value,
                fillColor = {},
                scores = {};

            let domain = [],
                min = Infinity,
                max = -Infinity;

            geoids.forEach(geoid => {
                const score = +this.props.severeWeather[geoid][hazard].tract_totals.total_damage;
                scores[geoid] = score;
                domain.push(score);
                min = Math.min(min, score);
                max = Math.max(max, score);
            })
            domain.sort((a, b) => a - b);
            switch (scaleType) {
                case "quantile":
                case "ckmeans":
                    scale.domain(domain);
                    break;
                case "quantize":
                    scale.domain([min, max]);
                    break;
            }

            for (const geoid in scores) {
                fillColor[geoid] = scale(scores[geoid]);
            }

            this.setState({ fillColor, scores, scale })
        }
        catch (e) {
            this.setState({ fillColor: null, scores: {}, scale });
            return;
        }
    }

    createLayers({ geoid, geoLevel, hazard } = this.props) {
        const { fillColor, scores } = this.state;

        let counties = [],
            geoids = [];
        try {
            counties = this.props.geoGraph['36']['counties'].value;
            geoids = this.props.geoGraph[geoid][geoLevel].value;
        }
        catch (e) {
            counties = [];
            geoids = [];
        }

        return [
            { id: 'states-fill',
                type: 'fill',
                geoLevel: 'states',
                geoids: ['36'],
                'fill-color': "#f2efe9"
            },

            { id: 'data-layer',
                type: 'fill',
                geoLevel,
                geoids,
                'fill-color': fillColor,
                autoHighlight: true,
                onHover: e => {
                    const { object, x, y } = e;
                    let hoverData = null;
                    if (object) {
                        hoverData = {
                            rows: [
                                ["Total Loss", fnum(this.state.scores[object.properties.geoid])]
                            ],
                            x, y
                        }
                    }
                    this.setState({ hoverData })
                }
            },

            { id: 'counties-line',
                type: 'line',
                geoLevel: 'counties',
                geoids: counties,
                'line-color': "#c8c8c8",
                'line-width': 1
            },
            { id: 'states-line',
                type: 'line',
                geoLevel: 'states',
                geoids: ['36'],
                'line-color': "#fff",
                'line-width': 2
            }
        ]
    }

    generateLegend() {
        const { scale } = this.state,
            { hazard, scaleType } = this.props,
            name = this.getHazardName(hazard),
            range = scale.range();
        return (
            <table className="map-test-table">
                <thead>
                <tr>
                    <th className="no-border-bottom" colSpan={ range.length }>
                        { "Total Loss" }
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    {
                        range.map(t => <td key={ t } style={ { height: '10px', background: t } }/>)
                    }
                </tr>
                <tr>
                    {
                        range.map(t => {
                            return <td key={ t }>{ fnum(scale.invertExtent(t)[0]) }</td>
                        })
                    }
                </tr>
                </tbody>
            </table>
        )
    }
    generateControls() {
        const controls = [];

        controls.push({
            pos: "top-left",
            comp: this.generateLegend()
        })

        return controls;
    }

    getHazardName(hazard) {
        try {
            return this.props.riskIndex.meta[hazard].name;
        }
        catch (e) {
            return hazard
        }
    }

    render() {
        return (
            <MapBoxMap height={ this.props.height }
                       zoom={ this.props.zoom }
                       layers={ this.createLayers() }
                       controls={ this.generateControls() }
                       hoverData={ this.state.hoverData }/>
        )
    }
}

TestMap.defaultProps = {
    geoid: '36',
    geoLevel: 'tracts',
    hazard: 'riverine',
    scaleType: 'thresholds', // quantile, quantize, ckmeans
    thresholds: [50000, 500000, 2500000, 5000000],
    height: 600,
    zoom: 6
}

const mapStateToProps = state => ({
    riskIndex: state.graph.riskIndex || {},
    sheldus: state.graph.sheldus || {},
    severeWeather: state.graph.severeWeather || {},
    router: state.router,
    geoGraph: state.graph.geo
})

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(TestMap))