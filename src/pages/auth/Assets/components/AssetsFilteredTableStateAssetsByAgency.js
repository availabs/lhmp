import React, {Component} from 'react';
import _ from "lodash"
import get from "lodash.get";
import {authProjects} from "store/modules/user";
import {connect} from "react-redux";
import {reduxFalcor} from 'utils/redux-falcor'

import {fnum} from "utils/sheldusUtils"
import functions from 'pages/auth/Plan/functions'
import TableSelector from "components/light-admin/tables/tableSelector"


let totalBuildings = 0;
let totalBuildingsValue = 0;
let riskZoneIdsAllValuesTotal = {}

class AssetsFilteredTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ownerNames: []
        }
    }

    componentDidUpdate(prevProps) {
        if (!_.isEqual(prevProps.groupByFilter, this.props.groupByFilter) || prevProps.geoid !== this.props.geoid) {
            return this.fetchFalcorDeps();
        }
    }

    fetchFalcorDeps() {

        return this.props.falcor.get(
            ['building', 'statewide', 'byGeoid', this.props.geoid, 'agency', 'byRiskScenario', this.props.scenarioId, 'byRiskZone', 'all'],
            ['building', 'statewide', 'byGeoid', this.props.geoid, 'agency', 'sum', ['count', 'replacement_value']]
        );
    }

    buildingTable() {
        let BuildingTypeData = [];
        totalBuildings = 0;
        totalBuildingsValue = 0;
        riskZoneIdsAllValuesTotal = {};
        let primeColName = 'Owner Name';
        let linkBase = `${this.props.public ? '/risk' : ``}/assets/list/ownerType/2/statewide`;
        let linkTrail = ``
        let graph = this.props.buildingStatewideData;

        let riskZoneColNames = [];
        let scenarioToRiskZoneMapping = {};
        let riskZoneToNameMapping = {};
        if (graph && Object.keys(graph).length) {
            graph = Object.keys(graph)
                .reduce((a, c) => {
                    if (!c.toString().includes('-')) { //removing any data fetched from assetsList file
                        a[c] = graph[c]
                    }
                    return a
                }, {})

            Object.keys(graph)
                .forEach((geoId, i) => {

                    let riskZoneIdsAllValues = {}
                    Object.keys(get(graph, `${geoId}.agency.byRiskScenario`, {}))
                        .forEach(scenarioId => {
                            if (get(graph, `${geoId}.agency.byRiskScenario.${scenarioId}.byRiskZone.all.value`, null)){
                                get(graph, `${geoId}.agency.byRiskScenario.${scenarioId}.byRiskZone.all.value`, [])
                                    .filter(item => !(this.props.riskZoneId && this.props.riskZoneId.length) ||
                                        this.props.riskZoneId && this.props.riskZoneId.length && this.props.riskZoneId.map(d => d.toString()).includes(item.risk_zone_id))
                                    .forEach(riskZoneIdData =>{
                                        scenarioToRiskZoneMapping[scenarioId] = _.uniqBy([...get(scenarioToRiskZoneMapping, [scenarioId], []), riskZoneIdData.risk_zone_id])

                                        riskZoneToNameMapping[riskZoneIdData.name] = _.uniqBy([...get(riskZoneToNameMapping, [riskZoneIdData.name], []), riskZoneIdData.risk_zone_id])

                                        if (!riskZoneIdsAllValues[`${riskZoneIdData.name}`]){
                                            if(!riskZoneColNames.includes(`${riskZoneIdData.name} #`)){
                                                riskZoneColNames.push(`${riskZoneIdData.name} #`, `${riskZoneIdData.name} $` )
                                            }

                                            riskZoneIdsAllValues[`${riskZoneIdData.name}`] = {
                                                count: parseInt(riskZoneIdData.count) || 0,
                                                value: parseInt(riskZoneIdData.sum) || 0,
                                                scenarioId, riskZoneId : riskZoneIdData.risk_zone_id
                                            };
                                        }else{
                                            riskZoneIdsAllValues[`${riskZoneIdData.name}`].count += parseInt(riskZoneIdData.count) || 0;
                                            riskZoneIdsAllValues[`${riskZoneIdData.name}`].value += parseInt(riskZoneIdData.sum) || 0;
                                        }
                                    })
                            }

                        })
                    if(parseInt(get(graph, `${geoId}.agency.sum.count.value`))){
                        let metaData = ''
                        BuildingTypeData.push({
                            [primeColName]:
                                functions.formatName(get(this.props.geoidData, `${geoId}.name`, 'N/A'), geoId),
                            'TOTAL $ REPLACEMENT VALUE': parseInt(get(graph, `${geoId}.agency.sum.replacement_value.value`, 0)),
                            'TOTAL # BUILDING TYPE' : parseInt(get(graph, `${geoId}.agency.sum.count.value`, 0)),
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
                                    metaData += `${riskZone.split('%')[0]}-sid:${riskZoneIdsAllValues[riskZone].scenarioId}-rid:${riskZoneIdsAllValues[riskZone].riskZoneId}/`
                                    return a
                                }, {}),
                            link: linkBase + `/geo/${geoId}` + `/metaData/${metaData}`,
                        });

                        totalBuildings += parseInt(get(graph, `${geoId}.agency.sum.count.value`, 0));
                        totalBuildingsValue += parseInt(get(graph, `${geoId}.agency.sum.replacement_value.value`, 0));
                    }
                });
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

                link: linkBase + '/totalRow'
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
                    link: (d) => d.replace('/totalRow', '').split('/metaData')[0] + linkTrail, // functional
                    linkOnClick: this.props.linkOnClick
                },
                this.props.public ? null : {
                    Header: 'TOTAL $ REPLACEMENT VALUE',
                    accessor: 'TOTAL $ REPLACEMENT VALUE',
                    sort: true,
                    formatValue: fnum,
                    link: (d) => d.replace('/totalRow', '').split('/metaData')[0] + linkTrail, // takes what is in data
                    linkOnClick: this.props.linkOnClick
                },
                ...riskZoneColNames
                    .map((name) => {

                        if (name.includes('$') && this.props.public && this.props.hideFloodValue) {
                            return null
                        }
                        let a = {};

                        a['Header'] = name;
                        a['accessor'] = name;
                        a['sort'] = true;
                        if (name.includes('$')) {
                            a['formatValue'] = fnum
                        }
                        a['link'] = (d) =>
                        {
                            let metaData = d.split('/metaData/')[1];
                            let riskZone = riskZoneToNameMapping[name.slice(0, name.length - 2)];
                            let scenarioId = Object.keys(scenarioToRiskZoneMapping).filter(f => scenarioToRiskZoneMapping[f].includes(riskZone[0]))[0];
                            if(metaData && metaData !== '/' && !d.includes('/totalRow')){
                                metaData = metaData.split('/').filter(str => str.includes(name.split('%')[0]))[0]
                                if(metaData){
                                    metaData = metaData.split('-')
                                    metaData.forEach(s => {
                                        if(s.includes('sid')){
                                            scenarioId = s.split(':')[1]
                                        }else if(s.includes('rid')){
                                            riskZone = s.split(':')[1]
                                        }
                                    })
                                }
                            }

                            if(d.includes('/totalRow') && this.props.activeGeoid.length === 2){
                                scenarioId = 'all';
                                riskZone = riskZone.join('-');
                            }
                            d = d.replace('/totalRow', '');
                            d = d.split('/metaData')[0]
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
        return (
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