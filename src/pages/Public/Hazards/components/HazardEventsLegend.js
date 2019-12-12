import React from 'react';

import * as d3format from "d3-format"

import ElementBox from 'components/light-admin/containers/ElementBox'

import { getHazardName } from 'utils/sheldusUtils'

import "./HazardEventsLegend.css"

import {
    fnum
} from "utils/sheldusUtils"

const format = d3format.format(",.0f")

export const CircleDiv = ({ color="#000", radius=10, thickness=2, children=null, style={} }) =>
    <div style={ { height: `${ radius * 2 }px`, width: `${ radius * 2 }px`, borderRadius: `${ radius }px`, border: `${ thickness }px solid ${ color }`, display: "inline-block", ...style } }>
        { children }
    </div>
////
export const CircleLabel = ({ center="25%", bottom=20, radius, value, color="#000" }) =>
    <CircleDiv radius={ radius } thickness={ 1 } color={ color } style={ { position: "absolute", left: `calc(${ center } - ${ radius }px)`, bottom: `${ bottom }px` } }>
        <span style={ { width: "100px", position: "absolute", left: `${ radius }px`, bottom: `${ radius * 2 - 2 }px`, borderBottom: `1px dashed ${ color }` } }/>
        <span style={ { color: color, position: "absolute", left: `${ radius + 110 }px`, bottom: `${ radius * 2 - 12 }px` } }>
			${ fnum(value) }
		</span>
    </CircleDiv>

export default class HazardEventsLegend extends React.Component {

    componentDidMount() {
        this.props.viewport.register(this, this.setState);
    }
    componentWillUnmount() {
        this.props.viewport.unregister(this);
    }

    getHazardName(hazard) {
        try {
            return this.props.riskIndexGraph.meta[hazard].name;
        }
        catch (e) {
            return getHazardName(hazard.toString())
        }
    }

    render() {
        const { colorScale, radiusScale, viewport } = this.props;
        const domain = colorScale.domain(),
            rows = [],

            numRows = 3,
            numCols = Math.ceil(domain.length / numRows);

        if (!domain.length) {
            return <div className="col-lg-12"><ElementBox>Loading...</ElementBox></div>
        }

        for (let r = 0; r < numRows; ++r) {
            const columns = [];
            for (let c = 0; c < numCols; ++c) {
                const i = (r * numCols) + c;
                columns.push(
                    <td key={ `row-${ r }-column-${ c }` }
                        style={ {
                            color: colorScale(domain[i]),
                            backgroundColor: "rgb(242, 239, 233)",
                            padding: "10px 0px 0px 15px"
                        } }>
                        <CircleDiv color={ colorScale(domain[i]) }/>
                        <div style={ { padding: "0px 10px", display: "inline-block", fontSize: "18px" } }>
                            { domain[i] ? this.getHazardName(domain[i]) : null }
                        </div>
                    </td>
                )
            }
            rows.push(
                <tr key={ `row-${ r }` }>
                    { columns }
                </tr>
            )
        }

        return (
            <div className="col-lg-12">
                <div style = {{backgroundColor: 'white' , width: '100%' , paddingBottom: 0 , margin: 'auto'}}>
                    <table className="hazard-events-legend"
                           style={ { width: "100%" } }>
                        <tbody>
                        { rows }
                        </tbody>
                    </table>

                </div>
            </div>
        )
    }
}
