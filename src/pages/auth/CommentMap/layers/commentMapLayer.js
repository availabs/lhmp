import React from "react"
import store from "store"
import MapLayer from "components/AvlMap/MapLayer"
import get from 'lodash.get'
import {falcorGraph} from "store/falcorGraph"
import COLOR_RANGES from "constants/color-ranges"
import * as d3scale from "d3-scale";
import mapboxgl from "mapbox-gl";
import * as turf from '@turf/turf'
import CommentMapModal from "../components/CommentMapModal";
import CommentMapInfoBoxTable from "../components/CommentMapInfoBoxTable"

var _ = require('lodash')
class CommentMapLayer extends MapLayer{
    onAdd(map) {
        super.onAdd(map);
        this.doAction([
            "sendMessage",
            {Message: 'Comment Map. Double click to drop a pin and save a comment',
                id:'Comment Map',
                duration:0
            },
        ])
        this.toggleCreationMode('markers',map)
        let activeGeoid = store.getState().user.activeGeoid
        let activePlan = store.getState().user.activePlan
        return falcorGraph.get(['geo',activeGeoid,'boundingBox'],
            ['forms','map_comment','byPlanId',activePlan,'length'],
            ['forms','map_comment','meta'])
            .then(response =>{
                let initalBbox = response.json.geo[activeGeoid]['boundingBox'].slice(4, -1).split(",");
                let length = get(response,['json','forms','map_comment','byPlanId',activePlan,'length'],0)
                let bbox = initalBbox ? [initalBbox[0].split(" "), initalBbox[1].split(" ")] : null;
                let meta = get(response,['json','forms','map_comment','meta'],[])
                if(length > 0){
                    falcorGraph.get(['forms','map_comment','byPlanId',activePlan,'byIndex',[{from:0,to:length-1}],['title','type']])
                        .then(response =>{
                            let graph = response.json.forms['map_comment'].byPlanId[activePlan].byIndex;
                            Object.keys(graph).filter(d => d !== '$__path').forEach(id =>{
                                if(graph[id] && meta.length > 0){
                                    this.markers = graph[id].attributes.point.map((p,i) =>{
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
                                }
                            })
                            map.resize();
                            map.fitBounds(bbox);
                            return response
                        })
                }
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
                    this.generateMapMarkers(data);
                    break;
            }
            this.calcRoute();
        }

    }

    toggleCreationMode(mode,map){
        this.creationMode = mode
        if(mode === 'markers'){

            document.addEventListener('dblclick', ondblclick.bind(this));

            this.map.on('dblclick',ondblclick.bind(this))

            function ondblclick(e){
                document.removeEventListener('dblclick', ondblclick.bind(this));
                switch (mode) {
                    case "markers":
                        this.handleMapClick(e.lngLat);
                        break;
                }
                document.addEventListener('dblclick', ondblclick.bind(this));
                this.modals.comment.show = true
                this.forceUpdate()

            }
        }
    }


}

export default (props = {}) =>new CommentMapLayer("CommentMapLayer",{
    name:'Comment Map',
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
            'id': 'counties',
            'source': 'counties',
            'source-layer': 'counties',
            'type': 'line',
            filter: ['all', ['in', 'geoid',store.getState().user.activeGeoid]]

        },
        {
            'id': 'cousubs',
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
                this.doAction([
                    "dismissMessage",
                    {id:'Comment Map'}
                ])
                switch (this.mode) {
                    case "markers":
                        while (this.markers.length) {
                            this.markers.pop().remove();
                        }
                        break;
                }
                this.map && this.render(this.map);
            },
            startSize: [400,400],
            position:"relative"
        }
    },
    infoBoxes: {
        Overview: {
            title: "Comment Map",
            comp: ({layer}) =>{
                return(
                    <CommentMapInfoBoxTable
                        layer={layer}

                    />
                )
            },
            show: true
        }
    },


})



