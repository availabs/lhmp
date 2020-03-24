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
import mapboxgl from "mapbox-gl/dist/mapbox-gl";
import MapLayer from "components/AvlMap/MapLayer.js"
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import 'styles/_mapbox-gl-draw.css'
//import { register, unregister } from "../ReduxMiddleware"


import { getColorRange } from "constants/color-ranges";
import ZoneControls from "../controls/zoneControls";
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
                    let data = []
                })

        }
    }

    // after drawing the polygon
    /*onSelect(selection) {
        if (['polygon'].includes(this.creationMode) ){
            let tmpRoute = [];
            selection = selection
                .filter((id,id_i) => selection.indexOf(id) === id_i)
                .map(f => f.properties.id);

            let feats = this.map.querySourceFeatures('conflationSource', {
                filter: ['in', 'id', ...selection.map(f => parseInt(f))],
                sourceLayer: 'network_conflation'
            });
            selection
                .forEach(f => {
                    let isFeature = feats.filter(feat => feat.properties.id === f);
                    if (isFeature.length > 0) tmpRoute.push(isFeature[0]);
                });
            //this.paintRoute('npmrds')
            console.log('tmproute', tmpRoute, selection)
            this.route = [tmpRoute];
        }else if(['selection'].includes(this.creationMode) ){
            let tmpRoute = [];
            selection = selection
                .filter((id,id_i) => selection.indexOf(id) === id_i);

            let feats = this.map.querySourceFeatures('conflationSource', {
                filter: ['in', 'npmrds', ...selection.filter(f => f)],
                sourceLayer: 'network_conflation'
            });
            selection
                .forEach(f => {
                    let isFeature = feats.filter(feat => feat.properties.npmrds === f);
                    if (isFeature.length > 0) tmpRoute.push(isFeature[0]);
                });
            //this.paintRoute('npmrds')
            console.log('tmproute', tmpRoute, selection)
            this.route = [tmpRoute];
        }else{
            this.map.setPaintProperty(
                'conflation-route',
                'line-color',
                'rgba(0,0,0,0)');
        }
        return Promise.resolve(selection)

    }*/

    toggleCreationMode(mode, map) {
        console.log('creation mode', mode)
        this.creationMode = mode;
        if (this.creationMode !== 'polygon') {
            this.map.fire('toggleMode');
        }

        if (mode === 'selection'){
            this.select = {
                fromLayers:['conflation-route'],
                property: 'npmrds',
                highlightLayers: [
                    { id:'conflation-route', filter: ['all'] }
                ],
            }
        }else if (mode === 'polygon')
        {
            let canvas = map.getCanvasContainer();
            let points = [];
            let poly = null;
            document.addEventListener('click', onClick);
            document.addEventListener('dblclick', ondblclick);
            let draw = new MapboxDraw({
                displayControlsDefault: false,
            });
            this.map.addControl(draw);
            draw.changeMode('draw_polygon');

            this.map.on('draw.create',updateArea);
            this.map.on('draw.delete', updateArea);
            this.map.on('draw.update', updateArea);
            this.map.on('toggleMode', clearDraw);

            function clearDraw(e){
                if (map){
                    console.log('finally here')
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
                    /*RouteLayer.osmColors = RouteLayer.originalColors;
                    RouteLayer.paintOriginal();
                    RouteLayer.component.onSelect(RouteLayer.name, []);*/
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
                let features = map.queryRenderedFeatures(bbox, { layers: ['cousubs'] });
                if (poly){
                    console.log('poly',poly.features[0]);
                    /*RouteLayer.component.onSelect(RouteLayer.name,
                        features.filter(f => turf.pointsWithinPolygon(turf.points(f.geometry.coordinates), poly.features[0]).features.length > 0));
                    features
                        .filter(f => turf.pointsWithinPolygon(turf.points(f.geometry.coordinates), poly.features[0]).features.length > 0)
                        .map(f => f.properties.id)
                        .filter(f => f)
                        .forEach(f => RouteLayer.osmColors[f] = '#12cc23');
                    RouteLayer.paintRoute('id');*/
                }

                document.addEventListener('click', onClick);
                document.addEventListener('dblclick', ondblclick);
            }
        }
        else if (mode === 'custom'){
            this.route = [[]]
        }
        else{
            this.select = {
                fromLayers:[],
                property: '',
                highlightLayers: [],
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
        _isVisible: true
    }


}

const mapStateToProps = (state, { id }) => ({

});
const mapDispatchToProps = {};
