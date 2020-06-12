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

export class VulnerableDemographicsLayer extends MapLayer{
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


export const VulnerableDemographicsOptions =  (options = {}) => {
    return {
        active: true,
        ...options,
        sources: [
            // { id: "counties",
            //   source: {
            //     'type': "vector",
            //     'url': 'mapbox://am3081.a8ndgl5n'
            //   },
            // },
            { id: "cousubs",
                source: {
                    'type': "vector",
                    'url': 'mapbox://am3081.36lr7sic'
                },
            },
            // { id: "tracts",
            //   source: {
            //     'type': "vector",
            //     'url': 'mapbox://am3081.2x2v9z60'
            //   },
            // },
            {
                id: "blockgroup",
                source: {
                    'type': "vector",
                    'url': 'mapbox://am3081.52dbm7po'
                }
            },
            {
                id: "places",
                source: {
                    type: "vector",
                    url: "mapbox://am3081.6u9e7oi9"
                }
            }
        ],
        layers: [
            // { 'id': 'counties',
            //   'source': 'counties',
            //   'source-layer': 'counties',
            //   'type': 'fill',
            //   filter : ['in', 'geoid', 'none']
            // },
            // { 'id': 'tracts',
            //   'source': 'tracts',
            //   'source-layer': 'tracts',
            //   'type': 'fill',
            //   filter : ['in', 'geoid', 'none']
            // },
            {
                id: "blockgroup",
                source: "blockgroup",
                'source-layer': "blockgroups",
                'type': 'fill',
                filter : ['in', 'geoid', 'none']
            },

            { 'id': 'cousubs',
                'source': 'cousubs',
                'source-layer': 'cousubs',
                'type': 'fill',
                filter : ['in', 'geoid', 'none']
            },

            /*{ 'id': 'cousubs-line',
                'source': 'cousubs',
                'source-layer': 'cousubs',
                'type': 'line',
                filter : ['in', 'geoid', 'none'],
                paint: {
                    "line-color": BORDER_COLOR,
                    "line-width": 2
                }
            },
            { 'id': 'cousubs-symbol',
                'source': 'cousubs',
                'source-layer': 'cousubs',
                'type': 'symbol',
                filter : ['in', 'geoid', 'none'],
                layout: {
                    "symbol-placement": "point",
                    "text-size": 12,
                    // "text-allow-overlap": true,
                    // "text-ignore-placement": true
                },
                paint: {
                    "text-color": "#000"
                }
            },

            { id: 'places-line',
                source: 'places',
                'source-layer': 'places',
                type: 'line',
                filter: ['in', 'geoid', 'none'],
                paint: {
                    'line-color': BORDER_COLOR,
                    'line-width': 2
                }
            },
            { id: 'places-symbol',
                source: 'places',
                'source-layer': 'places',
                type: 'symbol',
                filter: ['in', 'geoid', 'none'],
                layout: {
                    "symbol-placement": "point",
                    "text-size": 12,
                    // "text-allow-overlap": true,
                    // "text-ignore-placement": true
                },
                paint: {
                    "text-color": "#000"
                }
            }*/
        ]
    }


}

const mapStateToProps = (state, { id }) => ({

});
const mapDispatchToProps = {};
