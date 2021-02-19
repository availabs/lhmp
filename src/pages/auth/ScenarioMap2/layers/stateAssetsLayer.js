import React from "react"
import store from "store"
import MapLayer from "components/AvlMap/MapLayer"
import get from 'lodash.get'
import _ from 'lodash'
import {falcorGraph} from "store/falcorGraph"
import {unregister} from "../../../../components/AvlMap/ReduxMiddleware";
import BuildingByAgency from 'pages/auth/Assets/components/BuildingsByAgencyConfig'

const ATTRIBUTES =
    ['building_id', 'address', 'prop_class', 'owner_type', 'replacement_value', 'agency', 'flood_zone']
const floodZones = {
    '100 Year': ['AE', 'A', 'AH', 'VE', 'AO'],
    '500 Year': ['X'],
    none: [null]
}

export class StateAssetsLayer extends MapLayer {
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

    setAgencyFilter(geos) {
        this.agencyFilter = geos;
        this.fetchData().then(data => this.receiveData(this.map, data))
    }

    setFloodPlainFilter(floodType) {
        this.floodPlainFilter = get(floodZones, [floodType], null);
        this.fetchData().then(data => this.receiveData(this.map, data))
    }

    fetchData(graph) {
        if (this.tracts && this.tracts.length < 2 || !store.getState().user.activeGeoid) return Promise.resolve();

        if (!graph) graph = falcorGraph.getCache();

        let countiesOrCousubs = get(graph,
            `geo.${store.getState().user.activeGeoid}.${this.displayFeatures}`,
            null);

        if (!(countiesOrCousubs && countiesOrCousubs.value && countiesOrCousubs.value.length > 0)) return Promise.resolve();

        let agencyList = BuildingByAgency
            .map(bba => bba.name)
            .filter(agency => this.agencyFilter.length ? this.agencyFilter.includes(agency) : true)

        return falcorGraph.get(
            ['building', 'byGeoid', store.getState().user.activeGeoid, 'agency', agencyList, 'length']
        ).then(res => {
            let length = get(res, ['json', 'building', 'byGeoid', store.getState().user.activeGeoid, 'agency', agencyList[0], 'length'])
            return falcorGraph.get(
                ['building', 'byGeoid',
                    store.getState().user.activeGeoid,
                    'agency',
                    agencyList,
                    'byIndex', {from: 0, to: length - 1}, ATTRIBUTES]
            ).then(finalRes => {

                let buildingIds =
                    Object.values(
                        get(store.getState(), ['graph', 'building', 'byGeoid', store.getState().user.activeGeoid, 'agency', agencyList[0], 'byIndex'], {})
                    )
                        .map(v => get(v, ['value', 2], null))
                        .filter(v => v);
                this.buildingIds = buildingIds || [];

                if (!buildingIds.length) return Promise.resolve();
                return falcorGraph.get(['building', 'geom', 'byBuildingId', buildingIds, 'centroid'])
            })
        })
    }

    receiveData(map, data) {
        if (!this.buildingIds) return Promise.resolve();

        let rawGraph = falcorGraph.getCache(),
            graph =
                this.buildingIds
                    .map(buildingId => ({
                        buildingId,
                        geom: get(rawGraph, ['building', 'geom', 'byBuildingId', buildingId, 'centroid', 'value'],
                            null)
                    }))
                    .filter(f => f.geom);

        let geojson = {
            "type": "FeatureCollection",
            "features": []
        };

        if (!graph || !graph.length) return Promise.resolve();

        graph
            .forEach((building, buildingI) => {
                if (
                    ((this.agencyFilter.length && this.agencyFilter.includes(get(rawGraph, ['building', 'byId', building.buildingId, 'agency']))) || !this.agencyFilter.length) &&
                    ((this.floodPlainFilter && this.floodPlainFilter.length && this.floodPlainFilter.includes(get(rawGraph, ['building', 'byId', building.buildingId, 'flood_zone']))) || !this.floodPlainFilter)
                )

                    geojson.features.push({
                        "type": "Feature",
                        "properties": {
                            id: buildingI,
                            color: '#f3aa33',
                            ...get(rawGraph, ['building', 'byId', building.buildingId]),
                            flood_zone: Object.keys(floodZones).filter(floodZone => floodZones[floodZone].includes(get(rawGraph, ['building', 'byId', building.buildingId, 'flood_zone'])))[0]
                        },
                        "geometry": get(building, `geom`, {})
                    })
            });

        if (map.getSource('agency')) {
            map.removeLayer('agency-layer');
            map.removeSource('agency');

            map.addSource('agency', {
                type: 'geojson',
                data: geojson
            });
            map.addLayer({
                'id': 'agency-layer',
                'source': 'agency',
                'type': 'circle',
                'paint': {
                    'circle-color': ["get", 'color'],
                    'circle-opacity': 0.5,
                    'circle-radius': 5,
                    'circle-stroke-width': 1,
                    'circle-stroke-color': '#ccc'
                }
            })

        } else {
            map.addSource('agency', {
                type: 'geojson',
                data: geojson
            });
            map.addLayer({
                'id': 'agency-layer',
                'source': 'agency',
                'type': 'circle',
                'paint': {
                    'circle-color': ["get", 'color'],
                    'circle-opacity': 0.5,
                    'circle-radius': 5,
                    'circle-stroke-width': 1,
                    'circle-stroke-color': '#ccc'
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
                // this.map.fitBounds(bbox);

                // get tracts
                let tracts = get(graph,
                    `geo.${store.getState().user.activeGeoid}.tracts]`,
                    null);
                if (tracts && tracts.value) {
                    this.tracts = tracts.value;
                    // show tracts
                    this.map.setFilter('tracts-layer-agency', ['all', ['in', 'geoid', ...tracts.value]]);
                }

                // show cousubs or counties
                let countiesOrCousubs = get(graph,
                    `geo.${store.getState().user.activeGeoid}.${this.displayFeatures}`,
                    null);
                if (countiesOrCousubs && countiesOrCousubs.value && countiesOrCousubs.value.length > 0) {
                    this.map.setFilter('tracts-layer-line-agency', ['all', ['in', 'geoid', ...countiesOrCousubs.value]])
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
        if (this.map.getSource('agency')) {
            this.map.removeLayer('agency-layer');
            this.map.removeSource('agency');
        }
    }
}

export const StateAssetsOptions = (options = {}) => {
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
                'id': 'tracts-layer-agency',
                'source': 'tracts',
                'source-layer': 'tracts',
                'type': 'fill',
                'paint': {
                    'fill-color': 'rgba(9, 98, 186, 0.0)',
                    'fill-opacity': 0.0
                }
            },
            {
                'id': 'tracts-layer-line-agency',
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
        agencyFilter: [],

        popover: {
            layers: ['agency-layer'],
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