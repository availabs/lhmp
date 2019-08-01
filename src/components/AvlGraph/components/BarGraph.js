import React from "react"

import ComponentBase from "./ComponentBase"

import get from "lodash.get"

import d3 from "./d3"

import COLOR_RANGES from "constants/color-ranges"
const DEFAULT_COLORS = COLOR_RANGES[12].reduce((a, c) => c.name === "Set3" ? c.colors : a, []).slice();

const HoverComp = ({ data, idFormat, xFormat, yFormat }) =>
  <table className="table table-sm">
    <thead>
      <tr>
        <th colSpan={ 3 }>{ xFormat(data.x) }</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><div style={ { width: "15px", height: "15px", background: data.color } }/></td>
        <td>{ idFormat(data.key) }</td>
        <td>{ yFormat(data.value) }</td>
      </tr>
    </tbody>
  </table>

export class BarGraph extends ComponentBase {
  static defaultProps = ComponentBase.generateDefaultProps({ label: "Test Label",
    HoverComp,
    keys: []
  })
  static componentType = "bar-graph"
  updateComponent() {
    let {
      id,
      svg,
      data,
      width,
      height,
      margin: { top, right, bottom, left },
      keys,
      yDomain,
      xDomain,
      registerData
    } = this.props;
    if (!Boolean(svg)) return;

    const group = d3.select(this.group.current)
      .style("transform", `translate(${ left }px, ${ top }px)`);

    const xScale = d3.scaleBand()
        .domain(xDomain)
        .range([0, width - left - right]);

    if (!keys.length) {
      const keyMap = {};
      data.forEach(bar => {
        let { x, ...rest } = bar;
        for (const k in rest) {
          keyMap[k] = true;
        }
      })
      keys = Object.keys(keyMap);
    }

    const yScale = d3.scaleLinear()
      .domain(yDomain)
      .range([0, height - top - bottom]);

    const GET_COLOR = this.getColor.bind(this);

    const rectData = {};

		const bars = group.selectAll("g.bar")
			.data(data, d => d.x)
			.join("g")
				.attr("class", "bar")
				.style("transform", d => `translate(${ xScale(d.x) }px, 0px)`)
				.each(function(d, i) {
          const thisData = [];
					let current = 0;
					const rects = d3.select(this)
						.selectAll('rect')
  						.data(keys.map((key, i) => ({ bar: d, key, value: get(d, key, 0), x: d.x, color: GET_COLOR(key, i) })), d => d.key)
  						.join("rect")
  							.attr("fill", d => d.color)
  							.attr("width", xScale.bandwidth())
  							.each(function(d) {
  								const h = yScale(d.value);

                  thisData.push({ ...d, h });

  								d3.select(this)
  									.attr("height", h)
  									.attr("y", height - top - bottom - current - h)
  								current += h;
  							})
          rectData[d.x] = thisData;
				})
		bars.exit().remove();

    registerData(id, { type: "bar-graph", data: rectData });
  }
}

export const generateTestBarData = (bars = 50, stacks = 5) => {
  const data = [];
  d3.range(bars).forEach(b => {
    const bar = {
      x: `key-${ b }`
    }
    d3.range(stacks).forEach(s => {
      bar[`stack-${ s }`] = Math.random() * 25 + 25;
    })
    data.push(bar);
  })
  return data;
}

/*
DATA FORMAT
Array [
  Object { <- One Object Per Line
    id: Unique String,
    color: Optional Valid Color String,
    data: Array [
      Object { <- One Object Per Data Point
        x: Value,
        y: Numeric Value
      },
      Object {
        x: Value,
        y: Numeric Value
      },
      ...
    ]
  },
  ...
]
*/
