import React from "react"

import store from "store"
import { update } from "utils/redux-falcor/components/duck"
import { falcorGraph, falcorChunkerNice } from "store/falcorGraph"
import { connect } from 'react-redux';
import { reduxFalcor, UPDATE as REDUX_UPDATE } from 'utils/redux-falcor'
import get from "lodash.get"
import styled from "styled-components"
import {
    scaleLinear,
    scaleQuantile,
    scaleQuantize, scaleThreshold
} from "d3-scale"
import { extent } from "d3-array"
import { format as d3format } from "d3-format"
import { fnum } from "utils/sheldusUtils"
import MapLayer from "components/AvlMap/MapLayer.js"
import { getColorRange } from "constants/color-ranges";
import {register, unregister} from "components/AvlMap/ReduxMiddleware";
import COLOR_RANGES from "constants/color-ranges"
import {Link} from "react-router-dom";
import {falcorChunkerNiceWithUpdate} from "../../../../store/falcorGraph";
import scenarioMap2 from "./scenarioMap2";
var _ = require('lodash')
const LEGEND_COLOR_RANGE = getColorRange(8, "YlGn");
const IDENTITY = i => i;

const TABS = [
    { name: "Basic",
        props: [
            "address",
            "name",
            "prop_class",
            "owner_type",
            "replacement_value",
            "critical"
        ] },
    { name: "Occupany",
        props: [
            "num_residents",
            "num_employees",
            "num_occupants",
            "num_vehicles_inhabitants"
        ] },
    { name: "Structural",
        props: [
            "num_units",
            "basement",
            "building_type",
            "roof_type",
            "height",
            "num_stories",
            "structure_type",
            "bldg_style",
            "sqft_living",
            "nbr_kitchens",
            "nbr_full_baths",
            "nbr_bedrooms",
            "first_floor_elevation"
        ] },
    { name: "Services",
        props: [
            "heat_type"
        ] },
    { name: "Commercial",
        props: [
            "replacement_value",
            "naics_code",
            "census_industry_code",
            "contents_replacement_value",
            "inventory_replacement_value",
            "establishment_revenue",
            "business_hours"
        ] },
    { name: "Risk",
        props: [
            "seismic_zone",
            "flood_plain",
            "flood_depth",
            "flood_duration",
            "flood_velocity",
            "high_wind_speed",
            "soil_type",
            "storage_hazardous_materials",
            "topography",
            "expected_annual_flood_loss"
        ] },
    { name: "Actions",
        props: [
            "action_name",
            "action_type"
        ] }
];

export class ScenarioLayer extends MapLayer{
    onAdd(map) {
        register(this, 'USER::SET_RISK_ZONE_ID', ["scenario"]);
        super.onAdd(map);
        if(store.getState().user.activeGeoid){
            let activeGeoid = store.getState().user.activeGeoid
            let graph = '';
            this.map.on('render',()=>{
                const features =  map.querySourceFeatures('nys_buildings_avail', {
                    sourceLayer: 'nys_buildings_osm_ms_parcelid_pk',
                })
                this.selection = features.map(d => d.properties.id);
                this.fetchData().then(data => this.receiveData(map, data))

            })
            return falcorGraph.get(['geo',activeGeoid,'boundingBox'],
                ["parcel", "meta", ["prop_class", "owner_type"]])
                .then(response =>{
                    let initalBbox = response.json.geo[activeGeoid]['boundingBox'].slice(4, -1).split(",");
                    let bbox = initalBbox ? [initalBbox[0].split(" "), initalBbox[1].split(" ")] : null;
                    this.map.resize();
                    this.map.fitBounds(bbox);
                    //map.setZoom(9)

                    return this.fetchData().then(data => this.receiveData(this.map, data))
                })
        }
    }
    onRemove(map) {
        unregister(this);
    }
    receiveMessage(action, data) {
        this.activeScenarioId = data.activeRiskZoneId
        //console.log('this.activeScenarioId',this.activeScenarioId)
        return this.fetchData().then(data => this.receiveData(data,this.map))
    }
    /*
    getBuildingIds() {
        // console.log('in get building ids')
        let geoids = store.getState().user.activeGeoid

        return falcorGraph.get(["building", "byGeoid", geoids, "length"])
            .then(res => {
                const length = res.json.building.byGeoid[geoids].length;
                return falcorChunkerNiceWithUpdate(["building", "byGeoid", geoids, "byIndex", { from: 0, to: length-1}, ["building_id"]])
            }).then(requests => {
                console.log('request',typeof requests,requests.payload)
            })
    }
     */
    fetchData(){
        let owner_types = ['2','3', '4', '5', '6', '7','8'];
        let buildingIds = [];
        /*
        this.getBuildingIds()
            .then(buildingids => {
                //if (!buildingids.length) return;
                buildingids = []
                return falcorChunkerNiceWithUpdate(["building", "byId", buildingids, ["address","owner_type", "prop_class"]])
            })
         */
        return falcorGraph.get(
            ['building', 'byGeoid', store.getState().user.activeGeoid, 'flood_zone',
                ['flood_100','flood_500'], 'owner_type',owner_types, 'critical', ['true', 'false']],
            ['building','byGeoid',store.getState().user.activeGeoid,'byRiskZones','data'],

        ).then(d => {
            let graph = d.json.building.byGeoid[store.getState().user.activeGeoid].flood_zone;
            let filteredBuildings = [];
            let data = {}
            if(graph){
                Object.keys(graph).filter(d => d !== '$__path').forEach(item =>{
                    data[item] = get(d, `json.building.byGeoid.${store.getState().user.activeGeoid}.flood_zone.${item}.owner_type`, {})
                });
                Object.keys(data).forEach(d =>{
                    owner_types.map(owner =>{
                        filteredBuildings.push(...get(data[d], `${owner}.critical.false`))
                    })
                })
            }

            buildingIds = filteredBuildings.map(f => f.id);
            return buildingIds
        }).then(buildingIds =>{
            if(buildingIds){
                return falcorChunkerNice(
                    ['building', 'geom', 'byBuildingId',buildingIds, 'centroid'],
                )

            }
        })
        .then(() =>{
            if (!this.selection || this.selection.length === 0) {
                return Promise.resolve([])
            }else{
                if(this.activeScenarioId !== null){
                    return falcorChunkerNice(
                        ['risk_zones',[this.activeScenarioId],'buildings',this.selection,'total_loss']
                    )
                }

            }

        })

    }

    receiveData(map,data) {
        /*
        owner types :
            2 - state
            3 - county
            4,5,6,7- Municipality
            8 - Private
         */
        let resultedRiskZonesData = [];
        let coloredBuildingIds = [];
        let coloredBuildings = {};
        let riskZonesData = falcorGraph.getCache();

        if(riskZonesData.risk_zones && riskZonesData.risk_zones[this.activeScenarioId] && this.activeScenarioId){
                if(riskZonesData.risk_zones[this.activeScenarioId]){
                    if(Object.keys(riskZonesData.risk_zones[this.activeScenarioId].buildings).length > 0){
                        Object.keys(riskZonesData.risk_zones[this.activeScenarioId].buildings).forEach(building_id =>{
                            if(building_id){
                                resultedRiskZonesData.push({
                                    'id':building_id,
                                    'value':riskZonesData.risk_zones[this.activeScenarioId].buildings[building_id].total_loss.value ? riskZonesData.risk_zones[this.activeScenarioId].buildings[building_id].total_loss.value : 0
                                })
                            }
                        })

                    }

                }
        }
        if(resultedRiskZonesData.length > 0){
            const colorScale = this.getColorScale(resultedRiskZonesData),
                colors = resultedRiskZonesData.reduce((a, c) => {
                    if(c.value.toString() !== '0'){
                        a[c.id] = colorScale(c.value);
                        coloredBuildingIds.push(c.id.toString());
                    }
                return a;
            }, {});
            coloredBuildings = colors
        }



        let rawGraph = falcorGraph.getCache(),
            graph = get(rawGraph, `building.byGeoid.${store.getState().user.activeGeoid}.flood_zone`, null),
            centroidGraph = get(rawGraph, `building.geom.byBuildingId`, null),
            geojson = {
                "type": "FeatureCollection",
                "features": []
            },
            buildingColors = {};
        Object.keys(graph['flood_100'].owner_type).forEach(owner => {

            //state owned
            if (owner === '2') {
                graph['flood_100'].owner_type[owner].critical.false.value.forEach(item => {
                    buildingColors[item.id] = '#0d1acc'
                    geojson.features.push({
                        "type": "Feature",
                        "properties": {id: item.id, color: '#0d1acc'},
                        "geometry": {...get(centroidGraph, `${item.id}.centroid.value`, null)}
                    })
                })
                graph['flood_500'].owner_type[owner].critical.false.value.forEach(item => {
                    buildingColors[item.id] = '#0d1acc'
                    geojson.features.push({
                        "type": "Feature",
                        "properties": {id: item.id, color: '#0d1acc'},
                        "geometry": {...get(centroidGraph, `${item.id}.centroid.value`, null)}
                    })
                })
            }

            // County Owned
            if (owner === '3') {
                graph['flood_100'].owner_type[owner].critical.false.value.forEach(item => {
                    buildingColors[item.id] = '#0fcc1b'
                    geojson.features.push({
                        "type": "Feature",
                        "properties": {id: item.id, color: '#0fcc1b'},
                        "geometry": {...get(centroidGraph, `${item.id}.centroid.value`, null)}
                    })
                })
                graph['flood_500'].owner_type[owner].critical.false.value.forEach(item => {
                    buildingColors[item.id] = '#0fcc1b'
                    geojson.features.push({
                        "type": "Feature",
                        "properties": {id: item.id, color: '#0fcc1b'},
                        "geometry": {...get(centroidGraph, `${item.id}.centroid.value`, null)}
                    })
                })
            }

            // municipality Owned
            if (['4', '5', '6', '7'].includes(owner)) {
                graph['flood_100'].owner_type[owner].critical.false.value.forEach(item => {
                    buildingColors[item.id] = '#cc1e0a'
                    geojson.features.push({
                        "type": "Feature",
                        "properties": {id: item.id, color: '#cc1e0a'},
                        "geometry": {...get(centroidGraph, `${item.id}.centroid.value`, null)}
                    })
                })
                graph['flood_500'].owner_type[owner].critical.false.value.forEach(item => {
                    buildingColors[item.id] = '#cc1e0a'
                    geojson.features.push({
                        "type": "Feature",
                        "properties": {id: item.id, color: '#cc1e0a'},
                        "geometry": {...get(centroidGraph, `${item.id}.centroid.value`, null)}
                    })
                })
            }

            //Private Owned
            if (owner === '8') {
                graph['flood_100'].owner_type[owner].critical.false.value.forEach(item => {
                    buildingColors[item.id] = '#F3EC16'
                    geojson.features.push({
                        "type": "Feature",
                        "properties": {id: item.id, color: '#F3EC16'},
                        "geometry": {...get(centroidGraph, `${item.id}.centroid.value`, null)}
                    })
                })
                graph['flood_500'].owner_type[owner].critical.false.value.forEach(item => {
                    buildingColors[item.id] = '#F3EC16'
                    geojson.features.push({
                        "type": "Feature",
                        "properties": {id: item.id, color: '#F3EC16'},
                        "geometry": {...get(centroidGraph, `${item.id}.centroid.value`, null)}
                    })
                })
            }

        })

        if(this.map.getSource('buildings')) {
            this.map.getSource("buildings").setData(geojson)
        }


        this.map.setPaintProperty(
            'buildings-layer',
            'circle-color',
            ["get", ["to-string", ["get", "id"]], ["literal", buildingColors]]

        )
        if(Object.keys(coloredBuildings).length > 0){
            this.map.setPaintProperty(
                'ebr',
                'fill-color',
                ["get",
                    ["to-string", ["get", "id"]],
                    ["literal",coloredBuildings]
                ],
            )
        }


    }

    getColorScale(data) {
        const { type, range, domain } = this.legend;
        switch (type) {
            case "quantile": {
                const domain = data.map(d => d.value).filter(d => d).sort();
                this.legend.domain = domain;
                return scaleQuantile()
                    .domain(domain)
                    .range(range);
            }
            case "quantize": {
                const domain = extent(data, d => d.value);
                this.legend.domain = domain;
                return scaleQuantize()
                    .domain(domain)
                    .range(range);
            }
            case "threshold": {
                return scaleThreshold()
                    .domain(domain)
                    .range(range)
            }
            case "linear":{
                return scaleLinear()
                    .domain(domain)
                    .range(range)
            }
        }
    }


}


const getPropClassName = (falcorCache, value) =>
    get(falcorCache, ["parcel", "meta", "prop_class", "value"], [])
        .reduce((a, c) => c.value.toString() === value.toString() ? c.name : a, "Unknown")

const getOwnerTypeName = (falcorCache,value) =>
    get(falcorCache, ["parcel", "meta", "owner_type", "value"], [])
        .reduce((a, c) => c.value.toString() === value.toString() ? c.name : a, "Unknown")




export const ScenarioOptions =  (options = {}) => {
    return {
        active: true,
        ...options,
        activeScenarioId: null,
        sources: [
            { id:"buildings",
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
                id:"counties",
                source: {
                    'type':"vector",
                    'url': 'mapbox://am3081.1ggw4eku'
                }
            },
            {
                id:"nys_buildings_avail",
                source: {
                    'type': "vector",
                    'url': 'mapbox://am3081.dpm2lod3'
                }
            },
            {
                id:"nys_1811_parcels",
                source: {
                    'type': "vector",
                    'url': "mapbox://am3081.6o6ny609"
                }
            }
        ],
        layers: [
            {
                'id': 'parcels',
                'source': 'nys_1811_parcels',
                'source-layer': 'nys_1811_parcels',
                'type': 'fill',
                'minzoom': 13,
                'paint': {
                    'fill-opacity':0.1,
                    'fill-outline-color': '#ffffff'
                }

            },
            {
                'id': 'ebr',
                'source': 'nys_buildings_avail',
                'source-layer': 'nys_buildings_osm_ms_parcelid_pk',
                'type': 'fill',
                'minzoom': 13,
                'paint': {
                    'fill-color': '#000000'
                }
            },

            {
                'id': 'buildings-layer',
                'source': 'buildings',
                'type': 'circle',
                'paint': {
                    'circle-radius': 3,
                    'circle-opacity': 0.5
                }
            },


        ],
        legend: {
            title: 'Total Hazard Loss',
            type: "linear",
            types: ["threshold", "quantile", "quantize","linear"],
            vertical: false,
            range: LEGEND_COLOR_RANGE,
            active: true,
            domain: [0,10000,50000,100000, 250000, 500000, 1000000], //10k, 50k, 100k, 250k, 500k, 1m+
            format: fnum
        },
        popover: {
            layers: ["ebr"],
            dataFunc: function(topFeature, features) {
                const { id } = topFeature.properties;
                let result = [];
                let data = [];
                const scenario_graph = get(falcorGraph.getCache(), ["building", "byGeoid",store.getState().user.activeGeoid,'byRiskZones','data'], {}),
                   attributes = [
                        [null, ["address"]],
                        ["Owner Type", ["owner_type"],d => getOwnerTypeName(falcorGraph.getCache(), d)],
                        ["Land Use", ["prop_class"], d => getPropClassName(falcorGraph.getCache(), d)],
                        ["500 year Loss Value",['hazard_loss_dollars']],
                        ["100 year Loss Value",['hazard_loss_dollars']],
                        ["50 year Loss Value",['hazard_loss_dollars']],
                        ["25 year Loss Value",['hazard_loss_dollars']],
                        ["Expected Annual Flood Loss",['hazard_loss_dollars']]
                    ];

                scenario_graph.value.forEach(building =>{
                    if(building.building_id.toString() === id.toString()){
                        data = attributes.reduce((a, [name, key, format = IDENTITY]) => {
                            const data = get(building, key, false);
                            if (data && (name === null)) {
                                a.push(format(data));
                            }
                            if (data && (name !== null)) {
                                a.push([name, format(data)]);
                            }

                            return a;
                        }, [])

                    }
                })
                if (data.length) {
                    data.push(["Building ID", id]);
                    data.forEach(d =>{
                        if(d[0] === '500 year Loss Value'){
                            d[1] = fnum((parseFloat(d[1]) * 0.2/100).toString())
                        }if(d[0] === '100 year Loss Value'){
                            d[1] = fnum((parseFloat(d[1]) * 1/100).toString())
                        }if(d[0] === '50 year Loss Value'){
                            d[1] = fnum((parseFloat(d[1]) * 2/100).toString())
                        }if(d[0] === '25 year Loss Value'){
                            d[1] = fnum((parseFloat(d[1]) * 4/100).toString())
                        }
                    })
                    return data;
                }else{
                    data.push(["Building ID", id]);
                }
                return data;
            },
            minZoom: 13
        },
        selectedBuildingId: "none",
        onClick: {
            layers: ["ebr"],
            dataFunc: function(features) {
                if (!features.length) return;

                const props = { ...features[0].properties };

                this.selectedBuildingId = props.id.toString();
                this.map && this.render(this.map);

                this.modals.building.show
                    ? this.doAction(["updateModal", "building", props])
                    : this.doAction(["toggleModal", "building", props]);
            }
        },
        modals: {
            building: {
                comp: BuildingModal,
                show: false,
                onClose: function() {
                    this.map && this.render(this.map);
                }
            }
        },

    }
};

const BuildingContainer = styled.div`
  color: ${ props => props.theme.textColor };
  padding-top: 15px;
  width: 100%;
  min-width: 500px;

  h4 {
    color: ${ props => props.theme.textColorHl };
  }
`;

const TabSelector = ({ name, isActive, select }) =>
    <StyledTabSelector isActive={ isActive }
                       onClick={ e => select(name) }>
        { name }
    </StyledTabSelector>

const StyledTabSelector = styled.div`
  border-bottom: ${ props => props.isActive ? `2px solid ${ props.theme.textColorHl }` : 'none' };
  color: ${ props => props.isActive ? props.theme.textColorHl : props.theme.textColor };
  width: ${ 100 / TABS.length }%;
  padding: 2px 5px;
  transition: color 0.15s, background-color 0.15s;
  :hover {
    cursor: pointer;
    color: ${ props => props.theme.textColorHl };
    background-color: ${ props => props.theme.panelBackgroundHover };
  }
`;


const TabBase = ({ name, props, data, meta }) => {

    let rows = [];
    let headers = [];
    if (name === 'Actions'){
        data.actionsData
            .map((action,action_i) => {
                let row = props.reduce((a, c) => {
                        const d = get(action, [c], null);
                        if (!headers.includes(formatPropName(c))) headers.push(formatPropName(c))
                        a.push(
                            <td>{ (d !== null) && (d !== 'null') ? formatPropValue(c, d, meta) : "unknown" }</td>
                        )
                        return a;
                    }
                    ,[])
                row.push(
                    <td>
                        <Link
                            className="btn btn-sm btn-primary"
                            to={ `/actions/project/view/${action['id']}` } >
                            View Action
                        </Link>
                    </td>
                )
                rows.push(row)
            })
    }else{
        rows = props.reduce((a, c) => {
            const d = (c === "expected_annual_flood_loss") ?
                get(data, ["riskZone", "riverine", "aal"], null)
                :
                get(data, [c], null);
            a.push(
                <tr key={ c }>
                    <td>{ formatPropName(c) }</td>
                    <td>{ (d !== null) && (d !== 'null') ? formatPropValue(c, d, meta) : "unknown" }</td>
                </tr>
            )
            return a;
        },[])
    }
    return name === 'Actions' ?
        (
            <table className='table table-lightborder'>
                <thead>
                {headers.map(h => <th> {h} </th>)}
                </thead>
                <tbody>
                { rows.map((r,r_i) => <tr key={ r_i }> {r} </tr>) }
                </tbody>
            </table>
        ) : (
            <table>
                <tbody>
                { rows }
                </tbody>
            </table>
        )
};

const formatPropName = prop =>
    prop.split("_")
        .map(string => string[0].toUpperCase() + string.slice(1))
        .map(string => string.replace(/Nbr|Num/, "Number of"))
        .map(string => string.replace("Prop", "Property"))
        .map(string => string.replace("Value", "Cost"))
        .join(" ")
const formatPropValue = (prop, value, meta) => {
    const string = get(meta, [prop, "value"], [])
        .reduce((a, c) => c.value === value ? c.name : a, value);
    if (/value/.test(prop) || /loss/.test(prop)) {
        return d3format("$,d")(string);
    }
    return string;
}

class BuildingModalBase extends React.Component {
    state = {
        tab: TABS[0].name
    }
    fetchFalcorDeps() {

        return this.props.falcor.get(
            ["building", "byId", this.props.id, TABS.filter(tab => tab.name !== 'Actions').reduce((a, c) => [...a, ...c.props], [])],
            ["parcel", "meta", ["prop_class", "owner_type"]],
            ["building","byId", this.props.id, "riskZone", "riverine", "aal"],
            ['actions', 'assets','byId',[this.props.id],['action_name','action_type']]
        )
            .then(res => console.log("RES:" ,res))
    }
    renderTab() {
        const data = TABS.find(t => t.name === this.state.tab);
        let actionsData = this.props.actionsData &&
        this.props.actionsData[this.props.id] &&
        this.props.actionsData[this.props.id].value ?
            this.props.actionsData[this.props.id].value : {}
        return (
            <TabBase { ...data }
                     meta={ this.props.parcelMeta }
                     data={ {...this.props.buildingData, actionsData: actionsData}}/>
        )
    }
    render() {
        const { layer, buildingData } = this.props,
            address = get(buildingData, "address", false),
            name = get(buildingData, "name", false);
        return (
            <BuildingContainer>
                { address || name ?
                    <h4>
                        { address || name }
                    </h4>
                    : null
                }
                <div style={ { width: "100%", display: "flex", padding: "10px 0px" } }>
                    { TABS.map(({ name }) =>
                        <TabSelector name={ name } key={ name }
                                     isActive={ name === this.state.tab }
                                     select={ tab => this.setState({ tab }) }/>
                    )
                    }
                </div>
                { this.renderTab() }
            </BuildingContainer>
        )
    }
}

const mapStateToProps = (state, { id }) =>
    ({
    buildingData: get(state, ["graph", "building", "byId", id], {}),
    parcelMeta: get(state, ["graph", "parcel", "meta"], {}),
    buildingRiskData : get(state,["graph","building","byId"]),
    actionsData : get(state,["graph","actions","assets","byId"]),
    buildingsByIdData : get(state,['graph','building','byGeoid'])
});
const mapDispatchToProps = {};

const BuildingModal = connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(BuildingModalBase))





