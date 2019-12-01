import React from "react"
import store from "store"
import MapLayer from "components/AvlMap/MapLayer"
import get from 'lodash.get'
import {falcorGraph} from "store/falcorGraph"
import COLOR_RANGES from "constants/color-ranges"
import {falcorChunkerNiceWithUpdate} from "../../../../../../store/falcorGraph";
import {update} from "utils/redux-falcor/components/duck"

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
                let graph = falcorGraph.getCache()
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
                let graph = falcorGraph.getCache()
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
                this.fetchData(graph).then(data => this.receiveData(map, data))
            })

    }

    fetchData(graph) {
        console.log('in ffd: haz loss');
        if (this.tracts.length < 2 || !store.getState().user.activeGeoid) return Promise.resolve();
        if (!store.getState().user.activeGeoid) return Promise.resolve();
        if (!graph) graph = falcorGraph.getCache()
        let countiesOrCousubs = get(graph,
            `geo.${store.getState().user.activeGeoid}.${this.displayFeatures}`,
            null);
        let geoids = get(graph,
            `geo.${store.getState().user.activeGeoid}.cousubs`,
            null);
        if (!(countiesOrCousubs && countiesOrCousubs.value && countiesOrCousubs.value.length > 0)) return Promise.resolve();
        return falcorGraph.get(
            ['geo', countiesOrCousubs.value, 'name'],
            ["building", "byGeoid", geoids.value, "length"]
        )
            .then(res => {
                return geoids.value.map(geoid => {
                    const length = res.json.building.byGeoid[geoid].length;
                    return ["building", "byGeoid", geoid, "byIndex", {
                        from: 0,
                        to: length - 1
                    }, ["id",  "owner_type", "critical", "flood_zone"]]
                });
            })
            .then(requests => {
                console.log('about to chnk', requests)
                return requests.reduce((a,c) => a.then(() => falcorChunkerNiceWithUpdate(c)), Promise.resolve())
                /*    .then(res => {
                        console.log('chnked', res, falcorGraph.getCache())
                        const buildingids = [],
                            graph = get(res.payload, ["building", "byId"], {});
                        console.log('graph', graph)
                        geoids.value.forEach(geoid => {
                            const byIndex = get(graph, [geoid, "byIndex"], {});
                            console.log('byIndex', byIndex)
                            Object.values(byIndex).forEach(({ id }) => {
                                if (id) {
                                    buildingids.push(id)
                                }
                            })
                        })
                        // console.log('buildingids', buildingids)
                        return buildingids;
                    })*/
            })
            /*.then(buildingids => {
                console.log('buildingIds', buildingids)
                if (!buildingids.length) return;
                return falcorChunkerNiceWithUpdate(["building", "byId", buildingids, ["owner_type", "critical", "flood_zone"]])
            })
            .then(() => store.dispatch(update(falcorGraph.getCache())))*/


    }

    receiveData(map, data) {
        console.log('in rec data')
        let graph = falcorGraph.getCache(),
            countyOwned = [],
            municipalityOwned = [],
            critical = [],
            buildingColors = {};
        console.log(graph)
        if (!graph.building || !graph.building.byId) return Promise.resolve();

        console.log('before loop')
        Object.keys(graph.building.byId)
            .filter(buildingId => ['AE','A','AH','VE','AO'].includes(graph.building.byId[buildingId].flood_zone))
            .forEach(buildingId => {
                let building = graph.building.byId[buildingId];
                if (['3'].includes(building.owner_type)){
                    countyOwned.push(buildingId)
                    buildingColors[buildingId] = '#0fcc1b'
                }else if (['4','5','6','7'].includes(building.owner_type)){
                    municipalityOwned.push(buildingId)
                    buildingColors[buildingId] = '#0d1acc'

                }

                if (building.critical){
                    critical.push(buildingId)
                    buildingColors[buildingId] = '#cc1e0a'

                }
            });

        console.log(countyOwned, municipalityOwned, critical)

        map.setPaintProperty(
            'tracts-layer',
            'fill-opacity',
            0.7
        );
        map.setPaintProperty(
            'tracts-layer',
            'fill-outline-color',
            'rgba(9, 98, 186, 0.5)'
        );
        map.setFilter("ebr-line", ["in", "id",
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
        )
        map.setPaintProperty(
            'ebr-line',
            'line-color',
            ["get", ["to-string", ["get", "id"]], ["literal", buildingColors]]
        )

    }
}

const tractLayer = new TractLayer("Hazard Loss Layer", {
    name: 'Hazard Loss',
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
        { id: "nys_buildings_avail",
            source: {
                'type': "vector",
                'url': 'mapbox://am3081.dpm2lod3'
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
                'fill-color': 'rgba(9, 98, 186, 0.2)',
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
        { 'id': 'ebr',
            'source': 'nys_buildings_avail',
            'source-layer': 'nys_buildings_osm_ms_parcelid_pk',
            'type': 'fill',
            'paint': {
                'fill-color': '#000000'
            }

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
        }
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
        layers: ['ebr'],
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