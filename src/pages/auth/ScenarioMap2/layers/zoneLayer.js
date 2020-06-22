import React from "react"

import store from "store"
import { update } from "utils/redux-falcor/components/duck"
import { falcorGraph, falcorChunkerNice } from "store/falcorGraph"
import MapLayer from "components/AvlMap/MapLayer.js"
//import { register, unregister } from "../ReduxMiddleware"


import { getColorRange } from "constants/color-ranges";
import ZoneControls from "../controls/zoneControls";
import geo from "../../../../store/modules/geo";
var _ = require('lodash')
const LEGEND_COLOR_RANGE = getColorRange(7, "YlGn");

const IDENTITY = i => i;

export class ZoneLayer extends MapLayer{
    onAdd(map) {
        super.onAdd(map);
        if(store.getState().user.activeGeoid){
            let activeGeoid = store.getState().user.activeGeoid
            return falcorGraph.get(['geo',activeGeoid,'boundingBox'])
                .then(response =>{
                    let initalBbox = response.json.geo[activeGeoid]['boundingBox'].slice(4, -1).split(",");
                    let bbox = initalBbox ? [initalBbox[0].split(" "), initalBbox[1].split(" ")] : null;
                    this.layers.forEach(layer => {
                        map.setLayoutProperty(layer.id, 'visibility',"none");
                    })
                    map.resize();
                    map.fitBounds(bbox);
                })

        }
    }

    toggleVisibilityOn() {
        let activeGeoid = store.getState().user.activeGeoid
        this.layers.forEach(layer => {
            this.map.setLayoutProperty(layer.id, 'visibility',  "visible");
        })
        //console.log('in toggle visibility on',localStorage.getItem("zone"))
        if(localStorage.getItem("zone") && this.map.getLayoutProperty("polygon-layer","visibility") === 'visible'){
            let new_zones = JSON.parse(localStorage.getItem("zone")) || []
            let geojson = {
                "type": "FeatureCollection",
                "features": []
            }
            new_zones.forEach(new_zone =>{
                if(new_zone.geoid === activeGeoid && !new_zone.name.includes("County")){
                    if(new_zone.geojson){
                        geojson.features.push({
                            type : "Feature",
                            properties:{},
                            geometry:new_zone.geojson.geometry ? new_zone.geojson.geometry : new_zone.geojson
                        })
                    }else{
                        geojson.features.push(new_zone.geom)
                    }
                }
            })
            this.map.getSource("polygon").setData(geojson)
        }

    }

    toggleVisibilityOff(){
        this.layers.forEach(layer => {
            this.map.setLayoutProperty(layer.id, 'visibility',"none");
        })
    }

    showTownBoundary(data,id,zones_data){
        let zones = JSON.parse("[" + data + "]")[0] || [];
        let geojson = {
            "type": "FeatureCollection",
            "features": []
        }
        let activeGeoid = store.getState().user.activeGeoid
        zones.forEach(zone =>{
            if(zone.geoid === activeGeoid && !zone.name.includes("County")){
                if(zone.geojson){
                    if(zone.geojson.geometry){
                        geojson.features.push({
                            type : "Feature",
                            properties:{},
                            geometry:zone.geojson.geometry
                        })
                    }else{
                        geojson.features.push({
                            type : "Feature",
                            properties:{},
                            geometry:zone.geojson
                        })
                    }
                }else{
                    geojson.features.push(zone.geom)
                }
            }
        })
        this.map.getSource("polygon").setData(geojson)
    }




}


export const ZoneOptions =  (options = {}) => {
        return {
            active: true,
            ...options,
            sources: [
                { id:"polygon",
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
                    id: "counties",
                    source: {
                        'type': "vector",
                        'url': 'mapbox://am3081.1ggw4eku'
                    },
                },
                { id: "cousubs",
                    source: {
                        'type': "vector",
                        'url': 'mapbox://am3081.dlnvkxdi'
                    },
                }
            ],
            layers: [
                {
                    'id': 'counties',
                    'source': 'counties',
                    'source-layer': 'counties',
                    'type': 'line',
                    'paint': {
                        'line-color': '#F31616',
                        'line-opacity': 0.5,
                        'line-width': 4
                    },
                    filter: ['all', ['in', 'geoid',store.getState().user.activeGeoid]]

                },
                {
                    'id': 'polygon-layer',
                    'source': 'polygon',
                    'type': 'line',
                    'paint': {
                        'line-color': '#F31616',
                        'line-opacity': 0.5,
                        'line-width': 4,
                    },
                }

            ],
            _isVisible: true
        }


}

const mapStateToProps = (state, { id }) => ({

});
const mapDispatchToProps = {};
