import React from "react"
import store from "store"
import MapLayer from "components/AvlMap/MapLayer"
import turfBbox from '@turf/bbox'
import get from 'lodash.get'
import {falcorGraph} from "store/falcorGraph"
import COLOR_RANGES from "constants/color-ranges"

class ShowZoneLayer extends MapLayer{
    receiveProps(oldProps, newProps){
        if (!this.zoneId || this.zoneId !== newProps.zoneId){
            this.zoneId = newProps.zoneId;
            this.onAdd(this.map).then(this.fetchData())
        }

    }

    onAdd(map) {
        super.onAdd(map);
        if(store.getState().user.activeGeoid && this.zoneId){
            let activeGeoid = store.getState().user.activeGeoid
            return falcorGraph.get(['geo',activeGeoid,'boundingBox'],
                ['forms','byId',this.zoneId]
                )
                .then(response =>{
                    // let initalBbox = response.json.geo[activeGeoid]['boundingBox'].slice(4, -1).split(",");
                    // let bbox = initalBbox ? [initalBbox[0].split(" "), initalBbox[1].split(" ")] : null;
                    let attributes = get(response,['json','forms','byId',[this.zoneId],'attributes'],{})
                    let bbox = turfBbox(attributes.geojson)
                    let geojson = {
                        "type": "FeatureCollection",
                        "features": []
                    }
                    geojson.features.push({
                            type : "Feature",
                            properties:{},
                            geometry: attributes.geojson.coordinates ? attributes.geojson : JSON.parse(attributes.geojson)
                        }
                    )
                    map.resize();
                    map.fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]]);
                    this.map.getSource("polygon").setData(geojson)

                })


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