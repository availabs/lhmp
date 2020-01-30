import React from "react"

import store from "store"
import { update } from "utils/redux-falcor/components/duck"
import { falcorGraph, falcorChunkerNice } from "store/falcorGraph"
import { connect } from 'react-redux';
import { reduxFalcor, UPDATE as REDUX_UPDATE } from 'utils/redux-falcor'
import get from "lodash.get"
import styled from "styled-components"
import {
    scaleLinear,
    scaleQuantile,
    scaleQuantize, scaleThreshold
} from "d3-scale"
import { extent } from "d3-array"
import { format as d3format } from "d3-format"
import { fnum } from "utils/sheldusUtils"
import MapLayer from "components/AvlMap/MapLayer.js"
import { getColorRange } from "constants/color-ranges";
import {register, unregister} from "components/AvlMap/ReduxMiddleware";
import COLOR_RANGES from "constants/color-ranges"
var _ = require('lodash')
const LEGEND_COLOR_RANGE = getColorRange(8, "YlGn");

export class ScenarioLayer extends MapLayer{
    onAdd(map) {
        register(this, 'USER::SET_RISK_ZONE_ID', ["scenario"]);
        super.onAdd(map);
        if(store.getState().user.activeGeoid){
            let activeGeoid = store.getState().user.activeGeoid
            let graph = '';
            this.map.on('render',()=>{
                const features =  map.querySourceFeatures('nys_buildings_avail', {
                    sourceLayer: 'nys_buildings_osm_ms_parcelid_pk',
                })
                this.selection = features.map(d => d.properties.id);
                this.fetchData().then(data => this.receiveData(map, data))

            })
            return falcorGraph.get(['geo',activeGeoid,'boundingBox'])
                .then(response =>{
                    let initalBbox = response.json.geo[activeGeoid]['boundingBox'].slice(4, -1).split(",");
                    let bbox = initalBbox ? [initalBbox[0].split(" "), initalBbox[1].split(" ")] : null;
                    this.map.resize();
                    this.map.fitBounds(bbox);
                    //map.setZoom(9)

                    return this.fetchData().then(data => this.receiveData(this.map, data))
                })
        }
    }
    onRemove(map) {
        unregister(this);
    }
    receiveMessage(action, data) {
        this.activeScenarioId = data.activeRiskZoneId
        //console.log('this.activeScenarioId',this.activeScenarioId)
        return this.fetchData().then(data => this.receiveData(data,this.map))
    }
    fetchData(){
        let owner_types = ['2','3', '4', '5', '6', '7','8'];
        let buildingIds = [];
        return falcorGraph.get(
            ['building', 'byGeoid', store.getState().user.activeGeoid, 'flood_zone',
                ['flood_100','flood_500'], 'owner_type',owner_types, 'critical', ['true', 'false']]
        ).then(d => {
            let graph = d.json.building.byGeoid[store.getState().user.activeGeoid].flood_zone;
            let filteredBuildings = [];
            let data = {}
            if(graph){
                Object.keys(graph).filter(d => d !== '$__path').forEach(item =>{
                    data[item] = get(d, `json.building.byGeoid.${store.getState().user.activeGeoid}.flood_zone.${item}.owner_type`, {})
                });
                Object.keys(data).forEach(d =>{
                    owner_types.map(owner =>{
                        filteredBuildings.push(...get(data[d], `${owner}.critical.false`))
                    })
                })
            }

            buildingIds = filteredBuildings.map(f => f.id);
            return buildingIds
        }).then(buildingIds =>{
            if(buildingIds){
                return falcorChunkerNice(
                    ['building', 'geom', 'byBuildingId',buildingIds, 'centroid']
                )
            }
        })
        .then(() =>{
            if (!this.selection || this.selection.length === 0) {
                return Promise.resolve([])
            }else{
                if(this.activeScenarioId !== null){
                    falcorGraph.get(
                        ['risk_zones',[this.activeScenarioId],'buildings',this.selection,'total_loss']
                    )
                        .then(data => {
                            return data
                        })

                }

            }

        })

    }

    receiveData(map,data) {
        /*
        owner types :
            2 - state
            3 - county
            4,5,6,7- Municipality
            8 - Private
         */
        let resultedRiskZonesData = [];
        let coloredBuildingIds = [];
        let coloredBuildings = {};
        let riskZonesData = falcorGraph.getCache();

        if(riskZonesData.risk_zones && riskZonesData.risk_zones[this.activeScenarioId] && this.activeScenarioId){
                if(riskZonesData.risk_zones[this.activeScenarioId]){
                    if(Object.keys(riskZonesData.risk_zones[this.activeScenarioId].buildings).length > 0){
                        Object.keys(riskZonesData.risk_zones[this.activeScenarioId].buildings).forEach(building_id =>{
                            if(building_id){
                                resultedRiskZonesData.push({
                                    'id':building_id,
                                    'value':riskZonesData.risk_zones[this.activeScenarioId].buildings[building_id].total_loss.value ? riskZonesData.risk_zones[this.activeScenarioId].buildings[building_id].total_loss.value : 0
                                })
                            }
                        })

                    }

                }
        }
        if(resultedRiskZonesData.length > 0){
            const colorScale = this.getColorScale(resultedRiskZonesData),
                colors = resultedRiskZonesData.reduce((a, c) => {
                a[c.id] = colorScale(c.value);
                coloredBuildingIds.push(c.id.toString());
                return a;
            }, {});
            coloredBuildings = colors
        }

        let rawGraph = falcorGraph.getCache(),
            graph = get(rawGraph, `building.byGeoid.${store.getState().user.activeGeoid}.flood_zone`, null),
            centroidGraph = get(rawGraph, `building.geom.byBuildingId`, null),
            geojson = {
                "type": "FeatureCollection",
                "features": []
            },
            buildingColors = {};
        Object.keys(graph['flood_100'].owner_type).forEach(owner => {

            //state owned
            if (owner === '2') {
                graph['flood_100'].owner_type[owner].critical.false.value.forEach(item => {
                    buildingColors[item.id] = '#0d1acc'
                    geojson.features.push({
                        "type": "Feature",
                        "properties": {id: item.id, color: '#0d1acc'},
                        "geometry": {...get(centroidGraph, `${item.id}.centroid.value`, null)}
                    })
                })
                graph['flood_500'].owner_type[owner].critical.false.value.forEach(item => {
                    buildingColors[item.id] = '#0d1acc'
                    geojson.features.push({
                        "type": "Feature",
                        "properties": {id: item.id, color: '#0d1acc'},
                        "geometry": {...get(centroidGraph, `${item.id}.centroid.value`, null)}
                    })
                })
            }

            // County Owned
            if (owner === '3') {
                graph['flood_100'].owner_type[owner].critical.false.value.forEach(item => {
                    buildingColors[item.id] = '#0fcc1b'
                    geojson.features.push({
                        "type": "Feature",
                        "properties": {id: item.id, color: '#0fcc1b'},
                        "geometry": {...get(centroidGraph, `${item.id}.centroid.value`, null)}
                    })
                })
                graph['flood_500'].owner_type[owner].critical.false.value.forEach(item => {
                    buildingColors[item.id] = '#0fcc1b'
                    geojson.features.push({
                        "type": "Feature",
                        "properties": {id: item.id, color: '#0fcc1b'},
                        "geometry": {...get(centroidGraph, `${item.id}.centroid.value`, null)}
                    })
                })
            }

            // municipality Owned
            if (['4', '5', '6', '7'].includes(owner)) {
                graph['flood_100'].owner_type[owner].critical.false.value.forEach(item => {
                    buildingColors[item.id] = '#cc1e0a'
                    geojson.features.push({
                        "type": "Feature",
                        "properties": {id: item.id, color: '#cc1e0a'},
                        "geometry": {...get(centroidGraph, `${item.id}.centroid.value`, null)}
                    })
                })
                graph['flood_500'].owner_type[owner].critical.false.value.forEach(item => {
                    buildingColors[item.id] = '#cc1e0a'
                    geojson.features.push({
                        "type": "Feature",
                        "properties": {id: item.id, color: '#cc1e0a'},
                        "geometry": {...get(centroidGraph, `${item.id}.centroid.value`, null)}
                    })
                })
            }

            //Private Owned
            if (owner === '8') {
                graph['flood_100'].owner_type[owner].critical.false.value.forEach(item => {
                    buildingColors[item.id] = '#F3EC16'
                    geojson.features.push({
                        "type": "Feature",
                        "properties": {id: item.id, color: '#F3EC16'},
                        "geometry": {...get(centroidGraph, `${item.id}.centroid.value`, null)}
                    })
                })
                graph['flood_500'].owner_type[owner].critical.false.value.forEach(item => {
                    buildingColors[item.id] = '#F3EC16'
                    geojson.features.push({
                        "type": "Feature",
                        "properties": {id: item.id, color: '#F3EC16'},
                        "geometry": {...get(centroidGraph, `${item.id}.centroid.value`, null)}
                    })
                })
            }

        })

        if(this.map.getSource('buildings')) {
            this.map.getSource("buildings").setData(geojson)
        }


        this.map.setPaintProperty(
            'buildings-layer',
            'circle-color',
            ["get", ["to-string", ["get", "id"]], ["literal", buildingColors]]

        )
        if(Object.keys(coloredBuildings).length > 0){
            this.map.setPaintProperty(
                'ebr',
                'fill-color',
                ["get",
                    ["to-string", ["get", "id"]],
                    ["literal",coloredBuildings]
                ],
            )
        }


    }

    getColorScale(data) {
        const { type, range, domain } = this.legend;
        switch (type) {
            case "quantile": {
                const domain = data.map(d => d.value).filter(d => d).sort();
                this.legend.domain = domain;
                return scaleQuantile()
                    .domain(domain)
                    .range(range);
            }
            case "quantize": {
                const domain = extent(data, d => d.value);
                this.legend.domain = domain;
                return scaleQuantize()
                    .domain(domain)
                    .range(range);
            }
            case "threshold": {
                return scaleThreshold()
                    .domain(domain)
                    .range(range)
            }
            case "linear":{
                return scaleLinear()
                    .domain(domain)
                    .range(range)
            }
        }
    }


}


export const ScenarioOptions =  (options = {}) => {
    return {
        active: true,
        ...options,
        activeScenarioId: null,
        sources: [
            { id:"buildings",
                source: {
                    type: "geojson",
                    //generateId: true,
                    data: {
                        type: "FeatureCollection",
                        features: []
                    }
                }
            },
            {
                id:"counties",
                source: {
                    'type':"vector",
                    'url': 'mapbox://am3081.1ggw4eku'
                }
            },
            {
                id:"nys_buildings_avail",
                source: {
                    'type': "vector",
                    'url': 'mapbox://am3081.dpm2lod3'
                }
            },
            {
                id:"nys_1811_parcels",
                source: {
                    'type': "vector",
                    'url': "mapbox://am3081.6o6ny609"
                }
            }
        ],
        layers: [
            {
                'id': 'parcels',
                'source': 'nys_1811_parcels',
                'source-layer': 'nys_1811_parcels',
                'type': 'fill',
                'minzoom': 13,
                'paint': {
                    'fill-color': 'rgba(255,255,255, 0.2)'
                }
            },
            {
                'id': 'ebr',
                'source': 'nys_buildings_avail',
                'source-layer': 'nys_buildings_osm_ms_parcelid_pk',
                'type': 'fill',
                'minzoom': 13,
                'paint': {
                    'fill-color': '#000000'
                }
            },

            {
                'id': 'buildings-layer',
                'source': 'buildings',
                'type': 'circle',
                'paint': {
                    'circle-radius': 3,
                    'circle-opacity': 0.5
                }
            },


        ],
        legend: {
            title: 'Total Hazard Loss',
            type: "linear",
            types: ["threshold", "quantile", "quantize","linear"],
            vertical: false,
            range: LEGEND_COLOR_RANGE,
            active: true,
            domain: [0,10000,50000,100000, 250000, 500000, 1000000], //10k, 50k, 100k, 250k, 500k, 1m+
            format: fnum
        },
        popover: {
            layers: ["ebr"],
            dataFunc: function(topFeature, features) {
                /*
                const {id} = topFeature.properties
                let graph = falcorGraph.getCache()
                if(graph.risk_zones){
                    console.log('id',id)
                    console.log('graph',graph.risk_zones[this.activeScenarioId].buildings[id].total_loss)
                }
                 */
            },
        }
    }
};






