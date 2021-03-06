import React from "react"
import store from "store"
import MapLayer from "components/AvlMap/MapLayer"
import get from 'lodash.get'
import {falcorGraph} from "store/falcorGraph"
import COLOR_RANGES from "constants/color-ranges"

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
    receiveProps(oldProps, newProps){
        if (!this.assetId){
            this.assetId = newProps.assetId;
            this.onAdd(this.map)
        }
        if (this.assetId !== newProps.assetId) this.assetId = newProps.assetId
    }
    onPropsChange(oldProps, newProps){
        if (this.assetId !== newProps.assetId) this.assetId = newProps.assetId
        this.doAction(["fetchLayerData"]);
    }
    onAdd(map) {
        super.onAdd(map);
        if (!store.getState().user.activeGeoid) return Promise.resolve();
        if (!this.assetId) return Promise.resolve()
        return falcorGraph.get(
            ['geo', store.getState().user.activeGeoid, 'tracts'],
            ['geo', store.getState().user.activeGeoid, 'counties'],
            ['geo', store.getState().user.activeGeoid, 'cousubs'],
            ["geo", [store.getState().user.activeGeoid], "boundingBox"],
            ['building', 'geom', 'byBuildingId', this.assetId, 'centroid']
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
                let centroid = get(graph, `building.geom.byBuildingId.${this.assetId}.centroid.value.coordinates`, null);
                let initalBbox =
                    get(graph, `geo.${store.getState().user.activeGeoid}.boundingBox.value`, null)
                        .slice(4, -1).split(",");
                let bbox = initalBbox ? [initalBbox[0].split(" "), initalBbox[1].split(" ")] : null;
                map.resize();
                map.fitBounds(bbox);
                if (centroid){
                    map.flyTo({
                        center: centroid,
                        essential: true // this animation is considered essential with respect to prefers-reduced-motion
                    });
                }

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
        return falcorGraph.get(
            ['building', 'byId', this.assetId, 'geomData',['footprint_id', 'parcel_id']]
        )
        // return Promise.resolve()
    }

    receiveData(map, data) {
        let rawGraph = falcorGraph.getCache(),
            graph = get(rawGraph, `building.byId.${this.assetId}.geomData`, null),
            footprintId = get(graph, `footprint_id`),
            parcelId = get(graph, `parcel_id`);

        if (!graph) return Promise.resolve();

        map.setPaintProperty(
            'ebr-footprints',
            'fill-color',
            ['match',
                ["to-string", ["get", "footprint_id"]],
                footprintId, '#ff2d10',
                '#1aecff'
            ]
        );
        map.setPaintProperty(
            'ebr-parcels',
            'fill-color',
            ['match',
                ["to-string", ["get", "OBJECTID"]],
                parcelId.toString(), 'rgba(170,170,11,0.49)',
                'rgba(0,255,56,0.23)'
            ]
        );
/*        if (map.getSource('buildings')) {
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
        });*/

/*        map.setFilter("ebr-line", ["in", "id",
            ...countyOwned.map(id => +id),
            ...municipalityOwned.map(id => +id),
            ...critical.map(id => +id)]);
        map.setFilter("ebr", ["in", "id",
            ...countyOwned.map(id => +id),
            ...municipalityOwned.map(id => +id),
            ...critical.map(id => +id)]);

        map.setPaintProperty(
            'ebr',
            'fill-color',
            ["get", ["to-string", ["get", "id"]], ["literal", buildingColors]]
        );
        map.setPaintProperty(
            'ebr-line',
            'line-color',
            ["get", ["to-string", ["get", "id"]], ["literal", buildingColors]]
        )*/
    }
}

const assetLayer = new TractLayer("Assets Layer", {
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
        {
            id: "nys_buildings_avail",
            source: {
                'type': "vector",
                'url': 'mapbox://am3081.dpm2lod3'
            }
        },
        {
            id: "nys_buildings_footprints",
            source: {
                'type': "vector",
                'url': 'mapbox://am3081.3h5757tb'
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
/*        {
            'id': 'ebr',
            'source': 'nys_buildings_avail',
            'source-layer': 'nys_buildings_osm_ms_parcelid_pk',
            'type': 'fill',
            'paint': {
                'fill-color': '#ff2f0e'
            },
            filter: ["in", "id", this.assetId]

        },
        {
            id: "ebr-line",
            'source': 'nys_buildings_avail',
            'source-layer': 'nys_buildings_osm_ms_parcelid_pk',
            'type': 'line',
            'paint': {
                'line-color': '#ffffff',
                'line-width': 3,
                'line-offset': -1
            },
            //filter: ["in", "id", "none"]
        },*/
        {
            'id': 'ebr-parcels',
            'source': 'nys_1811_parcels',
            'source-layer': 'nys_1811_parcels',
            'type': 'fill',
            'paint': {
                'fill-color': 'rgba(0,255,56,0.23)'
            },
            //filter: ["in", "id", "none"]
        },
        {
            'id': 'ebr-footprints',
            'source': 'nys_buildings_footprints',
            'source-layer': 'nys_buildings_osm_ms_parcelid',
            'type': 'fill',
            'paint': {
                'fill-color': '#1aff5c'
            },
            //filter: ["in", "id", "none"]
        },
    ],
    displayFeatures: get(store.getState(), `user.activeGeoid.length`, null) === 2 ? 'counties' : 'cousubs',
    assetId: null,
    popover: {
        layers: ['ebr-footprints', 'ebr-parcels'],
        dataFunc: feature => {
            return [] /*feature.layer.id === 'ebr-footprints' ?
                ["Footprint",
                    // ["Name", get(falcorGraph.getCache(), `geo.${feature.properties.geoid}.name`, 0)],
                    // ["Damage", get(assetLayer, `data.${feature.properties.geoid}`, 0)],
                ] :
                ['Parcel',
                   // ['id', get(feature, `properties.id`, null)],
                ]*/

        }
    }
});

export default assetLayer