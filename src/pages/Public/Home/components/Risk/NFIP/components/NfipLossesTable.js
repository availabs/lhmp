import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import { falcorChunkerNice } from "store/falcorGraph"
import store from "store"
import { fnum } from "utils/sheldusUtils"

import get from "lodash.get";

import TableBox from 'components/light-admin/tables/TableBox3'
import Table from 'components/light-admin/tables/Table'
import functions from "../../../../../../auth/Plan/functions";

class NfipTable extends React.Component {

    async fetchFalcorDeps({ geoid, geoLevel }=this.props) {
        if(!this.props.allGeo || !Object.keys(this.props.allGeo).length) return Promise.resolve();

        let formType = 'filterJurisdictions',
            formAttributes = ['county', 'municipality']
        let response = await this.props.falcor.get(['forms', formType, 'byPlanId', this.props.activePlan, 'length'])
        let length = get(response, ['json', 'forms', formType, 'byPlanId', this.props.activePlan, 'length'], 0);

        let queries = [["geo", Object.keys(this.props.allGeo), [geoLevel, 'name']]]
        if (length > 0) {
            queries.push(['forms', formType, 'byPlanId', this.props.activePlan, 'byIndex', [{
                from: 0,
                to: length - 1
            }], ...formAttributes])
        }

        return this.props.falcor.get(
            ...queries
        )
            .then(response => response.json.geo[geoid][geoLevel])
            .then(geoids => {
                return this.props.falcor.get(['nfip', 'losses', 'byGeoid', Object.keys(this.props.allGeo)/*.filter(g => g.length === 7)*/, 'allTime', ['total_losses', 'closed_losses', 'open_losses', 'cwop_losses', 'total_payments', 'repetitive_loss', 'severe_repetitive_loss', 'number_policies']])
            })
    }

    getGeoToFilter(){
        let formType = 'filterJurisdictions'
        let graph = get(this.props.falcor.getCache(), [`forms`], null);
        let id = get(graph, [formType, 'byPlanId', this.props.activePlan, 'byIndex'], {})
        if(id){
            id = Object.keys(id)
                .map(i => get(id[i], ['value', 2], null))
                .filter(i => i)
            let data = id.map(i => get(graph, ['byId', i], {}))
            if (data){
                let geoToFilter =
                    Object.keys(data)
                        .reduce((a,g) => {
                            let tmpGeos = get(data[g], `value.attributes.municipality`, null)
                            tmpGeos = tmpGeos && typeof tmpGeos === "string" && tmpGeos.includes('[') ?
                                tmpGeos.slice(1,-1).split(',') : tmpGeos
                            if(tmpGeos) a.push(...tmpGeos)
                            return a;
                        }, [])
                return geoToFilter;
            }
        }

        return []
    }

    processData() {
        const { geoid, geoLevel } = this.props,
            label = geoLevel === 'counties' ? 'county' : 'Jurisdiction',
            geoids = Object.keys(this.props.allGeo),
            data = [];
        let geoToFilter = this.getGeoToFilter(this.props.formData);

        geoids
            .filter(geoid => !geoToFilter.includes(geoid))
            .forEach(geoid => {
            const graph = this.props.nfip.losses.byGeoid[geoid].allTime,
                name = this.props.allGeo[geoid];
            console.log('g?', this.props.nfip.losses.byGeoid)
            if(graph.total_losses > 0 || true){
                data.push({
                    [label]: functions.formatName(name, geoid),
                    "total claims": graph.total_losses,
                    //"closed losses": graph.closed_losses,
                    //"open losses": graph.open_losses,
                    "paid claims": (+graph.total_losses - +graph.cwop_losses),
                    "total payments": graph.total_payments,
                    'repetitive loss': +graph.repetitive_loss,
                    'severe repetitive loss': +graph.severe_repetitive_loss,
                    '# of policies': +graph.number_policies,
                })
            }
        })

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
                },
                {
                    Header: 'Severe Repetitive Loss',
                    accessor: 'severe repetitive loss',
                    align: 'center',
                },
                {
                    Header: '# of policies',
                    accessor: '# of policies',
                    align: 'center',
                },

            ].reduce((a,c, cI, src) => {
                if (this.props.colOrder){
                    let tmpCOl = src.filter(s => s.Header === this.props.colOrder[cI]).pop()
                    if (tmpCOl) a.push(tmpCOl)
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
    geoid: state.user.activeGeoid || '36',
        activePlan: state.user.activePlan,
        activeGeoid: state.user.activeGeoid,
        activeCousubid: state.user.activeCousubid,
        allGeo: state.geo.allGeos,
        formData: get(state.graph, [`forms`, 'filterJurisdictions'], null)
    }}

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(NfipTable));
