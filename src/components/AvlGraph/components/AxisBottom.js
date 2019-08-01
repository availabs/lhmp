import React from "react"

import ComponentBase from "./ComponentBase"

import d3 from "./d3"

export class AxisBottom extends ComponentBase {
  static defaultProps = ComponentBase.generateDefaultProps({ label: "",
    ticks: 10,
    tickValues: []
  })
  static componentType = "x-axis"
  updateComponent() {
    const {
      svg,
      data,
      width,
      height,
      margin: { top, right, bottom, left },
      xFormat,
      label
    } = this.props;
    if (!Boolean(svg)) return;

    const xScale = d3.scalePoint()
      .domain(data)
      .range([0, width - left - right])
      .padding(0.5);

    const axisBottom = d3.axisBottom(xScale)
      .tickValues(this.getTickValues())
      .tickFormat(xFormat);

    const group = d3.select(this.group.current)
      .style("transform", `translate(${ left }px, ${ height - bottom }px)`);

    group.selectAll("g.axis")
      .data(data.length ? ["axis-bottom"] : [])
        .join("g")
          .attr("class", "axis axis-bottom")
          .call(axisBottom);

    group.selectAll("text.axis-label")
      .data(data.length && Boolean(label) ? [label] : [])
        .join("text")
          .attr("class", "axis-label axis-label-bottom")
          .style("transform", `translate(${ (width - left - right) * 0.5 }px, ${ bottom - 10 }px)`)
          .attr("text-anchor", "middle")
					.attr("fill", "#000")
          .text(d => d)
  }
  getTickValues() {
    let {
      data,
      ticks,
      tickValues
    } = this.props;

    if (tickValues.length) return tickValues;

    return [
      ...new Set(
        d3.scaleLinear()
          .domain([0, data.length - 1])
          .ticks(ticks)
          .map(t => Math.round(t))
      )
    ]
    .map(t => data[t]);
  }
}
