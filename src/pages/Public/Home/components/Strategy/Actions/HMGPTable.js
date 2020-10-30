import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from 'lodash.get'
import ElementBox from 'components/light-admin/containers/ElementBox'
import Table from 'components/light-admin/tables/Table'

import {
    getHazardName,
    fnum
} from 'utils/sheldusUtils'

class HMAP_Table extends React.Component {

    fetchFalcorDeps() {
        return this.props.falcor.get(
            ['hmap', 'byGeoId', [this.props.geoid]
            ]
        )//.then(res => console.log('hmgp data', this.props, res))
    }

    getHazardName(hazard) {
        try {
            return this.props.riskIndex.meta[hazard].name;
        }
        catch (e) {
            return null
        }
    }

    createRow(jurisdiction, data) {
        const row = {};
        row['Jurisdiction'] = jurisdiction;
        row['Approved'] = get( data, 'Approved',0);
        row['Finished'] = get( data, 'Finished',0);
        row['Completed'] = get( data, 'Completed',0);
        return row;
    }

    processData() {
        const graph = get(this.props.hmap.byGeoId, `${this.props.geoid}.value`, null);
        if (!graph) return ;
        let data = {};
        let tableData = [];
        graph.forEach(g => {
            !data[g['subgrantee']] || data[g['subgrantee']][g['status']] ?
                data[g['subgrantee']] = {[g['status']]: g['count']} :
                data[g['subgrantee']][g['status']] = g['count']
        });

        if (!Object.keys(data).length) throw new Error("No Data.");

        tableData = Object.keys(data)
            .map(d => this.createRow(d, data[d]))
            .sort((a,b) =>
                this.props.defaultSortCol ?
                    (this.props.defaultSortOrder === 'desc' ? -1 : 1)*(typeof a[this.props.defaultSortCol] === "string" ?
                    a[this.props.defaultSortCol].localeCompare(b[this.props.defaultSortCol]) :
                    b[this.props.defaultSortCol] - a[this.props.defaultSortCol]) :
                    (b.Approved-a.Approved));
        return { data:tableData, columns: [ 
                   
                    {
                        Header: 'Jurisdiction', 
                        accessor: 'Jurisdiction',
                        align: 'left',
                        width: 400
                    },
                    {
                        Header: 'Approved', 
                        accessor: 'Approved',
                        align: 'center'
                    },
                    {
                        Header: 'Finished', 
                        accessor: 'Finished',
                        align: 'center'
                    },
                    {
                        Header: 'Completed', 
                        accessor: 'Completed',
                        align: 'center'
                    }
                ].reduce((a,c, cI, src) => {
                if (this.props.colOrder){
                    a.push(src.filter(s => s.Header === this.props.colOrder[cI]).pop())
                }else{
                    a.push(c)
                }
                return a;
            }, [])

            };
    }

    render() {
        try {
            return (
                <div>
                    <h4> FEMA Funded Hazard Mitigation Assistance Projects</h4>
                    { 
                        this.processData() ? 
                        (<Table { ...this.processData() } height={this.props.minHeight || '60vh'}/>)
                            : (<h4>Loading Capability Data ...</h4>)
                    }
                </div>
               
            )
        }
        catch (e) {
// console.log("ERROR:",this.props.hazard,e)
            return null;
        }
    }
}

HMAP_Table.defaultProps = {
    geoid: '36',
    geoLevel: 'state',
    hazard: "all", // a hazard, "none", "all"
    filterColumns: []
}

const mapStateToProps = state => {
    return {
        router: state.router,
        hmap: state.graph.hmap,
        riskIndex: state.graph.riskIndex
    };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(HMAP_Table));