import React from "react"
import * as d3scale from "d3-scale"
import store from "store"
import MapLayer from "components/AvlMap/MapLayer"
import get from 'lodash.get'
import {falcorGraph} from "store/falcorGraph"

import COLOR_RANGES from "constants/color-ranges"
import { fnum } from "utils/sheldusUtils"
import _ from "lodash";
import hazardcolors from "constants/hazardColors";

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
    receiveProps(oldProps, newProps){
        if (this.filters.hazard.value !== newProps.hazard) this.filters.hazard.value = newProps.hazard
    }
    onPropsChange(oldProps, newProps){
        if (this.filters.hazard.value !== newProps.hazard) this.filters.hazard.value = newProps.hazard
        this.doAction(["fetchLayerData"]);
    }
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
                let graph = falcorGraph.getCache()
                // set map bounds
                let initalBbox =
                    get(graph, `geo.${store.getState().user.activeGeoid}.boundingBox.value`, null)
                        .slice(4,-1).split(",");
                let bbox = initalBbox ? [initalBbox[0].split(" "),initalBbox[1].split(" ")] : null;
                map.resize();
                map.fitBounds(bbox, {maxDuration: 0});

                // get tracts
                let tracts = get(graph,
                    `geo.${store.getState().user.activeGeoid}.tracts]`,
                    null);
                if (tracts && tracts.value){
                    this.tracts = tracts.value;
                    // show tracts
                    map.setFilter('tracts-layer', ['all', ['in', 'geoid', ...tracts.value]]);
                }

                // show cousubs or counties
                if (get(store.getState(), `user.activeGeoid.length`, null) === 2){
                    let counties = get(graph,
                        `geo.${store.getState().user.activeGeoid}.counties`,
                        null);
                    if (counties && counties.value && counties.value.length > 0){
                        map.setFilter('tracts-layer-line', ['all', ['in', 'geoid', ...counties.value]])
                    }
                }else{
                    let cousubs = get(graph,
                        `geo.${store.getState().user.activeGeoid}.cousubs`,
                        null);
                    if (cousubs && cousubs.value && cousubs.value.length > 0){
                        map.setFilter('tracts-layer-line', ['all', ['in', 'geoid', ...cousubs.value]])
                    }
                }

                // get data and paint map
                this.fetchData(graph).then(data => this.receiveData(map, data))
            })

    }

    fetchData(graph) {
        // console.log('in ffd: analysis');
        if (!graph) graph = falcorGraph.getCache();
        if (this.tracts.length < 2 || !store.getState().user.activeGeoid) return Promise.resolve({route: []});
        let countiesOrCousubs = get(graph,
            `geo.${store.getState().user.activeGeoid}.${this.displayFeatures}]`,
            null);

        if (!(countiesOrCousubs && countiesOrCousubs.value && countiesOrCousubs.value.length > 0)) return Promise.resolve()

        if (this.displayFeatures === 'counties'){
            return falcorGraph.get(
                ['geo', [...countiesOrCousubs.value,...this.tracts], 'name'],
                ['severeWeather', [...countiesOrCousubs.value,...this.tracts], this.filters.hazard.value, 'tract_totals', 'total_damage']
            ).then(d => {
                this.data = _.mapValues(get(d,
                    `json.severeWeather`,
                    0), `${this.filters.hazard.value}.tract_totals.total_damage`);
                return d
            })
        }else {
            return falcorGraph.get(
                ['geo', [...countiesOrCousubs.value,...this.tracts], 'name'],
                ['severeWeather', this.tracts, this.filters.hazard.value, 'tract_totals', 'total_damage'])
                .then(fullData => {
                    this.data = {};
                    graph = falcorGraph.getCache();
                    let countiesOrCousubs = get(graph,
                        `geo.${store.getState().user.activeGeoid}.${this.displayFeatures}]`,
                        null);
                    if (countiesOrCousubs && countiesOrCousubs.value && countiesOrCousubs.value.length > 0){
                        countiesOrCousubs.value.forEach(c => {
                            let subTracts = get(graph,
                                `geo.${c}.tracts.value`,
                                []);
                            // console.log('analysis: for', c)
                            this.data[c] = subTracts.reduce((a, current) => {
                                let currVal = get(graph,
                                    `severeWeather.${current}.${this.filters.hazard.value}.tract_totals.total_damage`,
                                    0)
                                this.data[current] = currVal;
                                return a + currVal;
                            }, 0)
                        })
                    }
                    return Promise.resolve()
                })

        }

    }

    receiveData(map, data) {
        // console.log('in recData: analysis')
        let keyDomain = this.data;
        let maxDamage = Math.max(...Object.keys(keyDomain)
            .filter(f => f.length === 11)
            .map(f => keyDomain[f]));
        let domain = [0,1,2,3,4].map(i => ((maxDamage)*(i/4)));
        domain = [10000,100000,1e6,1e7,1e8]
        // console.log('keyDomain', keyDomain);
        let range = hazardcolors[this.filters.hazard.value + '_range'];
        // console.log('range',maxDamage, range, domain);


        let colorScale = d3scale.scaleThreshold()
            .domain(domain)
            .range(range);

        let testScale = d3scale.scaleThreshold()
            .domain(domain)
            .range([1,2,3,4,5]);

        this.legend.domain = domain;
        this.legend.range = range;
        this.legend.title = `${hazardMeta.filter(f => f.value === this.filters.hazard.value)[0].name} Loss`.toUpperCase()
        this.legend.active = true;
        let mapColors = Object.keys(keyDomain).reduce((out, curr) => {
            if (keyDomain[curr]) {
                // console.log('testing', curr, keyDomain[curr],colorScale(keyDomain[curr]) )
                out[curr] = colorScale(keyDomain[curr]);
            }
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
            1
        );
        map.setPaintProperty(
            'tracts-layer',
            'fill-outline-color',
            'rgba(9, 98, 186, 0.5)'
        );

    }

    formatName(name, geoid){
        let jurisdiction = geoid.length === 2 ? 'State' :
            geoid.length === 5 ? 'County' :
                geoid.length === 10 ? 'Town' :
                    geoid.length === 11 ? 'Tract' : '';
        if (name.toLowerCase().includes(jurisdiction.toLowerCase())){
            name = name.replace(jurisdiction.toLowerCase(), ' (' + jurisdiction + ')')
        }else{
            name  += ' (' + jurisdiction + ')';
        }

        return name
    }
}

const tractLayer = new TractLayer("Analysis Layer", {
    name: 'Analysis',
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
                        'fill-color': 'rgba(255,255,255,0)',
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
            value: "hurricane",
            onChange: (map, layer, value) => this.fetchData()
        }
    },
     legend: {
        active: false,

        type: "threshold",

        types: ["threshold", "linear", "quantile", "quantize"],

        domain: [1.1, 1.25, 1.5, 1.75, 2],
        range: [],

        title: ``,
        format: fnum,
        vertical: false
    },
    popover: {
        layers: ['tracts-layer-line', 'tracts-layer'],
        dataFunc: (feature, features, layer, map, e) =>
            {
                let cache = falcorGraph.getCache();
                let allFeats = map.queryRenderedFeatures(e.point, { layers: ['tracts-layer-line', 'tracts-layer'] });
                let cousubs = allFeats.filter(f => f.layer.id === 'tracts-layer-line');
                let tracts = allFeats.filter(f => f.layer.id === 'tracts-layer');

                return [
                    tractLayer.formatName(get(cache, `geo.${cousubs[0].properties.geoid}.name`, 0), cousubs[0].properties.geoid),
                    ["Tract", get(cache, `geo.${tracts[0].properties.geoid}.name`, 0)],
                    ["Damage", fnum(get(tractLayer, `data.${cousubs[0].properties.geoid}`, 0))],
                ];

            }
    }
});

export default tractLayer

