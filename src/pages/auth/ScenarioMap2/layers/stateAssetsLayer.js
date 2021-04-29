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
    '100 Year': {values: ['AE', 'A', 'AH', 'VE', 'AO'], color: '#ff0031'},
    '500 Year': {values: ['X'], color: '#005eff'},
    none: {values: [null], color: '#242323'}
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
                // map.resize();
                // map.fitBounds(bbox);
                this.layers.forEach(layer => {
                    map.setLayoutProperty(layer.id, 'visibility', "none");
                })
                return this.fetchData().then(data => this.receiveData(this.map, data))

            })

    }

    setAgencyFilter(geos) {
        this.agencyFilter = geos;
        this.fetchData().then(data => this.receiveData(this.map, data))
    }

    setFloodPlainFilter(floodType) {
        this.floodPlainFilter = get(floodZones, [floodType, 'values'], null);
        this.fetchData().then(data => this.receiveData(this.map, data))
    }

    setViewModeFilter(viewMode) {
        this.viewModeFilter = viewMode;
        this.fetchData().then(data => this.receiveData(this.map, data))
    }

    fetchData(graph) {
        if (this.tracts && this.tracts.length < 2 || !store.getState().user.activeGeoid) return Promise.resolve();
        if (!graph) graph = falcorGraph.getCache();

        let countiesOrCousubs = get(graph,
            `geo.${store.getState().user.activeGeoid}.${this.displayFeatures}`,
            null);

        if (!(countiesOrCousubs && countiesOrCousubs.value && countiesOrCousubs.value.length > 0)) return Promise.resolve();

        this.loading = true;
        let agencyList = BuildingByAgency
            .map(bba => bba.name)
            .filter(agency => this.agencyFilter.length ? this.agencyFilter.includes(agency) : true)

        return falcorGraph.get(
            ['building', 'byGeoid', store.getState().user.activeGeoid, 'agency', agencyList, 'length'],
            // ['building', 'byGeoid', store.getState().user.activeGeoid, 'ownerType', '2', 'length']
        ).then(res => {
            let length = get(res, ['json', 'building', 'byGeoid', store.getState().user.activeGeoid, 'agency', agencyList[0], 'length'])
                // lengthOT = get(res, ['json', 'building', 'byGeoid', store.getState().user.activeGeoid, 'ownerType', '2', 'length']);
            let reqs = [],
                chunk = 2000;

            // building.byGeoid[{keys:geoids}].ownerType[{keys:ownerTypes}].byIndex[{integers:indices}]
            if (length > 200) {
                for (let i = 0; i < length; i += chunk) {
                    reqs.push(
                        ['building', 'byGeoid',
                            store.getState().user.activeGeoid,
                            'agency',
                            agencyList,
                            'byIndex', {from: i, to: i + chunk - 1}, ATTRIBUTES]
                    )
                }
            } else {
                reqs.push(['building', 'byGeoid',
                    store.getState().user.activeGeoid,
                    'agency',
                    agencyList,
                    'byIndex', {from: 0, to: length - 1}, ATTRIBUTES])
            }

            // if (lengthOT > chunk) {
            //     for (let i = 0; i < lengthOT; i += chunk) {
            //         reqs.push(
            //             ['building', 'byGeoid', store.getState().user.activeGeoid, 'ownerType', '2', 'byIndex', {
            //                 from: i,
            //                 to: i + chunk - 1
            //             }, ATTRIBUTES]
            //         )
            //     }
            // } else {
            //     reqs.push(['building', 'byGeoid', store.getState().user.activeGeoid, 'ownerType', '2', 'byIndex', {
            //         from: 0,
            //         to: lengthOT - 1
            //     }, ATTRIBUTES])
            // }

            console.time('getting data')
            return reqs.reduce((a, c) => {
                return a.then(() => falcorGraph.get(c))
            }, Promise.resolve())
                .then(finalRes => {
                    console.timeEnd('getting data')
                    let onlyAgency = Object.values(
                        get(store.getState(), ['graph', 'building', 'byGeoid', store.getState().user.activeGeoid, 'agency', agencyList[0], 'byIndex'], {})
                        ).map(v => get(v, ['value', 2], null)).filter(v => v),
                        // onlyOnwerType = Object.values(
                        //     get(store.getState(), ['graph', 'building', 'byGeoid', store.getState().user.activeGeoid, 'ownerType', '2', 'byIndex'], {})
                        // ).map(v => get(v, ['value', 2], null)).filter(v => v),

                        buildingIds = onlyAgency
                            // this.viewModeFilter === 'Only Agency' ? onlyAgency :
                            // this.viewModeFilter === 'Only Owner type' ? onlyOnwerType :
                            //     this.viewModeFilter === 'Both' ? _.intersection(onlyAgency, onlyOnwerType) : _.intersection(onlyAgency, onlyOnwerType)
                    this.buildingIds = buildingIds || [];
                    // this.AgencyAndOwnerType = _.intersection(onlyAgency, onlyOnwerType)
                    this.loading = false
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
            .filter(building =>
                (
                    (!this.agencyFilter.length || (this.agencyFilter.length && this.agencyFilter.includes(get(rawGraph, ['building', 'byId', building.buildingId, 'agency'])))) &&
                    (!this.floodPlainFilter.length || (this.floodPlainFilter && this.floodPlainFilter.length && this.floodPlainFilter.includes(get(rawGraph, ['building', 'byId', building.buildingId, 'flood_zone']))))
                )
            )
            .forEach((building, buildingI) => {
                let flood_zone = Object.keys(floodZones).filter(floodZone => floodZones[floodZone].values.includes(get(rawGraph, ['building', 'byId', building.buildingId, 'flood_zone'])))[0],
                    color = floodZones[flood_zone].color;

                geojson.features.push({
                    "type": "Feature",
                    "properties": {
                        id: buildingI,
                        color: color, // this.AgencyAndOwnerType.includes(building.buildingId) ? '#f50707' : '#f3aa33',
                        ...get(rawGraph, ['building', 'byId', building.buildingId]),
                        flood_zone: flood_zone
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
                    'circle-opacity': 0.7,
                    'circle-radius': 5,
                    'circle-stroke-width': 3,
                    'circle-stroke-color': '#ffffff'
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
        this.loading = false;
    }

    toggleVisibilityOn() {
        this.loading = true;
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
                // let initalBbox =
                //     get(graph, `geo.${store.getState().user.activeGeoid}.boundingBox.value`, null)
                //         .slice(4, -1).split(",");
                //let bbox = initalBbox ? [initalBbox[0].split(" "), initalBbox[1].split(" ")] : null;
                //this.map.resize();
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
                this.loading = false
                if(store.getState().user.activeGeoid.length === 2){
                    this.forceUpdate();
                }else{
                    return this.fetchData(graph).then(data => this.receiveData(this.map, data)).then(() => this.loading = false)
                }
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
        this.loading = false

    }
}

export const StateAssetsOptions = (options = {}) => {
// const tractLayer = new TractLayer("Assets Layer",
    return {
        name: 'State Assets',
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
        floodPlainFilter: [],
        viewModeFilter: 'Agency',
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