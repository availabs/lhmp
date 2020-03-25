import React from "react"

import store from "store"
import { update } from "utils/redux-falcor/components/duck"
import { falcorGraph, falcorChunkerNice } from "store/falcorGraph"
import mapboxgl from "mapbox-gl/dist/mapbox-gl";
import MapLayer from "components/AvlMap/MapLayer.js"
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import 'styles/_mapbox-gl-draw.css'
import * as turf from '@turf/turf'
//import { register, unregister } from "../ReduxMiddleware"
import { getColorRange } from "constants/color-ranges";
var _ = require('lodash')
const LEGEND_COLOR_RANGE = getColorRange(7, "YlGn");

const IDENTITY = i => i;
const IconPolygon = ({layer}) => <span className='fa fa-2x fa-connectdevelop'/>;
export class AddNewZoneLayer extends MapLayer{
    onAdd(map){
        super.onAdd(map);
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

    toggleCreationMode(mode, map) {
        console.log('creation mode', mode)
        this.creationMode = mode;
        if (mode === 'polygon')
        {
            let canvas = map.getCanvasContainer();
            //console.log('check',document.getElementById("avl-map-1").childNodes)
           // document.querySelectorAll(".sc-bnXvFD gWiRDt").style.zIndex = 2147483647
            let points = [];
            let poly = null;

            document.addEventListener('click', onClick);
            document.addEventListener('dblclick', ondblclick);
            let draw = new MapboxDraw({
                displayControlsDefault: false,
            });

            if(this.map.getLayer("parcels") || this.map.getLayer("ebr") || this.map.getLayer("counties") || this.map.getLayer("cousubs") || this.map.getLayer("project")){
                this.map.removeLayer("parcels")
                this.map.removeLayer("ebr")
                this.map.removeLayer("buildings-layer")
                this.map.removeLayer("counties")
                this.map.removeLayer("cousubs")
                this.map.removeLayer("project")
            }

            this.map.addControl(draw);
            draw.changeMode('draw_polygon');

            this.map.addLayer({
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

            })
            this.map.addLayer({
                'id': 'cousubs',
                'source': 'cousubs',
                'source-layer': 'cousubs',
                'type': 'line',
                'paint': {
                    'line-color': '#F31616',
                    'line-opacity': 0.5,
                    'line-width': 4
                },
                filter : ['in','geoid','']

            })

            this.map.on('draw.create',updateArea);
            this.map.on('draw.delete', updateArea);
            this.map.on('draw.update', updateArea);
            this.map.on('toggleMode', clearDraw);

            function clearDraw(e){
                if (map){
                    map.fire('draw.delete');
                    map.removeControl(draw);
                }
                document.removeEventListener('click', onClick);
                document.removeEventListener('dblclick', ondblclick);
            }
            function updateArea(e) {
                poly = draw.getAll();
                console.log('e.target', e,poly)
                if (e.type === 'draw.delete'){
                    draw.trash();
                    draw.deleteAll();
                    points = [];
                    poly = null;
                    draw.changeMode('draw_polygon');
                }
            }
            function mousePos(e){
                var rect = canvas.getBoundingClientRect();
                return new mapboxgl.Point(
                    e.clientX - rect.left - canvas.clientLeft,
                    e.clientY - rect.top - canvas.clientTop
                );
            }
            function onClick(e){
                console.log('clicked', e, mousePos(e, canvas), points)
                points.push(mousePos(e, canvas))
            }
            function ondblclick(e){
                document.removeEventListener('click', onClick);
                document.removeEventListener('dblclick', ondblclick);
                console.log('dbl click', points)
                let minX, minY, maxX, maxY;
                points.forEach(p => {
                    minX = !minX || minX > p.x ? p.x :  minX;
                    minY = !minY || minY > p.y ? p.y :  minY;
                    maxX = !maxX || maxX < p.x ? p.x :  maxX;
                    maxY = !maxY || maxY < p.y ? p.y :  maxY;
                })
                let bbox = [[minX, minY], [maxX, maxY]];
                //let features = map.queryRenderedFeatures(bbox, { layers: ['cousubs'] });
                if (poly){
                    let feats = map.querySourceFeatures('cousubs');
                    console.log('poly',poly.features[0].geometry.coordinates);
                }

                document.addEventListener('click', onClick);
                document.addEventListener('dblclick', ondblclick);
            }
        }
        this.forceUpdate();
    }




    toggleVisibilityOn() {
        //console.log('in map layer toggle visibility',map,this.layers)
        this._isVisible = !this._isVisible;
        this.layers.forEach(layer => {
            this.map.setLayoutProperty(layer.id, 'visibility',  "visible");
        })
    }

    toggleVisibilityOff(){
        this.layers.forEach(layer => {
            this.map.setLayoutProperty(layer.id, 'visibility',"none");
        })
    }


}


export const AddNewZoneOptions =  (options = {}) => {
    return {
        active: true,
        ...options,

        sources: [
            { id: "cousubs",
                source: {
                    'type': "vector",
                    'url': 'mapbox://am3081.dlnvkxdi'
                },
            }
        ],
        mapActions: {
            selectionPolygon: {
                Icon: IconPolygon,
                tooltip: "Add New Zone",
                action: function () {
                    if (this.creationMode !== "polygon") {
                        this.doAction([
                            "sendMessage",
                            {Message: "You have entered polygon mode"}
                        ]);
                        this.toggleCreationMode('polygon', this.map);
                    }
                }
            },
        },
        infoBoxes:{
            Overview: {
                title: "Add New Zone",
                comp: ({layer}) =>{

                    return(
                        <div>

                        </div>
                    )
                },
                show: true
            }
        },
        creationMode: "click",

        _isVisible: true
    }


}

const mapStateToProps = (state, { id }) => ({

});
const mapDispatchToProps = {};
