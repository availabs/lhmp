import React from "react"
import store from "store"
import { falcorGraph, falcorChunkerNice } from "store/falcorGraph"
import get from "lodash.get"
import MainControls from 'pages/auth/ScenarioMap2/controls/mainControls.js'
import MapLayer from "components/AvlMap/MapLayer.js"
import {ScenarioLayer, ScenarioOptions} from "./scenarioLayer.js"
import {ZoneLayer,ZoneOptions} from "./zoneLayer";
import {ProjectLayer,ProjectOptions} from "./projectLayer";
import { getColorRange } from "constants/color-ranges";
import GetRiskZoneID from 'pages/auth/ScenarioMap2/layers/scenarioLayer.js'
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


class ControlLayers extends MapLayer {
    onAdd(map) {
        super.onAdd(map);
        if (store.getState().user.activeGeoid) {
            let activeGeoid = store.getState().user.activeGeoid
            return falcorGraph.get(['geo', activeGeoid, 'boundingBox'])
                .then(response => {
                    let initalBbox = response.json.geo[activeGeoid]['boundingBox'].slice(4, -1).split(",");
                    let bbox = initalBbox ? [initalBbox[0].split(" "), initalBbox[1].split(" ")] : null;
                    map.resize();
                    map.fitBounds(bbox);
                })
        }

    }

    visibilityToggleModeOn(source, layerName) {
        if (source && layerName.includes("riverine")) {
            if (this.map.getSource('riverine')) {
                this.map.removeLayer('riverine_layer');
                this.map.removeSource('riverine')
            }
            this.map.addSource("riverine", {
                'type': "vector",
                'url': source
            })
            this.map.addLayer({
                'id': 'riverine_layer',
                'source': 'riverine',
                'source-layer': layerName,
                'type': 'fill',
                'minzoom': 8,
                'paint': {
                    'fill-color': ["interpolate",
                        ["linear"],
                        ["get", "depth_m"],
                        0,
                        "hsl(211, 0%, 100%)",
                        10,
                        "hsl(211, 75%, 53%)",
                        20,
                        "hsl(211, 83%, 39%)",
                        30,
                        "hsl(211, 64%, 44%)",
                        40,
                        "hsl(211, 91%, 33%)",
                        50,
                        "hsl(211, 83%, 31%)",
                        60,
                        "hsl(211, 35%, 33%)",
                        70,
                        "hsl(211, 89%, 38%)",
                        80,
                        "hsl(211, 83%, 31%)",
                        83,
                        "hsl(211, 83%, 31%)"
                    ]
                },

            })
        }
        if (source && layerName.includes("dfirm")) {
            if (this.map.getSource('dfirm')) {
                this.map.removeLayer('dfirm_layer');
                this.map.removeSource('dfirm')
            }
            this.map.addSource("dfirm", {
                'type': "vector",
                'url': source
            })
            this.map.addLayer({
                'id': 'dfirm_layer',
                'source': 'dfirm',
                'source-layer': layerName,
                'type': 'fill',
                'minzoom': 8,
                'paint': {
                    'fill-color': "#DAF7A6"
                },

            })
        }
    }


    visibilityToggleModeOff(source,layerName){
        if(source && layerName.includes("riverine")){
            if(this.map.getSource('riverine')) {
                this.map.removeLayer('riverine_layer');
                this.map.removeSource('riverine')
            }
        }
        if(source && layerName.includes("dfirm")){
            if(this.map.getSource('dfirm')) {
                this.map.removeLayer('dfirm_layer');
                this.map.removeSource('dfirm')
            }
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
                            <GetRiskZoneID/>
                        </div>
                    )
                },
                show: true
            }
        }

    })


