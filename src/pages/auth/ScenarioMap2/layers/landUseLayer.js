import React from "react"

import store from "store"
import { update } from "utils/redux-falcor/components/duck"
import { falcorGraph, falcorChunkerNice } from "store/falcorGraph"
import { connect } from 'react-redux';
import { reduxFalcor, UPDATE as REDUX_UPDATE } from 'utils/redux-falcor'
import get from "lodash.get"
import styled from "styled-components"
import {
    scaleLinear,
    scaleQuantile,
    scaleQuantize,
    scaleThreshold,
    scaleOrdinal
} from "d3-scale"
import { extent } from "d3-array"
import { format as d3format } from "d3-format"
import { fnum } from "utils/sheldusUtils"
import MapLayer from "components/AvlMap/MapLayer.js"
import { getColorRange } from "constants/color-ranges";
import {register, unregister} from "../../../../components/AvlMap/ReduxMiddleware";
import {filter} from "fuzzy";
var _ = require('lodash')



const IDENTITY = i => i;

export class LandUseLayer extends MapLayer{
    onAdd(map) {
        register(this, 'USER::SET_LAND_USE_TYPE', ["landUse"]);
        register(this,'USER:SET_LAND_USE_PROP_TYPE',['landUse']);
        register(this, 'USER::SET_LAND_USE_SUB_PROP_TYPE',['landUse'])
        register(this,'USER::SET_OWNER_TYPE',['landUse'])
        super.onAdd(map);
        if(store.getState().user.activeGeoid){
            let activeGeoid = store.getState().user.activeGeoid
            this.map.on('data',()=>{
                const features =  map.querySourceFeatures('nys_1811_parcels', {
                    sourceLayer: 'nys_1811_parcels',
                });
                //check for the legend
                this.selection = features.map(d => d.properties.OBJECTID);
                if(this.selection.length > 0){
                    this.fetchData().then(data => this.receiveData(map, data))
                }
            })

            return falcorGraph.get(['geo',activeGeoid,'boundingBox'])
                .then(response =>{
                    let initalBbox = response.json.geo[activeGeoid]['boundingBox'].slice(4, -1).split(",");
                    let bbox = initalBbox ? [initalBbox[0].split(" "), initalBbox[1].split(" ")] : null;
                    map.resize();
                    map.fitBounds(bbox);
                    this.layers.forEach(layer => {
                        map.setLayoutProperty(layer.id, 'visibility',"none");
                    })
                    return this.fetchData()
                })
        }
    }
    onRemove(map) {
        unregister(this);
    }

    receiveMessage(action, data) {
        this.landUseType = data.landUseType
        this.landUsePropType = data.landUsePropType || []
        this.landUseSubPropType = data.landUseSubPropType || []
        this.ownerType = data.ownerType || []
        return this.fetchData().then(data => this.receiveData(data,this.map))

    }

    getColorScale(data) {
        const { type, range, domain } = this.legend;
        switch (type) {
            case "quantile": {
                const domain = data.map(d => d.value).filter(d => d).sort();
                this.legend.domain = domain;
                return scaleQuantile()
                    .domain(domain)
                    .range(range);
            }
            case "quantize": {
                const domain = extent(data, d => d.value);
                this.legend.domain = domain;
                return scaleQuantize()
                    .domain(domain)
                    .range(range);
            }
            case "threshold": {
                return scaleThreshold()
                    .domain(domain)
                    .range(range)
            }
            case "linear":{
                return scaleLinear()
                    .domain(domain)
                    .range(range)
            }
            case "ordinal":{
                return scaleOrdinal()
                    .domain(domain)
                    .range(range)

            }
        }
    }

    fetchData(){
        if(this.selection){
            return falcorGraph.get(['parcel','byId',this.selection,['owner_type','prop_class','total_av']],
                ['parcel','meta',['prop_class']])
                    .then(response =>{
                        return response
                    })
        }
    }

    receiveData(map,data){
        let parcelData = get(falcorGraph.getCache(),['parcel','byId'],{})
        let filteredParcelData = {}
        let prop_class_filters = []
        let final_filters = []
        if(this.landUsePropType || this.landUseSubPropType || this.ownerType){
            if(!prop_class_filters.includes(this.landUsePropType.every(d => d)) || !prop_class_filters.includes(this.landUseSubPropType.every(d => d))){
                prop_class_filters.push(...this.landUsePropType,...this.landUseSubPropType)
            }
            prop_class_filters.forEach(filter =>{
                if(!final_filters.includes(filter % 100 === 0) && !final_filters.includes(filter.slice(0,1)+'00')){
                    final_filters.push(filter)
                }else{
                    _.pull(final_filters,filter.slice(0,1)+'00')
                    final_filters.push(filter)

                }
            })

        }
        if(final_filters.length > 0){
            filteredParcelData = Object.keys(parcelData).reduce((a, c) => {
                final_filters.forEach(prop=>{
                    if(parseInt(prop) % 100 === 0){
                        if(get(parcelData[c],['prop_class'],'') && get(parcelData[c],['prop_class'],'').slice(0,1) === prop.slice(0,1)){
                            a[c] = parcelData[c];
                        }
                    }else{
                        if(get(parcelData[c],['prop_class'],'') && get(parcelData[c],['prop_class'],'') === prop){
                            a[c] = parcelData[c];
                        }
                    }

                })
                return a;
            }, {})
        }else if(this.ownerType && this.ownerType.length > 0){
            this.ownerType.forEach(owner =>{
                if(Object.keys(filteredParcelData).length > 0){
                    filteredParcelData = Object.keys(filteredParcelData).reduce((a, c) => {
                        if(get(filteredParcelData[c],['owner_type'],'') && get(filteredParcelData[c],['owner_type'],'') === owner){
                            a[c] = parcelData[c];
                        }
                        return a;
                    }, {})
                }else{
                    filteredParcelData = Object.keys(parcelData).reduce((a, c) => {
                        if(get(parcelData[c],['owner_type'],'') && get(parcelData[c],['owner_type'],'') === owner){
                            a[c] = parcelData[c];
                        }
                        return a;
                    }, {})

                }
            })
        }
        else{
            filteredParcelData = parcelData
        }
        this.map.setFilter(
            'parcels', ["in", "OBJECTID", ...Object.keys(filteredParcelData).map(d => +d)]
        )

        if(this.landUseType){
            let resultedLandUseData = []
            let coloredBuildings = {}
            let coloredBuildingIds = []
            let land_use_type_name = this.landUseType.map(d => d.name)
            let land_use_type_value = this.landUseType.map(d => d.value)
            if(land_use_type_name.includes('Owner Type')){
                if(Object.keys(filteredParcelData).length > 0){
                    Object.keys(filteredParcelData).forEach(item =>{
                        resultedLandUseData.push({
                            id : item,
                            value : land_use_type_value[0].reduce((a,c) => c.value === filteredParcelData[item].owner_type.toString() ? c.name : a,null)
                        })
                    })
                }else if(Object.keys(parcelData).length > 0){
                    Object.keys(parcelData).forEach(item =>{
                        resultedLandUseData.push({
                            id : item,
                            value : land_use_type_value[0].reduce((a,c) => c.value === parcelData[item].owner_type.toString() ? c.name : a,null)
                        })
                    })
                }
                this.legend.vertical = true
                this.legend.type = "ordinal"
                this.legend.domain = land_use_type_value[0].map(d => d.name)
                this.legend.range = getColorRange(11, "Set3");
                if(resultedLandUseData.length > 0) {
                    const colorScale = this.getColorScale(resultedLandUseData),
                        colors = resultedLandUseData.reduce((a, c) => {
                            if (c.value !== 0) {
                                a[c.id] = colorScale(c.value);
                                coloredBuildingIds.push(c.id.toString());
                            }
                            return a;
                        }, {});
                    coloredBuildings = colors
                }
                if(Object.keys(coloredBuildings).length > 0){
                    this.map.setPaintProperty(
                        'parcels',
                        'fill-color',
                        ["get",
                            ["to-string", ["get", "OBJECTID"]],
                            ["literal",coloredBuildings]
                        ],
                    )
                }
                this.forceUpdate()
            }
            if(land_use_type_name.includes('Land Use Type')){
                if(Object.keys(filteredParcelData).length > 0){
                    Object.keys(filteredParcelData).forEach(item =>{
                        if(filteredParcelData[item].prop_class){
                            resultedLandUseData.push({
                                id : item,
                                value : land_use_type_value[0].reduce((a,c) => c.value.slice(0,1) === filteredParcelData[item].prop_class.slice(0,1) ? c.name : a,null)
                            })
                        }else{
                            resultedLandUseData.push({
                                id : item,
                                value : 'None'
                            })
                        }

                    })
                }else if(Object.keys(parcelData).length > 0){
                    Object.keys(parcelData).forEach(item =>{
                        if(parcelData[item].prop_class){
                            resultedLandUseData.push({
                                id : item,
                                value : land_use_type_value[0].reduce((a,c) => c.value.slice(0,1) === parcelData[item].prop_class.slice(0,1) ? c.name : a,null)
                            })
                        }else{
                            resultedLandUseData.push({
                                id : item,
                                value : 'None'
                            })
                        }

                    })
                }
                this.legend.vertical = true
                this.legend.type = "ordinal"
                this.legend.domain = land_use_type_value[0].map(d => d.name)
                this.legend.domain.push('None')
                this.legend.range = getColorRange("10","Set3")
                if(resultedLandUseData.length > 0) {
                    const colorScale = this.getColorScale(resultedLandUseData),
                        colors = resultedLandUseData.reduce((a, c) => {
                            if (c.value !== 0) {
                                a[c.id] = colorScale(c.value);
                                coloredBuildingIds.push(c.id.toString());
                            }
                            return a;
                        }, {});
                    coloredBuildings = colors
                }
                if(Object.keys(coloredBuildings).length > 0){
                    this.map.setPaintProperty(
                        'parcels',
                        'fill-color',
                        ["get",
                            ["to-string", ["get", "OBJECTID"]],
                            ["literal",coloredBuildings]
                        ],
                    )
                }
                this.forceUpdate()
            }
            if(land_use_type_name.includes('Property Value')){
                if(Object.keys(filteredParcelData).length > 0){
                    Object.keys(filteredParcelData).forEach(item =>{
                        resultedLandUseData.push({
                            id : item,
                            value :  filteredParcelData[item] && filteredParcelData[item].total_av || 0
                        })
                    })
                }else if(Object.keys(parcelData).length > 0){
                    Object.keys(parcelData).forEach(item =>{
                        resultedLandUseData.push({
                            id : item,
                            value :  parcelData[item] && parcelData[item].total_av || 0
                        })
                    })
                }
                this.legend.vertical = false;
                this.legend.type = "linear"
                this.legend.range = getColorRange(8, "YlGn");
                this.legend.domain =[0,50000,100000,200000,500000,1000000,5000000]
                if(resultedLandUseData.length > 0) {
                    const colorScale = this.getColorScale(resultedLandUseData),
                        colors = resultedLandUseData.reduce((a, c) => {
                            if (c.value !== 0) {
                                a[c.id] = colorScale(c.value);
                                coloredBuildingIds.push(c.id.toString());
                            }
                            return a;
                        }, {});
                    coloredBuildings = colors
                }
                if(Object.keys(coloredBuildings).length > 0){
                    this.map.setPaintProperty(
                        'parcels',
                        'fill-color',
                        ["get",
                            ["to-string", ["get", "OBJECTID"]],
                            ["literal",coloredBuildings]
                        ],
                    )
                }
                this.forceUpdate()
            }
        }
    }

    toggleVisibilityOn() {
        this._isVisible = !this._isVisible;
        this.layers.forEach(layer => {
            this.map.setLayoutProperty(layer.id, 'visibility', "visible");
        })
    }

    toggleVisibilityOff(){
        this._isVisible = !this._isVisible;
        this.layers.forEach(layer => {
            this.map.setLayoutProperty(layer.id, 'visibility',"none");
        })
    }



}


export const LandUseOptions =  (options = {}) => {
    return {
        active: true,
        ...options,
        sources: [
            {
                id: "counties",
                source: {
                    'type': "vector",
                    'url': 'mapbox://am3081.1ggw4eku'
                }
            },
            {
                id:"nys_1811_parcels",
                source: {
                    'type': "vector",
                    'url': "mapbox://am3081.6o6ny609"
                }
            }
        ],
        layers: [
            {
                'id': 'project',
                'source': 'counties',
                'source-layer': 'counties',
                'type': 'line',
                'paint': {
                    'line-color': '#000000',
                    'line-opacity': 0.5
                },
                filter: ['all', ['in', 'geoid', store.getState().user.activeGeoid]]

            },
            {
                'id': 'parcels',
                'source': 'nys_1811_parcels',
                'source-layer': 'nys_1811_parcels',
                'type': 'fill',
                //'minzoom': 13,
                'paint': {
                    'fill-opacity':0.3,
                    'fill-outline-color': '#000000'
                }

            }

        ],
        legend: {
            title: 'Land Use',
            type: "linear",
            types: ["threshold", "quantile", "quantize","linear","ordinal"],
            vertical: true,
            range: [],
            active: false,
            domain: [0,50000,100000,200000,500000,1000000,5000000],
            format: fnum
        },
        onClick:{
            layers: ["parcels"],
            dataFunc: function(features) {
                if (!features.length) return;
                let parcelData = get(falcorGraph.getCache(),['parcel','byId'],{})
                const props = { ...features[0].properties };
                console.log('props',props.OBJECTID,parcelData[props.OBJECTID])
            }

        }
    }


}

const mapStateToProps = (state, { id }) => ({

});
const mapDispatchToProps = {};