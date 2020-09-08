import React from "react"
import store from "store"
import MapLayer from "components/AvlMap/MapLayer"
import { fnum } from "utils/sheldusUtils"
import get from 'lodash.get'
import _ from 'lodash'
import {falcorChunkerNice, falcorGraph} from "store/falcorGraph"
import COLOR_RANGES from "constants/color-ranges"
import {unregister} from "../../../../components/AvlMap/ReduxMiddleware";
import {EARLIEST_YEAR, LATEST_YEAR} from "../components/yearsOfSevereWeatherData";
import hazardIcons from "../../../Public/Hazards/new_components/HazardMeta";
import mapboxgl from "mapbox-gl";
import criticalFacilityMeta from "../../Assets/components/criticalFacilityMeta";
const IDENTITY = i => i;
const getColor = (name) => COLOR_RANGES[5].reduce((a, c) => c.name === name ? c.colors : a).slice();

const hazardMeta = [
    {value: 'wind', name: 'Wind', description: '', sheldus: "Wind", colors: getColor('Greys')},
    {value: 'wildfire', name: 'Wildfire', description: '', sheldus: "Wildfire", colors: getColor('Blues')},
    {value: 'tsunami', name: 'Tsunami/Seiche', description: '', sheldus: "Tsunami/Seiche", colors: getColor('Blues')},
    {value: 'tornado', name: 'Tornado', description: '', sheldus: "Tornado", colors: getColor('Blues')},
    {value: 'riverine', name: 'Flooding', description: '', sheldus: "Flooding", colors: getColor('PuBuGn')},
    {value: 'lightning', name: 'Lightning', description: '', sheldus: "Lightning", colors: getColor('Blues')},
    {value: 'landslide', name: 'Landslide', description: '', sheldus: "Landslide", colors: getColor('Blues')},
    {value: 'icestorm', name: 'Ice Storm', description: '', sheldus: "", colors: getColor('Blues')},
    {
        value: 'hurricane',
        name: 'Hurricane',
        description: '',
        sheldus: "Hurricane/Tropical Storm",
        colors: getColor('Purples')
    },
    {value: 'heatwave', name: 'Heat Wave', description: '', sheldus: "Heat", colors: getColor('Blues')},
    {value: 'hail', name: 'Hail', description: '', sheldus: "Hail", colors: getColor('Blues')},
    {value: 'earthquake', name: 'Earthquake', description: '', sheldus: "Earthquake", colors: getColor('Blues')},
    {value: 'drought', name: 'Drought', description: '', sheldus: "Drought", colors: getColor('Blues')},
    {value: 'avalanche', name: 'Avalanche', description: '', sheldus: "Avalanche", colors: getColor('Blues')},
    {value: 'coldwave', name: 'Coldwave', description: '', colors: getColor('Blues')},
    {value: 'winterweat', name: 'Snow Storm', description: '', sheldus: "Winter Weather", colors: getColor('Blues')},
    {value: 'volcano', name: 'Volcano', description: '', colors: getColor('Blues')},
    {value: 'coastal', name: 'Coastal Hazards', description: '', sheldus: "Coastal Hazards", colors: getColor('Blues')}
];

const ATTRIBUTES = [
    "owner_type",
    "type",
    "name",
    "parcel_id",
    "geoid",
    "cousub_geoid",
    "place_geoid",
    "id",
    "replacement_value",
    "critical",
    "flood_zone",
    "prop_class",
    "flood_velocity",
    "flood_depth",
    "flood_base_elevation",
    'num_units',
    'basement',
    'num_stories',
    'building_type',
    'roof_type',
    'address',
    'num_residents',
    'heat_type',
    'naics_code',
    'census_industry_code',
    'contents_replacement_value',
    'inventory_replacement_value',
    'establishment_revenue',
    'business_hours',
    'seismic_zone',
    'flood_plain',
    'flood_duration',
    'high_wind_speed',
    'soil_type',
    'storage_hazardous_materials',
    'topography',
    'num_occupants',
    'num_vehicles_inhabitants',
    'height',
    'structure_type',
    'bldg_style',
    'sqft_living',
    'nbr_kitchens',
    'nbr_full_baths',
    'nbr_bedrooms',
    'first_floor_elevation',
    'num_employees',
    'owner_type',
    'shelter',
    'building_id'

];

let eventsGeo = {
    type: "FeatureCollection",
    features: []
};
const getPropClassName = (falcorCache, value) =>
    get(falcorCache, ["parcel", "meta", "prop_class", "value"], [])
        .reduce((a, c) => c.value.toString() === value.toString() ? c.name : a, "Unknown")

const getOwnerTypeName = (falcorCache,value) =>
    get(falcorCache, ["parcel", "meta", "owner_type", "value"], [])
        .reduce((a, c) => c.value.toString() === value.toString() ? c.name : a, "Unknown")


export class CriticalInfrastructureLayer extends MapLayer{
    onRemove(map) {
        unregister(this);
    }

    onAdd(map) {
        super.onAdd(map);
        if (!store.getState().user.activeGeoid) return Promise.resolve();

        let activeGeoid = store.getState().user.activeGeoid
        return falcorGraph.get(['geo',activeGeoid,'boundingBox'])
            .then(response =>{
                let initalBbox = response.json.geo[activeGeoid]['boundingBox'].slice(4, -1).split(",");
                let bbox = initalBbox ? [initalBbox[0].split(" "), initalBbox[1].split(" ")] : null;
                map.resize();
                map.fitBounds(bbox);
                this.layers.forEach(layer => {
                    map.setLayoutProperty(layer.id, 'visibility',"none");
                })
                this.fetchData().then(data => this.receiveData(this.map,data))

            })


    }

    fetchData(graph) {
        if (this.tracts && this.tracts.length < 2 || !store.getState().user.activeGeoid) return Promise.resolve();
        if (!store.getState().user.activeGeoid) return Promise.resolve();
        if (!graph) graph = falcorGraph.getCache();
        let countiesOrCousubs = get(graph,
            `geo.${store.getState().user.activeGeoid}.${this.displayFeatures}`,
            null);
        let geoids = get(graph,
            `geo.${store.getState().user.activeGeoid}.cousubs`,
            null);
        if (!(countiesOrCousubs && countiesOrCousubs.value && countiesOrCousubs.value.length > 0)) return Promise.resolve();
        let owner_types = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '-999'] // ['3', '4', '5', '6', '7']
        return falcorGraph.get(
            ['building', 'byGeoid', store.getState().user.activeGeoid, 'flood_zone',
                ['all'], 'owner_type', owner_types, 'critical', ['true']], //, ["id",  "owner_type", "critical", "flood_zone"]
            ['building', 'byGeoid', store.getState().user.activeGeoid, 'shelter'],
            ['building','byGeoid',store.getState().user.activeGeoid,'byRiskZones',store.getState().scenario.activeRiskZoneId,'data'],
            ['geo', countiesOrCousubs.value, 'name']
        ).then(d => {
            let allIds = [],
                data = get(d, `json.building.byGeoid.${store.getState().user.activeGeoid}.flood_zone.all.owner_type`, {}),
                shelterData = get(d, `json.building.byGeoid.${store.getState().user.activeGeoid}.shelter`, [])
                    .map(shelters => shelters.building_id);
            owner_types.map(owner => {
                allIds.push(...get(data, `${owner}.critical.true`)/*, ...get(data, `${owner}.critical.false`)*/)
            });
            allIds = allIds.map(f => f.id);
            allIds.push(...shelterData);
            if (allIds.length === 0) return Promise.resolve();
            return falcorGraph.get(
                ['building', 'geom', 'byBuildingId', allIds, 'centroid'],
                ['building', 'byId', allIds, ATTRIBUTES]
            )//.then(d => console.log('centroid res', d))
        })
    }
    setGeoFilter(geos){
        this.geoFilter = geos;
        this.receiveData(this.map)
    }
    receiveData(map, data) {
        let rawGraph = falcorGraph.getCache(),
            graph = get(rawGraph, `building.byGeoid.${store.getState().user.activeGeoid}.flood_zone.all.owner_type`, null),
            shelterGraph = get(rawGraph, `building.byGeoid.${store.getState().user.activeGeoid}.shelter.value`, []),
            centroidGraph = get(rawGraph, `building.geom.byBuildingId`, null),
            critical = [],
            buildingColors = {};
        let geojson = {
            "type": "FeatureCollection",
            "features": []
        };
        if (!graph || !shelterGraph) return Promise.resolve();
        this.criticalCodes = {}
        Object.keys(graph)
            .forEach(owner_type => {
                let allBuildings = get(graph[owner_type], `critical`);

                allBuildings.true.value
                    .map(f => f.id)
                    .filter(buildingId =>
                        this.geoFilter.length ?
                            this.geoFilter.includes(get(rawGraph, ['building', 'byId', buildingId, 'geoid'], null)) ||
                            this.geoFilter.includes(get(rawGraph, ['building', 'byId', buildingId, 'cousub_geoid'], null)) ||
                            this.geoFilter.includes(get(rawGraph, ['building', 'byId', buildingId, 'place_geoid'], null)) : true
                    )
                    .forEach(buildingId => {
                        let criticalCode =  get(rawGraph, ['building', 'byId', buildingId, 'critical'], null)

                        if (criticalCode && this.criticalCodes[criticalCode]){
                            this.criticalCodes[criticalCode] += 1
                        }else if(criticalCode && !this.criticalCodes[criticalCode]){
                            this.criticalCodes[criticalCode] = 1
                        }

                        critical.push(buildingId);
                        buildingColors[buildingId] = '#fbff00';
                        geojson.features.push({
                            "type": "Feature",
                            "properties":{id:buildingId, color:'#fbff00', critical: criticalFacilityMeta[criticalCode]},
                            "geometry": {...get(centroidGraph, `${buildingId}.centroid.value`, null)}
                        })
                    });

            });

        shelterGraph
            .forEach(shelter => {
                buildingColors[shelter.building_id] = '#ffffff';
                geojson.features.push({
                    "type": "Feature",
                    "properties":{id:shelter.building_id, color:'#ffffff', type: 'shelter',
                    ...Object.keys(get(rawGraph, ['building', 'byId', shelter.building_id], {}))
                        .filter(k => get(rawGraph, ['building', 'byId', shelter.building_id, k], null))
                        .reduce((a,k) => {
                            a[k] = get(rawGraph, ['building', 'byId', shelter.building_id, k], null);
                            a[k] = k === 'geoid' ? get(rawGraph, `geo.${a[k].slice(0,5)}.name`, '') :
                                k === 'cousub_geoid' ? get(rawGraph, `geo.${a[k]}.name`, '') : a[k]

                            return a;
                        }, {})
                    },
                    "geometry": {...get(centroidGraph, `${shelter.building_id}.centroid.value`, null)}
                })
            });
        this.markers.forEach(m => m.remove())
        geojson.features.forEach(marker => {
            // add icon
            let el = document.createElement('div');
            el.className = 'icon-w'
            el.style.backgroundColor = marker.properties.color
            el.style.color = '#ccc'
            el.style.borderRadius = '50%'
            let el2 = document.createElement('div');
            el2.className = marker.properties.type === 'critical' ? 'os-icon os-icon-alert-circle' : 'os-icon os-icon-home'
            el.appendChild(el2)

            this.markers.push(
                new mapboxgl.Marker(el)
                    .setLngLat(marker.geometry.coordinates)
                    .addTo(this.map)
            )
        })
        if(map.getSource('buildingsCritical')) {
            map.removeLayer('buildingsCritical-layer');
            map.removeSource('buildingsCritical');
        }else{
            map.addSource('buildingsCritical', {
                type: 'geojson',
                data: geojson
            });
            map.addLayer({
                'id': 'buildingsCritical-layer',
                'source': 'buildingsCritical',
                'type': 'circle',
                'paint': {
                    'circle-color': ["get", ["to-string", ["get", "id"]], ["literal", buildingColors]],
                    'circle-opacity': 0,
                    'circle-radius': 10,
                }
            })
        }
    }

    toggleVisibilityOn() {
        this.layers.forEach(layer => {
            this.map.setLayoutProperty(layer.id, 'visibility',  "visible");
        })

        // get data and paint map
        return falcorGraph.get(
            ['geo', store.getState().user.activeGeoid, 'tracts'],
            ['geo', store.getState().user.activeGeoid, 'counties'],
            ['geo', store.getState().user.activeGeoid, 'cousubs'],
            ["geo", [store.getState().user.activeGeoid], "boundingBox"]
        )
            .then(d => {
                let graph = d.json;
                let countiesOrCousubs = get(graph,
                    `geo.${store.getState().user.activeGeoid}.${this.displayFeatures}]`,
                    null);
                if (countiesOrCousubs && countiesOrCousubs.value && countiesOrCousubs.value.length > 0) {
                    return falcorGraph.get(
                        ['geo', countiesOrCousubs.value, 'tracts']
                    )
                }
                return d
            })
            .then(data => {
                // set map bounds
                let graph = falcorGraph.getCache();
                let initalBbox =
                    get(graph, `geo.${store.getState().user.activeGeoid}.boundingBox.value`, null)
                        .slice(4, -1).split(",");
                let bbox = initalBbox ? [initalBbox[0].split(" "), initalBbox[1].split(" ")] : null;
                this.map.resize();
                this.map.fitBounds(bbox);

                // get tracts
                let tracts = get(graph,
                    `geo.${store.getState().user.activeGeoid}.tracts]`,
                    null);
                if (tracts && tracts.value) {
                    this.tracts = tracts.value;
                    // show tracts
                    this.map.setFilter('tracts-layer-critical', ['all', ['in', 'geoid', ...tracts.value]]);
                }

                // show cousubs or counties
                let countiesOrCousubs = get(graph,
                    `geo.${store.getState().user.activeGeoid}.${this.displayFeatures}`,
                    null);
                if (countiesOrCousubs && countiesOrCousubs.value && countiesOrCousubs.value.length > 0) {
                    this.map.setFilter('tracts-layer-line-critical', ['all', ['in', 'geoid', ...countiesOrCousubs.value]])
                }

                // get data and paint map
                return this.fetchData(graph).then(data => this.receiveData(this.map, data))
            })

    }
    toggleVisibilityOff(){
        this.markers.forEach(m => m.remove())
        this.layers.forEach(layer => {
            this.map.setLayoutProperty(layer.id, 'visibility',"none");
        })
        if(this.map.getSource('buildingsCritical')) {
            this.map.removeLayer('buildingsCritical-layer');
            this.map.removeSource('buildingsCritical');
        }
    }
}

export const CriticalInfrastructureOptions =  (options = {}) => {
// const tractLayer = new TractLayer("Assets Layer",
    return {
        name: 'Assets',
        active: true,
        sources: [
            {
                id: "tracts",
                source: {
                    'type': "vector",
                    'url': 'mapbox://am3081.92hcxki8'
                }
            },
            {
                id: "cousubs",
                source: {
                    'type': "vector",
                    'url': 'mapbox://am3081.dlnvkxdi'
                }
            },
            {
                id: "counties",
                source: {
                    'type': "vector",
                    'url': 'mapbox://am3081.1ggw4eku'
                }
            },
        ],
        layers: [
            {
                'id': 'tracts-layer-critical',
                'source': 'tracts',
                'source-layer': 'tracts',
                'type': 'fill',
                'paint': {
                    'fill-color': 'rgba(9, 98, 186, 0.0)',
                    'fill-opacity': 0.0
                }
            },
            {
                'id': 'tracts-layer-line-critical',
                'source': get(store.getState(), `user.activeGeoid.length`, null) === 2 ? 'counties' : 'cousubs',
                'source-layer': get(store.getState(), `user.activeGeoid.length`, null) === 2 ? 'counties' : 'cousubs',
                'type': 'fill',
                'paint': {
                    'fill-color': 'rgba(0,0,0,0)',
                    'fill-outline-color': '#000'
                }
            },
        ],
        displayFeatures: get(store.getState(), `user.activeGeoid.length`, null) === 2 ? 'counties' : 'cousubs',
        markers: [],
        criticalCodes: {},
        geoFilter: [],
        filters: {
            hazard: {
                name: "hazard",
                type: "hidden",
                domain: hazardMeta,
                value: "hurricane"
            }
        },

        popover: {
            layers: ['buildingsCritical-layer'],
            dataFunc: function(topFeature, features) {
                const { id } = topFeature.properties;
                let result = [];
                let data = [];
                return falcorGraph.get(['building', 'byId', id, ['address', 'owner_type', 'prop_class']])
                    .then(buildingRes => {
                        const scenario_graph = get(falcorGraph.getCache(), ["building", "byGeoid",store.getState().user.activeGeoid,'byRiskZones',store.getState().scenario.activeRiskZoneId,'data'], {}),
                            attributes = [
                                [null, ["address"]],
                                ["Owner Type", ["owner_type"],d => getOwnerTypeName(falcorGraph.getCache(), d)],
                                ["Land Use", ["prop_class"], d => getPropClassName(falcorGraph.getCache(), d)],
                                ["500 year Loss Value",null],
                                ["100 year Loss Value",null],
                                ["50 year Loss Value",null],
                                ["25 year Loss Value",null],
                                ["500 year Building Depth",null],
                                ["100 year Building Depth",null],
                                ["50 year Building Depth",null],
                                ["25 year Building Depth",null],
                                ["Expected Annual Flood Loss",['hazard_loss_dollars']]

                            ];
                        scenario_graph.value.forEach(building =>{
                            if(building.building_id.toString() === id.toString()){
                                data = attributes.reduce((a, [name, key, format = IDENTITY]) => {
                                    const data = get(building, key, false);
                                    let result = {}
                                    if (data && (name === null)) {
                                        a.push(format(data));
                                    }
                                    if(name !== null && name.includes('500 year') && key === null){
                                        result = scenario_graph.value.find(obj => {
                                            return obj.building_id.toString()=== id.toString() && obj.annual_occurance === '0.2'
                                        });
                                        if(result && Object.keys(result).length > 0){
                                            a.push(["500 year Loss Value",result['hazard_loss_dollars']])
                                            a.push(["500 year Building Depth",result["risk_value"] + "ft"])
                                        }

                                    }
                                    if(name !== null && name.includes('100 year') && key === null){
                                        result = scenario_graph.value.find(obj => {
                                            return obj.building_id.toString()=== id.toString() && obj.annual_occurance === '1'
                                        });
                                        if(result && Object.keys(result).length > 0) {
                                            a.push(["100 year Loss Value", result['hazard_loss_dollars']])
                                            a.push(["100 year Building Depth", result["risk_value"] + "ft"])
                                        }
                                    }
                                    if(name !== null && name.includes('50 year') && key === null){
                                        result = scenario_graph.value.find(obj => {
                                            return obj.building_id.toString()=== id.toString() && obj.annual_occurance === '2'
                                        });
                                        if(result && Object.keys(result).length > 0) {
                                            a.push(["50 year Loss Value", result['hazard_loss_dollars']])
                                            a.push(["50 year Building Depth", result["risk_value"] + "ft"])
                                        }
                                    }
                                    if(name !== null && name.includes('25 year') && key === null){
                                        result = scenario_graph.value.find(obj => {
                                            return obj.building_id.toString()=== id.toString() && obj.annual_occurance === '4'
                                        });
                                        if(result && Object.keys(result).length > 0) {
                                            a.push(["25 year Loss Value", result['hazard_loss_dollars']])
                                            a.push(["25 year Building Depth", result["risk_value"] + "ft"])
                                        }
                                    }if(data && (name !== null)){
                                        a.push([name, format(data)]);
                                    }
                                    return _.uniqWith(a,_.isEqual);
                                }, [])

                            }
                        });
                        if (data.length) {
                            let value_500 = '',
                                value_100 = '',
                                value_50='',
                                value_25= '';
                            data.push(["Building ID", id]);
                            data.forEach(d =>{
                                if(d[0] === '500 year Loss Value'){
                                    value_500 = d[1]
                                    d[1] = fnum(d[1])
                                }if(d[0] === '100 year Loss Value'){
                                    value_100 = d[1]
                                    d[1] = fnum(d[1])
                                }if(d[0] === '50 year Loss Value'){
                                    value_50 = d[1]
                                    d[1] = fnum(d[1])
                                }if(d[0] === '25 year Loss Value'){
                                    value_25 = d[1]
                                    d[1] = fnum(d[1])
                                }if(d[0] === 'Expected Annual Flood Loss'){
                                    d[1] = fnum(
                                        (
                                            (parseFloat(value_500) * (0.2/100)) || '0'
                                            + (parseFloat(value_100) * (1/100)) || '0'
                                            + (parseFloat(value_50) * (2/100)) || '0'
                                            + (parseFloat(value_25) * (4/100)) || '0').toString()
                                    )

                                }
                            });
                            return [...data,
                                ...Object.keys(get(topFeature, `properties`, {}))
                                    .filter(k => !["id", "color"].includes(k))
                                    .map(k => [k.split('_').join(' '), get(topFeature, `properties.${k}`, null)])];
                        }else{
                            buildingRes = get(buildingRes, ['json', 'building', 'byId', id], null)

                            return [
                                ...data,
                                [null, buildingRes.address],
                                ["Owner Type", getOwnerTypeName(falcorGraph.getCache(), buildingRes.owner_type)],
                                ["Land Use", getPropClassName(falcorGraph.getCache(), buildingRes.prop_class)],
                                ...Object.keys(get(topFeature, `properties`, {}))
                                    .filter(k => !["id", "color"].includes(k))
                                    .map(k => [k.split('_').join(' '), get(topFeature, `properties.${k}`, null)])
                            ]
                        }
                    })
            },
        },

    }}