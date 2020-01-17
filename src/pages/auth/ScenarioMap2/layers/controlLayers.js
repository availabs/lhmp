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
import MainControls from 'pages/auth/ScenarioMap2/controls/mainControls.js'
import MapLayer from "components/AvlMap/MapLayer.js"
import {ScenarioLayer, ScenarioOptions} from "./scenarioLayer.js"
import {ZoneLayer,ZoneOptions} from "./zoneLayer";
import {ProjectLayer,ProjectOptions} from "./projectLayer";
//import { register, unregister } from "../ReduxMiddleware"
import { getColorRange } from "constants/color-ranges";
var _ = require('lodash')
const LEGEND_COLOR_RANGE = getColorRange(7, "YlGn");

const IDENTITY = i => i;
const COLORS = getColorRange(12, "Set3");

let UNIQUE = 0;
const getUniqueId = () => `unique-id-${ ++UNIQUE }`
let layerToShow = ''
const DynamicLayerFactory = (callingLayer, ...args) => {
    const lineColor = COLORS[UNIQUE % 12],
        sourceId = getUniqueId(),
        layerId = getUniqueId();
    if(layerToShow === 'scenario'){
        return new ScenarioLayer('scenario', ScenarioOptions())
    }
    else if(layerToShow === 'zone'){
        return new ZoneLayer('zone',ZoneOptions())
    }
    else if(layerToShow === 'projects'){
        return new ProjectLayer('projects',ProjectOptions())
    }

}


class ControlLayers extends MapLayer{
    onAdd(map) {
        super.onAdd(map);
        if(store.getState().user.activeGeoid){
            let activeGeoid = store.getState().user.activeGeoid
            return falcorGraph.get(['geo',activeGeoid,'boundingBox'])
                .then(response =>{
                    let initalBbox = response.json.geo[activeGeoid]['boundingBox'].slice(4, -1).split(",");
                    let bbox = initalBbox ? [initalBbox[0].split(" "), initalBbox[1].split(" ")] : null;
                    map.resize();
                    map.fitBounds(bbox);
                })
        }

    }

    toggleModesOff(layerName) {
        if (this.modes.includes(layerName)) {
            this.doAction([
                "deleteDynamicLayer",
                layerName
            ])

        }
    }

    toggleModesOn (layerName){
        if(this.modes.includes(layerName)){
            layerToShow = layerName
            this.doAction([
                "deleteDynamicLayer",
                layerName
            ])
            this.doAction([
                "addDynamicLayer",
                DynamicLayerFactory
            ]);
        }else {

            layerToShow = layerName
            this.doAction([
                "addDynamicLayer",
                DynamicLayerFactory,
                // callingLayer => DynamicLayerFactory(callingLayer, "ARG 1", "ARG 2", "ARG 3")
                // this form of adding a dynamic layer passes arguments from the calling component
            ]);
            this.modes.push(layerName)
        }

    }


}


export default (options = {}) =>
    new ControlLayers("Control Layers", {
        active: true,
        ...options,
        sources: [],
        modes: [],
        layers:[],
        infoBoxes:{
            Overview: {
                title: "",
                comp: ({layer}) =>{
                    return(
                        <div>
                            <MainControls layer={layer}/>
                        </div>
                    )
                },
                show: true
            }
        }

    })

const mapStateToProps = (state, { id }) => ({

});
const mapDispatchToProps = {};
