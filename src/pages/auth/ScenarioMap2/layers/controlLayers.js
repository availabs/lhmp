import React from "react"
import store from "store"
import {falcorGraph} from "store/falcorGraph"
import get from "lodash.get"
import MainControls from 'pages/auth/ScenarioMap2/controls/mainControls.js'
import MapLayer from "components/AvlMap/MapLayer.js"
import {ScenarioLayer, ScenarioOptions} from "./scenarioLayer.js"
import {ZoneLayer, ZoneOptions} from "./zoneLayer";
import {AddNewZoneLayer, AddNewZoneOptions} from "./addNewZoneLayer";
import {LandUseLayer, LandUseOptions} from "./landUseLayer";
import {CommentMapLayer, CommentMapOptions} from "./commentMapLayer";
import {CulvertsLayer, CulvertsOptions} from "./culvertsLayer";
import {JurisdictionLayer, JurisdictionOptions} from "./jurisdictionLayer";
import {HazardEventsLayer, HazardEventsOptions} from "./hazardEventsLayer";
import {CriticalInfrastructureLayer, CriticalInfrastructureOptions} from "./criticalInfrastructureLayer";
import {EvacuationRoutesLayer, EvacuationRoutesOptions} from "./evacuationLayer";
import {VulnerableDemographicsLayer, VulnerableDemographicsOptions} from "./vulnerableDemographicsLayer";
import {NfipLayer, NfipOptions} from "./nfipLayer";
import {StateAssetsLayer, StateAssetsOptions} from "./stateAssetsLayer";
import {ActionsLayer, ActionsOptions} from "./ActionsLayer"
import {getColorRange} from "constants/color-ranges";

var _ = require('lodash')
const LEGEND_COLOR_RANGE = getColorRange(7, "YlGn");

const IDENTITY = i => i;
const COLORS = getColorRange(12, "Set3");

let UNIQUE = 0;
const getUniqueId = () => `unique-id-${++UNIQUE}`
let culvertsLayer, landUseLayer, commentMapLayer, evacuationRoutesLayer, vulnerableDemographicsLayer, hazardEventsLayer,
    criticalInfrastructureLayer, nfipLayer, stateAssetsLayer, actionsLayer = {}
const DynamicScenarioLayerFactory = (callingLayer, ...args) => {
    return new ScenarioLayer('scenario', ScenarioOptions())

};
const DynamicZoneLayerFactory = (callingLayer, ...args) => {
    return new ZoneLayer('zone', ZoneOptions())
};

const DynamicAddNewZoneLayerFactory = (callingLayer, ...args) => {
    return new AddNewZoneLayer('addNewZone', AddNewZoneOptions())
}

const DynamicLandUseLayerFactory = (callingLayer, ...args) => {
    return new LandUseLayer('landUse', LandUseOptions())
}

const DynamicCommentMapLayerFactory = (callingLayer, ...args) => {
    return new CommentMapLayer('commentMap', CommentMapOptions())
}

const DynamicCulvertsLayerFactory = (callingLayer, ...args) => {
    return new CulvertsLayer('culverts', CulvertsOptions())
};

const DynamicJurisdictionLayerFactory = (callingLayer, ...args) => {
    return new JurisdictionLayer('jurisdiction', JurisdictionOptions())
};

const DynamicEvacuationRoutesLayerFactory = (callingLayer, ...args) => {
    return new EvacuationRoutesLayer('evacuationRoutes', EvacuationRoutesOptions({viewOnly: false}))
};

const DynamicVulnerableDemographicsLayerFactory = (callingLayer, ...args) => {
    return new VulnerableDemographicsLayer('vulnerableDemographics', VulnerableDemographicsOptions())
}

const DynamicHazardEventsLayerFactory = (callingLayer, ...args) => {
    return new HazardEventsLayer('hazardEvents', HazardEventsOptions())
}

const DynamicCriticalInfrastructureLayerFactory = (callingLayer, ...args) => {
    return new CriticalInfrastructureLayer('criticalInfrastructure', CriticalInfrastructureOptions())
}

const DynamicNfipLayerFactory = (callingLayer, ...args) => {
    return new NfipLayer('nfip', NfipOptions())
}

const DynamicStateAssetsLayerFactory = (callingLayer, ...args) => {
    return new StateAssetsLayer('stateAssets', StateAssetsOptions())
}

const DynamicActionsLayerFactory = (callingLayer, ...args) => {
    return new ActionsLayer('actions', ActionsOptions())
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
                    if (this.landUseLayer && this.commentMapLayer && this.culvertsLayer && this.evacuationRoutesLayer && this.vulnerableDemographicsLayer && this.hazardEventsLayer && this.criticalInfrastructureLayer
                    && this.nfipLayer && this.stateAssetsLayer && this.actionsLayer) {
                        this.landUseLayer.toggleVisibilityOff()
                        this.commentMapLayer.toggleVisibilityOff()
                        this.culvertsLayer.toggleVisibilityOff()
                        this.evacuationRoutesLayer.toggleVisibilityOff()
                        this.vulnerableDemographicsLayer.toggleVisibilityOff()
                        this.hazardEventsLayer.toggleVisibilityOff()
                        this.criticalInfrastructureLayer.toggleVisibilityOff()
                        this.nfipLayer.toggleVisibilityOff()
                        this.stateAssetsLayer.toggleVisibilityOff()
                        this.actionsLayer.toggleVisibilityOff()
                    }
                })
        }

    }

    visibilityToggleModeOn(source, layerName) {
        //console.log('in visibility toggle mode on',source,layerName)
        let activePlan = store.getState().user.activePlan;
        let opacity = 0.3
        // if(activePlan === '10' || activePlan === '56'){
        //     opacity = 0.3
        // }else{
        //     opacity = 0.3
        // }
        if (layerName.includes('_27') || layerName.includes('_26')) {
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
                    'fill-opacity': 0.3
                },

            })
            this.map.moveLayer('buildings-layer', 'andes_riverine_layer')
        } else {
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
                        'fill-opacity': opacity
                    },

                })
               this.map.moveLayer('buildings-layer', 'riverine_layer')
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
                        'fill-opacity': 0.3
                    },

                })
                this.map.moveLayer('buildings-layer', 'dfirm_layer')

            }
        }

    }


    visibilityToggleModeOff(source, layerName) {
        layerName = layerName ? layerName : []
        //console.log('in visibility toggle mode off',source,layerName)
        if (layerName.includes('_27') || layerName.includes('_26')) {
            if (source && (layerName.includes("_26") || layerName.includes("_27"))) {
                if (this.map.getSource('andes_riverine')) {
                    this.map.removeLayer('andes_riverine_layer');
                    this.map.removeSource('andes_riverine')
                }
            }
        } else {
            if (source && layerName.includes("riverine")) {
                if (this.map.getSource('riverine')) {
                    this.map.removeLayer('riverine_layer');
                    this.map.removeSource('riverine')
                }
            }
            if (source && layerName.includes("dfirm")) {
                if (this.map.getSource('dfirm')) {
                    this.map.removeLayer('dfirm_layer');
                    this.map.removeSource('dfirm')
                }
            }
        }


    }


    loadLayers() {
        if(store.getState().user.activeGeoid.length === 2){
            this.doAction([
                "addDynamicLayer",
                DynamicJurisdictionLayerFactory
            ]).then(jl => {
                this.jurisdictonLayer = jl
                this.doAction([
                    "addDynamicLayer",
                    DynamicStateAssetsLayerFactory
                ]).then(hel => {
                    stateAssetsLayer = hel
                    this.stateAssetsLayer = hel

                })
            })
        }else{
            this.doAction([
                "addDynamicLayer",
                DynamicScenarioLayerFactory
            ]).then(sl => {
                this.scenarioLayer = sl
                this.doAction([
                    "addDynamicLayer",
                    DynamicJurisdictionLayerFactory
                ]).then(jl => {
                    this.jurisdictonLayer = jl
                        this.doAction([
                            "addDynamicLayer",
                            DynamicZoneLayerFactory
                        ]).then(zl => {
                            this.zoneLayer = zl
                            this.doAction([
                                "addDynamicLayer",
                                DynamicCulvertsLayerFactory
                            ]).then(cl => {
                                culvertsLayer = cl
                                this.culvertsLayer = cl
                                this.doAction([
                                    "addDynamicLayer",
                                    DynamicLandUseLayerFactory
                                ]).then(ll => {
                                    landUseLayer = ll
                                    this.landUseLayer = ll
                                    this.doAction([
                                        "addDynamicLayer",
                                        DynamicCommentMapLayerFactory
                                    ]).then(cml => {
                                        commentMapLayer = cml
                                        this.commentMapLayer = cml
                                        this.doAction([
                                            "addDynamicLayer",
                                            DynamicEvacuationRoutesLayerFactory
                                        ]).then(erl => {
                                            evacuationRoutesLayer = erl
                                            this.evacuationRoutesLayer = erl
                                            this.doAction([
                                                "addDynamicLayer",
                                                DynamicVulnerableDemographicsLayerFactory
                                            ]).then(vdl => {
                                                vulnerableDemographicsLayer = vdl
                                                this.vulnerableDemographicsLayer = vdl
                                                this.doAction([
                                                    "addDynamicLayer",
                                                    DynamicHazardEventsLayerFactory
                                                ]).then(hel => {
                                                    hazardEventsLayer = hel
                                                    this.hazardEventsLayer = hel
                                                    this.doAction([
                                                        "addDynamicLayer",
                                                        DynamicCriticalInfrastructureLayerFactory
                                                    ]).then(hel => {
                                                        criticalInfrastructureLayer = hel
                                                        this.criticalInfrastructureLayer = hel
                                                        this.doAction([
                                                            "addDynamicLayer",
                                                            DynamicNfipLayerFactory
                                                        ]).then(hel => {
                                                            nfipLayer = hel
                                                            this.nfipLayer = hel
                                                        })
                                                        this.doAction([
                                                            "addDynamicLayer",
                                                            DynamicStateAssetsLayerFactory
                                                        ]).then(hel => {
                                                            stateAssetsLayer = hel
                                                            this.stateAssetsLayer = hel
                                                            this.doAction([
                                                                "addDynamicLayer",
                                                                DynamicActionsLayerFactory
                                                            ]).then(hel => {
                                                                actionsLayer = hel
                                                                this.actionsLayer = hel
                                                            })
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                })
            })
        }
    }

    mainLayerToggleVisibilityOn(layerName, selected) {
        //console.log('in on',layerName)
        if(store.getState().user.activeGeoid.length === 2){
            // if (layerName.includes('scenario')) {
            //     this.scenarioLayer.toggleVisibilityOn()
            // }
            if (layerName.includes("stateAssets")) {
                if (Object.keys(stateAssetsLayer).length > 0) {
                    stateAssetsLayer.toggleVisibilityOn()
                }
            }
            if (layerName.includes("jurisdiction")) {
                this.jurisdictonLayer.toggleVisibilityOn()
            }
        }else{
            if (layerName.includes('scenario')) {
                this.scenarioLayer.toggleVisibilityOn()
            }
            if (layerName.includes('zone')) {
                this.zoneLayer.toggleVisibilityOn()
            }
            if (layerName.includes('landUse')) {
                if (Object.keys(landUseLayer).length > 0) {
                    landUseLayer.toggleVisibilityOn()
                }
            }
            if (layerName.includes("commentMap")) {
                if (Object.keys(commentMapLayer).length > 0) {
                    commentMapLayer.toggleVisibilityOn()
                }
            }
            if (layerName.includes("culverts")) {
                if (Object.keys(culvertsLayer).length > 0) {
                    culvertsLayer.toggleVisibilityOn()
                }
            }
            if (layerName.includes("evacuationRoutes")) {
                if (Object.keys(evacuationRoutesLayer).length > 0) {
                    evacuationRoutesLayer.toggleVisibilityOn()
                }
            }
            if (layerName.includes("vulnerableDemographics")) {
                if (Object.keys(vulnerableDemographicsLayer).length > 0) {
                    vulnerableDemographicsLayer.toggleVisibilityOn()
                }
            }
            if (layerName.includes("hazardEvents")) {
                if (Object.keys(hazardEventsLayer).length > 0) {
                    hazardEventsLayer.toggleVisibilityOn()
                    if (this.map.getLayer('events-layer')){
                        this.map.moveLayer('events-layer','buildings-layer')
                    }
                }
            }
            if (layerName.includes("criticalInfrastructure")) {
                if (Object.keys(criticalInfrastructureLayer).length > 0) {
                    criticalInfrastructureLayer.toggleVisibilityOn()
                }
            }
            if (layerName.includes("nfip")) {
                if (Object.keys(nfipLayer).length > 0) {
                    nfipLayer.toggleVisibilityOn()
                }
            }
            if (layerName.includes("stateAssets")) {
                if (Object.keys(stateAssetsLayer).length > 0) {
                    stateAssetsLayer.toggleVisibilityOn()
                }
            }
            if (layerName.includes("actions")) {
                if (Object.keys(actionsLayer).length > 0) {
                    actionsLayer.toggleVisibilityOn()
                }
            }
            if (layerName.includes("jurisdiction")) {
                this.jurisdictonLayer.toggleVisibilityOn()
            }
        }
    }

    mainLayerToggleVisibilityOff(layerName) {
        //console.log('in off',layerName)
        if(store.getState().user.activeGeoid.length === 2){
            // if (layerName.includes('scenario')) {
            //     this.scenarioLayer.toggleVisibilityOff()
            // }
            if (layerName.includes("stateAssets")) {
                if (Object.keys(stateAssetsLayer).length > 0) {
                    stateAssetsLayer.toggleVisibilityOff()
                }
            }
            if (layerName.includes('jurisdiction')) {
                this.jurisdictonLayer.toggleVisibilityOff()

            }
        }else{
            if (layerName.includes('scenario')) {
                this.scenarioLayer.toggleVisibilityOff()
            }
            if (layerName.includes('zone')) {
                this.zoneLayer.toggleVisibilityOff()
            }
            if (layerName.includes("commentMap")) {
                if (Object.keys(commentMapLayer).length > 0) {
                    commentMapLayer.toggleVisibilityOff()
                }
            }
            if (layerName.includes("culverts")) {
                if (Object.keys(culvertsLayer).length > 0) {
                    culvertsLayer.toggleVisibilityOff()
                }
            }
            if (layerName.includes('landUse')) {
                if (Object.keys(landUseLayer).length > 0) {
                    landUseLayer.toggleVisibilityOff()
                }
            }
            if (layerName.includes("evacuationRoutes")) {
                if (Object.keys(evacuationRoutesLayer).length > 0) {
                    evacuationRoutesLayer.toggleVisibilityOff()
                }
            }
            if (layerName.includes("vulnerableDemographics")) {
                if (Object.keys(vulnerableDemographicsLayer).length > 0) {
                    vulnerableDemographicsLayer.toggleVisibilityOff()
                }
            }
            if (layerName.includes("hazardEvents")) {
                if (Object.keys(hazardEventsLayer).length > 0) {
                    hazardEventsLayer.toggleVisibilityOff()
                }
            }
            if (layerName.includes("criticalInfrastructure")) {
                if (Object.keys(criticalInfrastructureLayer).length > 0) {
                    criticalInfrastructureLayer.toggleVisibilityOff()
                }
            }
            if (layerName.includes("nfip")) {
                if (Object.keys(nfipLayer).length > 0) {
                    nfipLayer.toggleVisibilityOff()
                }
            }
            if (layerName.includes("stateAssets")) {
                if (Object.keys(stateAssetsLayer).length > 0) {
                    stateAssetsLayer.toggleVisibilityOff()
                }
            }
            if (layerName.includes("actions")) {
                if (Object.keys(actionsLayer).length > 0) {
                    actionsLayer.toggleVisibilityOff()
                }
            }
            if (layerName.includes('jurisdiction')) {
                this.jurisdictonLayer.toggleVisibilityOff()

            }
        }
    }


    addNewZoneOnClick(e) {
        document.getElementById("new_zone_button").disabled = true
        this.doAction([
            "addDynamicLayer",
            DynamicAddNewZoneLayerFactory
        ])
            .then(nzl => {
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
        layers: [],
        infoBoxes: {
            Overview: {
                title: "",
                comp: ({layer}) => {

                    return (
                        <div>
                            <MainControls layer={layer}/>
                        </div>
                    )
                },
                show: true
            }
        },
        boundingBox: []

    })
