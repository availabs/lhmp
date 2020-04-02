import React from "react"

import store from "store"
import { update } from "utils/redux-falcor/components/duck"
import { falcorGraph, falcorChunkerNice } from "store/falcorGraph"
import mapboxgl from "mapbox-gl/dist/mapbox-gl";
import MapLayer from "components/AvlMap/MapLayer.js"
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import 'styles/_mapbox-gl-draw.css'
import {ControlLayers} from "./controlLayers";
import AvlMap from "../../../../components/AvlMap";
import ZoneControl from "../controls/zoneControls";

var _ = require('lodash')
const IconPolygon = ({layer}) => <span className='fa fa-2x fa-connectdevelop'/>;
let result_polygon = {}
let zone_boundary = [];

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

            if(this.map.getLayer("parcels") || this.map.getLayer("ebr") || this.map.getLayer("counties") || this.map.getLayer("cousubs") || this.map.getLayer("project") || this.map.getLayer("polygon-layer")){
                this.map.removeLayer("parcels")
                this.map.removeLayer("ebr")
                this.map.removeLayer("buildings-layer")
                this.map.removeLayer("counties")
                this.map.removeLayer("cousubs")
                this.map.removeLayer("project")
                this.map.removeLayer("polygon-layer")
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
                points.push(mousePos(e, canvas))
            }
            function ondblclick(e){
                document.removeEventListener('click', onClick);
                document.removeEventListener('dblclick', ondblclick);
                let minX, minY, maxX, maxY;
                points.forEach(p => {
                    minX = !minX || minX > p.x ? p.x :  minX;
                    minY = !minY || minY > p.y ? p.y :  minY;
                    maxX = !maxX || maxX < p.x ? p.x :  maxX;
                    maxY = !maxY || maxY < p.y ? p.y :  maxY;
                })
                if (poly){
                    result_polygon = poly.features[0];
                    zone_boundary = [[minX, minY], [maxX, maxY]];
                }

                document.addEventListener('click', onClick);
                document.addEventListener('dblclick', ondblclick);
                clearDraw(e)
                alert("Please add a name and Save the zone")
            }


        }
        this.forceUpdate();
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
            },
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
                title:<h4 style ={{display: 'inline'}}>Add New Zone</h4>,
                comp: ({layer,AvlMap}) =>{
                    return(
                        <div>
                            <div className="col-sm-12">
                                <div className="form-group">
                                    <input id='new_zone_name' className="form-control"
                                           placeholder="New Zone Title"
                                           type="text"

                                    /></div>
                                <button
                                        className="mr-2 mb-2 btn btn-primary btn-sm"
                                        type="button"
                                        onClick = {(e) =>{
                                            e.persist()

                                            if(Object.keys(result_polygon).length === 0){
                                                alert("Please draw a zone")
                                            }else{
                                                let args = [];
                                                let name = document.getElementById("new_zone_name").value
                                                let geom = result_polygon.geometry
                                                geom['crs'] = {"type": "name", "properties": {"name": "EPSG:4326"}};
                                                let plan_id = store.getState().user.activePlan
                                                args.push(name,geom,plan_id,zone_boundary)
                                                return falcorGraph.call(['zones','insert'],args,[],[])
                                                    .then(response =>{
                                                        alert("Zone has been saved")
                                                        let new_zone = JSON.parse(localStorage.getItem("zone"))
                                                        new_zone.push({
                                                            'id':name,
                                                            'name':name,
                                                            'geom':result_polygon,
                                                            'geoid' : null
                                                        })
                                                        localStorage.setItem("zone",JSON.stringify(new_zone))
                                                        layer.doAction([
                                                            "deleteDynamicLayer",
                                                            "addNewZone"
                                                        ])
                                                        if(!layer.map.getLayer("parcels") || !layer.map.getLayer("ebr") || !layer.map.getLayer("project")){
                                                            let geoids = JSON.parse("[" + localStorage.getItem("zone") + "]")[0];
                                                            let cousubs = [];
                                                            geoids.forEach(geoid =>{
                                                                if(geoid.geoid && geoid.geoid.length !== 5){
                                                                    cousubs.push(geoid.geoid)
                                                                }
                                                            });
                                                            layer.map.setFilter(
                                                                "cousubs",
                                                                ['all', ['in', 'geoid',...cousubs]]
                                                            )
                                                            layer.map.addLayer({
                                                                'id': 'polygon-layer',
                                                                'source': 'polygon',
                                                                'type': 'line',
                                                                'paint': {
                                                                    'line-color': '#F31616',
                                                                    'line-opacity': 0.5,
                                                                    'line-width': 4
                                                                }
                                                            })

                                                            if(localStorage.getItem("zone")){
                                                                let new_zones = JSON.parse(localStorage.getItem("zone"))
                                                                let geojson = {
                                                                    "type": "FeatureCollection",
                                                                    "features": []
                                                                }
                                                                new_zones.forEach(new_zone =>{
                                                                    if(new_zone.geoid === null){
                                                                        if(new_zone.geojson){
                                                                            geojson.features.push({
                                                                                type : "Feature",
                                                                                properties:{},
                                                                                geometry:new_zone.geojson
                                                                            })
                                                                        }else{
                                                                            geojson.features.push(new_zone.geom)
                                                                        }
                                                                    }
                                                                })
                                                                layer.map.getSource("polygon").setData(geojson)
                                                            }

                                                            layer.map.addLayer({
                                                                'id': 'parcels',
                                                                'source': 'nys_1811_parcels',
                                                                'source-layer': 'nys_1811_parcels',
                                                                'type': 'fill',
                                                                'minzoom': 13,
                                                                'paint': {
                                                                    'fill-opacity':0.1,
                                                                    'fill-outline-color': '#ffffff'
                                                                }

                                                            })
                                                            layer.map.addLayer({
                                                                'id': 'ebr',
                                                                'source': 'nys_buildings_avail',
                                                                'source-layer': 'nys_buildings_osm_ms_parcelid_pk',
                                                                'type': 'fill',
                                                                'minzoom': 13,
                                                                'paint': {
                                                                    'fill-color': '#000000'
                                                                }
                                                            })
                                                            layer.map.addLayer({
                                                                'id': 'buildings-layer',
                                                                'source': 'buildings',
                                                                'type': 'circle',
                                                                'paint': {
                                                                    'circle-radius': 3,
                                                                    'circle-opacity': 0.5
                                                                }
                                                            })
                                                            layer.map.addLayer({
                                                                'id': 'project',
                                                                'source': 'counties',
                                                                'source-layer': 'counties',
                                                                'type': 'line',
                                                                'paint': {
                                                                    'line-color': '#FFFFFF',
                                                                    'line-opacity': 0.5
                                                                },
                                                                filter: ['all', ['in', 'geoid', store.getState().user.activeGeoid]]

                                                            })
                                                            document.getElementById("new_zone_button").disabled = false
                                                        }

                                                    })
                                            }

                                        }}
                                >Save Zone</button>
                                <button
                                    className="mr-2 mb-2 btn btn-danger btn-sm"
                                    type="button"
                                    onClick={(e) =>{
                                        document.getElementById("new_zone_button").disabled = false
                                        layer.doAction([
                                            "deleteDynamicLayer",
                                            "addNewZone"
                                        ])

                                    }}
                                >Cancel</button>
                            </div>
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
