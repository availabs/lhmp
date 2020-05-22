import React from "react"
import store from "store"
import MapLayer from "components/AvlMap/MapLayer"
import get from 'lodash.get'
import {falcorGraph} from "store/falcorGraph"
import * as d3scale from "d3-scale";
import mapboxgl from "mapbox-gl";
import { listen, unlisten } from "components/AvlMap/LayerMessageSystem"
import CommentMapModal from "pages/auth/ScenarioMap2/components/CommentMapModal";
var _ = require('lodash')

export class CommentMapLayer extends MapLayer{
    onAdd(map) {
        super.onAdd(map);
        let activeGeoid = store.getState().user.activeGeoid
        return falcorGraph.get(['geo',activeGeoid,'boundingBox'],
            ['forms','map_comment','meta'])
            .then(response =>{
                let initalBbox = response.json.geo[activeGeoid]['boundingBox'].slice(4, -1).split(",");
                let bbox = initalBbox ? [initalBbox[0].split(" "), initalBbox[1].split(" ")] : null;
                map.resize();
                map.fitBounds(bbox);
                return response
            })

    }

    generateMapMarkers(lngLat = null) {

        let points = []

        if (lngLat) {
            if (Array.isArray(lngLat)) {
                points = lngLat;
            } else {
                points.push(lngLat);
            }
        }

        const num = Math.max(points.length - 1, 1);
        const scale = d3scale.scaleLinear()
            .domain([0, num * 0.5, num])
            .range(["#1a9641", "#ffffbf", "#d7191c"]);

        this.markers.push(...points.map((p, i) => {
            return new mapboxgl.Marker({
                draggable: false,
                color: scale(i)
            })
                .setLngLat(p)
                .addTo(this.map)
                .on("dragend", e => this.calcRoute());
        }))

    }
    calcRoute() {
        this.doAction(["fetchLayerData"]);
    }

    handleMapClick(data) {
        if(data){
            switch (this.mode) {
                case "markers":
                    this.modals.comment.show = true
                    this.generateMapMarkers(data);
                    break;
            }
            this.calcRoute();
        }

    }

    toggleCreationMode(mode){
        this.creationMode = mode
        if(mode === 'markers'){
            this.doAction([
                "sendMessage",
                {Message: 'Comment Map. Click to drop a pin and save a comment',
                    id:'commentMap',
                    duration:0
                },
            ])
            document.addEventListener('click', onClick.bind(this));

            this.map.once('click',onClick.bind(this))

            function onClick(e){
                document.removeEventListener('click', onClick.bind(this));
                switch (mode) {
                    case "markers":
                        this.handleMapClick(e.lngLat);
                        break;
                }
                this.forceUpdate()

            }
        }
    }
    onRemove(map) {
        unlisten(this);
        this.markers.forEach(m => {m.remove()});
    }

    toggleVisibilityOff(){
        this.layers.forEach(layer => {
            this.map.setLayoutProperty(layer.id, 'visibility',"none");
        })
        this.onRemove(this.map)
    }

    toggleVisibilityOn() {
        let activePlan = store.getState().user.activePlan
        let meta = get(falcorGraph.getCache(),['forms','map_comment','meta','value'],[])
        falcorGraph.get(['forms','map_comment','byPlanId',activePlan,'length'])
            .then(response =>{
                let length = response.json.forms['map_comment'].byPlanId[activePlan].length;
                falcorGraph.get(['forms','map_comment','byPlanId',activePlan,'byIndex',[{from:0,to:length-1}],['title','type','comment']])
                    .then(response =>{
                        let graph = response.json.forms['map_comment'].byPlanId[activePlan].byIndex
                        Object.keys(graph).filter(d => d !== '$__path').forEach(id =>{
                            if(graph[id] && meta.length > 0){
                                this.markers.push(
                                    ...graph[id].attributes.point.map((p,i) =>{
                                        return new mapboxgl.Marker({
                                            draggable: false,
                                            color: meta.reduce((a,c) => c.category === graph[id].attributes.type ? c.type : a,null)
                                        })
                                            .setLngLat(p)
                                            .addTo(this.map)
                                            .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(
                                                '<div>'
                                                + '<b>'+ 'Title: ' +'</b>'+ graph[id].attributes.title + '<br>'
                                                + '<b>'+ 'Type: ' +'</b>'+ graph[id].attributes.type + '<br>'
                                                + '<b>'+ 'Comment: ' +'</b>'+ graph[id].attributes.comment +
                                                '</div>'
                                            ))
                                            .on("dragend", e => this.calcRoute())
                                    })
                                )
                            }
                        })
                        this.map.resize();
                        this.layers.forEach(layer => {
                            this.map.setLayoutProperty(layer.id, 'visibility',  "visible");
                        })
                        this.forceUpdate()
                    })
            })
    }

}

export const CommentMapOptions =  (options = {}) => {
    return {
        active: true,
        sources: [
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
                'id': 'counties_comment_map',
                'source': 'counties',
                'source-layer': 'counties',
                'type': 'line',
                filter: ['all', ['in', 'geoid',store.getState().user.activeGeoid]],
                'paint': {
                    'line-color': '#F31616',
                    'line-opacity': 0.5,
                    'line-width': 4
                },
            },
            {
                'id': 'cousubs_comment_map',
                'source': 'cousubs',
                'source-layer': 'cousubs',
                'type': 'line',
                filter : ['in','geoid','']

            },
        ],
        markers: [],
        mode:"markers",
        modals: {
            comment: {
                comp: ({layer}) => {
                    return (
                        <CommentMapModal layer={layer}
                        />
                    )
                },
                show: false,
                onClose: function() {
                    switch (this.mode) {
                        case "markers":
                            this.markers.pop().remove()
                            break;
                    }
                    this.doAction([
                        "dismissMessage",
                        {id:'commentMap'}
                    ])
                    this.map && this.render(this.map);
                },
                startSize: [400,400],
                position:"relative"
            }
        },
    }

}



