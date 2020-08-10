import React from "react"

import store from "store"
import { update } from "utils/redux-falcor/components/duck"
import { falcorGraph, falcorChunkerNice } from "store/falcorGraph"
import MapLayer from "components/AvlMap/MapLayer.js"
import {register, unregister} from "../../../../components/AvlMap/ReduxMiddleware";


import { getColorRange } from "constants/color-ranges";
import ZoneControls from "../controls/zoneControls";
import geo from "../../../../store/modules/geo";
import mapboxgl from "mapbox-gl";
import get from 'lodash.get'
var _ = require('lodash')
const LEGEND_COLOR_RANGE = getColorRange(7, "YlGn");

const IDENTITY = i => i;

export class JurisdictionLayer extends MapLayer{
    onAdd(map) {
        register(this, 'USER::SET_CENTROIDS', ["centroids"]);
        super.onAdd(map);
        this.map = map;
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

    toggleVisibilityOn() {
        this.layers.forEach(layer => {
            this.map.setLayoutProperty(layer.id, 'visibility',  "visible");
        })
        let activeGeoid = store.getState().user.activeGeoid
        let geoids = JSON.parse("[" + localStorage.getItem("jurisdiction") + "]")[0];
        let cousubs = [];
        if(geoids){
            geoids.forEach(geoid =>{
                if(geoid.geoid && geoid.geoid.length !== 5){
                    cousubs.push(geoid.geoid)
                }
            });
        }
        this.map.setFilter(
            "jurisdiction_cousubs",
            ['all', ['in', 'geoid',...cousubs.filter(d => d)]]
        )
    }

    removeCentroids(){
        this.markers.forEach(m => m.remove());
        this.forceUpdate()
    }
    paintCentroids(){
        if (this.markers.length){
            this.markers.map(m => {
                m.remove()
            });
        }
        this.markers = Object.keys(this.centroids)
                                .filter(p => get(this.centroids[p], `centroid.value.coordinates`, null))
                                .map((p,i) =>{
                                    return new mapboxgl.Marker({
                                        draggable: false
                                    })
                                        .setLngLat(this.centroids[p].centroid.value.coordinates)
                                    .addTo(this.map)
                                    /* .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(
                                         '<div>'
                                         + '<b>'+ 'Title: ' +'</b>'+ graph[id].attributes.title + '<br>'
                                         + '<b>'+ 'Type: ' +'</b>'+ graph[id].attributes.type + '<br>'
                                         + '<b>'+ 'Comment: ' +'</b>'+ graph[id].attributes.comment +
                                         '</div>'
                                     ))*/
                                })
        this.forceUpdate();
    }

    receiveMessage(action, data) {
        this.centroids = data.centroids || {}
        if (Object.keys(this.centroids).length && data.type === 'jurisdictions'){
            this.paintCentroids()
        }

    }

    onRemove(map) {
        unregister(this);
    }

    toggleVisibilityOff(){
        this.layers.forEach(layer => {
            this.map.setLayoutProperty(layer.id, 'visibility',"none");
        })
    }

    showTownBoundary(data,id){
        let geoids = JSON.parse("[" + data + "]")[0];
        let cousubs = [];
        let geojson = {
            "type": "FeatureCollection",
            "features": []
        }
        geoids.forEach(geoid =>{
            if(geoid.geoid && geoid.geoid.length !== 5){
                cousubs.push(geoid.geoid)
            }
        });
        this.map.setFilter(
            "jurisdiction_cousubs",
            ['all', ['in', 'geoid',...cousubs]]
        )
        this.map.getSource("polygon").setData(geojson)
    }




}


export const JurisdictionOptions =  (options = {}) => {
    return {
        active: true,
        ...options,
        sources: [
            { id:"polygon",
                source: {
                    type: "geojson",
                    //generateId: true,
                    data: {
                        type: "FeatureCollection",
                        features: []
                    }
                }
            },
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
                'id': 'jurisdiction_counties',
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
                'id': 'jurisdiction_cousubs',
                'source': 'cousubs',
                'source-layer': 'cousubs',
                'type': 'line',
                'paint': {
                    'line-color': '#F31616',
                    'line-opacity': 0.5,
                    'line-width': 4
                },
                filter : ['in','geoid','']

            },
        ],
        markers: [],
        _isVisible: true
    }

}

const mapStateToProps = (state, { id }) => ({

});
const mapDispatchToProps = {};
