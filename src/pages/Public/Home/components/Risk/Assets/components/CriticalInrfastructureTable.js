import React from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import {fnum} from "utils/sheldusUtils"

import get from "lodash.get";
import TableSelector from 'components/light-admin/tables/tableSelector'

class NfipTable extends React.Component {

    fetchFalcorDeps() {
        if (!this.props.activeCousubid || this.props.activeCousubid === 'undefined') return Promise.resolve();
        return this.props.falcor.get(
            ['geo', this.props.activeGeoid, ['name']],
            ["geo", this.props.activeGeoid, 'municipalities'])
            .then(response => {
                let allGeos = [this.props.activeGeoid,
                    ...get(this.props.falcor.getCache(), `geo.${this.props.activeGeoid}.municipalities.value`, [])]

                return this.props.falcor.get(
                    ['building', 'byGeoid', allGeos,
                        'critical', 'all', 'sum', ['count', 'replacement_value']],
                    ['building', 'byGeoid', allGeos,
                        'critical', 'all', ['flood_100', 'flood_500'], 'sum', ['count', 'replacement_value']],
                    ['geo', allGeos, ['name']],
                ).then(r => {
                    return r
                })
            })
    }

    processData() {
        const {geoid, geoLevel} = this.props,
            label = geoLevel === 'counties' ? 'county' : 'Municipality',
            geoids = this.props.geoGraph[geoid][geoLevel].value;
        let data = [];
        let total = {
            [label]: 'Total',
            'Total #': 0,
            'Total Replacement $': 0,
            'Flood 100 #': 0,
            'Flood 100 Replacement $': 0,
            'Flood 500 #': 0,
            'Flood 500 Replacement $': 0,
        }
        geoids.forEach(geoid => {
            const graph = this.props.building.byGeoid[geoid],
                name = this.props.geoGraph[geoid].name;

            data.push({
                [label]: this.formatName(name, geoid),
                'Total #': get(graph, `critical.all.sum.count.value`, null),
                'Total Replacement $': get(graph, `critical.all.sum.replacement_value.value`, null),
                'Flood 100 #': get(graph, `critical.all.flood_100.sum.count.value`, null),
                'Flood 100 Replacement $': get(graph, `critical.all.flood_100.sum.replacement_value.value`, null),
                'Flood 500 #': get(graph, `critical.all.flood_500.sum.count.value`, null),
                'Flood 500 Replacement $': get(graph, `critical.all.flood_500.sum.replacement_value.value`, null),
            })

            total['Total #'] += parseInt(get(graph, `critical.all.sum.count.value`, 0))
            total['Total Replacement $'] += parseInt(get(graph, `critical.all.sum.replacement_value.value`, 0))
            total['Flood 100 #'] += parseInt(get(graph, `critical.all.flood_100.sum.count.value`, 0))
            total['Flood 100 Replacement $'] += parseInt(get(graph, `critical.all.flood_100.sum.replacement_value.value`, 0))
            total['Flood 500 #'] += parseInt(get(graph, `critical.all.flood_500.sum.count.value`, 0))
            total['Flood 500 Replacement $'] += parseInt(get(graph, `critical.all.flood_500.sum.replacement_value.value`, 0))

        })
        data = data.sort((a, b) =>
            this.props.defaultSortCol ?
                (this.props.defaultSortOrder === 'desc' ? -1 : 1) * (typeof a[this.props.defaultSortCol] === "string" ?
                a[this.props.defaultSortCol].localeCompare(b[this.props.defaultSortCol]) :
                b[this.props.defaultSortCol] - a[this.props.defaultSortCol]) :
                b['total payments'] - b['total payments'])
        data.push(total)
        return {
            data: data,
            columns: [
                {
                    Header: label,
                    accessor: label,
                    filter: 'default',
                    sort: true
                },
                {
                    Header: 'Total #',
                    accessor: 'Total #',
                    align: 'center',
                    sort: true
                },
                {
                    Header: 'Total Replacement $',
                    accessor: 'Total Replacement $',
                    align: 'center',
                    sort: true,
                    formatValue: fnum
                },

                {
                    Header: 'Flood 100 #',
                    accessor: 'Flood 100 #',
                    align: 'center',
                    sort: true
                },
                {
                    Header: 'Flood 100 Replacement $',
                    accessor: 'Flood 100 Replacement $',
                    align: 'center',
                    sort: true,
                    formatValue: fnum
                },

                {
                    Header: 'Flood 500 #',
                    accessor: 'Flood 500 #',
                    align: 'center',
                    sort: true
                },
                {
                    Header: 'Flood 500 Replacement $',
                    accessor: 'Flood 500 Replacement $',
                    align: 'center',
                    sort: true,
                    formatValue: fnum
                },
            ].reduce((a, c, cI, src) => {
                if (this.props.colOrder) {
                    a.push(src.filter(s => s.Header === this.props.colOrder[cI]).pop())
                } else {
                    a.push(c)
                }
                return a;
            }, [])
        }
    }

    formatName(name, geoid) {
        let jurisdiction = geoid.length === 2 ? 'State' :
            geoid.length === 5 ? 'County' :
                geoid.length === 10 ? 'Town' :
                    geoid.length === 11 ? 'Tract' : '';
        if (name && name.toLowerCase().includes(jurisdiction.toLowerCase())) {
            name = name.replace(jurisdiction.toLowerCase(), ' (' + jurisdiction + ')')
        } else {
            name += ' (' + jurisdiction + ')';
        }

        return name
    }

// //
    render() {
        try {
            return (
                <div>
                    <TableSelector
                        {...this.processData()}
                        height={this.props.minHeight || '60vh'}
                        //width={'100vw'}
                        flex={false}
                    />

                </div>
            )
        } catch (e) {
            return <div>Loading...</div>;
        }
    }
}

// //
NfipTable.defaultProps = {
    geoid: '36',
    geoLevel: 'cousubs',
    title: "NFIP Losses"
}

const mapStateToProps = state => {
    return {
        activeCousubid: state.user.activeCousubid || null,
        activeGeoid: state.user.activeGeoid || null,
        router: state.router,
        geoGraph: state.graph.geo,
        building: state.graph.building,
        geoid: state.user.activeGeoid || '36'
    }
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(NfipTable));
