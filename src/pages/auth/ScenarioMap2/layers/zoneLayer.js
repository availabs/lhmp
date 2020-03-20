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

export class ZoneLayer extends MapLayer{
    onAdd(map) {
        super.onAdd(map);
        if(store.getState().user.activeGeoid){
            let activeGeoid = store.getState().user.activeGeoid
            let geoids = JSON.parse("[" + localStorage.getItem("zone") + "]")[0];
            let cousubs = [];
            if(geoids){
                console.log('geoids',geoids)
                geoids.forEach(geoid =>{
                    if(geoid.geoid.length !== 5){
                        cousubs.push(geoid.geoid)
                    }
                });
            }
            this.map.setFilter(
                "cousubs",
                ['all', ['in', 'geoid',...cousubs.filter(d => d)]]
            )

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

    showTownBoundary(data){
        let geoids = JSON.parse("[" + data + "]")[0];
        let cousubs = [];
        geoids.forEach(geoid =>{
            if(geoid.geoid.length !== 5){
                cousubs.push(geoid.geoid)
            }
        });
        this.map.setFilter(
            "cousubs",
            ['all', ['in', 'geoid',...cousubs.filter(d => d)]]
        )
    }

    noShowTownBoundary(data){
        let geoids = JSON.parse("[" + data + "]")[0];
        let cousubs = [];
        geoids.forEach(geoid =>{
            if(geoid.geoid.length !== 5){
                cousubs.push(geoid.geoid)
            }
        });
        this.map.setFilter(
            "cousubs",
            ['all', ['in', 'geoid',...cousubs]]
        )
    }



}


export const ZoneOptions =  (options = {}) => {
        return {
            active: true,
            ...options,
            sources: [
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

                }

            ],
            _isVisible: true
        }


}

const mapStateToProps = (state, { id }) => ({

});
const mapDispatchToProps = {};
