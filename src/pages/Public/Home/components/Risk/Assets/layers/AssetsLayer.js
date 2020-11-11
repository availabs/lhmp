import React from "react"
import store from "store"
import MapLayer from "components/AvlMap/MapLayer"
import { fnum } from "utils/sheldusUtils"
import get from 'lodash.get'
import {falcorGraph} from "store/falcorGraph"
import COLOR_RANGES from "constants/color-ranges"
import mapboxgl from "mapbox-gl";

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

class TractLayer extends MapLayer {

    onAdd(map) {
        super.onAdd(map);
        if (!store.getState().user.activeGeoid) return Promise.resolve();

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
                map.resize();
                map.fitBounds(bbox);

                // get tracts
                let tracts = get(graph,
                    `geo.${store.getState().user.activeGeoid}.tracts]`,
                    null);
                if (tracts && tracts.value) {
                    this.tracts = tracts.value;
                    // show tracts
                    map.setFilter('tracts-layer', ['all', ['in', 'geoid', ...tracts.value]]);
                }

                // show cousubs or counties
                let countiesOrCousubs = get(graph,
                    `geo.${store.getState().user.activeGeoid}.${this.displayFeatures}`,
                    null);
                if (countiesOrCousubs && countiesOrCousubs.value && countiesOrCousubs.value.length > 0) {
                    map.setFilter('tracts-layer-line', ['all', ['in', 'geoid', ...countiesOrCousubs.value]])
                }

                // get data and paint map
                return this.fetchData(graph).then(data => this.receiveData(map, data))
            })

    }

    fetchData(graph) {
        if (this.tracts.length < 2 || !store.getState().user.activeGeoid) return Promise.resolve();
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
                ['all'], 'owner_type', owner_types, 'critical', ['true']] //, ["id",  "owner_type", "critical", "flood_zone"]
        ).then(d => {
            let allIds = [],
                data = get(d, `json.building.byGeoid.${store.getState().user.activeGeoid}.flood_zone.all.owner_type`, {});

            owner_types.map(owner => {
                allIds.push(...get(data, `${owner}.critical.true`)/*, ...get(data, `${owner}.critical.false`)*/)
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
            graph = get(rawGraph, `building.byGeoid.${store.getState().user.activeGeoid}.flood_zone.all.owner_type`, null),
            centroidGraph = get(rawGraph, `building.geom.byBuildingId`, null),
            countyOwned = [],
            municipalityOwned = [],
            critical = [],
            buildingColors = {};
        let geojson = {
            "type": "FeatureCollection",
            "features": []
        };

        if (!graph) return Promise.resolve();
        if (this.markers.length){
            this.markers.map(m => {
                m.remove()
            });
        }

        Object.keys(graph)
            .forEach(owner_type => {
                let allBuildings = get(graph[owner_type], `critical`);
                console.log('??', allBuildings)
                /*if (owner_type === '3') {
                    [...allBuildings.true.value.map(f => f.id), ...allBuildings.false.value.map(f => f.id)]
                        .forEach(buildingId => {
                            countyOwned.push(buildingId);
                            buildingColors[buildingId] = '#0fcc1b';
                            geojson.features.push({
                                "type": "Feature",
                                "properties":{id:buildingId, color:'#0fcc1b'},
                                "geometry": {...get(centroidGraph, `${buildingId}.centroid.value`, null)}
                            })
                        })
                } else if (['4', '5', '6', '7'].includes(owner_type)) {
                    [...allBuildings.true.value.map(f => f.id), ...allBuildings.false.value.map(f => f.id)]
                        .forEach(buildingId => {
                            municipalityOwned.push(buildingId);
                            buildingColors[buildingId] = '#0d1acc';
                            geojson.features.push({
                                "type": "Feature",
                                "properties":{id:buildingId, color:'#0d1acc'},
                                "geometry": {...get(centroidGraph, `${buildingId}.centroid.value`, null)}
                            })
                        })

                }*/

                allBuildings.true.value
                    .map(f => f.id)
                    .forEach(buildingId => {
                        critical.push(buildingId);
                        buildingColors[buildingId] = '#cc1e0a';
                        geojson.features.push({
                            "type": "Feature",
                            "properties":{id:buildingId, color:'#cc1e0a'},
                            "geometry": {...get(centroidGraph, `${buildingId}.centroid.value`, null)}
                        })
                        this.markers.push(
                         new mapboxgl.Marker({
                            draggable: false
                        })
                            .setLngLat(get(centroidGraph, `${buildingId}.centroid.value.coordinates`, null))
                            .addTo(this.map)
                        )

                    });

            });
        /*this.legend.domain = ['County', 'Municipality', 'Critical'];
        this.legend.range = ['#0fcc1b', '#0d1acc', '#cc1e0a'];
        this.legend.title = `Buildings`.toUpperCase()
        this.legend.active = true;*/
        if(map.getSource('buildings')) {
            map.removeSource('buildings');
            map.removeLayer('buildings-layer');
        }
        map.addSource('buildings', {
            type: 'geojson',
            data: geojson
        });
        map.addLayer({
            'id': 'buildings-layer',
            'source': 'buildings',
            'type': 'circle',
            'paint': {
                'circle-color': ["get", ["to-string", ["get", "id"]], ["literal", buildingColors]],
                'circle-opacity': 0.5,
                'circle-radius': 5, 
            }
        })

        /*        map.setFilter("ebr-line", ["in", "id",
                    ...countyOwned.map(id => +id),
                    ...municipalityOwned.map(id => +id),
                    ...critical.map(id => +id)]);
                map.setFilter("ebr", ["in", "id",
                    ...countyOwned.map(id => +id),
                    ...municipalityOwned.map(id => +id),
                    ...critical.map(id => +id)]);*/

        /*        map.setPaintProperty(
                    'ebr',
                    'fill-color',
                    ["get", ["to-string", ["get", "id"]], ["literal", buildingColors]]
                )
                map.setPaintProperty(
                    'ebr-line',
                    'line-color',
                    ["get", ["to-string", ["get", "id"]], ["literal", buildingColors]]
                )*/
    }
}

const tractLayer = new TractLayer("Assets Layer", {
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
        /*        { id: "nys_buildings_avail",
                    source: {
                        'type': "vector",
                        'url': 'mapbox://am3081.dpm2lod3'
                    }
                }*/
    ],
    layers: [
        {
            'id': 'tracts-layer',
            'source': 'tracts',
            'source-layer': 'tracts',
            'type': 'fill',
            'paint': {
                'fill-color': 'rgba(9, 98, 186, 0.0)',
                'fill-opacity': 0.0
            }
        },
        {
            'id': 'tracts-layer-line',
            'source': get(store.getState(), `user.activeGeoid.length`, null) === 2 ? 'counties' : 'cousubs',
            'source-layer': get(store.getState(), `user.activeGeoid.length`, null) === 2 ? 'counties' : 'cousubs',
            'type': 'fill',
            'paint': {
                'fill-color': 'rgba(0,0,0,0)',
                'fill-outline-color': '#000'
            }
        },
        /*{ 'id': 'ebr',
            'source': 'nys_buildings_avail',
            'source-layer': 'nys_buildings_osm_ms_parcelid_pk',
            'type': 'fill',
            'paint': {
                'fill-color': '#000000'
            },
            filter: ["in", "id", "none"]

        },
        { id: "ebr-line",
            'source': 'nys_buildings_avail',
            'source-layer': 'nys_buildings_osm_ms_parcelid_pk',
            'type': 'line',
            'paint': {
                'line-color': '#6baed6',
                'line-width': 3,
                'line-offset': -1
            },
            filter: ["in", "id", "none"]
        }*/
    ],
    markers: [],
    displayFeatures: get(store.getState(), `user.activeGeoid.length`, null) === 2 ? 'counties' : 'cousubs',
/*    legend: {
        active: false,

        type: "ordinal",

        types: ["threshold", "linear", "quantile", "quantize"],

        domain: [],
        range: [],
        title: ``,
        format: fnum,
        vertical: true
    },*/
    filters: {
        hazard: {
            name: "hazard",
            type: "hidden",
            domain: hazardMeta,
            value: "hurricane"
        }
    },
    popover: {
        layers: ['buildings-layer'],
        dataFunc: feature => {
            return feature.layer.id === 'tracts-layer-line' ?
                ["tract",
                    ["Name", get(falcorGraph.getCache(), `geo.${feature.properties.geoid}.name`, 0)],
                    ["Damage", get(tractLayer, `data.${feature.properties.geoid}`, 0)
                    ],
                ] :
                ['Building',
                    ['id', get(feature, `properties.id`, null)],
                ]

        }
    }
});

export default tractLayer