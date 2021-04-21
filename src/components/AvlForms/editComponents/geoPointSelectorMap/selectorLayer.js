import React from "react"
import store from "store"
import MapLayer from "components/AvlMap/MapLayer"
import get from 'lodash.get'
import {falcorGraph} from "store/falcorGraph"
import mapboxgl from "mapbox-gl";
import _ from 'lodash'

class SelectorLayer extends MapLayer {

    receiveProps(oldProps, newProps) {
        this.onChange = newProps.onChange;

        if(!_.isEqual(this.locations, newProps.value)){
            this.locations = newProps.value;
            this.paintMarkers();

            this.fetchData().then(data => this.receiveData(this.map, data))
        }
    }

    onPropsChange(oldProps, newProps) {
        if (!_.isEqual(newProps.value, oldProps.value)) {
            this.locations = newProps.value;
            this.paintMarkers();
            this.fetchData().then(data => this.receiveData(this.map, data))
            this.doAction(["fetchLayerData"]);
        }
    }

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

        return requests.reduce((a, c) =>
                a.then(() => falcorGraph.get(
                    ['nfip', 'losses', 'byGeoid', c, 'allTime', 'total_payments'],
                    ['geo', c, 'name']
                ))
            , Promise.resolve())
    }

    receiveData(map, data) {
    }

    paintMarkers() {
        this.markers.map(m => m.remove())
        this.markers = this.locations.map((p, i) => {
            p = {lng: p.lng, lat: p.lat}
            let marker = new mapboxgl.Marker({
                draggable: false
            })
                .setLngLat(p)
                .addTo(this.map);

            marker.getElement().addEventListener('click', () => {
                this.markers.filter(m => _.isEqual(m, marker)).map(m => m.remove());
                this.locations = this.locations.filter(l => !_.isEqual(l, p));
                this.onChange(this.locations);
            });
            return marker
        })

        this.onChange(this.locations);

    }
}

const selectorLayer = new SelectorLayer("Local Context Layer", {
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
        },
        {
            id: "buildings",
            source: {
                type: "geojson",
                //generateId: true,
                data: {
                    type: "FeatureCollection",
                    features: []
                }
            }
        },
        {
            id: "nys_buildings_avail",
            source: {
                'type': "vector",
                'url': 'mapbox://am3081.dpm2lod3'
            }
        },
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
        },
        {
            'id': 'ebr',
            'source': 'nys_buildings_avail',
            'source-layer': 'nys_buildings_osm_ms_parcelid_pk',
            'type': 'fill',
            'minzoom': 13,
            'paint': {
                'fill-color': '#000000'
            }
        },

        {
            'id': 'buildings-layer',
            'source': 'buildings',
            'type': 'circle',
            'paint': {
                //'circle-radius': 3,
                'circle-opacity': 0.5,

            }
        },
    ],
    displayFeatures: 'cousubs',
    locations: [],
    markers: [],
    popover: {
        layers: ['ebr'],
        dataFunc: feature => {
            let graph = falcorGraph.getCache()
            return ['--',
                [],
            ]
        }
    },
    onClick: {
        layers: ["ebr"],
        dataFunc: function (features, a, location) {
            if (!features.length) return;
            this.locations = [...(this.locations || []), {...location}];
            this.paintMarkers();
            this.map && this.render(this.map);

        }
    },
    modals: {
        building: {
            comp: (e) => {
                return ''
            },
            show: false,
            onClose: function () {
                this.map && this.render(this.map);
            }
        }
    },
});

export default selectorLayer