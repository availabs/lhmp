import React from "react"
import * as d3scale from "d3-scale"
import store from "store"
import MapLayer from "components/AvlMap/MapLayer"
import get from 'lodash.get'
import {falcorChunkerNiceWithUpdate, falcorGraph} from "store/falcorGraph"
import * as turf from '@turf/turf'
import COLOR_RANGES from "constants/color-ranges"

const getColor = (name) => COLOR_RANGES[9].reduce((a, c) => c.name === name ? c.colors : a).slice();

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


class TractLayer extends MapLayer {

    onAdd(map) {
        super.onAdd(map);
        if (!store.getState().user.activeGeoid) return Promise.resolve();
        return falcorGraph.get(
            ['geo', store.getState().user.activeGeoid, 'tracts'],
            ['geo', store.getState().user.activeGeoid, this.displayFeatures],
            ["geo", [store.getState().user.activeGeoid], ["boundingBox", 'geom']]
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
                let graph = falcorGraph.getCache()
                // set map bounds
                let initalBbox =
                    get(graph, `geo.${store.getState().user.activeGeoid}.boundingBox.value`, null)
                        .slice(4, -1).split(",");
                let bbox = initalBbox ? [initalBbox[0].split(" "), initalBbox[1].split(" ")] : null;
                let bounds = get(graph, `geo.${store.getState().user.activeGeoid}.geom.value`, null);
                if (bounds) bounds = JSON.parse(bounds);
                map.resize();
                map.fitBounds(bbox);
                // filter out everything outside of the bounds
                map.addSource('mask', {
                    "type": "geojson",
                    "data": this.polyMask(bounds, [...bbox[0], ...bbox[1]])
                });

                map.addLayer({
                    "id": "zmask",
                    "source": "mask",
                    "type": "fill",
                    "paint": {
                        "fill-color": this.backgroundColor,
                        'fill-opacity': 0.999
                    }
                });
                // get tracts
                let tracts = get(graph,
                    `geo.${store.getState().user.activeGeoid}.tracts`,
                    null);
                if (tracts && tracts.value) {
                    this.tracts = tracts.value;
                    // show tracts
                    map.setFilter('tracts-layer', ['all', ['in', 'geoid', ...tracts.value]]);
                }

                // show cousubs or counties
                if (get(store.getState(), `user.activeGeoid.length`, null) === 2) {
                    let counties = get(graph,
                        `geo.${store.getState().user.activeGeoid}.counties`,
                        null);
                    if (counties && counties.value && counties.value.length > 0) {
                        map.setFilter('tracts-layer-line', ['all', ['in', 'geoid', ...counties.value]])
                    }
                } else {
                    let cousubs = get(graph,
                        `geo.${store.getState().user.activeGeoid}.cousubs`,
                        null);
                    if (cousubs && cousubs.value && cousubs.value.length > 0) {
                        map.setFilter('tracts-layer-line', ['all', ['in', 'geoid', ...cousubs.value]])
                    }
                }

                // get data and paint map
                this.fetchData(graph).then(data => this.receiveData(map, data))
            })

    }

    fetchData(graph) {
        if (!graph) graph = falcorGraph.getCache()
        let geos = get(graph,
            `geo.${store.getState().user.activeGeoid}.${this.displayFeatures}`,
            null);

        if (!(geos && geos.value && geos.value.length > 0)) return Promise.resolve();

        return falcorChunkerNiceWithUpdate(['acs', geos.value, ['2017'], ['B01003_001E']])
            .then(d => falcorChunkerNiceWithUpdate(['geo', geos.value, 'name']))
            .then(fullData => {
                return Promise.resolve()
            })
    }

    receiveData(map, data) {
        let graph = falcorGraph.getCache();
        data = graph.acs;
        let keyDomain = Object.keys(data).filter(d => d != '$__path').reduce((out, curr) => {
            let allTracts = get(graph,
                `geo.${curr}.tracts`,
                null);
            if (allTracts && allTracts.value && allTracts.value.length > 0) {
                allTracts.value.forEach(t => out[t] = data[curr][2017]['B01003_001E'])
            }
            out[curr] = data[curr][2017]['B01003_001E'];
            return out;
        }, {});
        // console.log('keyDomain', keyDomain);
        let range = getColor('Blues');
        let colorScale = d3scale.scaleThreshold()
            .domain([1000, 3000, 6000, 8000, 10000, 50000, 100000, 500000, 1000000])
            .range(range);

        let mapColors = Object.keys(keyDomain).reduce((out, curr) => {
            out[curr] = colorScale(keyDomain[curr]);
            return out;
        }, {});
        // console.log('mapColors', mapColors);
        map.setPaintProperty(
            'tracts-layer',
            'fill-color',
            ["get", ["to-string", ["get", "geoid"]], ["literal", mapColors]]
        );

        map.setPaintProperty(
            'tracts-layer',
            'fill-opacity',
            0
        );
        map.setPaintProperty(
            'tracts-layer',
            'fill-outline-color',
            'rgba(9, 98, 186, 0.5)'
        );

    }

    polyMask(mask, bounds) {
        /*let bboxPoly = turf.bboxPolygon(bounds);
        return turf.difference(bboxPoly, mask);*/
        return turf.mask(mask)
    }
}

const tractLayer = new TractLayer("Local Context Layer", {
    name: 'Local Context',
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
        }
    ],
    layers: [
        {
            'id': 'tracts-layer',
            'source': 'tracts',
            'source-layer': 'tracts',
            'type': 'fill',
            'paint': {
                'fill-color': 'rgba(9, 98, 186, 0)',
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
   
    onHover: {
        layers: ['tracts-layer-line'],
        dataFunc: (feature) => {
            tractLayer.map.setPaintProperty(
                'tracts-layer-line',
                'fill-outline-color',
                ["case",
                    ["==", ['get', 'geoid'], feature[0].properties.geoid],
                    '#ff1200',
                    'rgba(0,0,0,0.3)'
                ]
            );

            tractLayer.map.on('mouseleave', 'tracts-layer-line', () => {
                tractLayer.map.setPaintProperty(
                    'tracts-layer-line',
                    'fill-outline-color',
                    ["case",
                        ["==", ['get', 'geoid'], feature[0].properties.geoid],
                        '#000',
                        '#000'
                    ]
                );
            })
        }
    },
    popover: {
        layers: ['tracts-layer-line'],
        dataFunc: feature => {
            let graph = falcorGraph.getCache()
            return ["tract",
                ["Name", get(graph, `geo.${feature.properties.geoid}.name`, 0)],
                ["Population", get(graph,
                    `acs.${feature.properties.geoid}.2017.B01003_001E`,
                    0)],
            ]
        }
    }
});

export default tractLayer