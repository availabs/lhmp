import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import { falcorChunkerNice } from "store/falcorGraph"
import store from "store"
import { fnum } from "utils/sheldusUtils"

import get from "lodash.get";

import TableBox from 'components/light-admin/tables/TableBox3'
import Table from 'components/light-admin/tables/Table'

class NfipTable extends React.Component {

    fetchFalcorDeps({ geoid, geoLevel }=this.props) {
        return this.props.falcor.get(
            ["geo", geoid, [geoLevel, 'name']],
        )
            .then(response => response.json.geo[geoid][geoLevel])
            .then(geoids => {
                return this.props.falcor.get(['nfip', 'losses', 'byGeoid', geoids, 'allTime', ['total_losses', 'closed_losses', 'open_losses', 'cwop_losses', 'total_payments', 'repetitive_loss', 'severe_repetitive_loss']])
                    .then(() => this.props.falcor.get(['geo', geoids, 'name']))
            })
    }

    processData() {
        const { geoid, geoLevel } = this.props,
            label = geoLevel === 'counties' ? 'county' : 'Jurisdiction',
            geoids = this.props.geoGraph[geoid][geoLevel].value,
            data = [];

        geoids.forEach(geoid => {
            const graph = this.props.nfip.losses.byGeoid[geoid].allTime,
                name = this.props.geoGraph[geoid].name;
            data.push({
                [label]: this.formatName(name, geoid),
                "total claims": graph.total_losses,
                //"closed losses": graph.closed_losses,
                //"open losses": graph.open_losses,
                "paid claims": (+graph.total_losses - +graph.cwop_losses),
                "total payments": graph.total_payments,
                'repetitive loss': +graph.repetitive_loss,
                'severe repetitive loss': +graph.severe_repetitive_loss
            })
        })
        console.log('data', data)
        return {
            data: data.sort((a, b) =>
                this.props.defaultSortCol ?
                    (this.props.defaultSortOrder === 'desc' ? -1 : 1)*(typeof a[this.props.defaultSortCol] === "string" ?
                        a[this.props.defaultSortCol].localeCompare(b[this.props.defaultSortCol]) :
                        b[this.props.defaultSortCol] - a[this.props.defaultSortCol]) :
                    b['total payments'] - b['total payments']
                    ),
            columns: [ 
                {
                    Header: label, 
                    accessor: label
                },
                {
                    Header: 'total claims', 
                    accessor: 'total claims',
                    align: 'center'
                },
                {
                    Header: 'paid claims',
                    accessor: 'paid claims',
                    align: 'center'
                },
                {
                    Header: 'total payments', 
                    accessor: 'total payments',
                    align: 'center',
                    formatValue: fnum
                },
                {
                    Header: 'Repetitive Loss',
                    accessor: 'repetitive loss',
                    align: 'center',
                    formatValue: fnum
                },
                {
                    Header: 'Severe Repetitive Loss',
                    accessor: 'severe repetitive loss',
                    align: 'center',
                    formatValue: fnum
                },

            ].reduce((a,c, cI, src) => {
                if (this.props.colOrder){
                    a.push(src.filter(s => s.Header === this.props.colOrder[cI]).pop())
                }else{
                    a.push(c)
                }
                return a;
            }, [])
        }
    }

    formatName(name, geoid){
        let jurisdiction = geoid.length === 2 ? 'State' :
            geoid.length === 5 ? 'County' :
                geoid.length === 10 ? 'Town' :
                    geoid.length === 11 ? 'Tract' : '';
        if (name && name.toLowerCase().includes(jurisdiction.toLowerCase())){
            name = name.replace(jurisdiction.toLowerCase(), ' (' + jurisdiction + ')')
        }else{
            name  += ' (' + jurisdiction + ')';
        }

        return name
    }

// //
    render() {
        try {
            return (
                <div>

                <Table  { ...this.processData() } 
                    height={this.props.minHeight || '60vh'}
                />
                
                </div>
            )
        }
        catch (e) {
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
    router: state.router,
    geoGraph: state.graph.geo,
    nfip: state.graph.nfip,
    geoid: state.user.activeGeoid || '36'
    }}

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(NfipTable));
