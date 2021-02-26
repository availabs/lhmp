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
            //console.log('updating', prevProps.groupByFilter, this.props.groupByFilter)
            return this.fetchFalcorDeps();
        }
    }

    fetchFalcorDeps() {

        let reqs = [
            ['building', 'statewide', 'byGeoid', this.props.geoid, 'owner_type', Object.values(this.props.filterData)[0], 'ownerName', 'list']
        ]
        return this.props.falcor.get(...reqs)
            .then(response => {
                let ownerNames =
                    this.props.geoid
                        .reduce((acc, geoid) => [
                            ...acc,
                            ...Object.values(this.props.filterData)[0]
                                .reduce((a,ownerType) => [...a, ...get(response, ['json', 'building', 'statewide', 'byGeoid', geoid, 'owner_type', ownerType, 'ownerName', 'list'])], [])
                        ] ,[]).filter(f => f);
                if (ownerNames && ownerNames.length){

                    if (this.props.activeGeoid.length === 2){
                        let iChunk = 100,
                            jChunk = 200
                        reqs = []

                        for (let j = 0; j < ownerNames.length; j += jChunk){
                            reqs.push(
                                ['building', 'statewide', 'byGeoid', this.props.geoid[0]/* 36001 fetches data for '36' */, 'owner_type', Object.values(this.props.filterData)[0], 'byRiskScenario', this.props.scenarioId, 'byRiskZone', 'byOwnerName', ownerNames.slice(j, j+jChunk), 'all'],

                            )
                            for (let i = 0; i < this.props.geoid.length; i += iChunk){
                            reqs.push(
                                ['building', 'statewide', 'byGeoid', this.props.geoid.slice(i, i+iChunk), 'owner_type', Object.values(this.props.filterData)[0], 'byOwnerName', ownerNames.slice(j, j+jChunk), 'sum', ['count', 'replacement_value']]
                            )
                        }
                    }

                    }else{
                        reqs = [
                            ['building', 'statewide', 'byGeoid', this.props.geoid, 'owner_type', Object.values(this.props.filterData)[0], 'byRiskScenario', this.props.scenarioId, 'byRiskZone', 'byOwnerName', ownerNames, 'all'],
                            ['building', 'statewide', 'byGeoid', this.props.geoid, 'owner_type', Object.values(this.props.filterData)[0], 'byOwnerName', ownerNames, 'sum', ['count', 'replacement_value']]
                        ]
                    }
                    console.log('reqs', reqs)
                    return reqs.reduce((a,c) => a.then(() => this.props.falcor.get(c)), Promise.resolve())
                        .then(d => console.log('d',d))
                }

                return Promise.resolve();
            })
    }

    buildingTable() {
        let BuildingTypeData = [];
        totalBuildings = 0;
        totalBuildingsValue = 0;
        riskZoneIdsAllValuesTotal = {};
        let primeColName = 'Owner Name';
        let linkBase = `${this.props.public ? '/risk' : ``}/assets/list/ownerType/2`;
        let linkTrail = ``
        let graph = this.props.buildingStatewideData;
        let ownerNames = this.props.geoid
            .reduce((acc, geoid) => [
                ...acc,
                ...Object.values(this.props.filterData)[0]
                    .reduce((a, ownerType) => [...a, ...get(this.props.buildingStatewideData, [geoid, 'owner_type', ownerType, 'ownerName', 'list', 'value'], [])], [])
            ] ,[])
        ownerNames = _.uniqBy(ownerNames)
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

            ownerNames.forEach((ownerName, oni) => {
                Object.keys(graph)
                    .forEach((geoId, i) => {

                        let riskZoneIdsAllValues = {}
                        Object.keys(get(graph, `${geoId}.owner_type.2.byRiskScenario`, {}))
                            .forEach(scenarioId => {
                                if (get(graph, `${geoId}.owner_type.2.byRiskScenario.${scenarioId}.byRiskZone.byOwnerName.${ownerName}.all.value`, null)) {
                                    if (this.props.riskZoneId && this.props.riskZoneId.length > 0) {
                                        get(graph, `${geoId}.owner_type.2.byRiskScenario.${scenarioId}.byRiskZone.byOwnerName.${ownerName}.all.value`, [])
                                            .filter(item => this.props.riskZoneId && this.props.riskZoneId.map(d => d.toString()).includes(item.risk_zone_id))
                                            .forEach(riskZoneIdData => {
                                                scenarioToRiskZoneMapping[scenarioId] ?
                                                    scenarioToRiskZoneMapping[scenarioId].push(riskZoneIdData.risk_zone_id) :
                                                    scenarioToRiskZoneMapping[scenarioId] = [riskZoneIdData.risk_zone_id];

                                                if (!riskZoneIdsAllValues[`${riskZoneIdData.name}`]) {
                                                    if (!riskZoneColNames.includes(`${riskZoneIdData.name} #`)) {
                                                        riskZoneColNames.push(`${riskZoneIdData.name} #`, `${riskZoneIdData.name} $`)
                                                        riskZoneToNameMapping[riskZoneIdData.name] = riskZoneIdData.risk_zone_id;
                                                    }
                                                    riskZoneIdsAllValues[`${riskZoneIdData.name}`] = {
                                                        count: parseInt(riskZoneIdData.count) || 0,
                                                        value: parseInt(riskZoneIdData.sum) || 0
                                                    };
                                                }
                                            })
                                    } else {
                                        get(graph, `${geoId}.owner_type.2.byRiskScenario.${scenarioId}.byRiskZone.byOwnerName.${ownerName}.all.value`, [])
                                            .forEach(riskZoneIdData => {
                                                scenarioToRiskZoneMapping[scenarioId] ?
                                                    scenarioToRiskZoneMapping[scenarioId].push(riskZoneIdData.risk_zone_id) :
                                                    scenarioToRiskZoneMapping[scenarioId] = [riskZoneIdData.risk_zone_id];

                                                if (!riskZoneIdsAllValues[`${riskZoneIdData.name}`]) {
                                                    if (!riskZoneColNames.includes(`${riskZoneIdData.name} #`)) {
                                                        riskZoneColNames.push(`${riskZoneIdData.name} #`, `${riskZoneIdData.name} $`)
                                                        riskZoneToNameMapping[riskZoneIdData.name] = riskZoneIdData.risk_zone_id;

                                                    }
                                                    riskZoneIdsAllValues[`${riskZoneIdData.name}`] = {
                                                        count: parseInt(riskZoneIdData.count) || 0,
                                                        value: parseInt(riskZoneIdData.sum) || 0
                                                    };
                                                } else {
                                                    riskZoneIdsAllValues[`${riskZoneIdData.name}`].count += parseInt(riskZoneIdData.count) || 0;
                                                    riskZoneIdsAllValues[`${riskZoneIdData.name}`].value += parseInt(riskZoneIdData.sum) || 0;
                                                }

                                            })
                                    }

                                }

                            })

                        if(get(graph, `${geoId}.owner_type.2.byOwnerName.${ownerName}.sum.count.value`)){
                            if(BuildingTypeData.filter(tmpD => tmpD[primeColName] === ownerName).length === 0){
                                BuildingTypeData.push({
                                    [primeColName]: ownerName,
                                    'TOTAL $ REPLACEMENT VALUE': parseInt(get(graph, `${geoId}.owner_type.2.byOwnerName.${ownerName}.sum.replacement_value.value`, 0)),
                                    'TOTAL # BUILDING TYPE': parseInt(get(graph, `${geoId}.owner_type.2.byOwnerName.${ownerName}.sum.count.value`, 0)),
                                    geosCounted: [ownerName],
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
                                    link: linkBase + `/geo/${geoId}`
                                });

                                totalBuildings += parseInt(get(graph, `${geoId}.owner_type.2.byOwnerName.${ownerName}.sum.count.value`, 0));
                                totalBuildingsValue += parseInt(get(graph, `${geoId}.owner_type.2.byOwnerName.${ownerName}.sum.replacement_value.value`, 0));
                            }else{
                                let tmpRecord = BuildingTypeData.filter(btd => btd[primeColName] === ownerName)[0];

                                tmpRecord =
                                    Object.assign(tmpRecord,
                                        {
                                            [primeColName]: ownerName,
                                            'TOTAL $ REPLACEMENT VALUE':
                                                tmpRecord['TOTAL $ REPLACEMENT VALUE'] + /*tmpRecord.geosCounted.includes(item) ? 0 :*/ parseInt(get(graph, `${geoId}.owner_type.2.byOwnerName.${ownerName}.sum.replacement_value.value`, 0)),
                                            'TOTAL # BUILDING TYPE' :
                                                tmpRecord['TOTAL # BUILDING TYPE'] + /*tmpRecord.geosCounted.includes(item) ? 0 :*/ parseInt(get(graph, `${geoId}.owner_type.2.byOwnerName.${ownerName}.sum.count.value`, 0)),
                                            geosCounted: [...tmpRecord.geosCounted, geoId],
                                            ...Object.keys(riskZoneIdsAllValues)
                                                .reduce((a, riskZone) => {
                                                    a[riskZone + ' #'] = (get(tmpRecord, [riskZone + ' #'], 0) + (parseInt(riskZoneIdsAllValues[riskZone].count) || 0)) || 0;
                                                    a[riskZone + ' $'] = (get(tmpRecord, [riskZone + ' $'], 0) + (parseInt(riskZoneIdsAllValues[riskZone].value) || 0)) || 0;
                                                    riskZoneIdsAllValuesTotal[riskZone + ' #'] ?
                                                        riskZoneIdsAllValuesTotal[riskZone + ' #'] += parseInt(riskZoneIdsAllValues[riskZone].count) || 0 :
                                                        riskZoneIdsAllValuesTotal[riskZone + ' #'] = parseInt(riskZoneIdsAllValues[riskZone].count) || 0;

                                                    riskZoneIdsAllValuesTotal[riskZone + ' $'] ?
                                                        riskZoneIdsAllValuesTotal[riskZone + ' $'] += parseInt(riskZoneIdsAllValues[riskZone].value) || 0 :
                                                        riskZoneIdsAllValuesTotal[riskZone + ' $'] = parseInt(riskZoneIdsAllValues[riskZone].value) || 0;
                                                    return a
                                                }, {}),
                                            link: linkBase
                                        });

                                BuildingTypeData = [tmpRecord, ...BuildingTypeData.filter(btd => btd[primeColName] !== ownerName)]

                                totalBuildings += parseInt(get(graph, `${geoId}.owner_type.2.byOwnerName.${ownerName}.sum.count.value`, 0));
                                totalBuildingsValue += parseInt(get(graph, `${geoId}.owner_type.2.byOwnerName.${ownerName}.sum.replacement_value.value`, 0));
                            }
                        }

                    });
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