import React, {Component} from 'react';
import _ from "lodash"
import get from "lodash.get";
import {authProjects} from "../store/modules/user";
import {connect} from "react-redux";
import {reduxFalcor} from 'utils/redux-falcor'

import { fnum } from "utils/sheldusUtils"
import functions from 'pages/auth/Plan/functions'
const numeral = require('numeral');

import BuildingByOwnerTypeConfig from "pages/auth/Assets/components/BuildingByOwnerTypeConfig";
import BuildingByLandUseConfig from 'pages/auth/Assets/components/BuildingByLandUseConfig'

import TableSelector from "components/light-admin/tables/tableSelector"
import {sum} from "simple-statistics";
import {greatCircle} from "@turf/turf";

let totalBuildings = 0;
let totalBuildingsValue = 0;
let riskZoneIdsAllValuesTotal = {}
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    fetchFalcorDeps() {
        let propTypes =
            BuildingByLandUseConfig
            .filter(item => !this.props.groupByFilter.length || this.props.groupByFilter.map(f => f.toString().slice(0,1)).includes(item.value.slice(0,1)))
            .map(item => item.value);
        let ids = this.props.groupBy === 'ownerType' ? BuildingByOwnerTypeConfig.map(f => f.value) :
                    this.props.groupBy === 'propType' ? propTypes :
                    this.props.groupBy === 'jurisdiction' ? [] :
                        [];
        return this.props.falcor.get(
            ['geo', this.props.activeGeoid, ['name']],
            //["geo", this.props.activeGeoid, 'counties', 'municipalities'],
            ["geo", this.props.activeGeoid, 'cousubs'],

            ['building', 'byGeoid', this.props.geoid, this.props.groupBy, ids, 'sum', ['count','replacement_value']],

            ['building', 'byGeoid', this.props.geoid, this.props.groupBy, ids, 'byRiskScenario', this.props.scenarioId, 'byRiskZone', 'all']
        )
            .then(response => {
                //let allGeo = [this.props.activeGeoid,...get(this.props.falcor.getCache(), `geo.${this.props.activeGeoid}.counties.municipalities.value`, [])];
                let allGeo = get(this.props.falcor.getCache(), `geo.${this.props.activeGeoid}.cousubs.value`, []);
                return this.props.groupBy === 'jurisdiction' ?
                    this.props.falcor.get(
                        ['building', 'byGeoid', this.props.geoid, this.props.groupBy, allGeo, 'sum', ['count','replacement_value']],
                        ['building', 'byGeoid', this.props.geoid, this.props.groupBy, allGeo, 'byRiskScenario', this.props.scenarioId, 'byRiskZone', 'all'],
                        ['geo', allGeo , ['name']],
                ) : this.props.falcor.get(['geo', allGeo , ['name']])
            })
    }

    buildingTable(config){
        let BuildingTypeData = [];
        totalBuildings = 0;
        totalBuildingsValue = 0;
        riskZoneIdsAllValuesTotal = {};
        let primeColName = this.props.groupBy.split('T').join(' T');
        let linkBase = `/assets/list/${this.props.groupBy}/`;
        let graph = get(this.props.buildingData, `${this.props.geoid}.${this.props.groupBy}`, null);
        let riskZoneColNames = [];
        let scenarioToRiskZoneMapping = {};
        if(graph && Object.keys(graph).length) {
            Object.keys(graph)
                .forEach((item,i) =>{
                    console.log('item', item)
                    if (this.props.groupBy === 'propType'){
                        if (parseInt(item) % 100 === 0){
                            //sum subcategories
                            let tmpSumCount = 0, tmpSumReplacementValue = 0, subCats = [], riskZoneIdsAllValues = {};
                            Object.keys(graph)
                                .filter(subItem => subItem.toString().slice(0,1) === item.toString().slice(0,1))
                                .forEach((subItem,si) =>{
                                    subCats.push(subItem)
                                    tmpSumCount += parseInt(get(graph, `${subItem}.sum.count.value`, 0));
                                    tmpSumReplacementValue += parseInt(get(graph, `${subItem}.sum.replacement_value.value`, 0));

                                    // get risk zone data
                                    Object.keys(get(graph, `${subItem}.byRiskScenario`, {}))
                                        .forEach(scenarioId => {
                                            if (get(graph, `${subItem}.byRiskScenario.${scenarioId}.byRiskZone.all.value`, null)){
                                                get(graph, `${subItem}.byRiskScenario.${scenarioId}.byRiskZone.all.value`, [])
                                                    .forEach(riskZoneIdData => {
                                                        scenarioToRiskZoneMapping[scenarioId] ?
                                                            scenarioToRiskZoneMapping[scenarioId].push(riskZoneIdData.risk_zone_id) :
                                                            scenarioToRiskZoneMapping[scenarioId] = [riskZoneIdData.risk_zone_id];

                                                        if (!riskZoneIdsAllValues[`Risk Zone ${riskZoneIdData.risk_zone_id}`]){
                                                            if(!riskZoneColNames.includes(`Risk Zone ${riskZoneIdData.risk_zone_id} #`)){
                                                                riskZoneColNames.push(`Risk Zone ${riskZoneIdData.risk_zone_id} #`, `Risk Zone ${riskZoneIdData.risk_zone_id} $`)
                                                            }
                                                            riskZoneIdsAllValues[`Risk Zone ${riskZoneIdData.risk_zone_id}`] = {
                                                                count: parseInt(riskZoneIdData.count) || 0,
                                                                value: parseInt(riskZoneIdData.sum) || 0
                                                            };
                                                        }else{
                                                            riskZoneIdsAllValues[`Risk Zone ${riskZoneIdData.risk_zone_id}`].count += parseInt(riskZoneIdData.count) || 0;
                                                            riskZoneIdsAllValues[`Risk Zone ${riskZoneIdData.risk_zone_id}`].value += parseInt(riskZoneIdData.sum) || 0;
                                                        }

                                                        riskZoneIdsAllValuesTotal[`Risk Zone ${riskZoneIdData.risk_zone_id}` + ' #'] ?
                                                            riskZoneIdsAllValuesTotal[`Risk Zone ${riskZoneIdData.risk_zone_id}` + ' #'] += parseInt(riskZoneIdData.count) || 0 :
                                                            riskZoneIdsAllValuesTotal[`Risk Zone ${riskZoneIdData.risk_zone_id}` + ' #'] = parseInt(riskZoneIdData.count) || 0;

                                                        riskZoneIdsAllValuesTotal[`Risk Zone ${riskZoneIdData.risk_zone_id}` + ' $'] ?
                                                            riskZoneIdsAllValuesTotal[`Risk Zone ${riskZoneIdData.risk_zone_id}` + ' $'] +=  parseInt(riskZoneIdData.sum) || 0 :
                                                            riskZoneIdsAllValuesTotal[`Risk Zone ${riskZoneIdData.risk_zone_id}` + ' $'] =  parseInt(riskZoneIdData.sum) || 0;

                                                    })
                                            }

                                        })
                                    //todo: total risk zone data, sanity check on risk zone data, put links
                                    totalBuildings += parseInt(get(graph, `${subItem}.sum.count.value`, 0));
                                    totalBuildingsValue += parseInt(get(graph, `${subItem}.sum.replacement_value.value`, 0));
                                });
                            BuildingTypeData.push({
                                [primeColName]: this.props.groupByFilter.length ?
                                    get(config.filter(f => f.value === item).pop(), `name`, null) + ' Total' :
                                    get(config.filter(f => f.value === item).pop(), `name`, null),
                                'TOTAL # BUILDING TYPE' : tmpSumCount,
                                'TOTAL $ REPLACEMENT VALUE': tmpSumReplacementValue,
                                ...Object.keys(riskZoneIdsAllValues)
                                    .reduce((a, riskZone) => {
                                        a[riskZone + ' #'] = riskZoneIdsAllValues[riskZone].count;
                                        a[riskZone + ' $'] = riskZoneIdsAllValues[riskZone].value;

                                        return a
                                    }, {}),
                                link: linkBase + subCats.join('-'),
                            })
                        }
                        if (this.props.groupByFilter.length){
                            // if filter is on, we display subCats as well

                            // get risk zone data
                            let riskZoneIdsAllValues = {}
                            Object.keys(get(graph, `${item}.byRiskScenario`, {}))
                                .forEach(scenarioId => {
                                    if (get(graph, `${item}.byRiskScenario.${scenarioId}.byRiskZone.all.value`, null)){
                                        get(graph, `${item}.byRiskScenario.${scenarioId}.byRiskZone.all.value`, [])
                                            .forEach(riskZoneIdData => {
                                                console.log('graph for', item, item, scenarioId, riskZoneIdData)
                                                if (!riskZoneIdsAllValues[`Risk Zone ${riskZoneIdData.risk_zone_id}`]){
                                                    if(!riskZoneColNames.includes(`Risk Zone ${riskZoneIdData.risk_zone_id} #`)){
                                                        riskZoneColNames.push(`Risk Zone ${riskZoneIdData.risk_zone_id} #`, `Risk Zone ${riskZoneIdData.risk_zone_id} $` )
                                                    }
                                                    riskZoneIdsAllValues[`Risk Zone ${riskZoneIdData.risk_zone_id}`] = {
                                                        count: parseInt(riskZoneIdData.count) || 0,
                                                        value: parseInt(riskZoneIdData.sum) || 0
                                                    };
                                                }else{
                                                    riskZoneIdsAllValues[`Risk Zone ${riskZoneIdData.risk_zone_id}`].count += parseInt(riskZoneIdData.count) || 0;
                                                    riskZoneIdsAllValues[`Risk Zone ${riskZoneIdData.risk_zone_id}`].value += parseInt(riskZoneIdData.sum) || 0;
                                                }

                                            })
                                    }

                                })
                            
                            BuildingTypeData.push({
                                [primeColName]: get(config.filter(f => f.value === item).pop(), `name`, null),
                                'TOTAL $ REPLACEMENT VALUE': parseInt(get(graph, `${item}.sum.replacement_value.value`, 0)),
                                'TOTAL # BUILDING TYPE' : parseInt(get(graph, `${item}.sum.count.value`, 0)),
                                ...Object.keys(riskZoneIdsAllValues)
                                    .reduce((a, riskZone) => {
                                        a[riskZone + ' #'] = riskZoneIdsAllValues[riskZone].count;
                                        a[riskZone + ' $'] = riskZoneIdsAllValues[riskZone].value;

                                        return a
                                    }, {}),
                                link: linkBase + item
                            })
                        }
                    }else{
                        // get risk zone data
                        let riskZoneIdsAllValues = {}
                        Object.keys(get(graph, `${item}.byRiskScenario`, {}))
                            .forEach(scenarioId => {
                                if (get(graph, `${item}.byRiskScenario.${scenarioId}.byRiskZone.all.value`, null)){
                                    console.log('in else', get(graph, `${item}.byRiskScenario.${scenarioId}.byRiskZone.all.value`, null))
                                    get(graph, `${item}.byRiskScenario.${scenarioId}.byRiskZone.all.value`, [])
                                        .forEach(riskZoneIdData => {
                                            console.log('riskZoneIdData',item, riskZoneIdData.count, riskZoneIdData.sum)
                                            scenarioToRiskZoneMapping[scenarioId] ?
                                                scenarioToRiskZoneMapping[scenarioId].push(riskZoneIdData.risk_zone_id) :
                                                scenarioToRiskZoneMapping[scenarioId] = [riskZoneIdData.risk_zone_id];

                                            if (!riskZoneIdsAllValues[`Risk Zone ${riskZoneIdData.risk_zone_id}`]){
                                                if(!riskZoneColNames.includes(`Risk Zone ${riskZoneIdData.risk_zone_id} #`)){
                                                    riskZoneColNames.push(`Risk Zone ${riskZoneIdData.risk_zone_id} #`, `Risk Zone ${riskZoneIdData.risk_zone_id} $` )
                                                }
                                                riskZoneIdsAllValues[`Risk Zone ${riskZoneIdData.risk_zone_id}`] = {
                                                    count: parseInt(riskZoneIdData.count) || 0,
                                                    value: parseInt(riskZoneIdData.sum) || 0
                                                };
                                            }else{
                                                riskZoneIdsAllValues[`Risk Zone ${riskZoneIdData.risk_zone_id}`].count += parseInt(riskZoneIdData.count) || 0;
                                                riskZoneIdsAllValues[`Risk Zone ${riskZoneIdData.risk_zone_id}`].value += parseInt(riskZoneIdData.sum) || 0;
                                            }

                                        })
                                }

                            })
                        console.log('total graph', get(this.props.geoidData, `${this.props.activeGeoid}.cousubs.value`, []));
                        BuildingTypeData.push({
                            [primeColName]: this.props.groupBy === 'jurisdiction' ?
                            functions.formatName(get(this.props.geoidData, `${item}.name`, 'N/A'), item) :
                                get(config.filter(f => f.value === item).pop(), `name`, null),
                            'TOTAL $ REPLACEMENT VALUE': parseInt(get(graph, `${item}.sum.replacement_value.value`, 0)),
                            'TOTAL # BUILDING TYPE' : parseInt(get(graph, `${item}.sum.count.value`, 0)),
                            ...Object.keys(riskZoneIdsAllValues)
                                .reduce((a, riskZone) => {
                                    a[riskZone + ' #'] = riskZoneIdsAllValues[riskZone].count;
                                    a[riskZone + ' $'] = riskZoneIdsAllValues[riskZone].value;

                                    riskZoneIdsAllValuesTotal[riskZone + ' #'] ?
                                        riskZoneIdsAllValuesTotal[riskZone + ' #'] += riskZoneIdsAllValues[riskZone].count :
                                        riskZoneIdsAllValuesTotal[riskZone + ' #'] = riskZoneIdsAllValues[riskZone].count;

                                    riskZoneIdsAllValuesTotal[riskZone + ' $'] ?
                                        riskZoneIdsAllValuesTotal[riskZone + ' $'] += riskZoneIdsAllValues[riskZone].value :
                                        riskZoneIdsAllValuesTotal[riskZone + ' $'] = riskZoneIdsAllValues[riskZone].value;

                                    console.log('riskZoneIdsAllValuesTotal', riskZoneIdsAllValuesTotal)
                                    return a
                                }, {}),
                            link: linkBase + item
                        });

                        totalBuildings += parseInt(get(graph, `${item}.sum.count.value`, 0));
                        totalBuildingsValue += parseInt(get(graph, `${item}.sum.replacement_value.value`, 0));
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

                link: this.props.groupBy === 'jurisdiction' ?
                    linkBase + get(this.props.geoidData, `${this.props.activeGeoid}.cousubs.value`, []).join('-') :
                    linkBase + config.map(f => f.value).join('-')
            })
            console.log('BuildingTypeData', BuildingTypeData, riskZoneIdsAllValuesTotal)
        }
        return {data: BuildingTypeData,
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
                    link: (d) => d // functional
                },
                {
                    Header: 'TOTAL $ REPLACEMENT VALUE',
                    accessor: 'TOTAL $ REPLACEMENT VALUE',
                    sort: true,
                    formatValue: fnum,
                    link: true // takes what is in data
                },
                ...riskZoneColNames
                    .map((name) => {
                        let a = {};
                        let riskZone = name.split(' ');
                        riskZone = riskZone[riskZone.length - 2];
                        let scenarioId = Object.keys(scenarioToRiskZoneMapping).filter(f => scenarioToRiskZoneMapping[f].includes(riskZone)).pop();
                        a['Header'] = name;
                        a['accessor'] = name;
                        a['sort'] = true;
                        name.includes('$') ? a['formatValue'] = fnum : '';
                        a['link'] = (d) => d + `/scenario/${scenarioId}/riskzone/${riskZone}`;
                        return a
                    }),
            ]}
    }


    render() {
        return (
            <div style={{width: '85vw', height: '100vh'}}>
                <TableSelector
                    {...this.buildingTable(
                        this.props.groupBy === 'ownerType' ?
                            BuildingByOwnerTypeConfig :
                            BuildingByLandUseConfig)}
                    flex={false}
                    height={'60vh'}
                    width={'50vw'}
                />
            </div>
        )
    }
}


Home.defaultProps = {
    geoid: "36025",
    groupBy: 'jurisdiction', // ownerType, propType, jurisdiction
    groupByFilter: [],
    scenarioId: [2]
};
const mapStateToProps = state => ({

    isAuthenticated: !!state.user.authed,
    activePlan: state.user.activePlan, // so componentWillReceiveProps will get called.
    activeGeoid: state.user.activeGeoid,
    activeCousubid: state.user.activeCousubid,
    geoidData: get(state.graph, 'geo'),
    buildingData : get(state.graph,'building.byGeoid')
});

const mapDispatchToProps = ({
    //sendSystemMessage
    authProjects,
});

export default {
    path: '/test',
    exact: true,
    mainNav: false,
    menuSettings: {
        image: 'none',
        display: 'none',
        scheme: 'color-scheme-dark',
        position: 'menu-position-left',
        layout: 'menu-layout-compact',
        style: 'color-style-default'
    },
    name: 'Home',
    auth: true,
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Home))
}