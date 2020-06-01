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
import ZoneControls from "../controls/zoneControls";
var _ = require('lodash')
const LEGEND_COLOR_RANGE = getColorRange(7, "YlGn");

const IDENTITY = i => i;

export class CulvertsLayer extends MapLayer{
    onAdd(map) {
        super.onAdd(map);
        let activeGeoid = store.getState().user.activeGeoid
        return falcorGraph.get(['geo',activeGeoid,'boundingBox'])
            .then(response =>{
                let initalBbox = response.json.geo[activeGeoid]['boundingBox'].slice(4, -1).split(",");
                let bbox = initalBbox ? [initalBbox[0].split(" "), initalBbox[1].split(" ")] : null;
                map.resize();
                map.fitBounds(bbox);
                this.fetchData().then(data => this.receiveData(this.map,data))

            })
    }

    fetchData(){
        let activePlan = store.getState().user.activePlan
        return falcorGraph.get(['forms',['culvert'],'byPlanId',activePlan,'length'])
            .then(response =>{
                let length = response.json.forms["culvert"].byPlanId[activePlan].length
                return falcorGraph.get(['forms',['culvert'],'byPlanId',activePlan,'byIndex',[{from:0,to:length-1}],['span_matl_type_code_desc',
                    'span_design_type_code_desc',
                    'built_year',
                    'feature_crossed',
                    'out_to_out_width',
                    'span_length',
                    'structure_length',
                    'inspection_date',
                    'location',
                    'condition_rating']])
                    .then(response =>{
                        return response
                    })
            })
    }

    receiveData(map,data){
        let activePlan = store.getState().user.activePlan
        let culvertsData = get(falcorGraph.getCache(),['forms','byId'],{}),
            geojson = {
            "type": "FeatureCollection",
            "features": []
        },
        culvertsColors = {}
        if(Object.keys(culvertsData).length > 0){
            Object.keys(culvertsData).forEach(item =>{
                culvertsColors[culvertsData[item].value.id] =  "#3AC406"
                //buildingRadius[item.building_id] = 10
                geojson.features.push({
                    "type": "Feature",
                    "properties": {id: culvertsData[item].value.id, color: "#3AC406"},
                    "geometry": get(culvertsData[item],['value','attributes','geometry'],'')
                })
            })
        }
        if(this.map.getSource('culverts') && this.map.getLayer("culverts-layer")) {
            this.map.getSource("culverts").setData(geojson)
        }
        if(this.map.getSource('culverts') && this.map.getLayer("culverts-layer")){
            this.map.setPaintProperty(
                'culverts-layer',
                'circle-color',
                ["get", ["to-string", ["get", "id"]], ["literal", culvertsColors]]
            )
            /*this.map.setPaintProperty(
                'buildings-layer',
                'circle-radius',
                ["get", ["to-string", ["get", "id"]], ["literal", buildingRadius]]
            )*/
        }
    }

    toggleVisibilityOn() {
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


export const CulvertsOptions =  (options = {}) => {
    return {
        active: true,
        ...options,
        sources: [
            {
                id: "counties",
                source: {
                    'type': "vector",
                    'url': 'mapbox://am3081.1ggw4eku'
                }
            },
            { id:"culverts",
                source: {
                    type: "geojson",
                    //generateId: true,
                    data: {
                        type: "FeatureCollection",
                        features: []
                    }
                }
            }
        ],
        layers: [
            {
                'id': 'culverts',
                'source': 'counties',
                'source-layer': 'counties',
                'type': 'line',
                'paint': {
                    'line-color': '#FFFFFF',
                    'line-opacity': 0.5
                },
                filter: ['all', ['in', 'geoid', store.getState().user.activeGeoid]]

            },
            {
                'id': 'culverts-layer',
                'source': 'culverts',
                'type': 'circle',
                'paint': {
                    //'circle-radius': 3,
                    'circle-opacity': 0.5,

                }
            }

        ],
        selectedCulvertId: "none",
        onClick: {
            layers: ["culverts-layer"],
            dataFunc: function(features) {
                const id = features[0].properties.id
                const props = { ...features[0].properties };
                this.selectedCulvertId = props.id.toString();
                this.map && this.render(this.map);

                this.modals.culvert.show
                    ? this.doAction(["updateModal", "culvert", props])
                    : this.doAction(["toggleModal", "culvert", props]);

            }
        },
        modals: {
            culvert: {
                comp: CulvertModal,
                show: false,
                onClose: function() {
                    this.map && this.render(this.map);
                },
                startSize: [400,400],
                position:"relative"
            },

        }
    }


}
class CulvertModalBase extends React.Component {
    state = {
        attributes : ['span_matl_type_code_desc',
            'span_design_type_code_desc',
            'built_year',
            'feature_crossed',
            'out_to_out_width',
            'span_length',
            'structure_length',
            'inspection_date',
            'location',
            'condition_rating']
    }
    fetchFalcorDeps() {

        return this.props.falcor.get(
            ['forms','byId',this.props.id]
        )
            .then(res => {return res})
    }

    render() {
        return (
            <div>
                { this.props.id ?
                    <h4>
                        {this.props.id}
                    </h4>
                    : null
                }
                <div className='table-responsive'>
                    <table className="table">
                        <thead>
                        <tr>
                            <th>ATTRIBUTE</th>
                            <th>VALUE</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            this.props.culvertData ?
                                this.state.attributes
                                    .map((d,i) => {
                                        return (
                                            <tr key={i}>
                                                <td>{d}</td>
                                                <td>{this.props.culvertData[d] || 'None'}</td>
                                            </tr>
                                        )
                                    })
                                :
                                null
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, { id }) =>
    ({
        culvertData: get(state.graph, ['forms','byId',id,'value','attributes'], {}),

    });
const mapDispatchToProps = {

};

const CulvertModal = connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(CulvertModalBase))
