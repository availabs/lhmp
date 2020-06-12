import React from "react"

import {falcorGraph} from "store/falcorGraph"
import store from 'store'
import geoJsonExtent from "@mapbox/geojson-extent"
import get from "lodash.get";
import mapboxgl from "mapbox-gl"

import MapLayer from "components/AvlMap/MapLayer"

import {ConflationStyle} from '../components/conflation.style'

import * as d3scale from "d3-scale"

import { listen, unlisten } from "components/AvlMap/LayerMessageSystem"
import {MAPBOX_TOKEN} from 'store/config'
import RouteInfoBox from "../../EvacuationRoutes/components/RouteInfoBox";
import EvacuationControl from "../controls/evacuationControl";
import {connect} from "react-redux";
import {reduxFalcor} from "../../../../utils/redux-falcor";
import AvlFormsListTable from "../components/EvacuationListTable";
import config from "../components/config";
import {Button} from "../../../../components/common/styled-components";
import ViewConfig from '../components/view_config.js'
import SaveRoute from "../components/saveRoute";
import _ from "lodash";

const atts = ['id', 'name', 'type', 'owner', "updatedAt", "tmcArray", "points"];

export class EvacuationRoutesLayer extends MapLayer {
    onAdd(map) {
        // register(this, REDUX_UPDATE, ["graph"]);
        if (this.viewOnly) this.mode = null;
        return falcorGraph.get(
                //["conflation", "latestVersion"],
                ["geo", [store.getState().user.activeGeoid], "boundingBox"],
                ['geo', store.getState().user.activeGeoid, 'cousubs']
            )
            .then(() => {
                let graph = falcorGraph.getCache();
                this.cousubs = get(graph, `geo.${store.getState().user.activeGeoid}.cousubs.value`, []);
                map.setFilter('cousubs-layer', [
                    'match',
                    ['get', 'geoid'],
                    get(graph, `geo.${store.getState().user.activeGeoid}.cousubs.value`, []),
                    true,
                    false
                ]);

                let initalBbox =
                    get(graph, `geo.${store.getState().user.activeGeoid}.boundingBox.value`, null)
                        .slice(4, -1).split(",");
                let bbox = initalBbox ? [initalBbox[0].split(" "), initalBbox[1].split(" ")] : null;

                this.layers.forEach(layer => {
                    map.setLayoutProperty(layer.id, 'visibility',"none");
                })
                this.onRemove(map)
                map.resize();
                map.fitBounds(bbox, {maxDuration: 0});
            })
    }

    onRemove(map) {
        unlisten(this);
        this.markers.forEach(m => m.remove());
    }

    toggleVisibilityOn() {
        this._isVisible = !this._isVisible;
        this.mode = "markers"
        this.layers.forEach(layer => {
            this.map.setLayoutProperty(layer.id, 'visibility', "visible");
        })
        this.markers.forEach(m => m.addTo(this.map));
    }

    toggleVisibilityOff(){
        this._isVisible = !this._isVisible;
        this.mode = ''
        this.layers.forEach(layer => {
            this.map.setLayoutProperty(layer.id, 'visibility',"none");
        })
        this.onRemove(this.map)
    }


    loadUserRoutes(forceUpdate = true) {
        return falcorGraph.get(["routes", "length"])
            .then(res => {
                const num = get(res, ["json", "routes", "length"], 0);
                if (num) {
                    return falcorGraph.get([
                        'routes',
                        'byIndex',
                        {from: 0, to: num - 1},
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
                } else {
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
                    } else {
                        set.delete(tmc);
                    }
                });
                this.data.click = [...set];
                break;
        }
        this.calcRoute();
    }

    getGeomRequest(selection) {
        if (this.mode === "click") {
            return ['tmc', selection, 'year', this.year, 'geometries'];
        } else if (this.mode === "markers") {
            return ['conflation', 'con', selection, 'meta', 'geometries'];
        }
        return false;
    }

    fetchData() {
        return Promise.resolve()
            .then(() => {
                if (this.mode === "click") {
                    return {mode: "click", data: [...this.data["click"]]};
                }
                if (this.markers.length < 2) {
                    return {mode: "markers", data: []};
                }

                const locations = this.markers.map(m => ({
                    lon: m.getLngLat().lng,
                    lat: m.getLngLat().lat
                }));

                let url = `https://api.mapbox.com/directions/v5/mapbox/driving/` + locations.map(f => `${f.lon},${f.lat}`).join(';');
                url += `?geometries=geojson&access_token=${MAPBOX_TOKEN}`;
                return fetch(url)
                    .then((res, error) => {
                        if (error) return {ways: []};
                        return res.json()
                    })
                    .then(res => {
                        return {mode: "markers", data: res};
                    })
            })
            .then(data => this.receiveRoute(data))
            .then(() => {
                if (this.mode === "markers") {
                    const falcorCache = falcorGraph.getCache();
                    this.nameArray = get(this.data, `markers.waypoints`, [])
                        .reduce((a, c, cI) => {
                            a.push(`Leg - ${cI} ${c.name ? `- ${c.name}` : ''}`);
                            return a;
                        }, []);
                } else {
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
            } else {
                points.push(lngLat);
            }
        }

        const num = Math.max(points.length - 1, 1);

        const scale = d3scale.scaleLinear()
            .domain([0, num * 0.5, num])
            .range(["#1a9641", "#ffffbf", "#d7191c"]);

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

    receiveRoute({mode, data}) {
        this.data[mode] = data;
        data = get(data, `routes`, []).pop();
        if (!data) return;
        if (data.hideAll) {
            this.clearRoute()
        }

        let bounds = new mapboxgl.LngLatBounds();

        if (data.viewAll) {
            this.viewMode = 'multi';
            this.features = data.data.map(f => {
                bounds = bounds.extend(new mapboxgl.LngLatBounds(geoJsonExtent(
                    get(f, `geometry`, {coordinates: [], type: "LineString"})
                )));
                return {
                    type: 'Feature',
                    properties: {name: get(data, `name`, '')},
                    geometry: get(f, `geometry`, {coordinates: [], type: "LineString"})
                }
            });
            this.map.getSource('execution-route-source').setData(
                {
                    type: 'FeatureCollection',
                    features: this.features
                }
            );
            this.map.fitBounds(bounds);

            this.forceUpdate()
        } else if (this.map.getSource('execution-route-source')) {
            this.geom = get(data, `geometry`, {coordinates: [], type: "LineString"});

            let feature = {
                type: 'Feature',
                properties: {name: get(data, `name`, '')},
                geometry: this.geom
            };

            if (get(feature, `geometry.coordinates.length`, 0) > 0){
                bounds = bounds.extend(new mapboxgl.LngLatBounds(geoJsonExtent(
                    get(feature, `geometry`, {coordinates: [], type: "LineString"})
                )));
                this.map.fitBounds(bounds)
            }
            /*let indexOfFeature = _.indexOf(this.features, this.features.filter(f => _.isEqual(f.geometry.coordinates, feature.geometry.coordinates))[0])
            if (indexOfFeature === -1){
                this.viewMode === 'multi' ? this.features.push(feature) : this.features = [feature]
            }else{
                this.features.splice(indexOfFeature, 1)
            }*/
            this.viewMode === 'multi' ? this.features.push(feature) : this.features = [feature]
            this.map.getSource('execution-route-source').setData(
                {
                    type: 'FeatureCollection',
                    features: this.features
                }
            );
            this.forceUpdate()

        }
    }

    paintRoute(geom) {
        if (this.map.getSource('execution-route-source')) {
            let geojson = {
                "type": "FeatureCollection",
                "features": []
            }
            geom.data.routes[0].data.forEach(d => {
                geojson.features.push({
                    type : "Feature",
                    properties:{},
                    geometry: typeof d.geometry === 'string' ? JSON.parse(d.geometry) : d.geometry
                })

            })
            this.map.getSource('execution-route-source').setData(geojson);
            this.forceUpdate()
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
        this.features.pop();
        this.map.getSource('execution-route-source').setData(
            {
                type: 'FeatureCollection',
                features: this.features
            }
        );
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
        this.features = []
        this.map.getSource('execution-route-source').setData(
            {
                type: 'FeatureCollection',
                features: this.features
            }
        );
        // this.mapActions.modeToggle.disabled = false;
        this.calcRoute();
    }

    toggleCreationMode(mode) {
        switch (this.viewMode) {
            case "single":
                this.viewMode = "multi";
                // this.markers.forEach(m => m.remove());
                break;
            case "multi":
                this.viewMode = "single";
                // this.generateMapMarkers();
                break;
        }
        this.creationMode = mode
        if(mode === 'markers'){
            this.doAction([
                "sendMessage",
                {Message: 'Evacuation Route. Click to drop pins and save a route',
                    id:'evacuationRoute',
                    duration:0
                },
            ])
            document.addEventListener('click', onClick.bind(this));

            this.map.on('click',onClick.bind(this))

            function onClick(e){
                document.removeEventListener('click', onClick.bind(this));
                switch (mode) {
                    case "markers":
                        this.handleMapClick(e.lngLat);
                        break;
                }
                this.forceUpdate()
            }

        }
        // this.calcRoute();
    }

    showInfoBox(flag){
        this.infoBoxes.router.show = !!flag ;
        this.forceUpdate()
    }

    loadUserRoute(route) {
        this.mapActions.modeToggle.disabled = true;
        // this.year = new Date(route.updatedAt).getFullYear();

        this.doZoom = true;

        if (get(route, "points", []).length) {
            this.mode = "markers";
            this.generateMapMarkers(route.points);
        } else {
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
            }, {});
            this.routeToLoad = null;
            this.doAction(["updateFilter", "userRoutes", route]);
        } else {
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
            this.map.fitBounds(bounds, {padding: {left: 375, top: 50, right: 425, bottom: 50}});
        }
    }

    getRouteName() {
        return get(this.filters, ["userRoutes", "value", "name"], "Route");
    }

}

export const EvacuationRoutesOptions =  (options = {}) =>{
    return {
        active: true,
        sources: [
            {
                id: 'execution-route-source',
                source: {
                    type: 'geojson',
                    data: {
                        "type": "FeatureCollection",
                        "features": []
                    }
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
                id: "cousubs",
                source: {
                    'type': "vector",
                    'url': 'mapbox://am3081.dlnvkxdi'
                }
            },
        ],
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
        },
            {
                'id': 'counties-layer',
                'source': 'counties',
                'source-layer': 'counties',
                'type': 'line',
                'paint': {
                    ...ConflationStyle.paint,
                    'line-color': 'rgb(16,255,53)',
                },
                filter: ['in', 'geoid', store.getState().user.activeGeoid]
            },
            {
                'id': 'cousubs-layer',
                'source': 'cousubs',
                'source-layer': 'cousubs',
                'type': 'line',
                'paint': {
                    'line-color': 'rgba(16,255,53,0.37)',
                }
            },
        ],
        onHover: {
            layers: ["execution-route"],
            filterFunc: function (features) {
                return [
                    "in",
                    this.getNetworkId(),
                    ...features.map(f => f.properties[this.getNetworkId()])
                        .filter(Boolean)
                ]
            }
        },

        version: 2.0,

        mode: "markers",
        viewMode: 'single',
        features: [],
        markers: [],
        nameArray: [],
        data: {
            markers: [], // array of conlation ids
            click: [] // array of tmc ids
        },
        year: 2019,
        doZoom: false,
        geom: null,
        routeToLoad: null,

        popover: {
            layers: ["cousubs-layer", 'counties-layer'],
            dataFunc: function (feature, features, layer) {
                return [];
            }
        },

        filters: {
            userRoutes: {
                name: "Routes",
                type: "single",
                domain: [],
                value: null,
                searchable: true,
                onChange: function (prev, route, domain) {
                    return this.loadUserRoute(route);
                }
            }
        },
        infoBoxes: {
            router: {
                title: ({layer}) => '',
                comp: ({layer}) => {
                    return (
                        <ControlBase layer={layer}
                                      userRoute={layer.filters.userRoutes.value}
                                      nameArray={layer.nameArray}
                                      data={layer.data}
                                      geom={layer.geom}
                                      paintRoute={layer.receiveRoute.bind(layer)}
                                      viewOnly={layer.viewOnly}
                        />
                    )
                },
                show: false
            }
        },
    }
}

const saveModalForm = (geom, setState) => {
    return (
        <div aria-labelledby="mySmallModalLabel" className="modal fade bd-example-modal-lg show" role="dialog"
             tabIndex="-1" aria-modal="true" style={{paddingRight: '15px', display: 'block'}}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header"><h5 className="modal-title" id="exampleModalLabel">Save Route</h5>
                        <button aria-label="Close" className="close" data-dismiss="modal" type="button"
                                onClick={() => setState({ showSaveModal: false })}
                        >
                            <span aria-hidden="true"> ×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <SaveRoute
                            geom={geom}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
};

const DEFAULT_ROUTE_DATA = {
    name: "",
    type: "personal",
    id: null
};
class EvacuationControlBase extends React.Component{
    constructor(props) {
        super(props);
        this.state ={
            showSaveModal: false,
            route: {...DEFAULT_ROUTE_DATA}
        }

    }

    componentDidMount() {
        this.setState({
            route: {
                ...this.state.route,
                owner: this.state.route.owner === "group" ? this.props.user.groups[0] : this.props.user.id
            }
        })
    }

    componentDidUpdate(oldProps, oldState) {
        if (oldProps.userRoute !== this.props.userRoute || !_.isEqual(oldProps.data, this.props.data)) {
            if (this.props.userRoute === null) {
                this.setState({
                    route: {
                        ...DEFAULT_ROUTE_DATA,
                        owner: this.props.user.id
                    }
                });
            } else {
                this.setState({
                    route: {
                        name: this.props.userRoute.name,
                        type: this.props.userRoute.type,
                        owner: this.props.userRoute.owner,
                        id: this.props.userRoute.id
                    }
                })
            }
        }
    }

    render(){
        let layer = this.props.layer
        let somethingToRemove = false;
        if ((layer.mode === "markers") && (layer.markers.length)) {
            somethingToRemove = true;
        } else if ((layer.mode === "click") && (layer.data.click.length)) {
            somethingToRemove = true;
        }
        let routes = get(layer.data, `routes`, []).pop(),
            geom = get(routes, `geometry`, {coordinates: [], type: "LineString"});
        return (
            <div>
                {!layer.filters.userRoutes.value ? null :
                    <div style={{fontSize: "18px", paddingTop: "5px"}}>
                        Year Created: {new Date(layer.filters.userRoutes.value.updatedAt).getFullYear()}
                    </div>
                }
                {!layer.viewOnly ?
                    <div style={{position: "relative", paddingTop: "10px", display: 'flex', justifyContent: 'space-between'}}>
                        <Button style={{width: "calc(33% - 5px)"}}
                                onClick={e => layer.removeLast()}
                                disabled={!somethingToRemove}
                                secondary>
                            Remove Last
                        </Button>
                        <Button style={{width: "calc(33% - 5px)"}}
                                onClick={e => layer.clearRoute()}
                                disabled={!somethingToRemove}
                                secondary>
                            Clear Route
                        </Button>
                        <Button style={{width: "calc(33% - 5px)"}}
                                disabled={!layer.nameArray.length}
                                onClick={e => this.setState({showSaveModal: true})}
                                primary>
                            Save Route
                        </Button>
                    </div>
                    : null
                }
                {this.state.showSaveModal ? saveModalForm(layer.geom, this.setState.bind(this)) : null}

                <AvlFormsListTable
                    json = {ViewConfig.view}
                    deleteButton = {!layer.viewOnly}
                    viewButton={true}
                    onViewClick={(e) => {
                        if (e.initLoad){
                            if(!this.state.initLoad){
                                this.setState({initLoad: true})
                                return  layer.paintRoute(
                                    {
                                        mode: 'markers',
                                        data: {
                                            routes: [{hideAll: e.hideAll, viewAll: e.viewAll,
                                                data: e.data ?
                                                    e.data.map(f => ({geometry: f.geom, name: f.route_name})):
                                                    []
                                                , geometry: e.geom, name: e.route_name}]
                                        }
                                    }
                                )
                            }
                        }else{
                            return  layer.paintRoute(
                                {
                                    mode: 'markers',
                                    data: {
                                        routes: [{hideAll: e.hideAll, viewAll: e.viewAll,
                                            data: e.data ?
                                                e.data.map(f => ({geometry: f.geom, name: f.route_name})):
                                                []
                                            , geometry: e.geom, name: e.route_name}]
                                    }
                                }
                            )
                        }
                    }}
                />
            </div>
        )
    }
}

const mapStateToProps = (state, { id }) =>
    ({
        user: state.user,
        graph: state.graph,
        buildingData: get(state, ["graph", "building", "byId", id], {}),
        parcelMeta: get(state, ["graph", "parcel", "meta"], {}),
        buildingRiskData : get(state,["graph","building","byId"]),
        actionsData : get(state,["graph","actions","assets","byId"]),
        buildingsByIdData : get(state,['graph','building','byGeoid'])
    });
const mapDispatchToProps = {

};

const ControlBase = connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(EvacuationControlBase))