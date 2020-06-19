import React from "react"

import store from "store"
import { update } from "utils/redux-falcor/components/duck"
import { falcorGraph, falcorChunkerNice } from "store/falcorGraph"
import mapboxgl from "mapbox-gl/dist/mapbox-gl";
import MapLayer from "components/AvlMap/MapLayer.js"
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import 'styles/_mapbox-gl-draw.css'
import {sendSystemMessage} from 'store/modules/messages';
import ZoneModalData from "../components/zoneModalData";
import {connect} from "react-redux";
import {reduxFalcor} from "../../../../utils/redux-falcor";
import get from "lodash.get";
import styled from "styled-components";
import AvlMap from "../../../../components/AvlMap";
import ElementBox from "../../../../components/light-admin/containers/ElementBox";
import Element from "../../../../components/light-admin/containers/Element";

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
        this.doAction([
            "sendMessage",
            {Message: 'Zone creation mode. Draw a polygon to create your zone. Double click to save zone',
            id:'addNewZone',
            duration:0
            },
        ])
        this.toggleCreationMode('polygon',map)
    }



    toggleCreationMode(mode, map) {
        console.log('creation mode', mode)
        this.creationMode = mode;
        if (mode === 'polygon')
        {
            let dblClickFlag = false;
            let canvas = map.getCanvasContainer();
            //console.log('check',document.getElementById("avl-map-1").childNodes)
           // document.querySelectorAll(".sc-bnXvFD gWiRDt").style.zIndex = 2147483647
            let points = [];
            let poly = null;

            document.addEventListener('click', onClick.bind(this));
            document.addEventListener('dblclick', ondblclick.bind(this));

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
                document.removeEventListener('click', onClick.bind(this));
                document.removeEventListener('dblclick', ondblclick.bind(this));
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
                document.removeEventListener('click', onClick.bind(this));
                document.removeEventListener('dblclick', ondblclick.bind(this));
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

                document.addEventListener('click', onClick.bind(this));
                document.addEventListener('dblclick', ondblclick.bind(this));
                this.modals.zone.show = true
                this.forceUpdate()
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
        modals: {
            zone: {
                comp: NewZoneModal,
                show: false,
                onClose: function() {
                    this.doAction([
                        "dismissMessage",
                        {id:'new_zone_display_message'}
                    ])

                    this.map && this.render(this.map);
                },
                startSize: [400,400],
                position:"relative"
            }
        },
        infoBoxes:{
            Overview: {
                title:<h4 style ={{display: 'inline'}}>New Zone</h4>,
                comp: ({layer,AvlMap}) =>{
                    return(
                        <div>
                            <div className="col-sm-12">
                                <div className="form-group">
                                <button
                                    className="mr-2 mb-2 btn btn-danger btn-sm"
                                    type="button"
                                    onClick={(e) =>{
                                        document.getElementById("new_zone_button").disabled = false
                                        layer.doAction([
                                            "deleteDynamicLayer",
                                            "addNewZone"
                                        ])
                                        layer.map.fire('draw.delete')
                                        layer.map.removeControl(draw);
                                        layer.doAction([
                                            "dismissMessage",
                                            {id:'new_zone_display_message'}
                                        ])
                                        layer.forceUpdate()
                                    }}
                                >Cancel</button>
                            </div>
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

const ZoneModalContainer = styled.div`
  
  padding-top: 0px;
  width: 50%;
  height: 50%
  min-width: 50px;
  min-height: 50px;
  h4 {
    color: ${ props => props.theme.textColorHl };
  }
`

class ShowNewZoneModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            showZoneModal :true,
            new_zone_name : '',
            zone_type: '',
            comment:''

        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        console.log('---',e.target.id,e.target.value,this.state);
        this.setState({ ...this.state, [e.target.id]: e.target.value });
    };

    fetchFalcorDeps(){
        return this.props.falcor.get(['forms','zones','meta'])
            .then(response =>{
                return response
            })
    }

    render(){
        return(
        <ElementBox>
            <div className="form-group">
                <div className="col-sm-12">
                    <div className="col-sm-12">
                        <div className="form-group"><h6>Name Your Zone</h6>
                            <input id='new_zone_name' className="form-control"
                                   placeholder="Name Your Zone"
                                   type="text"
                                   onChange={this.handleChange}
                                   value = {this.state.new_zone_name}
                            /></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><h6>Type</h6>
                            <select className="form-control justify-content-sm-end" id='zone_type' onChange={this.handleChange} value={this.state.zone_type}>
                                <option className="form-control" key={0} value={''}>--No Type Selected--</option>
                                {
                                    this.props.formsZonesMeta.map((meta,i) =>{
                                        return(<option  className="form-control" key={i+1} value={meta.type}>{meta.type}</option>)
                                    })
                                }
                            </select>
                        </div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><h6>Comment</h6>
                            <input id='comment' className="form-control"
                                   placeholder="Comment"
                                   type="text"
                                   onChange={this.handleChange}
                                   value = {this.state.comment}
                            /></div>
                    </div>
                    <div className="col-sm-12">
                        <button
                            className="mr-2 mb-2 btn btn-primary btn-sm"
                            type="button"
                            onClick = {(e) =>{
                                e.persist()
                                let args = [];
                                let attributes = {}
                                let plan_id = this.props.activePlan
                                let geom = result_polygon.geometry
                                let name = this.state.new_zone_name
                                let geoid = this.props.activeGeoid
                                geom['crs'] = {"type": "name", "properties": {"name": "EPSG:4326"}};
                                attributes['geom'] = geom
                                attributes['bbox'] = zone_boundary
                                attributes['name'] = name || 'None'
                                attributes['zone_type'] = this.state.zone_type || 'None'
                                attributes['comment'] = this.state.comment || 'None'
                                attributes['geojson'] = result_polygon
                                attributes['geoid'] = geoid
                                args.push('zones',plan_id,attributes);
                                return falcorGraph.call(['form_zones','insert'], args, [], [])
                                    .then(response =>{
                                        alert("Zone has been saved")
                                        let new_zone = localStorage.getItem("zone") ? JSON.parse(localStorage.getItem("zone")) : ''
                                        new_zone.push({
                                            'zone_id':null,
                                            'name': name || 'None',
                                            'geom':result_polygon,
                                            'bbox':zone_boundary,
                                            'geojson':result_polygon,
                                            'geoid' : geoid
                                        })
                                        localStorage.setItem("zone",JSON.stringify(new_zone))
                                        this.props.layer.doAction([
                                            "deleteDynamicLayer",
                                            "addNewZone"
                                        ])
                                        if(!this.props.layer.map.getLayer("parcels") || !this.props.layer.map.getLayer("ebr") || !this.props.layer.map.getLayer("project") || localStorage.getItem("zone")){
                                            let geoids = JSON.parse("[" + localStorage.getItem("zone") + "]")[0];
                                            let cousubs = [];
                                            geoids.forEach(geoid =>{
                                                if(geoid.geoid && geoid.geoid.length !== 5){
                                                    cousubs.push(geoid.geoid)
                                                }
                                            });
                                            this.props.layer.map.setFilter(
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
                                                this.props.layer.map.getSource("polygon").setData(geojson)
                                            }

                                            this.props.layer.map.fire('draw.delete')
                                            this.props.layer.map.removeControl(draw);
                                            this.props.layer.doAction([
                                                "dismissMessage",
                                                {id:'new_zone_display_message'}
                                            ])
                                            this.props.layer.forceUpdate()
                                            document.getElementById("new_zone_button").disabled = false
                                        }
                                    })
                            }}>
                            Save New Zone
                        </button>
                    </div>

                </div>
            </div>
        </ElementBox>
        )
    }
}

const mapStateToProps = (state, { id }) => ({
    activeGeoid:state.user.activeGeoid,
    activePlan : state.user.activePlan,
    formsZonesMeta : get(state.graph,['forms','zones','meta','value'],[])
});
const mapDispatchToProps = {};
const NewZoneModal = connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(ShowNewZoneModal))
