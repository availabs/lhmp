import React from "react"
import * as d3scale from "d3-scale"
import store from "store"
import MapLayer from "components/AvlMap/MapLayer"
import get from 'lodash.get'
import {falcorChunkerNice, falcorGraph} from "store/falcorGraph"
import * as turf from '@turf/turf'
import COLOR_RANGES from "constants/color-ranges"
import hazardcolors from "constants/hazardColors";
import {EARLIEST_YEAR, LATEST_YEAR} from "../components/yearsOfSevereWeatherData";

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
    paintEvents(map) {
        const events = falcorGraph.getCache().severeWeather.events.borked; //[geoid][hazard][year]["property_damage"].value;
        eventsGeo = {
            type: "FeatureCollection",
            features: []
        };
        //console.log('events borked',events)
        if (events) {
            let radiusScale = d3scale.scaleThreshold()
                .domain(
                    get(store.getState(), `user.activeGeoid.length`, null) === 2 ?
                    [500, 1000, 5000, 10000, 20000, 50000, 70000, 100000, 150000, 200000, 250000, 300000] :
                    [1000, 3000, 5000, 10000, 15000, 20000, 25000, 50000, 100000, 200000]
                )
                .range(
                    get(store.getState(), `user.activeGeoid.length`, null) === 2 ?
                    [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6] :
                    [0.1, 0.2, 0.4, 0.6, 0.8, 1, 1.2, 1.4, 1.8, 2, 2.2]
                );
            Object.keys(events).forEach(geo => {
                Object.keys(events[geo])
                    .filter(f => this.filters.hazard.value && this.filters.hazard.value.includes(f))
                    .forEach(haz => {
                    Object.keys(events[geo][haz]).forEach(year => {
                        if (events[geo][haz][year].property_damage.value && events[geo][haz][year].property_damage.value.length > 0) {
                            events[geo][haz][year].property_damage.value.forEach(data => {
                                if (JSON.parse(data.geom)) {
                                    let circle = turf.circle(JSON.parse(data.geom).coordinates, radiusScale(data.property_damage));
                                    circle.properties.hazard = data.hazardid;
                                    circle.properties.property_damage = data.property_damage;

                                    eventsGeo.features.push(circle)
                                }
                            });
                        }
                    })
                })
            })
        }
        let colors = [
            'match',
            ['get', 'hazard']
        ];
        hazardMeta.forEach(h => {
            colors.push(h.value);
            colors.push(hazardcolors[h.value]);
        });
        colors.push('#000');
        if (map.getSource('events')){
            console.log('gets source', map.getSource('events'))
            map.removeLayer('events-layer')
            map.removeSource('events')
        }

        if (!map.getSource('events')){
            map.addSource("events", {
                'type': 'geojson',
                'data': eventsGeo
            });
            map.addLayer(
                {
                    id: 'events-layer',
                    type: 'fill',
                    source: 'events',
                    "paint": {
                        "fill-color": colors,
                        "fill-opacity": 0.5
                    },
                }
            );
        }

    }

    receiveProps(oldProps, newProps){
        if (this.filters.hazard.value !== newProps.hazard)
            this.filters.hazard.value = newProps.hazard ?
                newProps.hazard : newProps.hazards ? newProps.hazards : null
    }
    onPropsChange(oldProps, newProps){
        if (this.filters.hazard.value !== newProps.hazard)
            this.filters.hazard.value = newProps.hazard ?
                newProps.hazard : newProps.hazards ? newProps.hazards : null
        this.doAction(["fetchLayerData"]);
    }
    onAdd(map) {
        super.onAdd(map);
        if (!store.getState().user.activeGeoid) return Promise.resolve();

        return falcorGraph.get(
            ['geo', store.getState().user.activeGeoid, 'tracts'],
            ['geo', store.getState().user.activeGeoid, this.displayFeatures],
            ["geo", [store.getState().user.activeGeoid], "boundingBox"]
        )
            .then(d => {
                let countiesOrCousubs = get(falcorGraph.getCache(),
                    `geo.${store.getState().user.activeGeoid}.${this.displayFeatures}]`,
                    null);
                if (countiesOrCousubs && countiesOrCousubs.value && countiesOrCousubs.value.length > 0) {
                    return falcorGraph.get(
                        ['geo', countiesOrCousubs.value, 'tracts']
                    )
                }
                return d
            })
            .then(d => {
                let requests = [],
                    yearsPerRequest = 3,
                graph = falcorGraph.getCache();
                // get tracts
                let tracts = get(graph,
                    `geo.${store.getState().user.activeGeoid}.${this.displayFeatures}`,
                    null);
                if (tracts && tracts.value) {
                    for (let i = LATEST_YEAR; i >= EARLIEST_YEAR; i -= yearsPerRequest) {
                        requests.push(['severeWeather', 'events', 'borked', tracts.value,
                            hazardMeta.map(f => f.value),
                            {from: Math.max(i - yearsPerRequest + 1, EARLIEST_YEAR), to: i},
                            'property_damage'])
                    }

                    return requests.reduce((a, c) =>
                            a.then(() => falcorChunkerNice(c, {chunckSize: 5}))
                        , Promise.resolve());
                }
                return d;

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
                    `geo.${store.getState().user.activeGeoid}.tracts`,
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
        if (this.tracts.length < 2 || !store.getState().user.activeGeoid) return Promise.resolve({route: []});
        if (!graph) graph = falcorGraph.getCache();
        let countiesOrCousubs = get(graph,
            `geo.${store.getState().user.activeGeoid}.${this.displayFeatures}]`,
            null);

        if (!(countiesOrCousubs && countiesOrCousubs.value && countiesOrCousubs.value.length > 0)) return Promise.resolve();

        if (this.displayFeatures === 'counties') {
            return falcorGraph.get(
                ['geo', countiesOrCousubs.value, 'name'],
                // ['severeWeather', [...countiesOrCousubs.value,...this.tracts], this.filters.hazard.value, 'tract_totals', 'total_damage']
            )
        } else {
            return falcorChunkerNice(
                ['geo', countiesOrCousubs.value, 'name'],
                // ['severeWeather', this.tracts, this.filters.hazard.value, 'tract_totals', 'total_damage']
            )
        }

    }

    receiveData(map, data) {
        this.paintEvents(map)
    }
}

const tractLayer = new TractLayer("Hazard Events Layer", {
    name: 'Hazard Events',
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
                'fill-outline-color': 'rgba(9, 98, 186, 0.5)'
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
            value: ["hurricane"]
        }
    },
    popover: {
        layers: ['tracts-layer-line', 'events-layer'],
        dataFunc: feature => {
            return feature.layer.id === 'tracts-layer-line' ?
                ["tract",
                    ["Name", get(falcorGraph.getCache(), `geo.${feature.properties.geoid}.name`, 0)]
                ] :
                ['Event',
                    ['Type', get(feature, `properties.hazard`, null)],
                    ['Damage', get(feature, `properties.property_damage`, null)]
                ]

        }
    }
});

export default tractLayer