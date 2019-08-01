import React from "react"
import ReactDOM from 'react-dom'

import deepequal from "deep-equal"
import get from "lodash.get"
import styled from "styled-components"

import d3 from "./components/d3"

import "./styles.css"

const DEFAULT_MARGIN = { top: 20, right: 20, bottom: 20, left: 20 };

const TRANSITION_SCALE = d3.scaleLinear()
  .domain([5, 250])
  .range([0.1, 0.25]);

export default class AvlGraph extends React.Component {
  static defaultProps = {
    margin: { ...DEFAULT_MARGIN },
    xFormat: x => x,
    yFormat: y => y,
    idFormat: id => id
  }

  constructor(props) {
    super(props);

    this.state = {
      width: 0,
      height: 0,
      showHover: false,
      hoverData: {}
    }
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  componentData = {}
  xDomain = []
  yDomain = []
  transitionTime = 0.15
  hoverData = {}

  container = null;
  svg = null;
  hover = null;

  componentDidMount() {
    this.setSize();
    this.enrichInteractiveLayer();
  }
  componentDidUpdate() {
    this.setSize();
    this.enrichInteractiveLayer();
  }
  enrichInteractiveLayer() {
    d3.select("#interactive-layer")
      .selectAll("rect")
        .datum(function() {
          const rect = d3.select(this);
          return {
            x: rect.attr("data-x"),
            xpos: rect.attr("data-xpos")
          }
        })
        .on("mousemove", this.onMouseMove);
  }
  setSize() {
    const { svg } = this;
    if (Boolean(svg)) {
      const width = svg.clientWidth,
        height = svg.clientHeight;
      if ((width !== this.state.width) || (height !== this.state.height)) {
        this.setState({ width, height });
      }
    }
  }
  renderChildren() {
    const { svg } = this;

    const {
      width,
      height
    } = this.state;

    let xDomain = [],
      childDomains = [];

    React.Children.forEach(this.props.children, child => {
      const childType = child.type.componentType;
      switch (childType) {
        case "line-graph": {
          const xd = get(child.props.data, '[0].data', []).map(d => d.x);
          childDomains.push(xd);
          break;
        }
        case "bar-graph": {
          const xd = child.props.data.map(d => d.x);
          childDomains.push(xd);
          break;
        }
      }
    })
    xDomain = childDomains.reduce((a, c) => {
      if (!deepequal(a, c)) {
        console.error("<AvlGraph> OOPS!!! Mismatched graph x domains.");
      }
      return a.length > c.length ? a : a.length < c.length ? c : a;
    })

    let yDomain = [0, 0];

    React.Children.forEach(this.props.children, child => {
      const childType = child.type.componentType;
      switch (childType) {
        case "line-graph": {
          const max = Math.max(yDomain[1], d3.max(child.props.data.reduce((a, c) => [...a, ...c.data.map(d => d.y)], [])));
          yDomain = [0, Math.max(max, yDomain[1])];
          break;
        } // END case "line-graph"
        case "bar-graph": {
          let keys = child.props.keys;
          if (!keys.length) {
            const keyMap = {};
            child.props.data.forEach(bar => {
              let { x, ...rest } = bar;
              for (const k in rest) {
                keyMap[k] = true;
              }
            })
            keys = Object.keys(keyMap);
          }
          const max = child.props.data.reduce((a, c) => Math.max(a, d3.sum(keys.map(k => c[k]))), 0);
          yDomain = [0, Math.max(max, yDomain[1])];
        } // END case "bar-graph"
      }
    })
    const transitionTime = TRANSITION_SCALE(width / xDomain.length);

    const children = React.Children.map(this.props.children, child => {
      const childType = child.type.componentType,
        newProps = {
          margin: { ...DEFAULT_MARGIN, ...this.props.margin },
          svg,
          width,
          height,
          registerData: this.registerData.bind(this),
          yDomain,
          xDomain
        };
      if (childType === "y-axis") {
        newProps.data = [...yDomain];
      }
      else if (childType === "x-axis") {
        newProps.data = [...xDomain];
        newProps.xFormat = child.props.xFormat || this.props.xFormat;
      }
      return React.cloneElement(child, newProps);
    });

    return { xDomain, yDomain, transitionTime, children };
  }
  renderInteractiveLayer(xDomain, yDomain, transitionTime) {
    this.xDomain = xDomain;
    this.yDomain = yDomain;
    this.transitionTime = transitionTime;

    const { width, height } = this.state,
      { top, right, bottom, left } = { ...DEFAULT_MARGIN, ...this.props.margin };

    const xScale = d3.scalePoint()
      .domain(xDomain)
      .range([0, width - left - right])
      .padding(0.5)

    return xDomain.map((x, i) =>
      <rect key={ x }
        x={ i * xScale.step() }
        width={ xScale.step() }
        height={ Math.max(height - top - bottom, 0) }
        fill="none"
        pointerEvents="all"
        data-x={ x }
        data-xpos={ xScale(x) }/>
    )
  }
  getHoverComps() {
    return Object.keys(this.state.hoverData)
      .reduce((comps, id) => {
        const props = React.Children.toArray(this.props.children)
          .reduce((a, c) => {
            return c.props.id === id ? c.props : a
          }, null);
        if (props !== null) {
          comps.push(
            <props.HoverComp key={ id }
              data={ this.state.hoverData[id] }
              idFormat={ props.idFormat || this.props.idFormat }
              xFormat={ props.xFormat || this.props.xFormat }
              yFormat={ props.yFormat || this.props.yFormat }/>
          );
        }
        return comps;
      }, [])
  }
  onMouseEnter() {
    this.setState({ showHover: true });
  }
  onMouseLeave() {
    this.setState({ showHover: false });
  }
  onMouseMove({ x, xpos }) {
    let [, y] = d3.mouse(document.getElementById("interactive-layer"));

    const { width, height } = this.state,
      { top, right, bottom, left } = { ...DEFAULT_MARGIN, ...this.props.margin };

    const yInverted = (height - top - bottom) - y;

    for (const id in this.componentData) {
      const compData = this.componentData[id];
      switch (compData.type) {
        case "bar-graph": {
          const data = compData.data[x];
          let current = 0,
            stack = null;
          data.forEach(d => {
            if ((yInverted >= current) && (yInverted <= (current + d.h))) {
              stack = d;
            }
            current += d.h;
          })
          if (stack &&
            (stack.key !== get(this.state.hoverData, [id, "key"], false) ||
            stack.x !== get(this.state.hoverData, [id, "x"]))
          ) {
            this.setHoverData(id, stack);
          }
          else if (!stack) {
            this.setHoverData(id);
          }
          break;
        } // END case "bar-graph"
        case "line-graph": {
          const compData = {
            x,
            data: this.componentData[id].data[x]
          }
          if (compData.x !== get(this.state.hoverData, [id, "x"], false)) {
            this.setHoverData(id, compData);
          }
          break;
        } // END case "line-graph"
      }
    }

    d3.select("#interactive-layer")
      .select("line")
      .style("transform", `translate(${ +xpos + 0.5 }px, 0px)`)

    d3.select(this.hover)
      .style("left", `${ +xpos + left + 10 }px`)
      .style("top", `${ y + top + 10 }px`);
  }

  setHoverData(id, data = null) {
    const hoverData = { ...this.state.hoverData };
    if (data) {
      hoverData[id] = data;
      this.setState({ hoverData });
    }
    if (!data && (id in hoverData)) {
      delete hoverData[id];
      this.setState({ hoverData });
    }
  }

  registerData(id, data) {
    this.componentData[id] = data;
  }
  render() {
    const { xDomain, yDomain, transitionTime, children } = this.renderChildren(),
      { width, height } = this.state,
      { top, right, bottom, left } = { ...DEFAULT_MARGIN, ...this.props.margin },
      hoverComps = this.getHoverComps();
    return (
      <Container innerRef={ comp => this.container = comp }>
        <SVG innerRef={ comp => this.svg = comp }>
          { children }
          <g id="interactive-layer" style={ { transform: `translate(${ left }px, ${ top }px)` } }
            onMouseEnter={ this.onMouseEnter }
            onMouseLeave={ this.onMouseLeave }>

            { this.renderInteractiveLayer(xDomain, yDomain, transitionTime) }

            <line y1="0" y2={ height - top - bottom }
              style={ {
                stroke: this.state.showHover ? "#000" : "none",
                transition: `transform ${ transitionTime }s`,
                pointerEvents: "none"
              } }/>

          </g>
        </SVG>
        { !this.state.showHover || !hoverComps.length ? null :
          <HoverContainer innerRef={ comp => this.hover = comp }
            style={ { transition: `top 0.15s, left ${ transitionTime }s` } }>
            { hoverComps }
          </HoverContainer>
        }
      </Container>
    )
  }
}
const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`
const SVG = styled.svg`
  width: 100%;
  height: 100%;
  display: block;
`
const HoverContainer = styled.div`
  position: absolute;
  pointer-events: none;
  padding: 5px 10px;
  background-color: #fff;
  white-space: nowrap;
`
