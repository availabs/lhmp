import React from "react"
import store from "store"
import MapLayer from "components/AvlMap/MapLayer"
import { fnum } from "utils/sheldusUtils"
import get from 'lodash.get'
import {falcorChunkerNice, falcorGraph} from "store/falcorGraph"
import COLOR_RANGES from "constants/color-ranges"
import {unregister} from "../../../../components/AvlMap/ReduxMiddleware";
import {EARLIEST_YEAR, LATEST_YEAR} from "../components/yearsOfSevereWeatherData";

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

let eventsGeo = {
    type: "FeatureCollection",
    features: []
};

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
        return falcorGraph.get(
            ['building', 'byGeoid', store.getState().user.activeGeoid, 'flood_zone',
                ['flood_100'], 'owner_type', ['3', '4', '5', '6', '7'], 'critical', ['true', 'false']] //, ["id",  "owner_type", "critical", "flood_zone"]
        ).then(d => {
            let allIds = [],
                data = get(d, `json.building.byGeoid.${store.getState().user.activeGeoid}.flood_zone.flood_100.owner_type`, {});

            ['3', '4', '5', '6', '7'].map(owner => {
                allIds.push(...get(data, `${owner}.critical.true`), ...get(data, `${owner}.critical.false`))
            });
            allIds = allIds.map(f => f.id);
            if (allIds.length === 0) return Promise.resolve();
            return falcorGraph.get(
                ['building', 'geom', 'byBuildingId', allIds, 'centroid']
            ).then(d => console.log('centroid res', d))
        })
    }

    receiveData(map, data) {
        let rawGraph = falcorGraph.getCache(),
            graph = get(rawGraph, `building.byGeoid.${store.getState().user.activeGeoid}.flood_zone.flood_100.owner_type`, null),
            centroidGraph = get(rawGraph, `building.geom.byBuildingId`, null),
            critical = [],
            buildingColors = {};
        let geojson = {
            "type": "FeatureCollection",
            "features": []
        };
        if (!graph) return Promise.resolve();
        Object.keys(graph)
            .forEach(owner_type => {
                let allBuildings = get(graph[owner_type], `critical`);

                allBuildings.true.value
                    .map(f => f.id)
                    .forEach(buildingId => {
                        critical.push(buildingId);
                        buildingColors[buildingId] = '#FFC300';
                        geojson.features.push({
                            "type": "Feature",
                            "properties":{id:buildingId, color:'#FFC300'},
                            "geometry": {...get(centroidGraph, `${buildingId}.centroid.value`, null)}
                        })
                    });

            });

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
                    'circle-opacity': 1,
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
        this.layers.forEach(layer => {
            this.map.setLayoutProperty(layer.id, 'visibility',"none");
        })
        if(this.map.getSource('buildingsCritical') && this.map.getLayer('buildingsCritical-layer')) {
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
            dataFunc: feature => {
                return feature.layer.id === 'tracts-layer-line' ?
                    ["tract",
                        ["Name", get(falcorGraph.getCache(), `geo.${feature.properties.geoid}.name`, 0)],
                        ["Damage", get(CriticalInfrastructureLayer, `data.${feature.properties.geoid}`, 0)
                        ],
                    ] :
                    ['Building',
                        ['id', get(feature, `properties.id`, null)],
                    ]

            }
        }

}}