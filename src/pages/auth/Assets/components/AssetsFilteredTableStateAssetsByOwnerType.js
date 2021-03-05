import React, {Component} from 'react';
import _ from "lodash"
import get from "lodash.get";
import {authProjects} from "store/modules/user";
import {connect} from "react-redux";
import {reduxFalcor} from 'utils/redux-falcor'

import {fnum} from "utils/sheldusUtils"
import TableSelector from "components/light-admin/tables/tableSelector"


let totalBuildings = 0;
let totalBuildingsValue = 0;
let riskZoneIdsAllValuesTotal = {}

class AssetsFilteredTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ownerNames: [],
            loadingDone: false
        }
    }

    componentDidUpdate(prevProps) {
        if (!_.isEqual(prevProps.groupByFilter, this.props.groupByFilter) || prevProps.geoid !== this.props.geoid) {
            //console.log('updating', prevProps.groupByFilter, this.props.groupByFilter)
            return this.fetchFalcorDeps();
        }
    }

    fetchFalcorDeps() {
           let  reqs = [
                ['building', 'statewide', 'byGeoid', this.props.geoid, 'owner_type', Object.values(this.props.filterData)[0], 'byRiskScenario', this.props.scenarioId, 'byRiskZone', 'byOwnerName', 'all'],
                ['building', 'statewide', 'byGeoid', this.props.geoid, 'owner_type', Object.values(this.props.filterData)[0], 'byOwnerName', 'all']
            ]
        return reqs.reduce((a,c) => a.then(() => this.props.falcor.get(c)), Promise.resolve())
    }

    buildingTable() {
            let cache = this.props.falcor.getCache()
            let allData =
                this.props.geoid
                    .reduce((aGeoid, cGeoid) => {
                        let list = get(cache, ['building', 'statewide', 'byGeoid', cGeoid, 'owner_type', '2', 'byOwnerName', 'all', 'value'], [])
                        if(list){
                            list.forEach(l => {
                                if(!aGeoid[l.primary_owner]){
                                    aGeoid[l.primary_owner] = {}
                                }
                                aGeoid[l.primary_owner]['sum'] = parseInt(l.count) + (get(aGeoid, [l.primary_owner, 'sum'], 0))
                                aGeoid[l.primary_owner]['replacement_value'] = parseInt(l.replacement_value) + (get(aGeoid, [l.primary_owner, 'replacement_value'], 0))
                            })
                        }
                        return aGeoid
                    }, {})

            this.props.geoid
                .reduce((aGeoid, cGeoid) => {
                    let scenarios = get(cache, ['building', 'statewide', 'byGeoid', cGeoid, 'owner_type', '2', 'byRiskScenario'], {})
                    Object.keys(scenarios)
                        .forEach(scenario => {
                            let list = get(scenarios, [scenario, 'byRiskZone', 'byOwnerName', 'all', 'value']);

                            if(list){
                                list.forEach(l => {
                                    if(!aGeoid[l.primary_owner]){
                                        aGeoid[l.primary_owner] = {}
                                    }
                                    if(!aGeoid[l.primary_owner][l.name]){
                                        aGeoid[l.primary_owner][l.name] = {}
                                    }
                                    aGeoid[l.primary_owner][l.name]['sum'] = parseInt(l.count) + (get(aGeoid, [l.primary_owner, l.name, 'sum'], 0))
                                    aGeoid[l.primary_owner][l.name]['replacement_value'] = parseInt(l.sum) + (get(aGeoid, [l.primary_owner, l.name, 'replacement_value'], 0))
                                })
                            }
                        })
                    return aGeoid
                }, allData)

        let BuildingTypeData = [];
        totalBuildings = 0;
        totalBuildingsValue = 0;
        riskZoneIdsAllValuesTotal = {};
        let primeColName = 'Owner Name';
        let linkBase = `${this.props.public ? '/risk' : ``}/assets/list/ownerType/2`;
        let linkTrail = ``
        let graph = allData;
        let riskZoneColNames = [];
        let scenarioToRiskZoneMapping = {};
        let riskZoneToNameMapping = {};
        if (graph && Object.keys(graph).length) {
                Object.keys(graph)
                    .forEach((ownerName, i) => {
                        let riskZoneIdsAllValues = {}
                        Object.keys(get(graph, [ownerName], {}))
                            .filter(key => !['sum', 'replacement_value'].includes(key))
                            .forEach(floodZoneName => {
                                if (get(graph, [ownerName, floodZoneName], null)) {
                                    if (!riskZoneColNames.includes(`${floodZoneName} #`)) {
                                        riskZoneColNames.push(`${floodZoneName} #`, `${floodZoneName} $`)
                                    }
                                    riskZoneIdsAllValues[`${floodZoneName}`] = {
                                        count: parseInt(get(graph, [ownerName, floodZoneName, 'sum'], {})),
                                        value: parseInt(get(graph, [ownerName, floodZoneName, 'replacement_value'], {}))
                                    };
                                }
                            })

                        BuildingTypeData.push({
                            [primeColName]: ownerName,
                            'TOTAL $ REPLACEMENT VALUE': parseInt(get(graph, [ownerName, `replacement_value`], 0)),
                            'TOTAL # BUILDING TYPE': parseInt(get(graph, [ownerName, `sum`], 0)),
                            ...Object.keys(riskZoneIdsAllValues)
                                .reduce((a, riskZone) => {
                                    a[riskZone + ' #'] = parseInt(riskZoneIdsAllValues[riskZone].count) || 0;
                                    a[riskZone + ' $'] = parseInt(riskZoneIdsAllValues[riskZone].value) || 0;

                                    riskZoneIdsAllValuesTotal[riskZone + ' #'] ?
                                        riskZoneIdsAllValuesTotal[riskZone + ' #'] += parseInt(riskZoneIdsAllValues[riskZone].count) || 0 :
                                        riskZoneIdsAllValuesTotal[riskZone + ' #'] = parseInt(riskZoneIdsAllValues[riskZone].count) || 0;

                                    riskZoneIdsAllValuesTotal[riskZone + ' $'] ?
                                        riskZoneIdsAllValuesTotal[riskZone + ' $'] += parseInt(riskZoneIdsAllValues[riskZone].value) || 0 :
                                        riskZoneIdsAllValuesTotal[riskZone + ' $'] = parseInt(riskZoneIdsAllValues[riskZone].value) || 0;

                                    return a
                                }, {}),
                            link: linkBase + `/geo/${encodeURI(ownerName)}`
                        });

                        totalBuildings += parseInt(get(graph, [ownerName, `sum`], 0));
                        totalBuildingsValue += parseInt(get(graph, [ownerName, `replacement_value`], 0));
            })
            BuildingTypeData.push({
                [primeColName]: 'TOTAL',
                'TOTAL $ REPLACEMENT VALUE': totalBuildingsValue,
                'TOTAL # BUILDING TYPE': totalBuildings,

                ...Object.keys(riskZoneIdsAllValuesTotal)
                    .reduce((a, riskZone) => {
                        a[riskZone] = riskZoneIdsAllValuesTotal[riskZone];
                        a[riskZone] = riskZoneIdsAllValuesTotal[riskZone];

                        return a
                    }, {}),

                link: linkBase
            })
        }
        return {
            data:
                BuildingTypeData.sort((a, b) =>
                    this.props.defaultSortCol && a[this.props.defaultSortCol] !== 'TOTAL' ?
                        (this.props.defaultSortOrder === 'desc' ? -1 : 1) * (typeof a[this.props.defaultSortCol] === "string" ?
                        a[this.props.defaultSortCol].localeCompare(b[this.props.defaultSortCol]) :
                        b[this.props.defaultSortCol] - a[this.props.defaultSortCol]) :
                        1),
            columns: [
                {
                    Header: primeColName,
                    accessor: primeColName,
                    filter: 'default',
                    sort: true
                },
                {
                    Header: 'TOTAL # BUILDING TYPE',
                    accessor: 'TOTAL # BUILDING TYPE',
                    sort: true,
                    link: (d) => d + linkTrail, // functional
                    linkOnClick: this.props.linkOnClick
                },
                this.props.public ? null : {
                    Header: 'TOTAL $ REPLACEMENT VALUE',
                    accessor: 'TOTAL $ REPLACEMENT VALUE',
                    sort: true,
                    formatValue: fnum,
                    link: (d) => d + linkTrail, // takes what is in data
                    linkOnClick: this.props.linkOnClick
                },
                ...riskZoneColNames
                    .map((name) => {
                        if (name.includes('$') && this.props.public && this.props.hideFloodValue) {
                            return null
                        }
                        let a = {};
                        let riskZone = riskZoneToNameMapping[name.slice(0, name.length - 2)];
                        let scenarioId = Object.keys(scenarioToRiskZoneMapping).filter(f => scenarioToRiskZoneMapping[f].includes(riskZone)).pop();
                        a['Header'] = name;
                        a['accessor'] = name;
                        a['sort'] = true;
                        if (name.includes('$')) {
                            a['formatValue'] = fnum
                        }
                        a['link'] = (d) => {
                            return d.split('/geo')[1] ?
                                d.split('/geo')[0] + `/scenario/${scenarioId}/riskzone/${riskZone}` + '/geo' + d.split('/geo')[1] :
                                d.split('/geo')[0] + `/scenario/${scenarioId}/riskzone/${riskZone}`
                        }
                        a['linkOnClick'] = this.props.linkOnClick;
                        return a
                    }),
            ].filter(f => f)
        }
    }


    render() {
        return !this.state.loadingDone && false? 'Loading...' :(
            <div style={{
                width: this.props.width ? this.props.width : '',
                height: this.props.height ? this.props.height : ''
            }}>
                <TableSelector
                    {...this.buildingTable()}
                    flex={this.props.flex ? this.props.flex : false}
                    height={this.props.height ? this.props.height : ''}
                    width={this.props.width ? this.props.width : ''}
                    tableClass={this.props.tableClass ? this.props.tableClass : null}
                />
            </div>
        )
    }
}


AssetsFilteredTable.defaultProps = {
    geoid: "36025",
    groupBy: 'critical', // ownerType, propType, jurisdiction, critical
    groupByFilter: [],
    scenarioId: [3],
    public: false
};
const mapStateToProps = state => ({

    isAuthenticated: !!state.user.authed,
    activePlan: state.user.activePlan, // so componentWillReceiveProps will get called.
    activeGeoid: state.user.activeGeoid,
    activeCousubid: state.user.activeCousubid,
    geoidData: get(state.graph, 'geo'),
    buildingData: get(state.graph, 'building.byGeoid'),
    buildingStatewideData: get(state.graph, ['building', 'statewide', 'byGeoid']),
    parcelMeta: get(state.graph, 'parcel.meta'),
});

const mapDispatchToProps = ({
    //sendSystemMessage
    authProjects,
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(AssetsFilteredTable))