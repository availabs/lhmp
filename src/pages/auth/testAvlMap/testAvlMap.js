import React from "react"
import store from "store"
import { falcorGraph, falcorChunkerNice } from "store/falcorGraph"
import MapLayer from "avlmap-npm/MapLayer"
import { getColorRange } from "constants/color-ranges";
import {register,unregister} from'avlmap-npm/ReduxMiddleware'
var _ = require('lodash')
const LEGEND_COLOR_RANGE = getColorRange(7, "YlGn");

const IDENTITY = i => i;

export class TestAvlMapLayer extends MapLayer{
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
                })
        }
    }



}


export default (props = {}) =>new TestAvlMapLayer("TestAvlMapLayer",{
        active: true,
        sources: [
            {
                id: "counties",
                source: {
                    'type': "vector",
                    'url': 'mapbox://am3081.1ggw4eku'
                }
            },
        ],
        layers: [
            {
                'id': 'project',
                'source': 'counties',
                'source-layer': 'counties',
                'type': 'line',
                'paint': {
                    'line-color': '#FFFFFF',
                    'line-opacity': 0.5
                },
                filter: ['all', ['in', 'geoid', store.getState().user.activeGeoid]]

            },

        ],


})

