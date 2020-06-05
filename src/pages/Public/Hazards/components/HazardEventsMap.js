import React from 'react';
import { connect } from 'react-redux';

import { getDistanceScales } from 'viewport-mercator-project';

// import * as d3scale from "d3-scale";
import * as d3color from 'd3-color';
// import * as d3format from "d3-format";

import ElementBox from 'components/light-admin/containers/ElementBox'

// import DeckMap from "components/mapping/escmap/DeckMap.react"
import SvgMap from "components/mapping/escmap/SvgMap.react"

import { CircleLabel } from "./HazardEventsLegend"

import {
    EARLIEST_YEAR,
    LATEST_YEAR
} from "../../../auth/Historic/components/yearsOfSevereWeatherData";

import {
    fnum
} from "utils/sheldusUtils"

class HazardEventsMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentYear: LATEST_YEAR + props.yearDelta
        }
    }

    componentDidMount() {
        this.props.viewport.register(this, this.setState);
    }
    componentWillUnmount() {
        this.props.viewport.unregister(this);
    }

    decrementCurrentPopulationYear() {
        const currentYear = Math.max(EARLIEST_YEAR, this.state.currentYear - 1);
        this.setState({ currentYear });
    }
    incrementCurrentPopulationYear() {
        const currentYear = Math.min(LATEST_YEAR, this.state.currentYear + 1);
        this.setState({ currentYear });
    }
    generateMapNavigator() {
        const currentYear = this.state.currentYear,
            decDisabled = (currentYear === EARLIEST_YEAR),
            incDisabled = (currentYear === LATEST_YEAR);
        return (
            <table className="map-test-table" style={ { tableLayout: "fixed" } }>
                <tbody>
                <tr className="no-border-bottom">
                    <th style={ { textAlign: "center", width: "30%" } }>
                        <button className="map-test-button"
                                onClick={ this.decrementCurrentPopulationYear.bind(this) }
                                disabled={ decDisabled }>
                            { "<" }
                        </button>
                    </th>
                    <th style={ { textAlign: "center", width: "40%" } }>
                        { currentYear }
                    </th>
                    <th style={ { textAlign: "center", width: "30%" } }>
                        <button className="map-test-button"
                                onClick={ this.incrementCurrentPopulationYear.bind(this) }
                                disabled={ incDisabled }>
                            { ">" }
                        </button>
                    </th>
                </tr>
                </tbody>
            </table>
        )
    }
    generateLegend() {
        const distanceScales = getDistanceScales(this.props.viewport());
        return (
            <table className="map-test-table" style={ { tableLayout: "fixed", width: "300px" } }>
                <thead>
                <tr><th>Property Damage</th></tr>
                </thead>
                <tbody>
                <tr>
                    <td style={ { position: "relative", height: "120px" } }>

                        <CircleLabel radius={ 40 } color={ "#000" }
                                     value={ (this.props.radiusScale.invert(distanceScales.metersPerPixel[0] * 40 / 1000)) }/>
                        <CircleLabel radius={ 30 } color={ "#000" }
                                     value={ (this.props.radiusScale.invert(distanceScales.metersPerPixel[0] * 30 / 1000)) }/>
                        <CircleLabel radius={ 10 } color={ "#000" }
                                     value={ (this.props.radiusScale.invert(distanceScales.metersPerPixel[0] * 10 / 1000)) }/>

                    </td>
                </tr>
                </tbody>
            </table>
        )
    }
    generateSmallLegend() {
        const distanceScales = getDistanceScales(this.props.viewport());
        return (
            <table className="map-test-table" style={ { tableLayout: "fixed", width: "300px" } }>
                <thead>
                <tr><th>Property Damage</th></tr>
                </thead>
                <tbody>
                <tr>
                    <td style={ { position: "relative", height: "90px" } }>

                        <CircleLabel radius={ 25 } color={ "#fff" }
                                     value={ (this.props.radiusScale.invert(distanceScales.metersPerPixel[0] * 40 / 1000)) }/>
                        <CircleLabel radius={ 15 } color={ "#fff" }
                                     value={ (this.props.radiusScale.invert(distanceScales.metersPerPixel[0] * 30 / 1000)) }/>
                        <CircleLabel radius={ 5 } color={ "#fff" }
                                     value={ (this.props.radiusScale.invert(distanceScales.metersPerPixel[0] * 10 / 1000)) }/>

                    </td>
                </tr>
                </tbody>
            </table>
        )
    }
    generateMapControls() {
        const controls = [];
        if (this.props.showLegend) {
            controls.push(
                { pos: this.props.mapLegendLocation,
                    comp: (this.props.mapLegendSize == "large") ? this.generateLegend() : this.generateSmallLegend()
                }
            )
        }
        if (!this.props.allTime) {
            controls.push(
                { pos: this.props.mapControlsLocation,
                    comp: this.generateMapNavigator()
                }
            )
        }
        return controls;
    }
    generateLayers() {
        const data = {
            type: "FeatureCollection",
            features: []
        };

        try {
            const { colorScale, geoid, dataType, geoLevel, hazard, eventsData } = this.props,

                hazards = hazard ? [hazard] : this.props.riskIndex.hazards.value;

            for (const gid in eventsData[geoid][geoLevel]) {
                hazards.forEach(hazard => {
                    data.features.push(...eventsData[geoid][geoLevel][gid][hazard][this.props.allTime ? "allTime" : this.state.currentYear])
                }, this)
            }
            const getLineColor = ({ properties }) => {
                const hexColor = colorScale(properties.hazard),
                    rgbColor = d3color.rgb(hexColor);
                return [rgbColor.r, rgbColor.g, rgbColor.b, 255];
            }
            return [

                { id: 'cousubs-layer-filled',
                    data: this.props.bounds,
                    filled: true,
                    getFillColor: [242, 239, 233, 255]
                },
                { id: 'cousubs-layer-stroked',
                    data: this.props.bounds,
                    stroked: true,
                    getLineColor: (d) =>
                        d.properties.geoid === this.props.geoid ?
                        [255, 0, 0, 255] : [255, 0, 0, 0],
                    lineWidthMinPixels: 2
                },
                { id: 'events-layer',
                    data,
                    stroked: true,
                    getLineColor,
                    filled: false,
                    pickable: false
                }
            ];
        }
        catch (e) {
            return []
        }
    }
    render () {
        return (
            <ElementBox style={ { padding: this.props.padding } }>
                <SvgMap layers={ this.generateLayers() }
                        height={ this.props.height }
                        viewport={ this.props.viewport }
                        controls={ this.generateMapControls() }
                        padding={ this.props.zoomPadding }
                        bounds={ this.props.bounds }/>
            </ElementBox>
        )
    }
}

HazardEventsMap.defaultProps = {
    yearDelta: 0,
    height: 800,
    dragPan: true,
    scrollZoom: true,
    dragRotate: true,
    padding: null,
    mapLegendLocation: "bottom-left",
    mapLegendSize: "large",
    mapControlsLocation: "top-left",
    hazard: null,
    allTime: false
}

const mapStateToProps = state => ({
    router: state.router,
    geo: state.geo,
    geoGraph: state.graph.geo,
    severeWeather: state.graph.severeWeather,
    riskIndex: state.graph.riskIndex
})

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(HazardEventsMap);