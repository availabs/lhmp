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
            let geoids = JSON.parse("[" + localStorage.getItem("zone") + "]")[0];
            let cousubs = [];
            if(geoids){
                geoids.forEach(geoid =>{
                    if(geoid.geoid && geoid.geoid.length !== 5){
                        cousubs.push(geoid.geoid)
                    }
                });
            }
            this.map.setFilter(
                "cousubs",
                ['all', ['in', 'geoid',...cousubs.filter(d => d)]]
            )

            if(localStorage.getItem("zone")){
                let new_zones = JSON.parse(localStorage.getItem("zone"))

                let geojson = {
                    "type": "FeatureCollection",
                    "features": []
                }
                new_zones.forEach(new_zone =>{
                    if(new_zone.geoid === null){
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

            return falcorGraph.get(['geo',activeGeoid,'boundingBox'])
                .then(response =>{
                    let initalBbox = response.json.geo[activeGeoid]['boundingBox'].slice(4, -1).split(",");
                    let bbox = initalBbox ? [initalBbox[0].split(" "), initalBbox[1].split(" ")] : null;
                    map.resize();
                    map.fitBounds(bbox);
                })

        }
    }

    toggleVisibilityOn() {
        //console.log('in map layer toggle visibility',map,this.layers)
        this._isVisible = !this._isVisible;
        this.layers.forEach(layer => {
            this.map.setLayoutProperty(layer.id, 'visibility',  "visible");
        })
    }

    toggleVisibilityOff(){
        this.layers.forEach(layer => {
            this.map.setLayoutProperty(layer.id, 'visibility',"none");
        })
    }

    showTownBoundary(data,id){
        let geoids = JSON.parse("[" + data + "]")[0];
        let cousubs = [];
        let geojson = {
            "type": "FeatureCollection",
            "features": []
        }
        geoids.forEach(geoid =>{
            if(geoid.geoid && geoid.geoid.length !== 5){
                cousubs.push(geoid.geoid)
            }else if(geoid.geoid === null){
                let new_zones = JSON.parse(localStorage.getItem("zone"))
                new_zones.forEach(new_zone =>{
                    if(new_zone.geoid === null){
                        if(new_zone.geojson){
                            if(new_zone.geojson.geometry){
                                geojson.features.push({
                                    type : "Feature",
                                    properties:{},
                                    geometry:new_zone.geojson.geometry
                                })
                            }else{
                                geojson.features.push({
                                    type : "Feature",
                                    properties:{},
                                    geometry:new_zone.geojson
                                })
                            }
                        }else{
                            geojson.features.push(new_zone.geom)
                        }
                    }
                })
            }
        });
        this.map.setFilter(
            "cousubs",
            ['all', ['in', 'geoid',...cousubs]]
        )
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
                    'id': 'cousubs',
                    'source': 'cousubs',
                    'source-layer': 'cousubs',
                    'type': 'line',
                    'paint': {
                        'line-color': '#F31616',
                        'line-opacity': 0.5,
                        'line-width': 4
                    },
                    filter : ['in','geoid','']

                },
                {
                    'id': 'polygon-layer',
                    'source': 'polygon',
                    'type': 'line',
                    'paint': {
                        'line-color': '#F31616',
                        'line-opacity': 0.5,
                        'line-width': 4
                    }
                }

            ],
            _isVisible: true
        }


}

const mapStateToProps = (state, { id }) => ({

});
const mapDispatchToProps = {};
