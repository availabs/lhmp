import React from "react"
import { connect } from "react-redux"
import { reduxFalcor, UPDATE as REDUX_UPDATE } from "utils/redux-falcor"

import { falcorGraph, falcorChunkerNice } from "store/falcorGraph"
import { register, unregister } from "components/AvlMap/ReduxMiddleware"

import geoJsonExtent from "@mapbox/geojson-extent"
import get from "lodash.get";
import mapboxgl from "mapbox-gl"
import styled from "styled-components"

import MapLayer from "components/AvlMap/MapLayer"

import {
    ConflationSource,
    ConflationStyle
} from './conflation.style.js'

import * as d3scale from "d3-scale"
import { getColorRange } from "constants/color-ranges"

import RouteInfoBox from "../components/RouteInfoBox"

import {MAPBOX_TOKEN} from 'store/config'
const atts = ['id', 'name', 'type', 'owner', "updatedAt", "tmcArray", "points"];

class RouteLayer extends MapLayer {
    onAdd(map) {
        // register(this, REDUX_UPDATE, ["graph"]);

        this.markers.forEach(m => m.addTo(map));

        return this.loadUserRoutes(false)
            .then(() => falcorGraph.get(["conflation", "latestVersion"]))
            .then(() => this.calcRoute());
    }
    onRemove(map) {
        // unregister(this);
        this.markers.forEach(m => m.remove());
    }
    loadUserRoutes(forceUpdate = true) {

        return falcorGraph.get(["routes", "length"])
            .then(res => {
                const num = get(res, ["json", "routes", "length"], 0);
                if (num) {
                    return falcorGraph.get([
                        'routes',
                        'byIndex',
                        { from: 0, to: num - 1 },
                        atts
                    ])
                        .then(res => {
                            const routes = [];
                            for (let i = 0; i < num; ++i) {
                                routes.push(atts.reduce((a, c) => {
                                    a[c] = get(res, ["json", "routes", "byIndex", i, c], null);
                                    return a;
                                }, {}))
                            }
                            this.filters.userRoutes.domain = routes;
                        })
                }
                else {
                    this.filters.userRoutes.domain = [];
                }
            })
            .then(() => {
                if (this.routeToLoad) {
                    return falcorGraph.get(["routes", "byId", this.routeToLoad, atts])
                        .then(() => this.selectUserRoute(this.routeToLoad))
                }
            })
        // .then(() => forceUpdate && this.forceUpdate());
    }
    // receiveMessage(action, data) {
    // }
    // receiveLayerMessage(msg) {
    //   if (msg.type === "FilterMessage" && msg.filterName == "year") {
    //     this.year = msg.newValue;
    //     this.map && this.render(this.map);
    //   }
    // }
    getNetworkId() {
        const year = this.year < 2019 ? 2017 : 2019;
        return "tmc" + year.toString().slice(2) + "id";
    }
    handleMapClick(data) {
        switch (this.mode) {
            case "markers":
                this.generateMapMarkers(data);
                break;
            case "click":
                const newData = new Set([...data]),
                    set = new Set([...this.data.click]);
                newData.forEach(tmc => {
                    if (!set.has(tmc)) {
                        set.add(tmc);
                    }
                    else {
                        set.delete(tmc);
                    }
                })
                this.data.click = [...set];
                break;
        }
        this.calcRoute();
    }

    getGeomRequest(selection) {
        if (this.mode === "click") {
            return ['tmc', selection, 'year', this.year, 'geometries'];
        }
        else if (this.mode === "markers") {
            return ['conflation', 'con', selection, 'meta', 'geometries'];
        }
        return false;
    }

    fetchData() {
        return Promise.resolve()
            .then(() => {
                if (this.mode === "click") {
                    return { mode: "click", data: [...this.data["click"]] };
                }
                if (this.markers.length < 2) {
                    return { mode: "markers", data: [] };
                }

                const locations = this.markers.map(m => ({
                    lon: m.getLngLat().lng,
                    lat: m.getLngLat().lat
                }));

                let url = `https://api.mapbox.com/directions/v5/mapbox/driving/` + locations.map(f => `${f.lon},${f.lat}`).join(';');
                url += `?geometries=geojson&access_token=${MAPBOX_TOKEN}`
                return fetch(url)
                    .then((res, error) => {
                        if (error) return { ways: [] };
                        return res.json()
                    })
                    .then(res => {
                        return { mode: "markers", data: res };
                    })
            })
            .then(data => this.receiveRoute(data))
            /*.then(() => {
                if (this.data[this.mode].length) {
                    return falcorChunkerNice(this.getGeomRequest(this.data[this.mode]))
                }
            })*/
            /*.then(() => {
                if (this.mode === "markers" && this.data.markers.length) {
                    const request = ["conflation", "con", this.data.markers, "meta", ['tmc17id','tmc19id']];
                    return falcorChunkerNice(request)
                }
            })*/
            .then(() => {
                if (this.mode === "markers") {
                    const falcorCache = falcorGraph.getCache();
                    console.log('this.data',this.data, this.data.markers.waypoints)
                    this.nameArray = get(this.data, `markers.waypoints`, [])
                        .reduce((a, c, cI) => {
                        a.push(`Leg - ${cI} ${c.name ? `- ${c.name}` : ''}`)
                        return a;
                    }, []);
                }
                else {
                    this.nameArray = [...this.data.click];
                }
            })
    }
    getMapFilter() {
/*        switch (this.mode) {
            case "markers":
                return ["match",
                    ["to-string", ["get", "id"]],
                    [...new Set(this.data[this.mode]), "none"],
                    true, false
                ]
            case "click":
                return ["match",
                    ["to-string", ["get", this.getNetworkId()]],
                    [...new Set(this.data[this.mode]), "none"],
                    true, false
                ]
        }*/
    }
    render(map) {
        this.map.setFilter("execution-route", this.getMapFilter());

        this.zoomToBounds();
    }
    generateMapMarkers(lngLat = null) {
        this.markers.forEach(m => m.remove());

        let points = this.markers.map(m => m.getLngLat());

        if (lngLat) {
            if (Array.isArray(lngLat)) {
                points = lngLat;
            }
            else {
                points.push(lngLat);
            }
        }

        const num = Math.max(points.length - 1, 1)

        const scale = d3scale.scaleLinear()
            .domain([0, num * 0.5, num])
            .range(["#1a9641", "#ffffbf", "#d7191c"])

        this.markers = points.map((p, i) => {
            return new mapboxgl.Marker({
                draggable: true,
                color: scale(i)
            })
                .setLngLat(p)
                .addTo(this.map)
                .on("dragend", e => this.calcRoute());
        })
    }
    calcRoute() {
        this.doAction(["fetchLayerData"]);
    }
    receiveRoute({ mode, data }) {
        this.data[mode] = data;
        data = get(data, `routes`, []).pop();
        this.geom = get(data, `geometry`, {coordinates: [], type: "LineString"})

        if (this.map.getSource('execution-route-source')) {
            this.map.getSource('execution-route-source').setData(get(data, `geometry`, {coordinates: [], type: "LineString"}));
        }
    }
    removeLast() {
        switch (this.mode) {
            case "markers":
                this.markers.pop().remove();
                this.generateMapMarkers();
                break;
            case "click":
                this.data["click"].pop();
                break;
        }
        this.calcRoute();
    }
    clearRoute() {
        switch (this.mode) {
            case "markers":
                while (this.markers.length) {
                    this.markers.pop().remove();
                }
                break;
            case "click":
                this.data.click = [];
                break;
        }
        this.filters.userRoutes.value = null;
        // this.mapActions.modeToggle.disabled = false;
        this.calcRoute();
    }
    toggleCreationMode() {
        switch (this.mode) {
            case "markers":
                this.mode = "click";
                this.markers.forEach(m => m.remove());
                break;
            case "click":
                this.mode = "markers";
                this.generateMapMarkers();
                break;
        }
        this.calcRoute();
    }
    loadUserRoute(route) {
        this.mapActions.modeToggle.disabled = true;
        // this.year = new Date(route.updatedAt).getFullYear();

        this.doZoom = true;

        if (get(route, "points", []).length) {
            this.mode = "markers";
            this.generateMapMarkers(route.points);
        }
        else {
            this.mode = "click";
            this.markers.forEach(m => m.remove());
            this.data.click = [...route.nameArray];
        }
    }
    selectUserRoute(routeId) {
        const data = get(falcorGraph.getCache(), ["routes", "byId", routeId], null);
        if (data) {
            const route = atts.reduce((a, c) => {
                switch (c) {
                    case "nameArray":
                    case "points":
                        a[c] = get(data, [c, "value"], null);
                        break;
                    default:
                        a[c] = get(data, c, null);
                }
                return a;
            }, {})
            this.routeToLoad = null;
            this.doAction(["updateFilter", "userRoutes", route]);
        }
        else {
            this.routeToLoad = routeId;
        }
    }
    zoomToBounds() {
        if (Boolean(this.map) && this.doZoom) {
            this.doZoom = false;

            const cache = falcorGraph.getCache();

            const bounds = this.data[this.mode].reduce((a, c) => {
                const data = get(cache, [...this.getGeomRequest(c), "value"], null);
                return data ? a.extend(new mapboxgl.LngLatBounds(geoJsonExtent(data))) : a;
            }, new mapboxgl.LngLatBounds());

            !bounds.isEmpty() &&
            this.map.fitBounds(bounds, { padding: { left: 375, top: 50, right: 425, bottom: 50 } });
        }
    }
    getRouteName() {
        return get(this.filters, ["userRoutes", "value", "name"], "Route");
    }
}

export default (props = {}) =>
    new RouteLayer("Conflation Routing", {
        sources: [
            {
                id: 'execution-route-source',
                source: {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'LineString',
                            coordinates: []
                        }
                    }
                }

            }],
        layers: [{
            id: 'execution-route',
            source: 'execution-route-source',
            type: 'line',
            paint: {
                ...ConflationStyle.paint,
                "line-color": [
                    "case", ["boolean", ["feature-state", "hover"], false],
                    "#e0e",
                    "#a0a"
                ],
                "line-opacity": 1.0,
                "line-width": 6
            }
        }],

        onHover: {
            layers: ["execution-route"],
            filterFunc: function(features) {
                return [
                    "in",
                    this.getNetworkId(),
                    ...features.map(f => f.properties[this.getNetworkId()])
                        .filter(Boolean)
                ]
            }
        },

        active: false,

        ...props,
        version: 2.0,

        mode: "markers",
        markers: [],
        nameArray: [],
        data: {
            markers: [], // array of conlation ids
            click: [] // array of tmc ids
        },
        year: 2019,
        doZoom: false,

        routeToLoad: null,

        onClick: {
            layers: ["map", "conflation"],
            dataFunc: function(features, point, lngLat, layer) {
                switch (this.mode) {
                    case "markers":
                        layer === "map" && this.handleMapClick(lngLat);
                        break;
                    case "click":
                        (layer === "conflation") && features &&
                        this.handleMapClick(features.map(f => f.properties[this.getNetworkId()]).filter(Boolean));
                        break;
                }

            }
        },

       /* popover: {
            layers: ["execution-route"],
            dataFunc: function(feature, features, layer) {
                console.log(feature.properties, this.getNetworkId());
                return [];
            }
        },*/

        filters: {
            userRoutes: {
                name: "Routes",
                type: "single",
                domain: [],
                value: null,
                searchable: true,
                onChange: function(prev, route, domain) {
                    return this.loadUserRoute(route);
                }
            }
        },

        infoBoxes: {
            router: {
                title: ({ layer}) => layer.getRouteName(),
                comp: ({ layer }) => (
                    <RouteInfoBox layer={ layer }
                                  userRoute={ layer.filters.userRoutes.value }
                                  nameArray={ layer.nameArray }
                                  data={ layer.data }
                                  geom={ layer.geom }
                    />
                ),
                show: true
            }
        },

        /*mapActions: {
            modeToggle: {
                Icon: ({ layer }) => <span className={ `fa fa-2x fa-${ layer.mode === "markers" ? "map-marker" : "road" }` }/>,
                tooltip: "Toggle Creation Mode",
                action: function() {
                    this.toggleCreationMode();
                }
            }
        }*/

    })
