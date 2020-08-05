import React from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import _ from 'lodash'
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import TableBox from 'components/light-admin/tables/TableBox'
import {Link} from "react-router-dom";
import owner_config from 'pages/auth/Assets/components/BuildingByOwnerTypeConfig.js'
import ElementBox from "../../../../components/light-admin/containers/ElementBox";
import BuildingByLandUseConfig from 'pages/auth/Assets/components/BuildingByLandUseConfig.js'
import BuildingByOwnerTypeConfig from "./BuildingByOwnerTypeConfig";
const ATTRIBUTES = [
    'address',
    'prop_class',
    'owner_type',
    'replacement_value',
];
let length = 5276890;
const owner_types = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '-999']

class AssetsListByTypeByHazard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            geoid: this.props.match.params.geoid ? this.props.match.params.geoid : this.props.activeGeoid,
            data: [],
            loading: false,
            columns: ATTRIBUTES
        };
        this.zonesData = this.zonesData.bind(this)
    }
    zonesData(from, to){
        let data = []
        this.setState({
            loading: true
        })
        let propTypes =
            BuildingByLandUseConfig
                .filter(item => !this.props.groupByFilter.length || this.props.groupByFilter.map(f => f.toString().slice(0,1)).includes(item.value.slice(0,1)))
                .map(item => item.value);
        let ids = this.props.groupBy === 'ownerType' ? BuildingByOwnerTypeConfig.map(f => f.value) :
            this.props.groupBy === 'propType' ? propTypes :
                this.props.groupBy === 'jurisdiction' ? [] :
                    [];
        ids = this.props.match.params.typeIds.split('-')

        return this.props.falcor.get(
            ['form_zones',['zones'],'byPlanId',this.props.activePlan,'byId',this.props.zone_id,
                this.props.groupBy,ids.filter(f => f),
                'byRiskScenario',this.props.scenarioId,'byRiskZone','list'],
            ['form_zones',['zones'],'byPlanId',this.props.activePlan,'byId',this.props.zone_id,
                this.props.groupBy,ids.filter(f => f), 'list'],
            ['building', 'meta', ['owner_type', 'prop_class'], 'name'])
            .then(response => {
                let meta = response.json.building.meta;
                let graph = response.json.form_zones.zones.byPlanId[this.props.activePlan].byId[this.props.zone_id][this.props.groupBy];
                Object.keys(graph).forEach(item => {
                    let tmpItem = this.props.match.params.scenarioIds ? get(graph[item], `byRiskScenario.${this.props.scenarioId}.byRiskZone.list`, []) :
                        get(graph[item], `list`, [])
                    if (tmpItem){
                        tmpItem.forEach(ti => {
                            data.push({
                                'address': ti.address,
                                'prop_class': meta.prop_class.map(d => d.value === ti.prop_class ? d.name : null),
                                'owner_type': meta.owner_type.map(d => d.value === ti.owner_type ? d.name : null),
                                'replacement_value': ti.replacement_value,
                                'building_id': ti.building_id
                            })
                        })
                    }
                })
                data.sort((a, b) => (parseInt(a.replacement_value) < parseInt(b.replacement_value)) ? 1 : -1);
                data.map(d => {
                    d.replacement_value = '$' + d.replacement_value
                })
                this.setState({data: from && to ? data.slice(from, to) : data.slice(0, this.props.size), loading: false});

            })
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.activeCousubid !== this.props.activeCousubid || prevState.geoid !== this.state.geoid) {
            this.setState({geoid: this.props.activeCousubid !== "undefined" ? this.props.activeCousubid : this.props.activeGeoid})
        }
        if (prevProps.match.url !== this.props.match.url){
           this.componentDidMount()
        }
        if (!_.isEqual(prevState.data, this.state.data) && this.props.dataChange){
            this.props.dataChange(get(this.state, `data`, []).slice(0,get(this.props, `size`, 5)))
        }
    }

    componentDidMount() {
        let data = [];
        let types = this.props.match.params.typeIds.toString()

        if (this.props.buildings) { // if building ids are given
            return  this.zonesData()
        }

        if (this.props.match.params.hazardIds) {
            this.setState({
                loading: true
            });
            return this.props.falcor.get(['building', 'byGeoid',
                    this.state.geoid,
                    this.props.match.params.type,
                    types,
                    [this.props.match.params.hazardIds],
                    'byIndex', {from: 0, to: 50}, ATTRIBUTES],
                ['building', 'meta', ['owner_type', 'prop_class'], 'name'])
                .then(response => {
                    let meta = response.json.building.meta;
                    let graph = response.json.building.byGeoid[this.state.geoid][this.props.match.params.type][types][this.props.match.params.hazardIds].byIndex;
                    Object.keys(graph).forEach(item => {
                        if (graph[item] && graph[item]['$__path']) {
                            data.push({
                                'address': graph[item].address,
                                'prop_class': meta.prop_class.map(d => d.value === graph[item].prop_class ? d.name : null),
                                'owner_type': meta.owner_type.map(d => d.value === graph[item].owner_type ? d.name : null),
                                'replacement_value': graph[item].replacement_value,
                                'building_id': graph[item]['$__path'][2]
                            })
                        }

                    });

                    data.sort((a, b) => (parseInt(a.replacement_value) < parseInt(b.replacement_value)) ? 1 : -1);
                    data.map(d => {
                        d.replacement_value = '$' + d.replacement_value
                    })
                    this.setState({data: data, loading: false});
                })
        } else if (this.props.match.params.scenarioIds) {
            this.setState({
                loading: true
            });
            return this.props.falcor.get(
                ['building', 'byGeoid', this.state.geoid, this.props.match.params.type, types, 'byRiskScenario', this.props.match.params.scenarioIds,
                    'byRiskZone', this.props.match.params.riskzoneIds ? this.props.match.params.riskzoneIds : 'all', 'byIndex', {
                    from: 0,
                    to: 50
                }, ATTRIBUTES],
                ['building', 'meta', ['owner_type', 'prop_class'], 'name']
            )
                .then(response => {
                    let meta = response.json.building.meta;
                    let riskZones = this.props.match.params.riskzoneIds ? this.props.match.params.riskzoneIds.toString() : 'all';

                    let graph = get(response,
                        `json.building.byGeoid.${this.state.geoid}.${this.props.match.params.type}.${types}.byRiskScenario.${this.props.match.params.scenarioIds}.byRiskZone.${riskZones}.byIndex`,
                        null);
                    if (!graph) return Promise.resolve()
                    Object.keys(graph).forEach(item => {
                        if (graph[item] && graph[item]['$__path']) {
                            data.push({
                                'address': graph[item].address,
                                'prop_class': meta.prop_class.map(d => d.value === graph[item].prop_class ? d.name : null),
                                'owner_type': meta.owner_type.map(d => d.value === graph[item].owner_type ? d.name : null),
                                'replacement_value': graph[item].replacement_value,
                                'building_id': graph[item]['$__path'][2]
                            })
                        }

                    });

                    data.sort((a, b) => (parseInt(a.replacement_value) < parseInt(b.replacement_value)) ? 1 : -1);
                    data.map(d => {
                        d.replacement_value = '$' + d.replacement_value
                    })
                    this.setState({data: data, loading: false});
                })
        } else {
            this.setState({
                loading: true
            });
            let type = this.props.match.params.type === 'critical' ? 'criticalGrouped' : this.props.match.params.type;
            return this.props.falcor.get(
                ['building', 'byGeoid',
                    this.state.geoid,
                    type,
                    types,
                    'byIndex', {from: 0, to: 50}, ATTRIBUTES],

                ['building', 'meta', ['owner_type', 'prop_class'], 'name'])
                .then(response => {
                    let meta = response.json.building.meta;
                    //console.log('res', response.json.building.byGeoid[this.state.geoid][this.props.match.params.type][types].byIndex)
                    let graph = response.json.building.byGeoid[this.state.geoid][type][types].byIndex;
                    Object.keys(graph).forEach(item => {
                        if (get(graph, `${item}.$__path`, null) !== null) {
                            data.push({
                                'address': graph[item].address,
                                'prop_class': meta.prop_class.map(d => d.value === graph[item].prop_class ? d.name : null),
                                'owner_type': meta.owner_type.map(d => d.value === graph[item].owner_type ? d.name : null),
                                'replacement_value': graph[item].replacement_value,
                                'building_id': graph[item]['$__path'][2]
                            })
                        }

                    });
                    data.sort((a, b) => (parseInt(a.replacement_value) < parseInt(b.replacement_value)) ? 1 : -1);
                    data.map(d => {
                        d.replacement_value = '$' + d.replacement_value
                    })
                    this.setState({data: data, loading: false});
                })
        }

    }

    onPageChange(from, to) {
        let data = [];
        let types = this.props.match.params.typeIds.toString()

        if (this.props.buildings) { // if building ids are given
            return this.zonesData(from, to)
        }

        if (this.props.match.params.hazardIds) {
            this.setState({
                loading: true
            })
            return this.props.falcor.get(
                ['building', 'byGeoid',
                    this.state.geoid,
                    this.props.match.params.type,
                    types,
                    [this.props.match.params.hazardIds],
                    'byIndex', {from: from, to: to}, ATTRIBUTES],
                ['building', 'meta', ['owner_type', 'prop_class'], 'name'])
                .then(response => {
                    let meta = response.json.building.meta;
                    let graph = response.json.building.byGeoid[this.state.geoid][this.props.match.params.type][types][this.props.match.params.hazardIds].byIndex;
                    Object.keys(graph).forEach(item => {
                        if (get(graph, `${item}.$__path`, null) !== null) {
                            data.push({
                                'address': graph[item].address,
                                'prop_class': meta.prop_class.map(d => d.value === graph[item].prop_class ? d.name : null),
                                'owner_type': meta.owner_type.map(d => d.value === graph[item].owner_type ? d.name : null),
                                'replacement_value': graph[item].replacement_value,
                                'building_id': graph[item]['$__path'][2]
                            })
                        }
                    })
                    data.sort((a, b) => (parseInt(a.replacement_value) < parseInt(b.replacement_value)) ? 1 : -1);
                    data.map(d => {
                        d.replacement_value = '$' + d.replacement_value
                    })
                    this.setState({data: data, loading: false});

                })
        } else if (this.props.match.params.scenarioIds) {
            this.setState({
                loading: true
            });
            return this.props.falcor.get(
                ['building', 'byGeoid', this.state.geoid, this.props.match.params.type, types, 'byRiskScenario', this.props.match.params.scenarioIds,
                    'byRiskZone', this.props.match.params.riskzoneIds ? this.props.match.params.riskzoneIds : 'all', 'byIndex', {
                    from: from,
                    to: to
                }, ATTRIBUTES],
                ['building', 'meta', ['owner_type', 'prop_class'], 'name']
            )
                .then(response => {
                    let meta = response.json.building.meta;
                    let riskZones = this.props.match.params.riskzoneIds ? this.props.match.params.riskzoneIds.toString() : 'all';
                    let graph = get(response,
                        `json.building.byGeoid.${this.state.geoid}.${this.props.match.params.type}.${types}.byRiskScenario.${this.props.match.params.scenarioIds}.byRiskZone.${riskZones}.byIndex`,
                        null);
                    Object.keys(graph).forEach(item => {
                        if (graph[item] && graph[item]['$__path']) {
                            data.push({
                                'address': graph[item].address,
                                'prop_class': meta.prop_class.map(d => d.value === graph[item].prop_class ? d.name : null),
                                'owner_type': meta.owner_type.map(d => d.value === graph[item].owner_type ? d.name : null),
                                'replacement_value': graph[item].replacement_value,
                                'building_id': graph[item]['$__path'][2]
                            })
                        }

                    });

                    data.sort((a, b) => (parseInt(a.replacement_value) < parseInt(b.replacement_value)) ? 1 : -1);
                    data.map(d => {
                        d.replacement_value = '$' + d.replacement_value
                    })
                    this.setState({data: data, loading: false});
                })
        } else {
            this.setState({
                loading: true
            })
            let type = this.props.match.params.type === 'critical' ? 'criticalGrouped' : this.props.match.params.type;

            return this.props.falcor.get(
                ['building', 'byGeoid',
                    this.state.geoid,
                    type,
                    types,
                    'byIndex', {from: from, to: to}, ATTRIBUTES],
                ['building', 'meta', ['owner_type', 'prop_class'], 'name'])
                .then(response => {
                    let meta = response.json.building.meta;
                    let graph = response.json.building.byGeoid[this.state.geoid][type][types].byIndex;
                    Object.keys(graph).forEach(item => {
                        if (get(graph, `${item}.$__path`, null) !== null) {
                            data.push({
                                'address': graph[item].address,
                                'prop_class': meta.prop_class.map(d => d.value === graph[item].prop_class ? d.name : null),
                                'owner_type': meta.owner_type.map(d => d.value === graph[item].owner_type ? d.name : null),
                                'replacement_value': graph[item].replacement_value,
                                'building_id': graph[item]['$__path'][2]
                            })
                        }
                    })
                    data.sort((a, b) => (parseInt(a.replacement_value) < parseInt(b.replacement_value)) ? 1 : -1);
                    data.map(d => {
                        d.replacement_value = '$' + d.replacement_value
                    })
                    this.setState({data: data, loading: false});
                })
        }


    }

    render() {
        let hazard_risk = ''
        let property_type = ''
        if (this.props.match.params.hazardIds === 'flood_100') {
            hazard_risk = '100-year Flood Zone'
        } else if (this.props.match.params.hazardIds === 'flood_500') {
            hazard_risk = '500-year Flood Zone'
        }
        if (this.props.match.params.type === 'propType') {
            property_type = 'Property'
        } else if (this.props.match.params.type === 'ownerType') {
            let owner_type = this.props.match.params.typeIds.split('-')
            if (owner_type.length === 1) {
                owner_config.forEach(d => {
                    if (d.value === owner_type[0]) {
                        property_type = d.name + ' ' + 'Owner'
                    }
                })
            } else {
                property_type = 'Municipal' + ' ' + 'Owner'
            }
        } else if (this.props.match.params.type === 'critical') {
            property_type = 'Critical Infrastructure'
        }
        return (
            <div>
                <Element>
                    <ElementBox>
                        <h4 style={{textWrap: 'break-word', wordBreak: 'break-word'}}>
                            <label>
                                Assets Listed By {property_type} -
                                {
                                    get(this.props, `match.params.typeIds`, '').toString().split('-')
                                        .map(type =>
                                            get(BuildingByLandUseConfig.filter(f => f.value === type.toString()), `[0].name`, type)
                                        ).join(', ')
                                }
                                {hazard_risk ? ' and ' + ' ' + hazard_risk : null}
                                {this.props.match.params.riskzoneIds ? ` and Risk Zones: ${this.props.match.params.riskzoneIds.toString().split('-').join(', ')}` : null}
                            </label>
                            <Link
                                className="mr-2 mb-2 btn btn-sm btn-outline-info btn-rounded"
                                to={'/guidance/guidance-assets/view'} target={'_blank'}
                            >?</Link>
                        </h4>
                        <div id="dataTable1_wrapper" className="dataTables_wrapper container-fluid dt-bootstrap4">
                            <div className="row">
                                <TableBox
                                    page={0}
                                    pageSize={this.props.size}
                                    length={[length]}
                                    loading={this.state.loading}
                                    onPage={this.onPageChange.bind(this)}
                                    filterData={true}
                                    tableData={this.props.match.url.split('/')[1] === 'risk' ?
                                        this.state.data.map(f => {
                                            delete f.replacement_value;
                                            return f
                                        }) :
                                        this.state.data}
                                    columns={
                                        this.props.match.url.split('/')[1] === 'risk' ?
                                            this.state.columns.filter(f => f !== 'replacement_value') :
                                            this.state.columns
                                    }
                                    isPublic={this.props.match.url.split('/')[1] === 'risk'}
                                />
                            </div>
                        </div>
                    </ElementBox>
                </Element>
            </div>
        )
    }

    static defaultProps = {
        geoid: [36001],
        length: length,
        size: 50,
        filterData: false
    }
}

const mapStateToProps = (state, ownProps) => {
    return ({
        activeGeoid: state.user.activeGeoid,
        activePlan: state.user.activePlan,
        filter_type: ownProps.filter_type,
        filter_value: ownProps.filter_value,
        //geoid: ownProps.geoid,
        prop_class: ownProps.prop_class,
        buildingMeta: get(state.graph, 'building.meta', {}),
    })
};

const mapDispatchToProps = {};

let authRoutes = [
    // Auth
    {
        icon: 'os-icon',
        path: '/assets/list/:type/:typeIds',
        exact: true,
        mainNav: false,
        breadcrumbs: [
            {name: 'Assets', path: '/assets/'},
            {name: 'type', path: '/assets/list/:type'},
            {name: 'typeIds', path: '/assets/list/:type/:typeIds'}
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        name: 'Asset List',
        auth: true,
        component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(AssetsListByTypeByHazard))
    },
    {
        path: '/assets/list/:type/:typeIds/hazard/:hazardIds',
        name: 'Asset List',
        mainNav: false,
        auth: true,
        exact: true,
        breadcrumbs: [
            {name: 'Assets', path: '/assets/'},
            {name: 'type', path: '/assets/list/:type'},
            {name: 'typeIds', path: '/assets/list/:type/:typeIds'},
            {name: 'hazardIds', path: '/assets/list/:type/:typeIds/hazard/:hazardIds'}
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(AssetsListByTypeByHazard))
    },

    {
        path: '/assets/list/:type/:typeIds/scenario/:scenarioIds',
        name: 'Asset List',
        mainNav: false,
        auth: true,
        exact: true,
        breadcrumbs: [
            {name: 'Assets', path: '/assets/'},
            {name: 'type', path: '/assets/list/:type'},
            {name: 'typeIds', path: '/assets/list/:type/:typeIds'},
            {name: 'scenarioIds', path: '/assets/list/:type/:typeIds/scenario/:scenarioIds'},
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(AssetsListByTypeByHazard))
    },

    {
        path: '/assets/list/:type/:typeIds/scenario/:scenarioIds/riskZone/:riskzoneIds',
        name: 'Asset List',
        mainNav: false,
        auth: true,
        exact: true,
        breadcrumbs: [
            {name: 'Assets', path: '/assets/'},
            {name: 'type', path: '/assets/list/:type'},
            {name: 'typeIds', path: '/assets/list/:type/:typeIds'},
            {name: 'scenarioIds', path: '/assets/list/:type/:typeIds/scenario/:scenarioIds'},
            {name: 'riskzoneIds', path: '/assets/list/:type/:typeIds/scenario/:scenarioIds/riskZone/:riskzoneIds'}
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(AssetsListByTypeByHazard))
    },
];
let publicRoutes = authRoutes.map(r => {
    let newR = _.cloneDeep(r);
    newR.path = '/risk' + r.path;
    newR.auth = false;
    newR.menuSettings.position = 'menu-position-top';
    newR.menuSettings.style = 'color-style-default';
    newR.menuSettings.layout = 'menu-layout-full';
    newR.menuSettings.scheme = 'color-scheme-dark';
    return newR
});

authRoutes.push(...publicRoutes);

let geoRoutes = authRoutes.map(r => {
    let newR = _.cloneDeep(r);
    newR.path = r.path + '/geo/:geoid';
    return newR
});

authRoutes.push(...geoRoutes);
export const ListWithoutUrl = connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(AssetsListByTypeByHazard))
export default authRoutes

