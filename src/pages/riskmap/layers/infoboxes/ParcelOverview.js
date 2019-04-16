import React from "react"
import { connect } from "react-redux"
import { reduxFalcor } from "utils/redux-falcor"

import styled from 'styled-components';

import { fnum } from "utils/sheldusUtils";

const OverviewContainer = styled.div`
	padding: 5px;
`
const OverviewHeader = styled.div`
	color: ${ props => props.textColor };
	font-size: 24px;
	margin-bottom: 5px;
`

class ParcelOverview extends React.Component {
	fetchFalcorDeps() {
		const { geoids } = this.props;
		if (!geoids.length) return Promise.resolve();

		return this.props.falcor.get(
			["irvs", "byGeoid", geoids, "length"]
		)
		.then(res => {
			let max = -Infinity;
			geoids.forEach(geoid => {
				const length = +res.json.irvs.byGeoid[geoid].length
				max = Math.max(max, length)
			})
			return max
		})
		.then(max => {
			if (!max) return;
			return this.props.falcor.get(
				["irvs", "byGeoid", geoids, "byIndex", { from: 0, to: max - 1 }, "buildingid"]
			)
			.then(res => {
				const buildingids = []
				geoids.forEach(geoid => {
					const graph = res.json.irvs.byGeoid[geoid].byIndex;
					for (let i = 0; i < max; ++i) {
						if (graph[i]) {
							buildingids.push(graph[i].buildingid)
						}
					}
				})
				return buildingids;
			})
		})
		.then(buildingids => {
			if (!buildingids.length) return;
			const requests = [],
				num = 500;
			for (let i = 0; i < buildingids.length; i += num) {
				requests.push(buildingids.slice(i, i + num))
			}
			return requests.reduce((a, c) =>
				a.then(() => this.props.falcor.get(["irvs", "byId", c, ["replacement_value", "parcel_id", "flood_zone", "critical"]]))
				, Promise.resolve()
			)
		})
	}
	processData() {
		let data = { loading: true };
		try {
			const parcelIds = [],
				buildingIds = [];
			let total = 0,
				floodPlainValue = 0,
				totalCriticalReplacementValue = 0,
				totalCriticalReplacementValueInFloodPlain = 0;
			this.props.geoids.forEach(geoid => {
				const parcelGraph = this.props.parcelGraph.byGeoid[geoid];
				for (let i = 0; i < parcelGraph.length; ++i) {
					parcelIds.push(parcelGraph.byIndex[i].id)
				}
				const irvsGraph = this.props.irvsGraph.byGeoid[geoid];
				for (let i = 0; i < irvsGraph.length; ++i) {
					buildingIds.push(irvsGraph.byIndex[i].buildingid)
				}
			})

			const buildingsByParcelId = {}
			buildingIds.forEach(buildingid => {
				const graph = this.props.irvsGraph.byId[buildingid];
				if (graph) {
					if (graph.flood_zone.value && graph.flood_zone.value.filter(fz => fz === 'X').length) {
						floodPlainValue += +graph.replacement_value.value;
					}
					if (graph.critical.value) {
						totalCriticalReplacementValue += +graph.replacement_value.value;
					}
					if (graph.critical.value && graph.flood_zone.value && graph.flood_zone.value.filter(fz => fz === 'X').length) {
						totalCriticalReplacementValueInFloodPlain += +graph.replacement_value.value;
					}
				}
			})
			parcelIds.forEach(id => {
				const parcelGraph = this.props.parcelGraph.byId[id];
				total += +parcelGraph["full_marke"];
			})
			data = {
				total,
				floodPlainValue,
				totalCriticalReplacementValue,
				totalCriticalReplacementValueInFloodPlain,
				loading: total === 0
			}
		}
		catch (e) {
// console.log("ERROR:",e)
			data = { loading: true };
		}
		return data;
	}
	render() {
		const {
			loading,
			total,
			floodPlainValue,
			totalCriticalReplacementValue,
			totalCriticalReplacementValueInFloodPlain
		} = this.processData()
		return (
			<OverviewContainer>
				<OverviewHeader>Parcels Overview</OverviewHeader>
					{ loading ? "Loading..." :
						<div>
							<div>
								Total Market Value: ${ fnum(total) }
							</div>
							<div>
								Total Replacement Value in Floodplain: ${ fnum(floodPlainValue) }
							</div>
							<div>
								Total Critical Replacement Value: ${ fnum(totalCriticalReplacementValue) }
							</div>
							<div>
								Total Critical Replacement Value In Floodplain: ${ fnum(totalCriticalReplacementValueInFloodPlain) }
							</div>
						</div>
					}
			</OverviewContainer>
		)
	}
}

const mapStateToProps = state => ({
	parcelGraph: state.graph.parcel,
	irvsGraph: state.graph.irvs
})
const mapDispatchToProps = {

}
export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(ParcelOverview))