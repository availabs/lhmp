import React from "react"

import deepequal from "deep-equal"

import COLOR_RANGES from "constants/color-ranges"
const DEFAULT_COLORS = COLOR_RANGES[12].reduce((a, c) => c.name === "Set3" ? c.colors : a, []).slice();

let ID_COUNTER = 0;
console.log("COLOR_RANGES:",COLOR_RANGES)
export default class ComponentBase extends React.Component {
  static generateDefaultProps = newProps => ({
    data: [],
    id: `component-${ ++ID_COUNTER }`,
    colors: (d, i) => DEFAULT_COLORS[i % DEFAULT_COLORS.length],
    ...newProps
  })
  group = React.createRef()
  state = {
    colorRange: [...DEFAULT_COLORS]
  }
  componentDidMount() {
    this.updateComponent();
    if (typeof this.props.colors === "string") {
      const [k1, k2] = this.props.colors.split("-"),
        colorRange = COLOR_RANGES[k1].reduce((a, c) => c.name === k2 ? c.colors : a, []).slice();
      this.setState({ colorRange })
    }
  }
  componentDidUpdate(oldProps, oldState) {
    if (!deepequal(oldProps.data, this.props.data) ||
        !deepequal(oldProps.xDomain, this.props.xDomain) ||
        !deepequal(oldProps.yDomain, this.props.yDomain) ||
        oldProps.width !== this.props.width ||
        oldProps.height !== this.props.height) {
      this.updateComponent();
    }
  }
  updateComponent() {}
  getColor(d, i) {
    const { colors } = this.props;
    if (typeof colors === "function") {
      return colors(d, i);
    }
    if (typeof colors === "string") {
      return this.state.colorRange[i % this.state.colorRange.length];
    }
    return colors[i % colors.length];
  }
  render() {
    return (
      <g ref={ this.group }/>
    )
  }
}
