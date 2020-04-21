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
let draw = new MapboxDraw({
    displayControlsDefault: false,
});
export class AddNewZoneLayer extends MapLayer{
    onAdd(map){
        super.onAdd(map);
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

            if(this.map.getLayer("parcels") || this.map.getLayer("ebr") || this.map.getLayer("counties") || this.map.getLayer("cousubs") || this.map.getLayer("project") || this.map.getLayer("polygon-layer")){
                this.map.removeLayer("counties")
                this.map.removeLayer("cousubs")
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
                //clearDraw(e)
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
                                                let attributes = {}
                                                let plan_id = store.getState().user.activePlan
                                                let name = document.getElementById("new_zone_name").value
                                                let geom = result_polygon.geometry
                                                geom['crs'] = {"type": "name", "properties": {"name": "EPSG:4326"}};
                                                attributes['geom'] = geom
                                                attributes['bbox'] = zone_boundary
                                                attributes['name'] = name
                                                attributes['geojson'] = result_polygon
                                                args.push('zones',plan_id,attributes);
                                                return falcorGraph.call(['form_zones','insert'], args, [], [])
                                                    .then(response =>{
                                                        alert("Zone has been saved")
                                                        let new_zone = localStorage.getItem("zone") ? JSON.parse(localStorage.getItem("zone")) : ''
                                                        new_zone.push({
                                                            'zone_id':null,
                                                            'name':name,
                                                            'geom':result_polygon,
                                                            'bbox':zone_boundary,
                                                            'geojson':result_polygon,
                                                            'geoid' : null
                                                        })
                                                        localStorage.setItem("zone",JSON.stringify(new_zone))
                                                        layer.doAction([
                                                            "deleteDynamicLayer",
                                                            "addNewZone"
                                                        ])
                                                        if(!layer.map.getLayer("parcels") || !layer.map.getLayer("ebr") || !layer.map.getLayer("project") || localStorage.getItem("zone")){
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
                                                                                geometry:new_zone.geojson.geometry ? new_zone.geojson.geometry : new_zone.geojson
                                                                            })
                                                                        }else{
                                                                            geojson.features.push(new_zone.geom)
                                                                        }
                                                                    }
                                                                })
                                                                layer.map.getSource("polygon").setData(geojson)
                                                            }
                                                            layer.map.fire('draw.delete')
                                                            layer.map.removeControl(draw);
                                                            layer.forceUpdate()
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


