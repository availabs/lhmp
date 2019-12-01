import React from "react"
import * as d3scale from "d3-scale"
import store from "store"
import MapLayer from "components/AvlMap/MapLayer"
import get from 'lodash.get'
import _ from 'lodash'
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

    onAdd(map) {
        super.onAdd(map);
        if (!store.getState().user.activeGeoid) return Promise.resolve();

        return falcorGraph.get(
            ['geo', store.getState().user.activeGeoid, 'tracts'],
            ['geo', store.getState().user.activeGeoid, this.displayFeatures],
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
        // console.log('in ffd: haz loss');
        if (this.tracts.length < 2 || !store.getState().user.activeGeoid) return Promise.resolve();
        if (!graph) graph = falcorGraph.getCache()
        let countiesOrCousubs = get(graph,
            `geo.${store.getState().user.activeGeoid}.${this.displayFeatures}]`,
            null);
        if (!(countiesOrCousubs && countiesOrCousubs.value && countiesOrCousubs.value.length > 0)) return Promise.resolve();

        return falcorGraph.get(
            ['geo', countiesOrCousubs.value, 'name'],
            ['severeWeather',
                this.displayFeatures === 'counties' ?
                    [...countiesOrCousubs.value, ...this.tracts] : this.tracts, [...hazardMeta.map(f => f.value), 'total'], 'tract_totals', 'total_damage']
        )


    }

    receiveData(map, data) {
        // console.log('in recData: haz loss', this.displayFeatures);
        let graph = falcorGraph.getCache();

        let countiesOrCousubs = get(graph,
            `geo.${store.getState().user.activeGeoid}.${this.displayFeatures}]`,
            null);
        let keyDomain = {};
        if (!(countiesOrCousubs && countiesOrCousubs.value && countiesOrCousubs.value.length > 0)) return Promise.resolve();
        this.data = {};

        if (this.displayFeatures === 'counties') {
            let currVal = _.mapValues(get(graph,
                `severeWeather`,
                0), 'total.tract_totals.total_damage');
            this.data = currVal;
            keyDomain = currVal
        } else {
            countiesOrCousubs.value.forEach(c => {
                // console.log('hazard loss: for', c);
                let subTracts = get(graph,
                    `geo.${c}.tracts.value`,
                    0);
                let total = subTracts.reduce((a, current) => {
                    let currVal = get(graph,
                        `severeWeather.${current}.total.tract_totals.total_damage`,
                        0);
                    this.data[current] = currVal;
                    keyDomain[current] = currVal;
                    return a + currVal;
                }, 0);
                this.data[c] = total;
                keyDomain[c] = total
            });
        }


        //let keyDomain = _.mapValues(this.data, 'total_damage');
        let maxDamage = Math.max(...Object.keys(keyDomain)
            .filter(f => f.length === 11)
            .map(f => keyDomain[f]));
        let domain = [0, 1, 2, 3, 4].map(i => ((maxDamage) * (i / 4)));

        // console.log('keyDomain', keyDomain);
        let range = hazardMeta.filter(d => d.value === this.filters.hazard.value)[0].colors;
        // console.log('range', maxDamage, range, domain);

        let colorScale = d3scale.scaleThreshold()
            .domain(domain)
            .range(range);

        let mapColors = Object.keys(keyDomain).reduce((out, curr) => {
            if (keyDomain[curr]) out[curr] = colorScale(keyDomain[curr]);
            return out;
        }, {});
        // console.log('map colors', mapColors);
        map.setPaintProperty(
            'tracts-layer',
            'fill-color',
            ["get", ["to-string", ["get", "geoid"]], ["literal", mapColors]]
        );

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
        layers: ['tracts-layer-line', 'events-layer'],
        dataFunc: feature => {
            return feature.layer.id === 'tracts-layer-line' ?
                ["tract",
                    ["Name", get(falcorGraph.getCache(), `geo.${feature.properties.geoid}.name`, 0)],
                    ["Damage", get(tractLayer, `data.${feature.properties.geoid}`, 0)
                    ],
                ] :
                ['Event',
                    ['Type', get(feature, `properties.hazard`, null)],
                    ['Damage', get(feature, `properties.property_damage`, null)]
                ]

        }
    }
});

export default tractLayer