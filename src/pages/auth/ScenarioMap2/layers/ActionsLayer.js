import React, {useState, useEffect} from "react"
import store from "store"
import MapLayer from "components/AvlMap/MapLayer"
import get from 'lodash.get'
import _ from 'lodash'
import {falcorGraph} from "store/falcorGraph"
import {unregister} from "../../../../components/AvlMap/ReduxMiddleware";
import mapboxgl from "mapbox-gl";
import * as turf from '@turf/turf'
import AvlFormsViewData from 'components/AvlForms/displayComponents/viewData';
import actionsViewConfig from 'pages/auth/actions/actions_project_forms/config.js'
export class ActionsLayer extends MapLayer {
    isJson(text) {
        try {
            JSON.parse(text);
            return true;
        } catch (e) {
            return false;
        }
    }

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
                this.fetchData().then(data => this.receiveData(this.map, data))

            })

    }


    fetchData(graph) {
        if (this.tracts && this.tracts.length < 2 || !store.getState().user.activeGeoid) return Promise.resolve();

        if (!graph) graph = falcorGraph.getCache();

        let countiesOrCousubs = get(graph,
            `geo.${store.getState().user.activeGeoid}.${this.displayFeatures}`,
            null);

        if (!(countiesOrCousubs && countiesOrCousubs.value && countiesOrCousubs.value.length > 0)) return Promise.resolve();

        this.loading = true;

        return falcorGraph.get(
            ['forms', 'actions', 'byPlanId', store.getState().user.activePlan, 'length'],
            ['forms', 'jurisdictions', 'byPlanId', store.getState().user.activePlan, 'length']
        ).then(async (res) => {
            let lenActions = get(res, ['json', 'forms', 'actions', 'byPlanId', store.getState().user.activePlan, 'length'], 0);
            let lenJurisdictions = get(res, ['json', 'forms', 'jurisdictions', 'byPlanId', store.getState().user.activePlan, 'length'], 0);
            if (!lenActions || !lenJurisdictions) return Promise.resolve();

            let reqs = [
                ['forms', 'actions', 'byPlanId', store.getState().user.activePlan, 'byIndex', [{
                    from: 0,
                    to: lenActions - 1
                }], ...['id']],
                ['forms', 'jurisdictions', 'byPlanId', store.getState().user.activePlan, 'byIndex', [{
                    from: 0,
                    to: lenJurisdictions - 1
                }], ...['id']]
            ];

            res = await falcorGraph.get(...reqs);

            let actions = get(res, ['json', 'forms', 'actions', 'byPlanId', store.getState().user.activePlan, 'byIndex'], {});
            actions = Object.keys(actions).filter(index => index !== '$__path').map(index => actions[index]);

            let jurisdictions = get(res, ['json', 'forms', 'jurisdictions', 'byPlanId', store.getState().user.activePlan, 'byIndex'], {});
            jurisdictions = Object.keys(jurisdictions).filter(index => index !== '$__path').map(index => jurisdictions[index]);

            // find zone centroids if actions don't have lat-lon
            let actionsWithZones =
                actions.filter(action => {
                        return (!get(action, `attributes.location_point`, null) ||
                                !this.isJson(get(action, `attributes.location_point`, null)) ||
                                get(action, `attributes.location_point`, null) === '{}'
                            ) &&
                            get(action, `attributes.zones`, null)
                    }
                );
            let zoneIds = actionsWithZones.reduce((acc, action) => {
                let zones = JSON.parse(get(action, ['attributes', 'zones'], '[]'))
                return typeof zones === "number" ? [...acc, zones] : [...acc, ...zones]
            }, []);

            let allZones = await falcorGraph.get(['forms', 'byId', zoneIds])
            let allZonesData = zoneIds.map(zoneId => ({
                zoneId: zoneId,
                geojson: get(allZones, ['json', 'forms', 'byId', zoneId, 'attributes', 'geojson'])
            }))
                .filter(f => f.geojson)
                .map(({zoneId, geojson}) => ({
                    zoneId: zoneId,
                    centroid: get(turf.centroid(geojson), ['geometry', 'coordinates'])
                }))

            actionsWithZones.forEach(action => {
                let zones = JSON.parse(get(action, `attributes.zones`, null));
                zones = typeof zones === "number" ? [zones] : zones;
                zones = zones.reduce((acc, zone, zoneI) => {
                    let centroid = allZonesData.filter(z => z.zoneId === zone)[0].centroid
                    return {...acc, ...{[zoneI]: {lng: centroid[0], lat: centroid[1]}}}
                }, {});

                action.attributes.location_point = JSON.stringify(zones)
            })

            // find jurisdiction centroids if actions don't have lat-lon AND zones
            let actionsWithJurisdictions = actions.filter(action => {
                    return (
                            !get(action, `attributes.location_point`, null) ||
                            !this.isJson(get(action, `attributes.location_point`, null)) ||
                            get(action, `attributes.location_point`, null) === '{}'
                        ) &&
                        !get(action, `attributes.zones`, null) &&
                        get(action, `attributes.zones`, null) !== '[]' &&
                        (
                            get(action, `attributes.action_county`, null) ||
                            get(action, `attributes.action_jurisdiction`, null)
                        )
                }
            );

            let jurisdictionsCentroids = {}
            actionsWithJurisdictions.forEach(action => {
                let jurisdictionList =
                    this.isJson(get(action, `attributes.action_jurisdiction`, null)) &&
                    JSON.parse(get(action, `attributes.action_jurisdiction`, null)) ?
                    JSON.parse(get(action, `attributes.action_jurisdiction`, null)) :
                    JSON.parse(get(action, `attributes.action_county`, null))
                jurisdictionList = typeof jurisdictionList === "number" ? [jurisdictionList] : jurisdictionList;

                jurisdictionList = jurisdictionList
                    .filter(j => j.toString().length !== 2) // some actions have wrong ids
                    .reduce((acc, jurisdiction, jurisdictionI) => {
                    let tmpJurisdiction = jurisdictions.filter(j => get(j, ['attributes', 'geoid']) === jurisdiction.toString())[0]

                    if (!tmpJurisdiction) return acc;
                    try{
                        let centroid = turf.centroid(JSON.parse(tmpJurisdiction.attributes.st_asgeojson || tmpJurisdiction.attributes.geojson)).geometry.coordinates;
                        return {...acc, ...{[jurisdictionI]: {lng: centroid[0], lat: centroid[1]}}}
                    }catch (e){
                        return acc;
                    }
                }, {});

                action.attributes.location_point = JSON.stringify(jurisdictionList)
            })

            this.actions = actions
            return actions

        })
    }

    receiveData(map, data) {
        if (!this.actions) return Promise.resolve();

        let geojson = {
            "type": "FeatureCollection",
            "features": []
        };

        this.actions
            .filter(action => get(action, `attributes.location_point`, null) &&
                this.isJson(get(action, `attributes.location_point`, null)) &&
                ![/*'{"0":{}}', */'{}'].includes(get(action, `attributes.location_point`, null)))
            .forEach((action) => {
                Object.values(JSON.parse(get(action, `attributes.location_point`, {})))
                    .forEach(point => {
                        geojson.features.push({
                            "type": "Feature",
                            "properties": {
                                id: action.id,
                                color: '#144ad2',
                                ...action.attributes
                            },
                            "geometry": {
                                type: 'Point',
                                coordinates: [point.lng, point.lat]
                            }
                        })
                    })
            });

        // this.markers.forEach(m => m.remove())
        // geojson.features.forEach(marker => {
        //     // add icon
        //     let el = document.createElement('div');
        //     el.className = 'icon-w'
        //     el.style.backgroundColor = marker.properties.color
        //     el.style.color = '#ccc'
        //     el.style.borderRadius = '10%'
        //     let el2 = document.createElement('div');
        //     el2.className = marker.properties.type === 'critical' ? 'os-icon os-icon-alert-circle' : 'os-icon os-icon-home'
        //     el.appendChild(el2)
        //
        //     this.markers.push(
        //         new mapboxgl.Marker(el)
        //             .setLngLat(marker.geometry.coordinates)
        //             .addTo(this.map)
        //     )
        // })

        if (map.getSource('actions')) {
            map.removeLayer('actions-layer');
            map.removeLayer('clusters');
            map.removeLayer('cluster-count');
            map.removeSource('actions');
        }
        
        map.addSource('actions', {
            type: 'geojson',
            data: geojson,
            cluster: true
        });
        
        map.addLayer({
            id: 'clusters',
            type: 'circle',
            source: 'actions',
            filter: ['has', 'point_count'],
            paint: {
                'circle-color': [
                    'step',
                    ['get', 'point_count'],
                    '#51bbd6',
                    100,
                    '#f1f075',
                    750,
                    '#f28cb1'
                ],
                'circle-radius': [
                    'step',
                    ['get', 'point_count'],
                    20,
                    100,
                    30,
                    750,
                    40
                ]
            }
        });

        map.addLayer({
            id: 'cluster-count',
            type: 'symbol',
            source: 'actions',
            filter: ['has', 'point_count'],
            layout: {
                'text-field': '{point_count_abbreviated}',
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 12
            }
        });

        map.addLayer({
            id: 'actions-layer',
            type: 'circle',
            source: 'actions',
            filter: ['!', ['has', 'point_count']],
            paint: {
                'circle-color': '#11b4da',
                'circle-radius': 5,
                'circle-stroke-width': 2,
                'circle-stroke-color': '#fff'
            }
        });

        map.on('click', 'clusters', function (e) {
            let features = map.queryRenderedFeatures(e.point, {
                layers: ['clusters']
            });
            let clusterId = features[0].properties.cluster_id;
            map.getSource('actions').getClusterExpansionZoom(
                clusterId,
                function (err, zoom) {
                    if (err) return;

                    map.easeTo({
                        center: features[0].geometry.coordinates,
                        zoom: zoom
                    });
                }
            );
        });

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

                // get tracts
                let tracts = get(graph,
                    `geo.${store.getState().user.activeGeoid}.tracts]`,
                    null);
                if (tracts && tracts.value) {
                    this.tracts = tracts.value;
                    // show tracts
                    this.map.setFilter('tracts-layer-actions', ['all', ['in', 'geoid', ...tracts.value]]);
                }

                // show cousubs or counties
                let countiesOrCousubs = get(graph,
                    `geo.${store.getState().user.activeGeoid}.${this.displayFeatures}`,
                    null);
                if (countiesOrCousubs && countiesOrCousubs.value && countiesOrCousubs.value.length > 0) {
                    this.map.setFilter('tracts-layer-line-actions', ['all', ['in', 'geoid', ...countiesOrCousubs.value]])
                }

                // get data and paint map
                this.loading = false
                return this.fetchData(graph).then(data => this.receiveData(this.map, data)).then(() => this.loading = false)
            })

    }

    toggleVisibilityOff() {
        this.markers.forEach(m => m.remove())
        this.layers.forEach(layer => {
            this.map.setLayoutProperty(layer.id, 'visibility', "none");
        })
        if (this.map.getSource('actions')) {
            this.map.removeLayer('actions-layer');
            this.map.removeSource('actions');
        }
        this.loading = false

    }
}

export const ActionsOptions = (options = {}) => {
// const tractLayer = new TractLayer("Assets Layer",
    return {
        name: 'Actions',
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
                'id': 'tracts-layer-actions',
                'source': 'tracts',
                'source-layer': 'tracts',
                'type': 'fill',
                'paint': {
                    'fill-color': 'rgba(9, 98, 186, 0.0)',
                    'fill-opacity': 0.0
                }
            },
            {
                'id': 'tracts-layer-line-actions',
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
        floodPlainFilter: [],
        viewModeFilter: 'Both',
        popover: {
            layers: ['actions-layer'],
            dataFunc: function (topFeature, features) {
                const {id} = topFeature.properties;
                let result = [];
                let data = [];

                return [[null, 'Data'],
                    ...Object.keys(get(topFeature, `properties`, {}))
                        .filter(k => !["id", "color"].includes(k))
                        .map(k => [k.split('_').join(' '), get(topFeature, `properties.${k}`, null)])
                ]
            },
        },
        onClick: {
            layers: ['actions-layer'],
            dataFunc: function (feature, fetures) {
                let props = {
                    json: actionsViewConfig,
                    id: feature.map(f => f.properties.id),
                    autoLoad: true
                };

                this.modals.action.show
                    ? this.doAction(["updateModal", "action", props])
                    : this.doAction(["toggleModal", "action", props]);
            }
        },
        modals: {
            action: {
                comp: ViewAction,
                show: false,
                onClose: function() {
                    this.map && this.render(this.map);
                }
            }
        },

    }
}

const ViewAction = function(props){
    let [activeId, setActiveId] = useState(props.id[0]);
    useEffect(() => {return () => {}});

    const nextButton = <button className='col-sm-3 mr-2 mb-2 btn btn-outline-primary btn-rounded' onClick={() => setActiveId(props.id[(props.id.findIndex(i => i === activeId) % props.id.length + 1) % props.id.length])}> next </button>,
        previousButton = props.id[0] === activeId ? null :
            <button className='col-sm-3 mr-2 mb-2 btn btn-outline-primary btn-rounded' onClick={() => setActiveId(props.id[props.id.findIndex(i => i === activeId) - 1])}> prev </button>;

    return (
        <div id='actionsView' style={{overflow: 'auto'}}>
            {props.id.length > 1 ?
                <div id='actionButtons' className='row'>
                    <div className='col-sm-6'>
                        {nextButton} <span className="col-sm-2 info"> {`${props.id.findIndex(i => i === activeId) + 1 } / ${props.id.length}`} </span>  {previousButton}
                    </div>
                </div>
                : null}
            <AvlFormsViewData {...{...props, id: activeId}}/>
        </div>
    )
}