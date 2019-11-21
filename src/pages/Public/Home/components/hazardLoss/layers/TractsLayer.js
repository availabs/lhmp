import React from "react"
import * as d3scale from "d3-scale"
import store from "store"
import MapLayer from "components/AvlMap/MapLayer"
import get from 'lodash.get'
import {falcorGraph, falcorChunkerNiceWithUpdate} from "store/falcorGraph"

import COLOR_RANGES from "constants/color-ranges"

// import MapLayer from "components/AvlMap/MapLayer"
// import React from "react"
// import styled from 'styled-components';


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


class TractLayer extends MapLayer {

    onAdd(map) {
        super.onAdd(map);
        if (!store.getState().user.activeGeoid) return Promise.resolve();

        return falcorGraph.get(
            ['geo', store.getState().user.activeGeoid, 'tracts'],
            ['geo', store.getState().user.activeGeoid, this.displayFeatures],
            ["geo",[store.getState().user.activeGeoid],"boundingBox"]
        )
            .then(d => {
                let countiesOrCousubs = get(falcorGraph.getCache(),
                    `geo.${store.getState().user.activeGeoid}.${this.displayFeatures}]`,
                    null)
                if (countiesOrCousubs && countiesOrCousubs.value && countiesOrCousubs.value.length > 0){
                    return falcorGraph.get(
                        ['geo', countiesOrCousubs.value, 'tracts']
                    )
                }
                return d
            })
            .then(data => {
                // set map bounds
                let initalBbox =
                    get(falcorGraph.getCache(), `geo.${store.getState().user.activeGeoid}.boundingBox.value`, null)
                        .slice(4,-1).split(",");
                let bbox = initalBbox ? [initalBbox[0].split(" "),initalBbox[1].split(" ")] : null;
                map.resize();
                map.fitBounds(bbox);

                // get tracts
                let tracts = get(falcorGraph.getCache(),
                    `geo.${store.getState().user.activeGeoid}.tracts]`,
                    null);
                if (tracts && tracts.value){
                    this.tracts = tracts.value;
                    // show tracts
                    map.setFilter('tracts-layer', ['all', ['in', 'geoid', ...tracts.value]]);
                }

                // show cousubs or counties
                if (get(store.getState(), `user.activeGeoid.length`, null) === 2){
                    let counties = get(falcorGraph.getCache(),
                        `geo.${store.getState().user.activeGeoid}.counties`,
                        null);
                    if (counties && counties.value && counties.value.length > 0){
                        map.setFilter('tracts-layer-line', ['all', ['in', 'geoid', ...counties.value]])
                    }
                }else{
                    let cousubs = get(falcorGraph.getCache(),
                        `geo.${store.getState().user.activeGeoid}.cousubs`,
                        null);
                    if (cousubs && cousubs.value && cousubs.value.length > 0){
                        map.setFilter('tracts-layer-line', ['all', ['in', 'geoid', ...cousubs.value]])
                    }
                }

                // get data and paint map
                this.fetchData().then(data => this.receiveData(map, data))
            })

    }

    fetchData() {
        if (this.tracts.length < 2 || !store.getState().user.activeGeoid) return Promise.resolve({route: []});
        return falcorChunkerNiceWithUpdate(
            ['severeWeather', [...this.tracts, store.getState().user.activeGeoid], this.filters.hazard.value, 'tract_totals', 'total_damage']
        )
            .then(fullData => {
                let countiesOrCousubs = get(falcorGraph.getCache(),
                    `geo.${store.getState().user.activeGeoid}.${this.displayFeatures}]`,
                    null);
                this.data = {};
                if (countiesOrCousubs && countiesOrCousubs.value && countiesOrCousubs.value.length > 0){

                    countiesOrCousubs.value.forEach(c => {
                        let subTracts = get(falcorGraph.getCache(),
                            `geo.${c}.tracts.value`,
                            0);
                        let total  = subTracts.reduce((a,current) => {
                            return a + get(falcorGraph.getCache(),
                                `severeWeather.${current}.${this.filters.hazard.value}.tract_totals.total_damage`,
                                0);
                        }, 0);
                        this.data[c] = {total_damage: total}
                    })
                }
                return falcorGraph.getCache().severeWeather
            })
    }

    receiveData(map, data) {
        data = falcorGraph.getCache().severeWeather;
        let keyDomain = Object.keys(data).filter(d => d != '$__path').reduce((out, curr) => {
            out[curr] = data[curr][this.filters.hazard.value].tract_totals.total_damage;
            return out;
        }, {});
        console.log('keyDomain', keyDomain);
        let range = hazardMeta.filter(d => d.value === this.filters.hazard.value)[0].colors;
        console.log('range', range);
        let colorScale = d3scale.scaleThreshold()
            .domain([50000, 1000000, 2000000, 4000000, 600000])
            .range(range);

        let mapColors = Object.keys(keyDomain).reduce((out, curr) => {
            out[curr] = colorScale(keyDomain[curr]);
            return out;
        }, {});
        console.log('mapColors', mapColors);
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

const tractLayer = new TractLayer("Tracts Layer", {
    name: 'TL',
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
            'id': 'tracts-layer',
            'source': 'tracts',
            'source-layer': 'tracts',
            'type': 'fill',
            'paint': {
                'fill-color': 'rgba(9, 98, 186, 0.5)',
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
        layers: ['tracts-layer-line'],
        dataFunc: feature =>
        {
            return ["tract",
                ["GeoId", feature.properties.geoid],
                ["Damage", get(tractLayer, `data.${feature.properties.geoid}.total_damage`, 0)],
            ]
        }
    }
});

export default tractLayer