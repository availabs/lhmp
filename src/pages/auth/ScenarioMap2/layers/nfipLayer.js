import React from "react"
import store from "store"
import MapLayer from "components/AvlMap/MapLayer"
import get from 'lodash.get'
import _ from 'lodash'
import {falcorGraph} from "store/falcorGraph"
import {unregister} from "../../../../components/AvlMap/ReduxMiddleware";

const IDENTITY = i => i;

const ATTRIBUTES =
    ['address_line_1', 'address_line_2', 'city', 'state', 'zip_code', 'building_value', 'tot_building_payment', 'tot_contents_payment', 'losses', 'total_paid', 'average_pay', 'geom']
const ADDRESS_ATTR = ['address_line_1', 'address_line_2', 'city', 'state', 'zip_code']
let eventsGeo = {
    type: "FeatureCollection",
    features: []
};

export class NfipLayer extends MapLayer {
    onRemove(map) {
        unregister(this);
    }

    onAdd(map) {
        super.onAdd(map);
        if (!store.getState().user.activeGeoid) return Promise.resolve();

        let activeGeoid = store.getState().user.activeGeoid
        return falcorGraph.get(['geo', activeGeoid, 'boundingBox'])
            .then(response => {
                let initalBbox = response.json.geo[activeGeoid]['boundingBox'].slice(4, -1).split(",");
                let bbox = initalBbox ? [initalBbox[0].split(" "), initalBbox[1].split(" ")] : null;
                map.resize();
                map.fitBounds(bbox);
                this.layers.forEach(layer => {
                    map.setLayoutProperty(layer.id, 'visibility', "none");
                })
                this.fetchData().then(data => this.receiveData(this.map, data))

            })


    }

    fetchData(graph) {
        if (this.tracts && this.tracts.length < 2 || !store.getState().user.activeGeoid) return Promise.resolve();

        if (!graph) graph = falcorGraph.getCache();

        let countiesOrCousubs = get(graph,
            `geo.${store.getState().user.activeGeoid}.${this.displayFeatures}`,
            null);

        if (!(countiesOrCousubs && countiesOrCousubs.value && countiesOrCousubs.value.length > 0)) return Promise.resolve();

        return falcorGraph.get(
            ['nfip', 'byGeoid', store.getState().user.activeGeoid, ATTRIBUTES]
        )
    }

    receiveData(map, data) {
        let rawGraph = falcorGraph.getCache(),
            graph = get(rawGraph, ['nfip', 'byGeoid', store.getState().user.activeGeoid, 'value'], null)

        let geojson = {
            "type": "FeatureCollection",
            "features": []
        };

        if (!graph || !graph.length) return Promise.resolve();
        graph
            .forEach((nfipEntry, nfipEntryI) => {
                geojson.features.push({
                    "type": "Feature",
                    "properties": {
                        id: nfipEntryI,
                        color: '#1100ff',
                        address:
                            ADDRESS_ATTR.map((aa) => get(nfipEntry, [aa], null)).filter(aa => aa).join(', '),
                        ...ATTRIBUTES
                            .filter(key => ![...ADDRESS_ATTR, 'geom'].includes(key))
                            .reduce((a, ck) => {
                                a[ck] = nfipEntry[ck]
                                return a
                            }, {})
                    },
                    "geometry": JSON.parse(get(nfipEntry, `geom`, {}))
                })
            });

        if (map.getSource('nfip')) {
            map.removeLayer('nfip-layer');
            map.removeSource('nfip');
        } else {
            map.addSource('nfip', {
                type: 'geojson',
                data: geojson
            });
            map.addLayer({
                'id': 'nfip-layer',
                'source': 'nfip',
                'type': 'circle',
                'paint': {
                    'circle-color': ["get", 'color'],
                    'circle-opacity': 0.5,
                    'circle-radius': 5,
                }
            })
        }
    }

    toggleVisibilityOn() {
        this.layers.forEach(layer => {
            this.map.setLayoutProperty(layer.id, 'visibility', "visible");
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

    toggleVisibilityOff() {
        this.markers.forEach(m => m.remove())
        this.layers.forEach(layer => {
            this.map.setLayoutProperty(layer.id, 'visibility', "none");
        })
        if (this.map.getSource('nfip')) {
            this.map.removeLayer('nfip-layer');
            this.map.removeSource('nfip');
        }
    }
}

export const NfipOptions = (options = {}) => {
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

        popover: {
            layers: ['nfip-layer'],
            dataFunc: function (topFeature, features) {
                const {id} = topFeature.properties;
                let result = [];
                let data = [];

                return [
                    ...Object.keys(get(topFeature, `properties`, {}))
                        .filter(k => !["id", "color"].includes(k))
                        .map(k => [k.split('_').join(' '), get(topFeature, `properties.${k}`, null)])
                ]
            },
        },

    }
}