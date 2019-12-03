import React from "react"
import * as d3scale from "d3-scale"
import store from "store"
import MapLayer from "components/AvlMap/MapLayer"
import get from 'lodash.get'
import {falcorChunkerNiceWithUpdate, falcorGraph} from "store/falcorGraph"
import * as turf from '@turf/turf'
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


class TractLayer extends MapLayer {

    onAdd(map) {
        super.onAdd(map);
        if (!store.getState().user.activeGeoid) return Promise.resolve();
        return falcorGraph.get(
            ['geo', store.getState().user.activeGeoid, this.displayFeatures],
            ["geo", [store.getState().user.activeGeoid], ["boundingBox", 'geom']]
        )
            .then(data => {
                let graph = falcorGraph.getCache()
                // set map bounds
                let initalBbox =
                    get(graph, `geo.${store.getState().user.activeGeoid}.boundingBox.value`, null)
                        .slice(4, -1).split(",");
                let bbox = initalBbox ? [initalBbox[0].split(" "), initalBbox[1].split(" ")] : null;
                map.resize();
                map.fitBounds(bbox);
                // filter out everything outside of the bounds
                // show cousubs
                let cousubs = get(graph,
                    `geo.${store.getState().user.activeGeoid}.cousubs`,
                    null);
                if (cousubs && cousubs.value && cousubs.value.length > 0) {
                    map.setFilter('tracts-layer-line', ['all', ['in', 'geoid', ...cousubs.value]])
                }

                // get data and paint map
                this.fetchData(graph).then(data => this.receiveData(map, data))
            })

    }

    fetchData(graph) {
        if (!graph) graph = falcorGraph.getCache()
        let geos = get(graph,
            `geo.${store.getState().user.activeGeoid}.cousubs`,
            null);

        if (!(geos && geos.value && geos.value.length > 0)) return Promise.resolve();

        const requests = [];
        for (let i = 0; i < geos.value.length; i += 50) {
            requests.push(geos.value.slice(i, i + 50));
        }
        // console.log('reqs', requests, graph, geos)
        return requests.reduce((a, c) =>
                a.then(() => falcorGraph.get(
                    ['nfip', 'losses', 'byGeoid', c, 'allTime', 'total_payments'],
                    ['geo', c, 'name']
                ))
            , Promise.resolve())
    }

    receiveData(map, data) {
        let graph = falcorGraph.getCache();
        let geos = get(graph,
            `geo.${store.getState().user.activeGeoid}.cousubs`,
            null);
        data = get(graph, `nfip.losses.byGeoid`, {});
        // console.log('old data',data)

        let keyDomain = geos.value
            .reduce((out, curr) => {
                // console.log('out', curr,  data)
            out[curr] = data[curr]['allTime']['total_payments'];
            return out;
        }, {});
        // console.log('keyDomain nfip', keyDomain);
        let maxDamage = Math.max(...Object.keys(keyDomain)
            .filter(f => f.length === 10)
            .map(f => keyDomain[f]));
        let domain = [0, 1, 2, 3, 4].map(i => ((maxDamage) * (i / 4)));

        // console.log('keyDomain', keyDomain);
        let range = getColor('Reds');
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
            'tracts-layer-line',
            'fill-color',
            ["get", ["to-string", ["get", "geoid"]], ["literal", mapColors]]
        );

        map.setPaintProperty(
            'tracts-layer-line',
            'fill-opacity',
            0.5
        );

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
            'id': 'tracts-layer-line',
            'source': 'cousubs',
            'source-layer': 'cousubs',
            'type': 'fill',
            'paint': {
                'fill-color': 'rgba(0,0,0,0)',
                'fill-outline-color': '#000'
            }
        }
    ],
    displayFeatures: 'cousubs',
    popover: {
        layers: ['tracts-layer-line'],
        dataFunc: feature => {
            let graph = falcorGraph.getCache()
            return ["tract",
                ["Name", get(graph, `geo.${feature.properties.geoid}.name`, 0)],
                ["Total", get(graph,
                    `nfip.losses.byGeoid.${feature.properties.geoid}.allTime.total_payments`,
                    0)],
            ]
        }
    }
});

export default tractLayer