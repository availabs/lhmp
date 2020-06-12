import React from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import * as d3scale from "d3-scale";
import {set as d3set} from "d3-collection"

import * as turf from "@turf/turf"
import get from 'lodash.get'
import {getChildGeo, getGeoMerge, getGeoMesh} from 'store/modules/geo'

import HazardEventsMap from "./HazardEventsMap"
import HazardEventsLegend from "./HazardEventsLegend"

import Viewport from "components/mapping/escmap/Viewport"

import {getColorScale} from 'utils/sheldusUtils'

import {EARLIEST_YEAR, LATEST_YEAR} from "../../../auth/Historic/components/yearsOfSevereWeatherData";

let UNIQUE_ID = 0;
const getUniqueId = () => `controller-${++UNIQUE_ID}`

const ACTIVE_CONTROLLERS = d3set()

const getMapDefaults = (width, height = null) =>
    width === 12 ? {
            showLegend: true,
            height: height || 800
        }
        : width === 6 ? {
            showLegend: false,
            dragRotate: false,
            scrollZoom: false,
            dragPan: false,
            height: height || 550,
            zoomPadding: 5,
            padding: "1em"
        }
        : {
            showLegend: false,
            dragRotate: false,
            scrollZoom: false,
            dragPan: false,
            height: height || 375,
            zoomPadding: 5,
            padding: "1em"
        }

const getMapWidth = numMaps =>
    numMaps === 1 ? 12
        : (numMaps % 3) === 0 ? 4
        : (numMaps === 2) || (numMaps === 4) ? 6
            : 4

class HazardEventsMapController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            viewport: Viewport(),
            eventsData: {},
            loadedRanges: {},
            bounds: null,
            colorScale: getColorScale([1, 2]),
            controllerId: getUniqueId(),
            radiusScale: d3scale.scaleLog()
                .domain([50000, 10000000]) // Dollar amount
                .range([4, 40]) // radius in kilometers
        }
        ACTIVE_CONTROLLERS.add(this.state.controllerId)
    }

    componentWillMount() {
        const {geoid} = this.props;
        this.props.getChildGeo(geoid.slice(0, 2), 'counties');
        this.props.getChildGeo(geoid.slice(0, 2), 'cousubs');

        this.props.getGeoMesh(geoid.slice(0, 2), 'counties');
        this.props.getGeoMerge(geoid.slice(0, 2), 'counties');

        this.props.getGeoMesh(geoid.slice(0, 2), 'cousubs');
        this.props.getGeoMerge(geoid.slice(0, 2), 'cousubs');
    }

    componentWillUnmount() {
        ACTIVE_CONTROLLERS.remove(this.state.controllerId)
    }

    updateLoadedRanges({from, to}) {
        if (!ACTIVE_CONTROLLERS.has(this.state.controllerId)) return;
        const key = `loaded-${from}-${to}`;
        let {loadedRanges} = this.state;
        if (!(key in loadedRanges)) {
            loadedRanges = {...loadedRanges, [key]: {range: [from, to], processed: false}}
            this.setState({loadedRanges});
        }
    }

    componentDidUpdate() {
        const {loadedRanges} = this.state;
        for (const key in loadedRanges) {
            const {processed} = loadedRanges[key];
            if (!processed) {
                this.processData(key);
            }
        }
    }

    componentWillReceiveProps(newProps) {
        const {geoid, geoLevel, hazard} = newProps;
        let geojson = null
        let padding = this.props.zoomPadding
        let cousubs = get(newProps, `geoGraph.${newProps.geoid.slice(0, 5)}.cousubs.value`, []);

        switch (geoLevel) {
            case 'counties':
                geojson = newProps.geo[geoid.slice(0, 2)]['counties'].features
                    .reduce((a, c) => (c.properties.geoid === geoid) ? c : a, null);
                break;
            case 'cousubs':
                geojson = newProps.geo[geoid.slice(0, 2)]['cousubs'].features
                    .reduce((a, c) => (c.properties.geoid === geoid) ? c : a, null);
                break;
        }
        if (!geojson) return;

        this.state.viewport.fitGeojson(geojson, {padding});

        this.setState({bounds: geojson})
        if ((geoid !== this.props.geoid) ||
            (hazard !== this.props.hazard)) {
            this.setState({loadedRanges: {}});
            this.fetchFalcorDeps(newProps);
        }
    }

    fetchFalcorDeps({geoid, dataType, geoLevel, hazard} = this.props) {

        return this.props.falcor.get(
            ['geo', geoid, geoLevel],
            ['riskIndex', 'hazards']
        ).then(falcorResponse => {
            this.setState({colorScale: getColorScale(falcorResponse.json.riskIndex.hazards)});

            const geoids = falcorResponse.json.geo[geoid][geoLevel],
                hazards = hazard ? [hazard] : falcorResponse.json.riskIndex.hazards,
                requests = [],

                yearsPerRequest = 3;

            for (let i = LATEST_YEAR; i >= EARLIEST_YEAR; i -= yearsPerRequest) {
                requests.push([dataType, 'events', 'borked', geoids, hazards, {
                    from: Math.max(i - yearsPerRequest + 1, EARLIEST_YEAR),
                    to: i
                }, 'property_damage'])
            }
            return requests.reduce((a, c) =>
                    a.then(() => this.props.falcor.get(c))
                        .then(() => this.updateLoadedRanges(c[5]))
                , this.props.falcor.get(['riskIndex', 'meta', falcorResponse.json.riskIndex.hazards, ['id', 'name']]));
        })
    }

    processData(key) {
        let {
            eventsData,
            loadedRanges,
            radiusScale
        } = this.state;

        const {range} = loadedRanges[key];
        const {geoid, dataType, geoLevel, hazard} = this.props,

            features = get(this.props.geo, `${geoid.slice(0, 2)}.${geoLevel}.features`, []);

        if (geoid.slice(0, 2) === '72') {
            radiusScale.range([1, 10])
        }

        if (!(geoid in eventsData)) {
            eventsData[geoid] = {}
        }
        if (!(geoLevel in eventsData[geoid])) {
            eventsData[geoid][geoLevel] = {};
        }
        const geoData = eventsData[geoid][geoLevel];

        try {
            const hazards = hazard ? [hazard] : this.props.riskIndexGraph.hazards.value

            this.props.geoGraph[geoid][geoLevel].value
                .forEach(geoid => {
                    if (!(geoid in geoData)) {
                        geoData[geoid] = {};
                    }
                    hazards.forEach(hazard => {
                        if (!(hazard in geoData[geoid])) {
                            geoData[geoid][hazard] = {};
                        }
                        for (let year = range[0]; year <= range[1]; ++year) {
                            if (!(year in geoData[geoid][hazard])) {
                                geoData[geoid][hazard][year] = [];
                            }
                            if (!("allTime" in geoData[geoid][hazard])) {
                                geoData[geoid][hazard].allTime = [];
                            }

                            const events = this.props[dataType].events.borked[geoid][hazard][year]["property_damage"].value;

                            if (events.length) {

                                const feature = features.reduce((a, c) => c.properties.geoid === geoid ? c : a);

                                events.forEach(event => {
                                    const property_damage = +event.property_damage,
                                        geom = event.geom,

                                        properties = {property_damage, hazard};

                                    let circle;

                                    if ((property_damage < radiusScale.domain()[0]) &&
                                        (geoLevel === "counties")) return;

                                    if (geom) {
                                        circle = turf.circle(JSON.parse(geom).coordinates, radiusScale(property_damage), {
                                            units: "kilometers",
                                            properties
                                        });
                                    } else {
                                        const centroid = turf.centroid(feature);
                                        circle = turf.circle(centroid.geometry.coordinates, radiusScale(property_damage), {
                                            units: "kilometers",
                                            properties
                                        });
                                    }
                                    if (circle) geoData[geoid][hazard][year].push(circle);
                                    if (circle) geoData[geoid][hazard].allTime.push(circle);
                                })

                            }
                        }
                    })
                })
        } catch (e) {
            return;
        }
        loadedRanges = {...loadedRanges, [key]: {range, processed: true}}
        this.setState({eventsData, loadedRanges, radiusScale});
    }

    render() {
        let {
            numMaps,
            height,
            mapHeight,
            mapControlsLocation,
            mapLegendLocation,
            mapLegendSize,
            geoLevel,
            geoid,
            dataType,
            colorScale,
            radiusScale,
            zoomPadding,
            hazard,
            allTime,
            showLegend,
        } = this.props;
        showLegend = (showLegend !== "auto") ? showLegend : (numMaps > 1)
        const maps = Array(this.props.numMaps).fill(getMapWidth(this.props.numMaps))
            .map((width, n) =>
                    <div className={`col-lg-${width}`} key={n}>
                        <HazardEventsMap
                            eventsData={this.state.eventsData}
                            yearDelta={n + 1 - this.props.numMaps}
                            geoLevel={geoLevel}
                            geoid={geoid}
                            dataType={dataType}
                            {...getMapDefaults(width, (height || mapHeight))}
                            mapLegendLocation={mapLegendLocation}
                            mapLegendSize={mapLegendSize}
                            mapControlsLocation={mapControlsLocation}
                            viewport={this.state.viewport}
                            colorScale={colorScale || this.state.colorScale}
                            radiusScale={this.state.radiusScale}
                            zoomPadding={zoomPadding}
                            hazard={hazard}
                            bounds={this.state.bounds}
                            allTime={allTime}/>
                    </div>
                , this);
        return (
            <div className='row'>
                {
                    !showLegend ? null :
                        <HazardEventsLegend
                            riskIndexGraph={this.props.riskIndexGraph}
                            viewport={this.state.viewport}
                            colorScale={colorScale || this.state.colorScale}
                            radiusScale={this.state.radiusScale}/>
                }
                {maps.reverse()}
            </div>
        )
    }
}

HazardEventsMapController.defaultProps = {
    geoid: '36',
    dataType: 'severeWeather',
    geoLevel: 'counties',
    numMaps: 1,
    showLegend: "auto",
    mapLegendLocation: 'top-left',
    mapLegendSize: "large",
    mapControlsLocation: "top-right",
    colorScale: null,
    mapHeight: null,
    height: null,
    zoomPadding: 20,
    hazard: null,
    allTime: false
}

const mapStateToProps = (state, ownProps) => {
    return {
        router: state.router,
        geo: state.geo,
        geoGraph: state.graph.geo,
        severeWeather: state.graph.severeWeather,
        riskIndexGraph: state.graph.riskIndex
    }
}

const mapDispatchToProps = {
    getChildGeo,
    getGeoMesh,
    getGeoMerge
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(HazardEventsMapController));