import React from "react"

import {
    ArrowDown,
    ArrowRight
} from "components/common/icons"

import MapLayer from "components/AvlMap/MapLayer"

const threedLayer = new MapLayer("Enhanced Buildings Risks", {
  active: true,
  sources: [
    { id: "buildings-3d",
      source: {
        'type': "vector",
        'url': 'mapbox://am3081.dpm2lod3'
      }
    }
  ],
  layers: [
    { 'id': 'buildings_layer_3d',
        'source': 'buildings-3d',
        'source-layer': 'nys_buildings_osm_ms_parcelid_pk',
        'type': 'fill',
        'minzoom': 8,
        'paint': {
            'fill-color': '#000000'        
        }

    }
  ]
})

export default threedLayer;