import React from "react"
import store from "store"
import { falcorGraph, falcorChunkerNice } from "store/falcorGraph"
import get from "lodash.get"
import MainControls from 'pages/auth/ScenarioMap2/controls/mainControls.js'
import MapLayer from "components/AvlMap/MapLayer.js"
import {ScenarioLayer, ScenarioOptions} from "./scenarioLayer.js"
import {ZoneLayer,ZoneOptions} from "./zoneLayer";
import {ProjectLayer,ProjectOptions} from "./projectLayer";
import {AddNewZoneLayer,AddNewZoneOptions} from "./addNewZoneLayer";
import {LandUseLayer,LandUseOptions} from "./landUseLayer";
import {CommentMapLayer,CommentMapOptions} from "./commentMapLayer";
import { getColorRange } from "constants/color-ranges";

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

/*const DynamicProjectLayerFactory = (callingLayer,...args) =>{
    return new ProjectLayer('projects',ProjectOptions())
}*/

const DynamicAddNewZoneLayerFactory =(callingLayer,...args) =>{
    return new AddNewZoneLayer('addNewZone',AddNewZoneOptions())
}

const DynamicLandUseLayerFactory = (callingLayer,...args) =>{
    return new LandUseLayer('landUse',LandUseOptions())
}

const DynamicCommentMapLayerFactory = (callingLayer,...args) =>{
    return new CommentMapLayer('commentMap',CommentMapOptions())
}

export class ControlLayers extends MapLayer {
    onAdd(map) {
        super.onAdd(map);
        if (store.getState().user.activeGeoid) {

            let activeGeoid = store.getState().user.activeGeoid;
            return falcorGraph.get(['geo', activeGeoid, 'boundingBox'])
                .then(response => {
                    let initalBbox = response.json.geo[activeGeoid]['boundingBox'].slice(4, -1).split(",");
                    let bbox = initalBbox ? [initalBbox[0].split(" "), initalBbox[1].split(" ")] : null;
                    this.boundingBox = bbox
                    map.resize();
                    map.fitBounds(bbox);
                })
        }

    }

    visibilityToggleModeOn(source, layerName) {
        //console.log('in visibility toggle mode on',source,layerName)
        if(layerName.includes('_27') || layerName.includes('_26')){
            if (this.map.getSource('andes_riverine')) {
                this.map.removeLayer('andes_riverine_layer');
                this.map.removeSource('andes_riverine')
            }
            this.map.addSource("andes_riverine", {
                'type': "vector",
                'url': source
            })
            this.map.addLayer({
                'id': 'andes_riverine_layer',
                'source': 'andes_riverine',
                'source-layer': layerName,
                'type': 'fill',
                'minzoom': 8,
                'paint': {
                    'fill-color': ["interpolate",
                        ["linear"],
                        ["get", "depth_m"],
                        0,
                        "hsl(211, 0%, 100%)",
                        5,
                        "hsl(211, 75%, 53%)",
                        10,
                        "hsl(211, 83%, 39%)",
                        20,
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
                    'fill-opacity':0.3
                },

            })
            this.map.moveLayer('buildings-layer','andes_riverine_layer')
        }else{
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
                        ],
                        'fill-opacity':0.3
                    },

                })
                this.map.moveLayer('buildings-layer','riverine_layer')
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
                        'fill-color': "hsl(211, 83%, 31%)",
                        'fill-opacity':0.3
                    },

                })
                this.map.moveLayer('buildings-layer','dfirm_layer')

            }
        }

    }


    visibilityToggleModeOff(source,layerName){
        //console.log('in visibility toggle mode off',source,layerName)
        if(layerName.includes('_27') || layerName.includes('_26')){
            if(source && (layerName.includes("_26") || layerName.includes("_27"))){
                if(this.map.getSource('andes_riverine')) {
                    this.map.removeLayer('andes_riverine_layer');
                    this.map.removeSource('andes_riverine')
                }
            }
        }else{
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
                    DynamicLandUseLayerFactory
                ]).then(ll => {
                    this.landUseLayer = ll
                    this.doAction([
                        "addDynamicLayer",
                        DynamicCommentMapLayerFactory
                    ]).then(cml =>{
                        this.commentMapLayer = cml
                    })
                })
            })
        })
    }

    mainLayerToggleVisibilityOn(layerName){
        //console.log('on',layerName)
        if(layerName.includes('scenario')){
            this.scenarioLayer.toggleVisibilityOn()
        }
        if(layerName.includes('zone')){
            this.zoneLayer.toggleVisibilityOn()
        }
        if(layerName.includes('landUse')){
            this.landUseLayer.toggleVisibilityOn()
        }
        if(layerName.includes("commentMap")){
            this.commentMapLayer.toggleVisibilityOn()
        }

    }

    mainLayerToggleVisibilityOff(layerName){
        //console.log('off',layerName)
        if(layerName.includes('scenario')){
            this.scenarioLayer.toggleVisibilityOff()
        }
        if(layerName.includes('zone')){
            this.zoneLayer.toggleVisibilityOff()
        }
        if(layerName.includes('landUse')){
            this.landUseLayer.toggleVisibilityOff()
        }
        if(layerName.includes("commentMap")){
            if(this.commentMapLayer){
                this.commentMapLayer.toggleVisibilityOff()
            }
        }
    }



    addNewZoneOnClick(e){
        document.getElementById("new_zone_button").disabled = true
        this.doAction([
            "addDynamicLayer",
            DynamicAddNewZoneLayerFactory
        ])
            .then(nzl =>{
                this.addNewZoneLayer = nzl
            })

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
        },
        boundingBox : []

    })


