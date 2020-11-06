import React from "react"

import store from "store"
import { update } from "utils/redux-falcor/components/duck"
import { falcorGraph, falcorChunkerNice } from "store/falcorGraph"
import MapLayer from "components/AvlMap/MapLayer.js"
//import { register, unregister } from "../ReduxMiddleware"
import turfBbox from '@turf/bbox'


import { getColorRange } from "constants/color-ranges";
import ZoneControls from "../controls/zoneControls";
import geo from "../../../../store/modules/geo";
import {register, unregister} from "../../../../components/AvlMap/ReduxMiddleware";
import get from "lodash.get";
import mapboxgl from "mapbox-gl";
var _ = require('lodash')
const LEGEND_COLOR_RANGE = getColorRange(7, "YlGn");

const IDENTITY = i => i;

export class ZoneLayer extends MapLayer{
    onAdd(map) {
        //localStorage.removeItem("zone")
        register(this, 'USER::SET_CENTROIDS', ["centroids"]);
        super.onAdd(map);
        if(store.getState().user.activeGeoid){
            let activeGeoid = store.getState().user.activeGeoid
            return falcorGraph.get(['geo',activeGeoid,'boundingBox'])
                .then(response =>{
                    let initalBbox = response.json.geo[activeGeoid]['boundingBox'].slice(4, -1).split(",");
                    this.bbox = initalBbox ? [initalBbox[0].split(" "), initalBbox[1].split(" ")] : null;
                    this.layers.forEach(layer => {
                        map.setLayoutProperty(layer.id, 'visibility',"none");
                    })
                    map.resize();
                    map.fitBounds(this.bbox);
                })

        }
    }

    showModal(modal, title, onClose, onClosetab){

        this.modals.dataModal = {
            show: true,
            comp: modal,
            title: title,
            onClose: onClose
        }
        //this.forceUpdate()
    }

    toggleVisibilityOn() {
        let activeGeoid = store.getState().user.activeGeoid
        this.layers.forEach(layer => {
            this.map.setLayoutProperty(layer.id, 'visibility',  "visible");
        })
        if(localStorage.getItem("zone") && this.map.getLayoutProperty("polygon-layer","visibility") === 'visible'){
            let new_zones = JSON.parse(localStorage.getItem("zone")) || []
            let geojson = {
                "type": "FeatureCollection",
                "features": []
            }
            new_zones.forEach(new_zone =>{
                if(new_zone.geoid === activeGeoid && !new_zone.name.includes("County")){
                    if(new_zone.geojson){
                        geojson.features.push({
                            type : "Feature",
                            properties:{},
                            geometry:new_zone.geojson.geometry ? new_zone.geojson.geometry : new_zone.geojson
                        })
                    }else{
                        geojson.features.push(new_zone.geom)
                    }
                }
            })
            this.map.getSource("polygon").setData(geojson)
        }

    }

    removeCentroids(){
        this.markers.forEach(m => m.remove());
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
        // this.forceUpdate();
    }

    receiveMessage(action, data) {
        this.centroids = data.centroids || {}
        if (Object.keys(this.centroids).length && data.type === 'zones'){
            this.paintCentroids()
            // this.markers = []
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

    showTownBoundary(data,id,zones_data){
        let zones = JSON.parse("[" + data + "]")[0] || [];
        let geojson = {
            "type": "FeatureCollection",
            "features": []
        }
        let activeGeoid = store.getState().user.activeGeoid
        zones.forEach(zone =>{
            if(zone.geoid === activeGeoid && !zone.name.includes("County")){
                if(zone.geojson){
                    if(zone.geojson.geometry){
                        geojson.features.push({
                            type : "Feature",
                            properties:{},
                            geometry:zone.geojson.geometry
                        })
                    }else{
                        geojson.features.push({
                            type : "Feature",
                            properties:{},
                            geometry:zone.geojson
                        })
                    }
                }else{
                    geojson.features.push(zone.geom)
                }
                if (zone.zone_id == id && get(geojson.features.slice(-1).pop(), `geometry`, null)) {
                    let bbox = turfBbox(get(geojson.features.slice(-1).pop(), `geometry`, null))
                    this.map.resize();
                    this.map.fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]]);
                }else if (!id && this.bbox){
                    this.map.resize();
                    this.map.fitBounds(this.bbox);
                }
            }
        })
        this.map.getSource("polygon").setData(geojson)
    }




}


export const ZoneOptions =  (options = {}) => {
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
                    'id': 'counties',
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
                    'id': 'polygon-layer',
                    'source': 'polygon',
                    'type': 'line',
                    'paint': {
                        'line-color': '#F31616',
                        'line-opacity': 0.5,
                        'line-width': 4,
                    },
                }

            ],
            markers: [],
            _isVisible: true,
            modals: {
                dataModal: {
                    title: "Attributes",
                    comp: ( modal ) => {
                        return <div></div>
                    },
                    show: false,
                    position: "bottom",
                    startSize: [800, 500],
                    onClose: () => console.log('closing...')
                }
            }
        }


}

const mapStateToProps = (state, { id }) => ({

});
const mapDispatchToProps = {};
