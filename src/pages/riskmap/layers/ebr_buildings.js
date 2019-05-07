import React from "react"

import {
    ArrowDown,
    ArrowRight
} from "components/common/icons"

import store from "store"
import { falcorGraph } from "store/falcorGraph"
import { update } from "utils/redux-falcor/components/duck"

import MapLayer from "components/AvlMap/MapLayer"

class EBRLayer extends MapLayer {

  onAdd(map) {
    super.onAdd(map)
    this.loading = true;

    const geoLevel = "cousubs";
    falcorGraph.get(["geo", "36", geoLevel])
      .then(res => res.json.geo['36'][geoLevel])
      .then(geoids => {
        const requests = [],
            num = 500;
        for (let i = 0; i < geoids.length; i += num) {
          requests.push(geoids.slice(i, i + num))
        }
        return requests.reduce((a, c) => a.then(() => falcorGraph.get(["geo", c, "name"])), Promise.resolve())
          .then(() => {
            const graph = falcorGraph.getCache().geo;
            console.log()
            this.filters.area.domain = geoids.map(geoid => {
              return { value: geoid, name: graph[geoid].name }
            })
            .filter(d => d.value && d.name.toLowerCase)
            .sort((a, b) => {
              const aCounty = a.value.slice(0, 5),
                bCounty = b.value.slice(0, 5);
              if (aCounty === bCounty) {
                return a.name < b.name ? -1 : 1;
              }
              return +aCounty - +bCounty;
            })
            console.log('municipal data', this.filters.area)
          })
      })
      .then(() => store.dispatch(update(falcorGraph.getCache())))
      .then(() => this.component.forceUpdate())

      this.component.updateFilter('Enhanced Buildings Risks', 'area', ['3600101000'])
  }


  onFilterFetch(filterName, oldValue, newValue) {
    console.log('onFilterFetch', filterName, oldValue, newValue)
    if(filterName !== 'area') {
      return Promise.resolve([])
    }
    const geoids = newValue
    return falcorGraph.get(["parcel", "byGeoid", geoids, "length"])
      .then(res => {
        let max = -Infinity;
        return geoids.map(geoid => {
          const length = res.json.parcel.byGeoid[geoid].length;
          return ["parcel", "byGeoid", geoid, "byIndex", { from: 0, to: length }, "id"]
        })
      })
      .then(requests => {
        return falcorGraph.get(...requests)
          .then(res => {
            const parcelids = [];
            console.log('got data', res)
            // geoids.forEach(geoid => {
            //   const graph = res.json.parcel.byGeoid[geoid].byIndex;
            //   for (let i = 0; i < length; ++i) {
            //     if (graph[i]) {
            //       parcelids.push(graph[i].id)
            //     }
            //   }
            // })
            return parcelids;
          })
      })
    
  }


  fetchData() {
    console.log('fetching')
    return Promise.resolve([])
  }


  receiveData(map, data) {
    console.log('receiveData', data)
  }

}


const EBR = new EBRLayer("Enhanced Buildings Risks", {
  active: true,
  sources: [
    { id: "nys_buildings_avail",
      source: {
        'type': "vector",
        'url': 'mapbox://am3081.dpm2lod3'
      }
    }
  ],
  layers: [
    { 'id': 'ebr',
        'source': 'nys_buildings_avail',
        'source-layer': 'nys_buildings_osm_ms_parcelid_pk',
        'type': 'fill',
        'minzoom': 8,
        'paint': {
            'fill-color': '#000000'        
        }

    }
  ], 
  filters: {
    area: {
      name: 'Area',
      type: 'multi',
      domain: [],
      value: []
    },
    measure: {
      name: "Measure",
      type: "dropdown",
      domain: [],
      value: "full_market_val"
    }
  },
   popover: {
    layers: ["ebr"],
    dataFunc: feature => {
      const id = feature.properties.id;
      // console.log (feature.properties)

      try {
        
        return [
            ["Building ID", id]
        ]
      }
      catch (e) {
        return []
      }
    }
  }
})

export default EBR;