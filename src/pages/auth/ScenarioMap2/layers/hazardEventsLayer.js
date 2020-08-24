import React from "react"
import * as d3scale from "d3-scale"
import store from "store"
import MapLayer from "components/AvlMap/MapLayer"
import get from 'lodash.get'
import mapboxgl from "mapbox-gl";
import mapbox from "mapbox";
import {falcorChunkerNice, falcorGraph} from "store/falcorGraph"
import * as turf from '@turf/turf'
import COLOR_RANGES from "constants/color-ranges"
import hazardcolors from "constants/hazardColors";
import hazardIcons from 'pages/Public/Hazards/new_components/HazardMeta'
import {EARLIEST_YEAR, LATEST_YEAR} from "../components/yearsOfSevereWeatherData";
import {register, unregister} from "../../../../components/AvlMap/ReduxMiddleware";
import {marker} from "leaflet/dist/leaflet-src.esm";

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

export class HazardEventsLayer extends MapLayer{
// class TractLayer extends MapLayer {


    paintEvents(map) {
        const graph = falcorGraph.getCache();
        const events = get(graph, `severeWeather.events.borked`, null); //[geoid][hazard][year]["property_damage"].value;

        eventsGeo = {
            type: "FeatureCollection",
            features: []
        };

        if (events) {
/*            let radiusScale = d3scale.scaleThreshold()
                .domain(
                    get(store.getState(), `user.activeGeoid.length`, null) === 2 ?
                        [500, 1000, 5000, 10000, 20000, 50000, 70000, 100000, 150000, 200000, 250000, 300000] :
                        [1000, 3000, 5000, 10000, 15000, 20000, 25000, 50000, 100000, 200000]
                )
                .range(
                    get(store.getState(), `user.activeGeoid.length`, null) === 2 ?
                        [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6] :
                        [0.1, 0.2, 0.4, 0.6, 0.8, 1, 1.2, 1.4, 1.8, 2, 2.2]
                );*/

            if (!this.filters.hazard.value && this.hazardsFromFalcor)  this.filters.hazard.value = this.hazardsFromFalcor;

            let colorScaleFilter = [
                'match',
                ['get', 'property_damage']
            ];

            this.markers.forEach(m => m.remove())
            Object.keys(events).forEach(geo => {
                Object.keys(events[geo])
                    .filter(f => this.filters.hazard.value && this.filters.hazard.value.includes(f))
                    .forEach(haz => {
                        Object.keys(events[geo][haz])
                            .filter(f => this.currentYear ? this.currentYear.toString() === f.toString() || this.currentYear === 'allTime' : true)
                            .forEach(year => {
                                if (events[geo][haz][year].property_damage.value && events[geo][haz][year].property_damage.value.length > 0) {
                                    events[geo][haz][year].property_damage.value.forEach(data => {
                                        let colorScale = d3scale.scaleThreshold()
                                            .domain(this.domain)
                                            .range(Object.keys(hazardcolors).includes(data.hazardid) ? hazardcolors[data.hazardid + '_range'] : hazardcolors['all_range']);
                                        if (JSON.parse(data.geom)) {
                                            if (!colorScaleFilter.includes(data.property_damage)){
                                                colorScaleFilter.push(data.property_damage)
                                                colorScaleFilter.push(colorScale(data.property_damage))
                                            }

                                            let circle = {
                                                type: "Feature",
                                                properties: {'circle-color': colorScale(data.property_damage)},
                                                geometry: {type: 'Point', coordinates: JSON.parse(data.geom).coordinates}
                                            }
                                            /*let circle = turf.circle(
                                                JSON.parse(data.geom).coordinates,
                                                 // radiusScale(data.property_damage) //radius
                                            );*/
                                            circle.properties.hazard = data.hazardid;
                                            circle.properties.property_damage = data.property_damage;
                                            circle.properties.begin_date_time = data.begin_date_time;
                                            circle.properties.geoid = get(graph, `geo.${data.geoid.slice(0,5)}.name`, '');
                                            circle.properties.cousub_geoid = get(graph, `geo.${data.cousub_geoid}.name`, '');
                                            circle.properties.episode_id = data.episode_id;
                                            circle.properties.episode_narrative = data.episode_narrative;

                                            eventsGeo.features.push(circle)
                                        }
                                    });
                                }
                            })
                    })
            })

            colorScaleFilter.push('#000')

            if (map.getSource('events')){
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
                        type: 'circle',
                        source: 'events',
                        "paint": {
                            'circle-radius': {
                                'base': 3,
                                'stops': [
                                    [12, 3],
                                    [22, 3]
                                ]
                            },
                            "circle-color": colorScaleFilter.length > 3 ? colorScaleFilter : '#cbbebe',
                            "circle-opacity": 0.3
                        },
                    }
                );
            }
/*            let popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false
            });
            map.on('mouseenter', 'events-layer', function(e) {
                // Change the cursor style as a UI indicator.
                map.getCanvas().style.cursor = 'pointer';

                let coordinates = e.features[0].geometry.coordinates.slice();

                // Ensure that if the map is zoomed out such that multiple
                // copies of the feature are visible, the popup appears
                // over the copy being pointed to.
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }

                // Populate the popup and set its coordinates
                // based on the feature found.
                popup
                    .setLngLat(coordinates)
                    .setHTML('<h3>' + 'Event' + '</h3><p>' +
                        Object.keys(e.features[0].properties)
                            .reduce((a, k) => a + '<p>' + k + ': <span style="max-width: 50px; overflow-wrap: break-spaces">' + e.features[0].properties[k] + '</span></p>', ''))
                    //.addTo(map)
            });

            map.on('mouseleave', 'events-layer', function() {
                map.getCanvas().style.cursor = '';
                popup.remove();
            });*/

            eventsGeo.features.forEach(marker => {
                // add icon
                let el = document.createElement('div');
                el.className = 'icon-w';
                el.style.backgroundColor = marker.properties['circle-color']
                // el.style.backgroundColor = hazardcolors[marker.properties.hazard]
                el.style.color = '#ccc'
                el.style.borderRadius = '50%'

                let el2 = document.createElement('div');
                el2.className = `fi fa-${get(hazardIcons[marker.properties.hazard], `icon`, 'wind')}`;
                el.appendChild(el2)

                this.markers.push(
                    new mapboxgl.Marker(el)
                        .setLngLat(marker.geometry.coordinates)
                        /*.setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
                            .setHTML('<h3>' + 'Event' + '</h3><p>' +
                                Object.keys(marker.properties)
                                    .reduce((a, k) => a + '<p>' + k + ': ' + marker.properties[k] + '</p>', '')
                            ))*/
                        .addTo(this.map)
                )
            })

/*            let colors = [
                'match',
                ['get', 'hazard']
            ];

            hazardMeta.forEach(h => {
                colors.push(h.value);
                colors.push(hazardcolors[h.value]);
            });
            colors.push('#000');
            if (map.getSource('events')){
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
                        type: 'circle',
                        source: 'events',
                        "paint": {
                            'circle-radius': {
                                'base': 3,
                                'stops': [
                                    [12, 3],
                                    [22, 3]
                                ]
                            },
                            "circle-color": colorScaleFilter.length > 3 ? colorScaleFilter : '#000',
                            "circle-opacity": 1
                        },
                    }
                );
            }*/

        }

    }

    onRemove(map) {
        unregister(this);
    }

    receiveMessage(action, data) {
        this.currentYear = data.activeYear
        this.filters.hazard.value = data.activeHazard
        this.domain = [0,10000,50000,100000, 250000];
        this.range = Object.keys(hazardcolors).includes(this.filters.hazard.value) ? hazardcolors[this.filters.hazard.value + '_range'] : hazardcolors['all_range']
        return this.fetchData().then(data => this.receiveData(this.map, data))
        //     this.fetchData().then(data => this.receiveData(this.map,data))

    }

    onAdd(map) {
        super.onAdd(map);
        register(this, 'USER::SET_YEAR', ["hazardEvents"]);
        register(this, 'USER::SET_HAZARD', ["hazardEvents"]);
        if (!store.getState().user.activeGeoid) return Promise.resolve();
        let activeGeoid = store.getState().user.activeGeoid
        return falcorGraph.get(['geo',activeGeoid,'boundingBox'])
            .then(response =>{
                let initalBbox = response.json.geo[activeGeoid]['boundingBox'].slice(4, -1).split(",");
                let bbox = initalBbox ? [initalBbox[0].split(" "), initalBbox[1].split(" ")] : null;
                map.resize();
                map.fitBounds(bbox);
                this.layers.forEach(layer => {
                    map.setLayoutProperty(layer.id, 'visibility',"none");
                })
                this.fetchData().then(data => this.receiveData(this.map,data))

            })

    }

    fetchData(graph) {
        if (this.tracts && this.tracts.length < 2 || !store.getState().user.activeGeoid) return Promise.resolve({route: []});
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

    toggleVisibilityOn() {
        this.layers.forEach(layer => {
            this.map.setLayoutProperty(layer.id, 'visibility',  "visible");
        })
        return falcorGraph.get(
            ['riskIndex', 'hazards'],
            ['geo', store.getState().user.activeGeoid, 'tracts'],
            ['geo', store.getState().user.activeGeoid, this.displayFeatures],
            ["geo", [store.getState().user.activeGeoid], "boundingBox"]
        )
            .then(d => {
                // set hazards if not passed
                this.hazardsFromFalcor = get(d, `json.riskIndex.hazards`, hazardMeta);
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
                            a.then(() => falcorGraph.get(c))
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
                this.map.resize();
                this.map.fitBounds(bbox);
                // get tracts
                let tracts = get(graph,
                    `geo.${store.getState().user.activeGeoid}.tracts`,
                    null);
                if (tracts && tracts.value) {
                    this.tracts = tracts.value;
                    // show tracts
                   this. map.setFilter('tracts-layer', ['all', ['in', 'geoid', ...tracts.value]]);
                }

                // show cousubs or counties
                let countiesOrCousubs = get(graph,
                    `geo.${store.getState().user.activeGeoid}.${this.displayFeatures}`,
                    null);
                if (countiesOrCousubs && countiesOrCousubs.value && countiesOrCousubs.value.length > 0) {
                    this.map.setFilter('tracts-layer-line', ['all', ['in', 'geoid', ...countiesOrCousubs.value]])
                }

                // get data and paint map
                this.fetchData(graph).then(data => this.receiveData(this.map, data))
            })

    }
    toggleVisibilityOff(){
        this.layers.forEach(layer => {
            this.map.setLayoutProperty(layer.id, 'visibility',"none");
        })
        if (this.map.getSource('events')){
            this.map.removeLayer('events-layer')
            this.map.removeSource('events')
        }
    }
}

export const HazardEventsOptions =  (options = {}) => {
// const tractLayer = new TractLayer("Hazard Events Layer",
    return  {
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
                'fill-color': 'rgba(9, 98, 186, 0.0)',
                'fill-outline-color': 'rgba(9, 98, 186, 0.0)'
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
            value: undefined
        }
    },
        markers: [],
    popover: {
        layers: [/*'tracts-layer-line', */'events-layer'],
        dataFunc: feature => {
            return feature.layer.id === 'tracts-layer-line' ?
                ["tract",
                    ["Name", get(falcorGraph.getCache(), `geo.${feature.properties.geoid}.name`, 0)]
                ] :
                ['Event',
                    ['Type', get(feature, `properties.hazard`, null)],
                    ['Damage', get(feature, `properties.property_damage`, null)],
                    ['Date', get(feature, `properties.begin_date_time`, null)],
                    ['County', get(feature, `properties.geoid`, null)],
                    ['Municipality', get(feature, `properties.cousub_geoid`, null)],
                    ['Episode ID', get(feature, `properties.episode_id`, null)],
                    ['Description', get(feature, `properties.episode_narrative`, null)],
                ]

        }
    }
}}
