import React from "react"

import store from "store"
import { update } from "utils/redux-falcor/components/duck"
import { falcorGraph, falcorChunkerNice } from "store/falcorGraph"
import { connect } from 'react-redux';
import { reduxFalcor, UPDATE as REDUX_UPDATE } from 'utils/redux-falcor'
import get from "lodash.get"
import styled from "styled-components"
import {
    scaleQuantile,
    scaleQuantize
} from "d3-scale"
import { extent } from "d3-array"
import { format as d3format } from "d3-format"
import { fnum } from "utils/sheldusUtils"
import MapLayer from "components/AvlMap/MapLayer.js"
//import { register, unregister } from "../ReduxMiddleware"

import { getColorRange } from "constants/color-ranges";
import ZoneControls from "../controls/zoneControls";
var _ = require('lodash')
const LEGEND_COLOR_RANGE = getColorRange(7, "YlGn");

const IDENTITY = i => i;

export class ScenarioLayer extends MapLayer{
    onAdd(map) {
        super.onAdd(map);
        if(store.getState().user.activeGeoid){
            let activeGeoid = store.getState().user.activeGeoid
            let graph = ''
            return falcorGraph.get(['geo',activeGeoid,'boundingBox'])
                .then(response =>{
                    let initalBbox = response.json.geo[activeGeoid]['boundingBox'].slice(4, -1).split(",");
                    let bbox = initalBbox ? [initalBbox[0].split(" "), initalBbox[1].split(" ")] : null;
                    map.resize();
                    map.fitBounds(bbox);
                    //map.setZoom(9)

                    return this.fetchData(graph).then(data => this.receiveData(map, data))
                })
        }
    }
    fetchData(graph){
        let owner_types = ['2','3', '4', '5', '6', '7','8'];
        let buildingIds = []
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
                // .then(d => {
                //     return d
                // })
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

        if(map.getSource('buildings')) {
            map.getSource("buildings").setData(geojson)
        }

        map.setPaintProperty(
            'buildings-layer',
            'circle-color',
            ["get", ["to-string", ["get", "id"]], ["literal", buildingColors]]

        )


    }

}


export const ScenarioOptions =  (options = {}) => {
    return {
        active: true,
        ...options,
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
                'id': 'parcels',
                'source': 'nys_1811_parcels',
                'source-layer': 'nys_1811_parcels',
                'type': 'fill',
                'minzoom': 15,
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
            }

        ]
    }
}

