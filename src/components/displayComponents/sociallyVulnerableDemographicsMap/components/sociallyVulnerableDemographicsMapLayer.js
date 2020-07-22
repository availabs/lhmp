import React from "react"

import store from "store"
import {falcorGraph} from "store/falcorGraph"
import get from "lodash.get"
import {scaleQuantile, scaleQuantize} from "d3-scale"
import {extent} from "d3-array"
import {format as d3format} from "d3-format"
import MapLayer from "components/AvlMap/MapLayer.js"
import {getColorRange} from "constants/color-ranges";
import {register, unregister} from "../../../../components/AvlMap/ReduxMiddleware";

var _ = require('lodash')
const LEGEND_COLOR_RANGE = getColorRange(7, "Reds");
const BORDER_COLOR = "#4292c6"
const HOVER_COLOR = "#6baed6";
const IDENTITY = i => i;
const zoomThreshold = 11

class VulnerableDemographicsLayer extends MapLayer {
    receiveMessage(action, data) {
        this.activeIndicator = data.indicator[0]
        this.activeIndicator.forEach(item => {
            this.censusKey = [item.censusKey].flat(1)
            this.divisorKey = [item.divisorKey]
            this.census_keys = [...this.censusKey, ...this.divisorKey].flat(1)
        })
        return this.fetchData().then(data => this.receiveData(data, this.map))
    }
    receiveProps(oldProps, newProps){
        if (((newProps.selected_indicator) && this.selected_indicator !== newProps.selected_indicator)) {
            this.activeIndicator = newProps.selected_indicator[0];
            this.censusKey = [this.activeIndicator.censusKey].flat(1)
            this.divisorKey = [this.activeIndicator.divisorKey]
            this.census_keys = [...this.censusKey, ...this.divisorKey].flat(1)
            this.setDomain = newProps.setDomain;
            this.fetchData().then(data => this.receiveData(this.map, data))
        }
    }
    onPropsChange(oldProps, newProps){
        if (((newProps.selected_indicator) && this.selected_indicator !== newProps.selected_indicator)) {
            this.activeIndicator = newProps.selected_indicator[0];
            this.censusKey = [this.activeIndicator.censusKey].flat(1)
            this.divisorKey = [this.activeIndicator.divisorKey]
            this.census_keys = [...this.censusKey, ...this.divisorKey].flat(1)
            this.setDomain = newProps.setDomain;
            this.doAction(["fetchLayerData"]);
        }
    }
    onAdd(map) {
        register(this, 'USER::SET_INDICATOR', ["demographics"])
        super.onAdd(map);
        if (store.getState().user.activeGeoid) {
            let activeGeoid = store.getState().user.activeGeoid
            return falcorGraph.get(['geo', activeGeoid, 'boundingBox'],
                ["geo", activeGeoid, ["tracts", activeGeoid, "name"]],
                ["geo", activeGeoid, ["blockgroup", activeGeoid, "name"]])
                .then(response => {
                    let initalBbox = response.json.geo[activeGeoid]['boundingBox'].slice(4, -1).split(",");
                    let bbox = initalBbox ? [initalBbox[0].split(" "), initalBbox[1].split(" ")] : null;
                    map.resize();
                    map.fitBounds(bbox);
                    this.fetchData().then((data) => this.receiveData(data, map))
                })
        }
    }

    onRemove(map) {
        unregister(this);
    }

    toggleVisibilityOn() {
        this.layers.forEach(layer => {
            this.map.setLayoutProperty(layer.id, 'visibility', "visible");
        })
    }

    toggleVisibilityOff() {
        this.layers.forEach(layer => {
            this.map.setLayoutProperty(layer.id, 'visibility', "none");
        })
    }

    getColorScale(domain) {
        switch (this.legend.type) {
            case "quantile":
                this.legend.domain = domain
                this.setDomain(domain)
                return scaleQuantile()
                    .domain(this.legend.domain)
                    .range(this.legend.range);
            case "quantize":
                this.legend.domain = extent(domain)
                this.setDomain(extent(domain))
                return scaleQuantize()
                    .domain(this.legend.domain)
                    .range(this.legend.range);
        }
        this.layer.forceUpdate()

    }

    fetchData() {
        let activeGeoid = store.getState().user.activeGeoid
        return falcorGraph.get(["geo", activeGeoid, "name"],
            ["geo", activeGeoid, ["tracts", activeGeoid, "name"]],
            ["geo", activeGeoid, ["blockgroup", activeGeoid, "name"]])
            .then(response => {
                this.tracts = get(response, ['json', 'geo', activeGeoid, "tracts"])
                this.blockGroups = get(response, ['json', 'geo', activeGeoid, "blockgroup"])
                falcorGraph.get(["geo", [...this.tracts, ...this.blockGroups], ["name"]],
                    ["acs", [...this.tracts, ...this.blockGroups], '2017', this.census_keys])
                    .then(response => {
                        return response
                    })
            })
    }

    receiveData(map, data) {
        if (!this.censusKey || !this.divisorKey) return;
        if (!map) map = this.map;
        let graph = falcorGraph.getCache()
        // tracts
        const valueMapTracts = this.tracts.reduce((a, c) => {
            let value = this.censusKey.reduce((aa, cc) => {
                const v = get(graph, ["acs", c, '2017', cc], -666666666);
                if (v !== -666666666) {
                    aa += v;
                }

                return aa;
            }, 0);
            const divisor = this.divisorKey.reduce((aa, cc) => {
                const v = get(graph, ["acs", c, '2017', cc], -666666666);
                if (v != -666666666) {
                    aa += v;
                }
                return aa;
            }, 0)
            if (divisor !== 0) {
                value /= divisor;
            }
            a[c] = value;
            return a;
        }, {})
        const valuesTracts = Object.values(valueMapTracts);
        if (!valuesTracts.length) return;
        const colorScaleTracts = this.getColorScale(valuesTracts),
            colorsTracts = {};
        for (const key in valueMapTracts) {
            colorsTracts[key] = colorScaleTracts(valueMapTracts[key]);

        }
        this.tracts.forEach(geoid => {
            colorsTracts[geoid] = get(colorsTracts, geoid, "#000")
        })
        this.map.setFilter("tracts", ["in", "geoid", ...this.tracts]);
        this.map.setPaintProperty("tracts", "fill-color",
            ["case",
                ["boolean", ["feature-state", "hover"], false], HOVER_COLOR,
                ["case",
                    ["has", ["to-string", ["get", "geoid"]], ["literal", colorsTracts]],
                    ["get", ["to-string", ["get", "geoid"]], ["literal", colorsTracts]],
                    "#000"
                ]
            ]
        )

        //blockGroups
        const valueMapBlockGroup = this.blockGroups.reduce((a, c) => {
            let value = this.censusKey.reduce((aa, cc) => {
                const v = get(graph, ["acs", c, '2017', cc], -666666666);
                if (v !== -666666666) {
                    aa += v;
                }
                return aa;
            }, 0);
            const divisor = this.divisorKey.reduce((aa, cc) => {
                const v = get(graph, ["acs", c, '2017', cc], -666666666);
                if (v != -666666666) {
                    aa += v;
                }
                return aa;
            }, 0)
            if (divisor !== 0) {

                value /= divisor;
            }
            a[c] = value;
            return a;
        }, {})
        var self = this
        this.map.on('zoom', function () {
            if (map.getZoom() > zoomThreshold) {
                const valuesBlockGroup = Object.values(valueMapBlockGroup);
                if (!valuesBlockGroup.length) return;
                const colorScaleBlockGroup = self.getColorScale(valuesBlockGroup),
                    colorsBlockGroup = {};

                for (const key in valueMapBlockGroup) {
                    colorsBlockGroup[key] = colorScaleBlockGroup(valueMapBlockGroup[key]);
                }

                self.blockGroups.forEach(geoid => {
                    colorsBlockGroup[geoid] = get(colorsBlockGroup, geoid, "#000")
                })

                map.setFilter("blockgroup", ["in", "geoid", ...self.blockGroups]);
                map.setPaintProperty("blockgroup", "fill-color",
                    ["case",
                        ["boolean", ["feature-state", "hover"], false], HOVER_COLOR,
                        ["case",
                            ["has", ["to-string", ["get", "geoid"]], ["literal", colorsBlockGroup]],
                            ["get", ["to-string", ["get", "geoid"]], ["literal", colorsBlockGroup]],
                            "#000"
                        ]
                    ]
                )
            }
        });
    }
}


const vulnerableDemographicsLayer = new VulnerableDemographicsLayer('VulnerableDemographicsLayer', {

    active: true,
    sources: [
        {
            id: "tracts",
            source: {
                'type': "vector",
                'url': 'mapbox://am3081.2x2v9z60'
            },
        },
        {
            id: "blockgroup",
            source: {
                'type': "vector",
                'url': 'mapbox://am3081.52dbm7po'
            }
        }
    ],
    layers: [
        {
            'id': 'tracts',
            'source': 'tracts',
            'source-layer': 'tracts',
            'type': 'fill',
            'maxzoom': zoomThreshold,
            'paint': {
                'fill-color': 'rgba(195, 0, 0, 0.1)',
                'fill-opacity': 0.3,

            },
            filter: ['in', 'geoid', 'none']
        },
        {
            id: "blockgroup",
            source: "blockgroup",
            'source-layer': "blockgroups",
            'type': 'fill',
            'minzoom': zoomThreshold,
            'paint': {
                'fill-color': 'rgba(195,0,0,0.1)',
                'fill-opacity': 0.3,

            },
            filter: ['in', 'geoid', 'none']
        },

    ],
    geoLevel: 'tracts',
    legend: {
        type: "quantile",
        domain: [],
        range: LEGEND_COLOR_RANGE,
        format: d3format(".0%"),
        active: false,
    },

})

export default vulnerableDemographicsLayer
