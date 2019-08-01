import React from "react"

import ComponentBase from "./ComponentBase"

import d3 from "./d3"

export class AxisLeft extends ComponentBase {
  static defaultProps = ComponentBase.generateDefaultProps({ label: "" })
  static componentType = "y-axis"
  updateComponent() {
    const {
      svg,
      data,
      width,
      height,
      margin: { top, right, bottom, left },
      label
    } = this.props;
    if (!Boolean(svg)) return;

    const yScale = d3.scaleLinear()
      .domain(data)
      .range([height - top - bottom, 0]);

    const axisLeft = d3.axisLeft(yScale);

    const group = d3.select(this.group.current)
      .style("transform", `translate(${ left }px, ${ top }px)`);

    group.selectAll("g.axis")
      .data(data.length ? ["axis-left"] : [])
        .join("g")
          .attr("class", "axis axis-left")
          .call(axisLeft);

    group.selectAll("text.axis-label")
      .data(data.length && Boolean(label) ? [label] : [])
        .join("text")
          .attr("class", "axis-label axis-label-left")
          .style("transform", `translate(${ -left + 10 }px, ${ (height - top - bottom) * 0.5 }px) rotate(-90deg)`)
          .attr("text-anchor", "middle")
					.attr("fill", "#000")
          .text(d => d)

    group.selectAll("line.grid-line")
      .data(yScale.ticks())
        .join("line")
          .attr("x1", 0)
          .attr("x2", width - left - right)
          .attr("y1", yScale)
          .attr("y2", yScale)
          .style("stroke", "rgba(0, 0, 0, 0.25)")
  }
}
