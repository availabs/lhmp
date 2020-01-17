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
var _ = require('lodash')
const LEGEND_COLOR_RANGE = getColorRange(7, "YlGn");

const IDENTITY = i => i;

class CountiesLayer extends MapLayer{
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
                    //map.setZoom(9)

                    return this.fetchData(graph).then(data => this.receiveData(map, data))
                })
        }
    }
    fetchData(graph){
        let owner_types = ['2','3', '4', '5', '6', '7','8'];
        let buildingIds = []
        return falcorGraph.get(
            ['building', 'byGeoid', store.getState().user.activeGeoid, 'flood_zone',
                ['flood_100','flood_500'], 'owner_type',owner_types, 'critical', ['true', 'false']]
        ).then(d => {
            let graph = d.json.building.byGeoid[store.getState().user.activeGeoid].flood_zone;
            let filteredBuildings = [];
            let data = {}
            if(graph){
                Object.keys(graph).filter(d => d !== '$__path').forEach(item =>{
                    data[item] = get(d, `json.building.byGeoid.${store.getState().user.activeGeoid}.flood_zone.${item}.owner_type`, {})
                });
                Object.keys(data).forEach(d =>{
                    owner_types.map(owner =>{
                        filteredBuildings.push(...get(data[d], `${owner}.critical.false`))
                    })
                })
            }
            buildingIds = filteredBuildings.map(f => f.id);
            return buildingIds
        }).then(buildingIds =>{
            if(buildingIds){
                console.log('length',buildingIds.length)
                return falcorGraph.get(
                    ['building', 'geom', 'byBuildingId',buildingIds, 'centroid']
                ).then(d => {
                    return falcorGraph.get(['building','byGeoid',store.getState().user.activeGeoid,
                        ['ownerType'],owner_types,['flood_100','flood_500'],'sum',['count','replacement_value']])
                        .then(response =>{
                            return response
                        })
                })
            }

        })
    }

    receiveData(map,data){
        /*
        owner types :
            2 - state
            3 - county
            4,5,6,7- Municipality
            8 - Private

         */
        let rawGraph = falcorGraph.getCache(),
        graph = get(rawGraph, `building.byGeoid.${store.getState().user.activeGeoid}.flood_zone`, null),
        centroidGraph = get(rawGraph, `building.geom.byBuildingId`, null),
        geojson = {
            "type": "FeatureCollection",
            "features": []
        },
        buildingColors = {};
        Object.keys(graph['flood_100'].owner_type).forEach(owner =>{

            //state owned
            if(owner === '2'){
                graph['flood_100'].owner_type[owner].critical.false.value.forEach(item =>{
                    buildingColors[item.id] = '#0d1acc'
                    geojson.features.push({
                        "type": "Feature",
                        "properties":{id:item.id, color:'#0d1acc'},
                        "geometry": {...get(centroidGraph, `${item.id}.centroid.value`, null)}
                    })
                })
                graph['flood_500'].owner_type[owner].critical.false.value.forEach(item =>{
                    buildingColors[item.id] = '#0d1acc'
                    geojson.features.push({
                        "type": "Feature",
                        "properties":{id:item.id, color:'#0d1acc'},
                        "geometry": {...get(centroidGraph, `${item.id}.centroid.value`, null)}
                    })
                })
            }

            // County Owned
            if (owner === '3') {
                graph['flood_100'].owner_type[owner].critical.false.value.forEach(item =>{
                    buildingColors[item.id] = '#0fcc1b'
                    geojson.features.push({
                        "type": "Feature",
                        "properties":{id:item.id, color:'#0fcc1b'},
                        "geometry": {...get(centroidGraph, `${item.id}.centroid.value`, null)}
                    })
                })
                graph['flood_500'].owner_type[owner].critical.false.value.forEach(item =>{
                    buildingColors[item.id] = '#0fcc1b'
                    geojson.features.push({
                        "type": "Feature",
                        "properties":{id:item.id, color:'#0fcc1b'},
                        "geometry": {...get(centroidGraph, `${item.id}.centroid.value`, null)}
                    })
                })
            }

            // municipality Owned
            if(['4', '5', '6', '7'].includes(owner)){
                graph['flood_100'].owner_type[owner].critical.false.value.forEach(item =>{
                    buildingColors[item.id] = '#cc1e0a'
                    geojson.features.push({
                        "type": "Feature",
                        "properties":{id:item.id, color:'#cc1e0a'},
                        "geometry": {...get(centroidGraph, `${item.id}.centroid.value`, null)}
                    })
                })
                graph['flood_500'].owner_type[owner].critical.false.value.forEach(item =>{
                    buildingColors[item.id] = '#cc1e0a'
                    geojson.features.push({
                        "type": "Feature",
                        "properties":{id:item.id, color:'#cc1e0a'},
                        "geometry": {...get(centroidGraph, `${item.id}.centroid.value`, null)}
                    })
                })
            }

            //Private Owned
            if(owner === '8'){
                graph['flood_100'].owner_type[owner].critical.false.value.forEach(item =>{
                    buildingColors[item.id] = '#F3EC16'
                    geojson.features.push({
                        "type": "Feature",
                        "properties":{id:item.id, color:'#F3EC16'},
                        "geometry": {...get(centroidGraph, `${item.id}.centroid.value`, null)}
                    })
                })
                graph['flood_500'].owner_type[owner].critical.false.value.forEach(item =>{
                    buildingColors[item.id] = '#F3EC16'
                    geojson.features.push({
                        "type": "Feature",
                        "properties":{id:item.id, color:'#F3EC16'},
                        "geometry": {...get(centroidGraph, `${item.id}.centroid.value`, null)}
                    })
                })
            }

        })
        if(map.getSource('buildings')) {
            map.removeSource('buildings');
            map.removeLayer('buildings-layer');
        }
        map.addSource('buildings', {
            type: 'geojson',
            data: geojson
        });
        map.addLayer({
            'id': 'buildings-layer',
            'source': 'buildings',
            'type': 'circle',
            'paint': {
                'circle-color': ["get", ["to-string", ["get", "id"]], ["literal", buildingColors]],
                'circle-radius':3,
                'circle-opacity': 0.5
            }
        })
    }

}


export default (options = {}) =>
    new CountiesLayer("Counties", {
        active: true,
        ...options,
        sources: [
            { id: "counties",
                source: {
                    'type': "vector",
                    'url': 'mapbox://am3081.1ggw4eku'
                }
            },
            {
                id: "nys_buildings_avail",
                source: {
                    'type': "vector",
                    'url': 'mapbox://am3081.dpm2lod3'
                }
            },
            {
                id:"nys_1811_parcels",
                source:{
                    'type':"vector",
                    'url':"mapbox://am3081.6o6ny609"
                }
            }
        ],
        layers: [
            { 'id': 'counties',
                'source': 'counties',
                'source-layer': 'counties',
                'type': 'line',
                'paint': {
                    'line-color': '#F31616',
                    //'line-opacity': 0.5
                },
                filter : ['all',['in','geoid',store.getState().user.activeGeoid]]
            },
            { 'id': 'ebr',
                'source': 'nys_buildings_avail',
                'source-layer': 'nys_buildings_osm_ms_parcelid_pk',
                'type': 'fill',
                'minzoom': 13,
                'paint': {
                    'fill-color': '#000000'
                }
            },
            {
                'id': 'parcels',
                'source': 'nys_1811_parcels',
                'source-layer': 'nys_1811_parcels',
                'type': 'fill',
                'minzoom': 13,
                'paint': {
                    'fill-color': 'rgba(0,0,0,0.5)'
                    //'fill-opacity': '0.5'
                }
            }
        ],
        infoBoxes:{
            Overview: {
                title: "Assets By Owner Type",
                comp: (props={}) =>{
                    let flood_100_count_muni = 0,
                        flood_100_value_muni = 0,
                        flood_500_count_muni = 0,
                        flood_500_value_muni = 0;
                    let graph = falcorGraph.getCache();
                    let resultData = []
                    if(graph.building){
                        let buildingDataByOwnerTypeByFloodType = graph.building.byGeoid[store.getState().user.activeGeoid].ownerType
                        Object.keys(buildingDataByOwnerTypeByFloodType).forEach(owner =>{
                            if(owner === '2'){
                                resultData.push({
                                    'owner': 'State',
                                    'pin_color':'#0d1acc',
                                    'flood_100_count':buildingDataByOwnerTypeByFloodType[owner]['flood_100'].sum.count.value || 0,
                                    'flood_100_value':buildingDataByOwnerTypeByFloodType[owner]['flood_100'].sum.replacement_value.value || 0,
                                    'flood_500_count':buildingDataByOwnerTypeByFloodType[owner]['flood_500'].sum.count.value || 0,
                                    'flood_500_value':buildingDataByOwnerTypeByFloodType[owner]['flood_500'].sum.replacement_value.value || 0
                                })
                            }
                            if(owner === '3'){
                                resultData.push({
                                    'owner': 'County',
                                    'pin_color':'#0fcc1b',
                                    'flood_100_count':buildingDataByOwnerTypeByFloodType[owner]['flood_100'].sum.count.value || 0,
                                    'flood_100_value':buildingDataByOwnerTypeByFloodType[owner]['flood_100'].sum.replacement_value.value || 0,
                                    'flood_500_count':buildingDataByOwnerTypeByFloodType[owner]['flood_500'].sum.count.value || 0,
                                    'flood_500_value':buildingDataByOwnerTypeByFloodType[owner]['flood_500'].sum.replacement_value.value || 0
                                })
                            }
                            if(['4', '5', '6', '7'].includes(owner)){
                                flood_100_count_muni += parseInt(buildingDataByOwnerTypeByFloodType[owner]['flood_100'].sum.count.value)
                                flood_100_value_muni += parseFloat(buildingDataByOwnerTypeByFloodType[owner]['flood_100'].sum.replacement_value.value)
                                flood_500_count_muni += parseInt(buildingDataByOwnerTypeByFloodType[owner]['flood_500'].sum.count.value)
                                flood_500_value_muni += parseFloat(buildingDataByOwnerTypeByFloodType[owner]['flood_500'].sum.replacement_value.value)

                            }
                            if(owner === '8'){
                                resultData.push({
                                    'owner': 'Private',
                                    'pin_color':'#F3EC16',
                                    'flood_100_count':buildingDataByOwnerTypeByFloodType[owner]['flood_100'].sum.count.value || 0,
                                    'flood_100_value':buildingDataByOwnerTypeByFloodType[owner]['flood_100'].sum.replacement_value.value || 0,
                                    'flood_500_count':buildingDataByOwnerTypeByFloodType[owner]['flood_500'].sum.count.value || 0,
                                    'flood_500_value':buildingDataByOwnerTypeByFloodType[owner]['flood_500'].sum.replacement_value.value || 0
                                })
                            }

                        })
                        resultData.push({
                            'owner': 'Municipality',
                            'pin_color':'#cc1e0a',
                            'flood_100_count':flood_100_count_muni || 0,
                            'flood_100_value':flood_100_value_muni || 0,
                            'flood_500_count':flood_500_count_muni || 0,
                            'flood_500_value':flood_500_value_muni || 0
                        })
                    }
                    return (
                        <div>
                            <table className='table table-sm table-hover'>
                                <thead>
                                <tr>
                                    <th>Owner Type</th>
                                    <th># Flood 100</th>
                                    <th>Est. Replacement $</th>
                                    <th># Flood 500</th>
                                    <th>Est. Replacement $</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    resultData ?
                                        (resultData).map(item =>{
                                            return (
                                                <tr>
                                                    <td>
                                                    <div className='el-legend'>
                                                        <div className='legend-value-w'>
                                                            <div className='legend-pin' style={{'background-color': item.pin_color}}/>{item.owner}
                                                        </div>
                                                    </div>
                                                    </td>
                                                    <td>{item.flood_100_count}</td>
                                                    <td>{fnum(item.flood_100_value)}</td>
                                                    <td>{item.flood_500_count}</td>
                                                    <td>{fnum(item.flood_500_value)}</td>
                                                </tr>
                                            )
                                        })
                                        :
                                        null

                                }
                                </tbody>
                                {/*<tfoot><tr style={{fontWeight: 600}}><td>Total</td><td>{totalNum}</td><td>{fnum(totalEst)}</td><td>{fnum(totalFEMA)}</td></tr></tfoot>*/}
                            </table>
                        </div>
                    )},
                show: true
            }
        }

    })


const mapStateToProps = (state, { id }) => ({

});
const mapDispatchToProps = {};
