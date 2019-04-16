import React from "react"

import {
    ArrowDown,
    ArrowRight
} from "components/common/icons"

import MapLayer from "components/AvlMap/MapLayer"

const threedLayer = new MapLayer("State Owned Buildings", {
  active: false,
  sources: [
    { id: "ogs_buildings",
      source: {
        'type': "vector",
        'url': 'mapbox://am3081.daswim5h'
      }
    }
  ],
  layers: [
    { 'id': 'buildings_layer',
        'source': 'ogs_buildings',
        'source-layer': 'nys_buildings_ogs-celkyq',
        'type': 'fill',
        'minzoom': 8,
        'paint': {
            'fill-color': '#ff0000'        
        }

    }
  ]
})

export default threedLayer;