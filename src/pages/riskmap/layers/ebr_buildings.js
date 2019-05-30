import React from "react"

import {
    ArrowDown,
    ArrowRight
} from "components/common/icons"

import store from "store"
import { falcorGraph } from "store/falcorGraph"
import { update } from "utils/redux-falcor/components/duck"
import { fnum } from "utils/sheldusUtils"
import {
    scaleQuantile,
    scaleOrdinal,
    scaleQuantize
} from "d3-scale"

import COLOR_RANGES from "constants/color-ranges"

import MapLayer from "components/AvlMap/MapLayer"

const QUANTILE_RANGE = COLOR_RANGES[5]
  .reduce((a, c) => c.name === "Spectral" ? c.colors : a)


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
    // if(filterName !== 'area') {
    //   return Promise.resolve([])
    // }
    const geoids = this.filters.area.value
    return falcorGraph.get(["building", "byGeoid", geoids, "length"])
      .then(res => {
        console.log('length data', res)
        let requests =  geoids.map(geoid => {
          const length = res.json.building.byGeoid[geoid].length;
          return ["building", "byGeoid", geoid, "byIndex", { from: 0, to: length-1}, "id"]
        })
        requests.push(["building", "byGeoid", geoids, "length"])
        return requests
      })
      .then(requests => {
        return falcorGraph.get(...requests)
          .then(res => {
            const buildingids = [];
            console.log('got data', res)
            geoids.forEach(geoid => {
              const length = res.json.building.byGeoid[geoid].length;
              const graph = res.json.building.byGeoid[geoid].byIndex;
              console.log('building ids', geoid, graph, res.json.building.byGeoid)
              Object.values(graph).forEach(building => {
                if(building.id){
                  buildingids.push(building.id)
                }
              })
            })
            return buildingids;
          })
      })
      .then(buildingids => {
        const requests = [],
          num = 500;
        for (let i = 0; i < buildingids.length; i += num) {
          requests.push(buildingids.slice(i, i + num))
        }
        console.time('make requests')
        return requests.reduce((a, c) => a.then(() => falcorGraph.get(["building", "byId", c, ["replacement_value","name", "type", "critical", "flood_zone"]])), Promise.resolve())
          .then((res) => {
            console.timeEnd('make requests')
            let graph = falcorGraph.getCache().building.byId
            const measure = this.filters.measure.value;
            console.log('why?',res.json.building.byId, measure)
            let data = Object.keys(graph).reduce((out, curr) => {
              out[curr] = graph[curr][measure]
              return out 
            },{})
            return  data;
          })
      })
    
  }


  fetchData() {
    console.log('fetching')
    return Promise.resolve([])
  }


  receiveData(map, data) {
    console.log('receiveData',data)
    let colors = {}
    let domain = []
   
    console.log(this.filters.measure.domain, this.filters.measure.value)
    let measureInfo = this.filters.measure.domain.filter(d => d.value === this.filters.measure.value)[0]
    if(measureInfo.type === 'ordinal') {
      colors = processOrdinal(data, measureInfo.value)
    } else {
      let cd = processNonOrdinal(data, this.legend.type, this.legend.range )
      colors = cd.colors
      domain = cd.domain
      this.legend.domain = domain;
    }

    this.legend.active = true;
    map.setFilter('ebr', ["in", "id", ...Object.keys(data).map(d => +d)])
    map.setPaintProperty('ebr', 'fill-color', ["get", ["to-string", ["get", "id"]], ["literal", colors]]);
    
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
  legend: {
    type: "quantile",
    types: ["quantile", "quantize"],
    vertical: false,
    range: QUANTILE_RANGE,
    active: false,
    domain: [],
  },
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
      domain: [
        {name: "Replacement Value", value: 'replacement_value', type: 'numeric'},
         {name: "Flood Zone", value: 'flood_zone', type: 'ordinal'},
        {name: "Critical Facilities (FCode)", value: 'critical', type: 'ordinal'}
      ],
      value: "replacement_value"
      
    }
  },
   popover: {
    layers: ["ebr"],
    dataFunc: feature => {
      const id = feature.properties.id;
      // console.log (feature.properties)

      try {
        const graph = falcorGraph.getCache().building.byId;
        // console.log('graph over',id, graph[id].replacement_value)
        // console.log('graph over',id, graph[id].name)
        // console.log('graph over',id, graph[id].type)
        // console.log('graph over',id, graph[id].critical)
        // console.log('graph over',id, graph[id].flood_zone)


        return [
            ["Building ID", id],
            ["Replacement Cost", fnum(+graph[id].replacement_value)],
            ["Name", (graph[id].name)],
            ["Type", (graph[id].type) ],
            ["Critical Facilities (FCode)", (graph[id].critical) ],
            ["Flood Zone", (graph[id].flood_zone) ]

     
        ]
      }
      catch (e) {
        // console.log(e)
        return ['no data']
      }
    }
  }
})

export default EBR;

function processNonOrdinal(data, type='quantile', range=QUANTILE_RANGE) {
   let colors = {}
   let domain = Object.values(data).map(d => +d);

    let min = Math.min(...domain)
    let max =  Math.max(...domain)

    let scale;
    let newDomain = []
    console.log(data, domain, min, max)

    switch (type) {
      case "quantile":
        scale = scaleQuantile()
          .domain(domain)
          .range(range);
        newDomain= domain;
        break;
      case "quantize":
        scale = scaleQuantize()
          .domain([min, max])
          .range(range);
        newDomain = [min, max];
        break;
    }

    for (const pid in data) {
      colors[pid] = scale(data[pid])
    }
    return {colors, domain: newDomain}
  }

  function processOrdinal (data) {
    return Object.keys(data).reduce((out, building_id) => {
      
        out[building_id] = data[building_id] ? 'red' : 'black';
      
      return out;
    },{})
  }  

   /* function processCritical (data) {
    return Object.keys(data).reduce((out, building_id) => {
      out[building_id] = data[building_id].critical ? 'red' : 'black';
      return out;
    },{})
  }  
*/


  // function processOrdinal(data, type='quantile', range=QUANTILE_RANGE) {
  //   const measure = this.filters.measure.value,
  //     graph = falcorGraph.getCache().parcel.byId,

  //     values = {},
  //     colors = {},

  //     domainMap = {},

  //     scale = scaleOrdinal();

  //   parcelids.forEach(pid => {
  //     let value = graph[pid][measure];
  //     if (value) {
  //       if (measure === "prop_class") {
  //         value = +(graph[pid][measure].toString()[0]) * 100;
  //       }
  //       values[pid] = value;
  //       domainMap[value] = true;
  //     }
  //   })

  //   const domain = Object.keys(domainMap);

  //   let range = this.legend.range;
  //   if (range.length !== domain.length) {
  //     range = COLOR_RANGES[domain.length].reduce((a, c) => c.type === "qualitative" ? c.colors : a);
  //   }

  //   scale.domain(domain)
  //     .range(range);

  //   this.legend.domain = domain;
  //   this.legend.range = range;

  //   for (const pid in values) {
  //     colors[pid] = scale(values[pid])
  //   }
  //   return colors
  // }
