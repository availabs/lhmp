import React from "react"
import store from "store"
import MapLayer from "components/AvlMap/MapLayer"
import get from 'lodash.get'
import _ from 'lodash'
import {falcorGraph} from "store/falcorGraph"
import COLOR_RANGES from "constants/color-ranges"

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
    onAdd(map) {
        super.onAdd(map);
        if(store.getState().user.activeGeoid){
            let activeGeoid = store.getState().user.activeGeoid,
                query = this.zoneId && this.zoneId.length ?  [['geo',activeGeoid,'boundingBox'], ['forms','byId',this.zoneId]] : [['geo',activeGeoid,'boundingBox']]
            return falcorGraph.get(...query)
                .then(response =>{
                    let initalBbox = response.json.geo[activeGeoid]['boundingBox'].slice(4, -1).split(",");
                    let bbox = initalBbox ? [initalBbox[0].split(" "), initalBbox[1].split(" ")] : null;
                    let geojson = {
                        "type": "FeatureCollection",
                        "features": []
                    }
                    if (get(this.zoneId, `length`, null)){
                        this.zoneId.forEach(zid => {
                            let attributes = get(response,['json','forms','byId',zid,'attributes'],{})
                            geojson.features.push({
                                type : "Feature",
                                properties:{},
                                geometry: attributes.geojson.coordinates ? attributes.geojson : JSON.parse(attributes.geojson)
                            })
                        })
                    }
                    map.resize();
                    map.fitBounds(bbox);
                    this.map.getSource("polygon").setData(geojson)

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
            'paint': {
                'line-color': '#F31616',
                'line-opacity': 0.5,
                'line-width': 4
            },
            filter : ['in','geoid','']

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

    ]
})

export default showZoneLayer