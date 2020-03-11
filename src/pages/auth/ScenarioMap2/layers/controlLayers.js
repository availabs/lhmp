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
import activeLayerConfig from 'pages/auth/ScenarioMap2/layers/activeLayerConfig.js'
var _ = require('lodash')
const LEGEND_COLOR_RANGE = getColorRange(7, "YlGn");

const IDENTITY = i => i;
const COLORS = getColorRange(12, "Set3");

let UNIQUE = 0;
const getUniqueId = () => `unique-id-${ ++UNIQUE }`
let layerToShow = ''
let activeLayers = []
const DynamicScenarioLayerFactory = (callingLayer, ...args) => {
    return new ScenarioLayer('scenario', ScenarioOptions())

};
const DynamicZoneLayerFactory =(callingLayer,...args) =>{
    return new ZoneLayer('zone',ZoneOptions())
};

const DynamicProjectLayerFactory = (callingLayer,...args) =>{
    return new ProjectLayer('projects',ProjectOptions())
}


class ControlLayers extends MapLayer {
    onAdd(map) {
        super.onAdd(map);
        if (store.getState().user.activeGeoid) {

            let activeGeoid = store.getState().user.activeGeoid;
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
                'type': 'line',
                'minzoom': 8,
                'paint': {
                    'line-color': ["interpolate",
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
                    ],
                    'line-opacity':0.6
                },

            })
            this.map.moveLayer('riverine_layer','parcels')
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
                'type': 'line',
                'minzoom': 8,
                'paint': {
                    'line-color': "hsl(211, 83%, 31%)",
                    'line-opacity':0.6
                },

            })
            this.map.moveLayer('parcels','dfirm_layer')

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


    loadLayers(){
        this.doAction([
            "addDynamicLayer",
            DynamicScenarioLayerFactory
        ]).then(sl => {
            this.scenarioLayer = sl
            this.doAction([
                 "addDynamicLayer",
                 DynamicZoneLayerFactory
             ]).then(zl => {
                this.zoneLayer = zl
                this.doAction([
                    "addDynamicLayer",
                    DynamicProjectLayerFactory
                ]).then(pl =>{
                    this.projectLayer = pl
                })
            })
        })
    }

    mainLayerToggleVisibilityOn(layerName){
        if(layerName === 'scenario'){
            this.scenarioLayer.toggleVisibilityOn()
        }
        if(layerName === 'zone'){
            this.zoneLayer.toggleVisibilityOn()
        }

    }

    mainLayerToggleVisibilityOff(layerName){
        if(layerName === 'scenario'){
            this.scenarioLayer.toggleVisibilityOff()
        }
        if(layerName === 'zone'){
            this.zoneLayer.toggleVisibilityOff()
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


