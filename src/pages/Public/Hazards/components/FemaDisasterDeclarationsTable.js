import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import ElementBox from 'components/light-admin/containers/ElementBox'
import TableBox from 'components/light-admin/tables/TableBoxHistoric'

import {
    EARLIEST_YEAR,
    LATEST_YEAR
} from "./yearsOfFemaDisasterDeclarationsData"

import {
    getHazardName
} from 'utils/sheldusUtils'

class FemaDisasterDeclarationsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disasterNumbers: []
        }
    }
    fetchFalcorDeps() {
        let geoid = this.props.geoid;

        return this.props.falcor.get(
            ['riskIndex', 'hazards']
        )
            .then(response => response.json.riskIndex.hazards)
            .then(hazards => {
                hazards = this.props.hazard ?
                    [this.props.hazard] :
                    this.props.hazards && this.props.hazards.length > 0 ?
                        this.props.hazards : hazards;

// `femaDisaster[{keys:geoids}][{keys:hazardids}][{integers:years}].length`
                return this.props.falcor.get(
                    ["femaDisaster", geoid, hazards, { from: EARLIEST_YEAR, to: LATEST_YEAR }, "length"],
                    ['riskIndex', 'meta', hazards, 'name']
                )
                    .then(response => {
                        let max = 0;
                        hazards.forEach(hazard => {
                            const hazardData = response.json.femaDisaster[geoid][hazard];
                            for (let year = EARLIEST_YEAR; year <= LATEST_YEAR; ++year) {
                                const length = hazardData[year].length;
                                max = Math.max(max, length);
                            }
                        })
                        if (!max) {
                            this.setState({disasterNumbers:[]});
                            return Promise.resolve()
                        };
                        return this.props.falcor.get(
                            ["femaDisaster", geoid, hazards, { from: EARLIEST_YEAR, to: LATEST_YEAR }, { from: 0, to: max -1 }, "disasternumber"]
                        )
                            .then(response => {
                                const disasternumbers = [];
                                hazards.forEach(hazard => {
                                    const hazardData = response.json.femaDisaster[geoid][hazard];
                                    for (let year = EARLIEST_YEAR; year <= LATEST_YEAR; ++year) {
                                        const yearData = hazardData[year];
                                        for (let index = 0; index < max; ++index) {
                                            const data = yearData[index];
                                            if (data) {
                                                disasternumbers.push(data.disasternumber);
                                            }
                                        }
                                    }
                                })
                                return disasternumbers;
                            })
                            .then(disasternumbers => {
                                if (!disasternumbers.length) return;
                                this.setState({disasterNumbers:disasternumbers});
                                return this.props.falcor.get(
                                    ["femaDisaster", "byDisasterNumber", disasternumbers, ['disasternumber','disastername', 'declarationtype', 'date', 'hazard']]
                                )
                            })
                    })
            })
    }
    componentDidUpdate(prevProps) {
        if (prevProps.geoid !== this.props.geoid || prevProps.hazard !== this.props.hazard){
            this.setState({geoid: this.props.geoid})
            this.fetchFalcorDeps()
        }
    }
    getHazardName(hazard) {
        try {
            return this.props.riskIndexGraph.meta[hazard].name;
        }
        catch (e) {
            return getHazardName(hazard)
        }
    }

    getColumnLabel(column) {
        switch (column) {
            case 'disasternumber':
                return 'disaster number';
            case 'disastername':
                return 'disaster name';
            case 'declarationtype':
                return 'declaration type';
            default:
                return column;
        }
    }

    processData() {
        const graph = this.props.femaDisaster.byDisasterNumber,
            keys = {},
            data = Object.keys(graph)
                .filter(f => this.state.disasterNumbers.includes(parseInt(f)))
                .map(key => {
                    let row = {};
                    for (const column in graph[key]) {
                        const label = this.getColumnLabel(column);
                        keys[label] = true;
                        row[label] = graph[key][column];
                    }
                    row['hazard'] = this.getHazardName(row['hazard']);
                    if (this.props.hazard) {
                        delete keys['hazard'];
                    }
                    const date = new Date(row['date']);
                    row['date'] = `${ date.getMonth() + 1 }/${ date.getDate() }/${ date.getFullYear() }`;
                    return row;
                });
        return { data, columns: Object.keys(keys) };
    }

    render() {
        try {
            return (
                <TableBox { ...this.processData() }
                          columnTypes={ this.props.columnTypes }
                          filterColumns={ this.props.filterColumns }
                          expandColumns={ this.props.expandColumns }/>
            )
        }
        catch (e) {
            return null;
        }
    }
}

FemaDisasterDeclarationsTable.defaultProps = {
    geoid: "36",
    hazard: null,
    hazards: [],
    columnTypes: { date: 'date' },
    filterColumns: [],
    expandColumns: []
}

const mapStateToProps = state => ({
    router: state.router,
    femaDisaster: state.graph.femaDisaster,
    riskIndexGraph: state.graph.riskIndex
})

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(FemaDisasterDeclarationsTable));