import React from "react"
import store from "store"
import MapLayer from "components/AvlMap/MapLayer"
import get from 'lodash.get'
import _ from 'lodash'
import turfCentroid from '@turf/centroid'
import {falcorGraph} from "store/falcorGraph"
import COLOR_RANGES from "constants/color-ranges"
import mapboxgl from "mapbox-gl";

const sources = {
    "_dfirm_500_100": {
        source: "mapbox://am3081.dm85ldgj",
        paint: {
            'fill-color': "hsl(352,82%,31%)",
            'fill-opacity':0.3
        }
    },
    "_dfirm_100": {
        source: "mapbox://am3081.6ta7ljid",
        paint: {
            'fill-color': "hsl(211, 83%, 31%)",
            'fill-opacity':0.3
        }
     }
}
class ShowZoneLayer extends MapLayer{
    receiveProps(oldProps, newProps){
        if (!this.zoneId || !_.isEqual(this.zoneId, newProps.zoneId)){
            this.zoneId = newProps.zoneId;
            this.onAdd(this.map).then(this.fetchData())
        }

    }
    onPropsChange(oldProps, newProps){
        if (!this.zoneId || !_.isEqual(this.zoneId, newProps.zoneId)){
            this.zoneId = newProps.zoneId;
            this.onAdd(this.map).then(this.fetchData())
        }

        this.doAction(["fetchLayerData"]);
    }
    addFloodPlane(){
        ['_dfirm_100','_dfirm_500_100'].forEach(layerName => {
            if (this.map.getSource('dfirm')) {
                this.map.removeLayer('dfirm_layer');
                this.map.removeSource('dfirm')
            }
            this.map.addSource("dfirm", {
                'type': "vector",
                'url': sources[layerName].source
            })
            this.map.addLayer({
                'id': 'dfirm_layer',
                'source': 'dfirm',
                'source-layer': store.getState().user.activePlan + layerName,
                'type': 'fill',
                'minzoom': 8,
                'paint': sources[layerName].paint,

            })
        })
    }
    onAdd(map) {
        super.onAdd(map);
        if(store.getState().user.activeGeoid){
            let activeGeoid = store.getState().user.activeGeoid,
                query = this.zoneId && this.zoneId.length ?
                    [['geo',activeGeoid,'boundingBox'], ['geo', activeGeoid, 'municipalities'], ['forms','byId',this.zoneId]] :
                    [['geo',activeGeoid,'boundingBox']]
            return falcorGraph.get(...query)
                .then(response =>{
                    map.setFilter('cousubs', ['all', ['in', 'geoid', ...get(response.json.geo, [activeGeoid, 'municipalities'], [])]])
                    map.setFilter('places', ['all', ['in', 'geoid', ...get(response.json.geo, [activeGeoid, 'municipalities'], [])]])
                    let initalBbox = response.json.geo[activeGeoid]['boundingBox'].slice(4, -1).split(",");
                    let bbox = initalBbox ? [initalBbox[0].split(" "), initalBbox[1].split(" ")] : null;
                    let geojson = {
                        "type": "FeatureCollection",
                        "features": []
                    }

                    if (this.markers.length){
                        this.markers.map(m => {
                            m.remove()
                        });
                    }

                    if (get(this.zoneId, `length`, null)){
                        this.zoneId.forEach(zid => {
                            let attributes = get(response,['json','forms','byId',zid,'attributes'],{})

                            geojson.features.push({
                                type : "Feature",
                                properties:{},
                                geometry: get(attributes, `geojson.coordinates`, null) ? attributes.geojson : attributes.geojson
                            })
                            try {
                                let coords = geojson.features.slice(-1).pop().geometry
                                if (coords){
                                    new mapboxgl.Marker({
                                        draggable: false
                                    })
                                        .setLngLat(turfCentroid(coords).geometry.coordinates)
                                        .addTo(map)
                                        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(
                                            '<div>'
                                            + '<b>'+ 'Name: ' +'</b>'+ attributes.name + '<br>'
                                            + '<b>'+ 'Comment: ' +'</b>'+ attributes.comment +
                                            '</div>'
                                        ))
                                }
                            }catch (e){
                                console.warn(e)
                            }
                        })
                    }
                    this.addFloodPlane();
                    map.resize();
                    map.fitBounds(bbox);
                    // this.map.getSource("polygon").setData(geojson)

                })


        }else{
            return Promise.resolve();
        }
    }

}

const showZoneLayer =  new ShowZoneLayer("ShowZoneLayer",{
    name:'Zones',
    active: true,
    sources: [
        { id:"polygon",
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
            id: "counties",
            source: {
                'type': "vector",
                'url': 'mapbox://am3081.1ggw4eku'
            },
        },
        { id: "cousubs",
            source: {
                'type': "vector",
                'url': 'mapbox://am3081.dlnvkxdi'
            },
        },
        { id: "places",
            source: {
                'type': "vector",
                'url': 'mapbox://am3081.6u9e7oi9'
            },
        }
    ],
    layers: [
        {
            'id': 'counties',
            'source': 'counties',
            'source-layer': 'counties',
            'type': 'line',
            'paint': {
                'line-color': '#F31616',
                'line-opacity': 0.5,
                'line-width': 4
            },
            filter: ['all', ['in', 'geoid',store.getState().user.activeGeoid]]

        },
        {
            'id': 'cousubs',
            'source': 'cousubs',
            'source-layer': 'cousubs',
            'type': 'line',
            // 'paint': {
            //     'line-color': '#F31616',
            //     'line-opacity': 0.5,
            //     'line-width': 4
            // },
            //filter : ['in','geoid',store.getState().user.activeGeoid]
        },
        {
            'id': 'places',
            'source': 'places',
            'source-layer': 'places',
            'type': 'line',
            // 'paint': {
            //     'line-color': '#F31616',
            //     'line-opacity': 0.5,
            //     'line-width': 4
            // },
            //filter : ['in','geoid',store.getState().user.activeGeoid]
        },
        {
            'id': 'polygon-layer',
            'source': 'polygon',
            'type': 'line',
            'paint': {
                'line-color': '#F31616',
                'line-opacity': 0.5,
                'line-width': 4
            }
        }

    ],
    markers: []
})

export default showZoneLayer