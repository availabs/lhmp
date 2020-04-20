import React, {Component} from 'react';
import _ from "lodash"
import get from "lodash.get";
import {authProjects} from "store/modules/user";
import {connect} from "react-redux";
import {reduxFalcor} from 'utils/redux-falcor'

import { fnum } from "utils/sheldusUtils"
import functions from 'pages/auth/Plan/functions'
import BuildingByOwnerTypeConfig from "pages/auth/Assets/components/BuildingByOwnerTypeConfig";
import BuildingByLandUseConfig from 'pages/auth/Assets/components/BuildingByLandUseConfig'
import TableSelector from "components/light-admin/tables/tableSelector"

let totalBuildings = 0;
let totalBuildingsValue = 0;
let riskZoneIdsAllValuesTotal = {}
class NewZoneAssetsFilteredTable extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    fetchFalcorDeps(){
        let propTypes =
            BuildingByLandUseConfig
                .filter(item => !this.props.groupByFilter.length || this.props.groupByFilter.map(f => f.toString().slice(0,1)).includes(item.value.slice(0,1)))
                .map(item => item.value);
        let ids = this.props.groupBy === 'ownerType' ? BuildingByOwnerTypeConfig.map(f => f.value) :
            this.props.groupBy === 'propType' ? propTypes :
                this.props.groupBy === 'jurisdiction' ? [] :
                    [];

        return this.props.falcor.get(
            ['form_zones',['zones'],'byPlanId',this.props.activePlan,'byId',this.props.zone_id,
            this.props.groupBy,ids.filter(f => f),
            'byRiskScenario',this.props.scenarioId,'byRiskZone','all'],
            ['form_zones',['zones'],'byPlanId',this.props.activePlan,'byId',this.props.zone_id,this.props.groupBy,ids.filter(f => f),'sum',['num_buildings','replacement_value']]
        )
            .then(response =>{
                return response
            })
    }

    buildingTable(config){
        let BuildingTypeData = [];
        totalBuildings = 0;
        totalBuildingsValue = 0;
        riskZoneIdsAllValuesTotal = {};
        let digitsToMatch = this.props.groupBy === 'propType' ? 1 : this.props.groupBy === 'critical' ? 2 : 0;
        let moduloBy = this.props.groupBy === 'propType' ? 100 : this.props.groupBy === 'critical' ? 1000 : 1;
        let primeColName = this.props.groupBy.split('T').join(' T');
        let linkBase = `${this.props.public ? 'risk' : ``}/assets/list/${this.props.groupBy}/`;
        let linkTrail = '';
        let graph = this.props.groupBy === 'critical' ?
            Object.keys(get(this.props.buildingData, `${this.props.geoid}.${this.props.groupBy + 'Grouped'}`, {}))
                .reduce( (a,c) => {
                    a[c] = {
                        ...get(this.props.buildingData, `${this.props.geoid}.${this.props.groupBy + 'Grouped'}.${c}`, {}),
                        ...get(this.props.buildingData, `${this.props.geoid}.${this.props.groupBy}.${c}`, {})
                    }
                    return a;
                }, {})
            :
            get(this.props.buildingData,['byId',this.props.zone_id,this.props.groupBy],{})
        let riskZoneColNames = [];
        let scenarioToRiskZoneMapping = {};
        let riskZoneToNameMapping = {};
        if(graph && Object.keys(graph).length) {
            Object.keys(graph)
                .filter(item => {
                    if (this.props.groupBy === 'propType' || this.props.groupBy === 'critical') {
                        return !this.props.groupByFilter.length || this.props.groupByFilter.map(f => f.toString().slice(0, digitsToMatch)).includes(item.toString().slice(0, digitsToMatch))
                    } else if (this.props.groupBy === 'ownerType') {
                        return !this.props.groupByFilter.length || this.props.groupByFilter.includes(item)
                    } else {
                        return true
                    }

                }).forEach(item =>{
                if (this.props.groupBy === 'propType' || this.props.groupBy === 'critical'){
                    if (parseInt(item) % moduloBy === 0){
                        //sum subcategories
                        let tmpSumCount = 0, tmpSumReplacementValue = 0, subCats = [], riskZoneIdsAllValues = {},assetsFilteredByRiskZoneId = []

                        Object.keys(graph)
                            .filter(subItem => subItem.toString().slice(0,digitsToMatch) === item.toString().slice(0,digitsToMatch))
                            .forEach((subItem,si) =>{
                                //console.log('inside forEach', this.props.groupBy, subItem)
                                subCats.push(subItem)
                                tmpSumCount += parseInt(get(graph, `${subItem}.sum.num_buildings.value`, 0));
                                tmpSumReplacementValue += parseInt(get(graph, `${subItem}.sum.replacement_value.value`, 0));
                                // get risk zone data
                                Object.keys(get(graph, `${subItem}.byRiskScenario`, {}))
                                    .forEach(scenarioId => {
                                        if (get(graph, `${subItem}.byRiskScenario.${scenarioId}.byRiskZone.all.value`, null)){
                                            //filtering on riskZoneId
                                            if(this.props.riskZoneId && this.props.riskZoneId.length > 0){
                                                get(graph, `${subItem}.byRiskScenario.${scenarioId}.byRiskZone.all.value`, [])
                                                    .filter(item => this.props.riskZoneId && this.props.riskZoneId.map(d => d.toString()).includes(item.risk_zone_id))
                                                    .forEach(riskZoneIdData =>{
                                                        scenarioToRiskZoneMapping[scenarioId] ?
                                                            scenarioToRiskZoneMapping[scenarioId].push(riskZoneIdData.risk_zone_id) :
                                                            scenarioToRiskZoneMapping[scenarioId] = [riskZoneIdData.risk_zone_id];

                                                        if(!riskZoneIdsAllValues[`${riskZoneIdData.name}`]){
                                                            if(!riskZoneColNames.includes(`${riskZoneIdData.name} #`)){
                                                                riskZoneColNames.push(`${riskZoneIdData.name} #`, `${riskZoneIdData.name} $`)
                                                                riskZoneToNameMapping[riskZoneIdData.name] = riskZoneIdData.risk_zone_id;
                                                            }
                                                            riskZoneIdsAllValues[`${riskZoneIdData.name}`] = {
                                                                count: parseInt(riskZoneIdData.count) || 0,
                                                                value: parseInt(riskZoneIdData.sum) || 0
                                                            };
                                                        }
                                                        riskZoneIdsAllValuesTotal[`${riskZoneIdData.name}` + ' #'] ?
                                                            riskZoneIdsAllValuesTotal[`${riskZoneIdData.name}` + ' #'] += parseInt(riskZoneIdData.count) || 0 :
                                                            riskZoneIdsAllValuesTotal[`${riskZoneIdData.name}` + ' #'] = parseInt(riskZoneIdData.count) || 0;

                                                        riskZoneIdsAllValuesTotal[`${riskZoneIdData.name}` + ' $'] ?
                                                            riskZoneIdsAllValuesTotal[`${riskZoneIdData.name}` + ' $'] +=  parseInt(riskZoneIdData.sum) || 0 :
                                                            riskZoneIdsAllValuesTotal[`${riskZoneIdData.name}` + ' $'] =  parseInt(riskZoneIdData.sum) || 0;
                                                    })
                                            }else{
                                                get(graph, `${subItem}.byRiskScenario.${scenarioId}.byRiskZone.all.value`, [])
                                                    .forEach(riskZoneIdData => {
                                                        scenarioToRiskZoneMapping[scenarioId] ?
                                                            scenarioToRiskZoneMapping[scenarioId].push(riskZoneIdData.risk_zone_id) :
                                                            scenarioToRiskZoneMapping[scenarioId] = [riskZoneIdData.risk_zone_id];

                                                        if (!riskZoneIdsAllValues[`${riskZoneIdData.name}`]){
                                                            if(!riskZoneColNames.includes(`${riskZoneIdData.name} #`)){
                                                                riskZoneColNames.push(`${riskZoneIdData.name} #`, `${riskZoneIdData.name} $`)
                                                                riskZoneToNameMapping[riskZoneIdData.name] = riskZoneIdData.risk_zone_id;
                                                            }
                                                            riskZoneIdsAllValues[`${riskZoneIdData.name}`] = {
                                                                count: parseInt(riskZoneIdData.count) || 0,
                                                                value: parseInt(riskZoneIdData.sum) || 0
                                                            };
                                                        }else{
                                                            riskZoneIdsAllValues[`${riskZoneIdData.name}`].count += parseInt(riskZoneIdData.count) || 0;
                                                            riskZoneIdsAllValues[`${riskZoneIdData.name}`].value += parseInt(riskZoneIdData.sum) || 0;
                                                        }

                                                        riskZoneIdsAllValuesTotal[`${riskZoneIdData.name}` + ' #'] ?
                                                            riskZoneIdsAllValuesTotal[`${riskZoneIdData.name}` + ' #'] += parseInt(riskZoneIdData.count) || 0 :
                                                            riskZoneIdsAllValuesTotal[`${riskZoneIdData.name}` + ' #'] = parseInt(riskZoneIdData.count) || 0;

                                                        riskZoneIdsAllValuesTotal[`${riskZoneIdData.name}` + ' $'] ?
                                                            riskZoneIdsAllValuesTotal[`${riskZoneIdData.name}` + ' $'] +=  parseInt(riskZoneIdData.sum) || 0 :
                                                            riskZoneIdsAllValuesTotal[`${riskZoneIdData.name}` + ' $'] =  parseInt(riskZoneIdData.sum) || 0;

                                                    })
                                            }

                                        }

                                    })
                                totalBuildings += parseInt(get(graph, `${subItem}.sum.num_buildings.value`, 0));
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
                                    //filtering on risk_zone_id
                                    if(this.props.riskZoneId && this.props.riskZoneId.length > 0){
                                        get(graph, `${item}.byRiskScenario.${scenarioId}.byRiskZone.all.value`, [])
                                            .filter(item => this.props.riskZoneId && this.props.riskZoneId.map(d => d.toString()).includes(item.risk_zone_id))
                                            .forEach(riskZoneIdData =>{
                                                if(!riskZoneIdsAllValues[`${riskZoneIdData.name}`]){
                                                    if(!riskZoneColNames.includes(`${riskZoneIdData.name} #`)){
                                                        riskZoneColNames.push(`${riskZoneIdData.name} #`, `${riskZoneIdData.name} $`)
                                                        riskZoneToNameMapping[riskZoneIdData.name] = riskZoneIdData.risk_zone_id;
                                                    }
                                                    riskZoneIdsAllValues[`${riskZoneIdData.name}`] = {
                                                        count: parseInt(riskZoneIdData.count) || 0,
                                                        value: parseInt(riskZoneIdData.sum) || 0
                                                    };
                                                }
                                            })
                                    }else{
                                        get(graph, `${item}.byRiskScenario.${scenarioId}.byRiskZone.all.value`, [])
                                            .forEach(riskZoneIdData => {
                                                if (!riskZoneIdsAllValues[`${riskZoneIdData.name}`]){
                                                    if(!riskZoneColNames.includes(`${riskZoneIdData.name} #`)){
                                                        riskZoneColNames.push(`${riskZoneIdData.name} #`, `${riskZoneIdData.name} $` )
                                                        riskZoneToNameMapping[riskZoneIdData.name] = riskZoneIdData.risk_zone_id;

                                                    }
                                                    riskZoneIdsAllValues[`${riskZoneIdData.name}`] = {
                                                        count: parseInt(riskZoneIdData.count) || 0,
                                                        value: parseInt(riskZoneIdData.sum) || 0
                                                    };
                                                }else{
                                                    riskZoneIdsAllValues[`${riskZoneIdData.name}`].count += parseInt(riskZoneIdData.count) || 0;
                                                    riskZoneIdsAllValues[`${riskZoneIdData.name}`].value += parseInt(riskZoneIdData.sum) || 0;
                                                }

                                            })
                                    }

                                }

                            })

                        BuildingTypeData.push({
                            [primeColName]: get(config.filter(f => f.value === item).pop(), `name`, null),
                            'TOTAL $ REPLACEMENT VALUE': parseInt(get(graph, `${item}.sum.replacement_value.value`, 0)),
                            'TOTAL # BUILDING TYPE' : parseInt(get(graph, `${item}.sum.num_buildings.value`, 0)),
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
                                if(this.props.riskZoneId && this.props.riskZoneId.length > 0){
                                    get(graph, `${item}.byRiskScenario.${scenarioId}.byRiskZone.all.value`, [])
                                        .filter(item => this.props.riskZoneId && this.props.riskZoneId.map(d => d.toString()).includes(item.risk_zone_id))
                                        .forEach(riskZoneIdData =>{
                                            scenarioToRiskZoneMapping[scenarioId] ?
                                                scenarioToRiskZoneMapping[scenarioId].push(riskZoneIdData.risk_zone_id) :
                                                scenarioToRiskZoneMapping[scenarioId] = [riskZoneIdData.risk_zone_id];

                                            if(!riskZoneIdsAllValues[`${riskZoneIdData.name}`]){
                                                if(!riskZoneColNames.includes(`${riskZoneIdData.name} #`)){
                                                    riskZoneColNames.push(`${riskZoneIdData.name} #`, `${riskZoneIdData.name} $`)
                                                    riskZoneToNameMapping[riskZoneIdData.name] = riskZoneIdData.risk_zone_id;
                                                }
                                                riskZoneIdsAllValues[`${riskZoneIdData.name}`] = {
                                                    count: parseInt(riskZoneIdData.count) || 0,
                                                    value: parseInt(riskZoneIdData.sum) || 0
                                                };
                                            }
                                        })
                                }else{
                                    get(graph, `${item}.byRiskScenario.${scenarioId}.byRiskZone.all.value`, [])
                                        .forEach(riskZoneIdData => {
                                            scenarioToRiskZoneMapping[scenarioId] ?
                                                scenarioToRiskZoneMapping[scenarioId].push(riskZoneIdData.risk_zone_id) :
                                                scenarioToRiskZoneMapping[scenarioId] = [riskZoneIdData.risk_zone_id];

                                            if (!riskZoneIdsAllValues[`${riskZoneIdData.name}`]){
                                                if(!riskZoneColNames.includes(`${riskZoneIdData.name} #`)){
                                                    riskZoneColNames.push(`${riskZoneIdData.name} #`, `${riskZoneIdData.name} $` )
                                                    riskZoneToNameMapping[riskZoneIdData.name] = riskZoneIdData.risk_zone_id;

                                                }
                                                riskZoneIdsAllValues[`${riskZoneIdData.name}`] = {
                                                    count: parseInt(riskZoneIdData.count) || 0,
                                                    value: parseInt(riskZoneIdData.sum) || 0
                                                };
                                            }else{
                                                riskZoneIdsAllValues[`${riskZoneIdData.name}`].count += parseInt(riskZoneIdData.count) || 0;
                                                riskZoneIdsAllValues[`${riskZoneIdData.name}`].value += parseInt(riskZoneIdData.sum) || 0;
                                            }

                                        })
                                }

                            }

                        })

                    BuildingTypeData.push({
                        [primeColName]: this.props.groupBy === 'jurisdiction' ?
                            functions.formatName(get(this.props.geoidData, `${item}.name`, 'N/A'), item) :
                            this.props.groupBy === 'critical' ?
                                item :
                                get(config.filter(f => f.value === item).pop(), `name`, null),
                        'TOTAL $ REPLACEMENT VALUE': parseInt(get(graph, `${item}.sum.replacement_value.value`, 0)),
                        'TOTAL # BUILDING TYPE' : parseInt(get(graph, `${item}.sum.num_buildings.value`, 0)),
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
                        link: linkBase + item
                    });

                    totalBuildings += parseInt(get(graph, `${item}.sum.num_buildings.value`, 0));
                    totalBuildingsValue += parseInt(get(graph, `${item}.sum.replacement_value.value`, 0));
                }
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

                link: this.props.groupBy === 'jurisdiction' ?
                    linkBase + get(this.props.geoidData, `${this.props.geoid}.cousubs.value`, []).join('-') :
                    this.props.groupBy === 'critical' ?
                        linkBase + get(this.props.falcor.getCache(), `building.byGeoid.${this.props.geoid}.critical.types.all.value`, []).join('-') :
                        linkBase + config.map(f => f.value).join('-')
            })

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
                    link: (d) => d + linkTrail // functional
                },
                this.props.public ? null : {
                    Header: 'TOTAL $ REPLACEMENT VALUE',
                    accessor: 'TOTAL $ REPLACEMENT VALUE',
                    sort: true,
                    formatValue: fnum,
                    link: (d) => d + linkTrail // takes what is in data
                },
                ...riskZoneColNames
                    .map((name) => {
                        if (name.includes('$') && this.props.public) {return null}
                        let a = {};
                        let riskZone = riskZoneToNameMapping[name.slice(0, name.length-2)];
                        let scenarioId = Object.keys(scenarioToRiskZoneMapping).filter(f => scenarioToRiskZoneMapping[f].includes(riskZone)).pop();
                        a['Header'] = name;
                        a['accessor'] = name;
                        a['sort'] = true;
                        if(name.includes('$')) {
                            a['formatValue'] = fnum
                        }
                        a['link'] = (d) => d + `/scenario/${scenarioId}/riskzone/${riskZone}` + linkTrail;
                        return a
                    }),
            ].filter(f => f)}

    }

    render(){
        this.buildingTable(this.props.groupBy === 'ownerType' ?
            BuildingByOwnerTypeConfig :
            this.props.groupBy === 'propType' ?
                BuildingByLandUseConfig : get(this.props.parcelMeta, 'critical_infra.value', []))
        return (
            <div style={{width: this.props.width ? this.props.width : '', height: this.props.height ? this.props.height : ''}}>
                *<TableSelector
                    {...this.buildingTable(
                        this.props.groupBy === 'ownerType' ?
                            BuildingByOwnerTypeConfig :
                            this.props.groupBy === 'propType' ?
                                BuildingByLandUseConfig : get(this.props.parcelMeta, 'critical_infra.value', []))}
                    flex={this.props.flex ? this.props.flex : false}
                    height={this.props.height ? this.props.height : ''}
                    width={this.props.width ? this.props.width : ''}
                    tableClass={this.props.tableClass ? this.props.tableClass : null}
                />
            </div>
        )
    }
}

NewZoneAssetsFilteredTable.defaultProps = {
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
    buildingData : get(state.graph,['form_zones','zones','byPlanId',`${state.user.activePlan}`,]),
    parcelMeta : get(state.graph,'parcel.meta'),
});

const mapDispatchToProps = ({
    //sendSystemMessage
    authProjects,
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(NewZoneAssetsFilteredTable))