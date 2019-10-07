import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import pick from "lodash.pick"
import Element from 'components/light-admin/containers/Element'
import TableBox from 'components/light-admin/tables/TableBox'
import {Link} from "react-router-dom";
import {falcorChunkerNice} from "store/falcorGraph"
import config from 'pages/auth/Assets/components/BuildingByLandUseConfig.js'
import owner_config from 'pages/auth/Assets/components/BuildingByOwnerTypeConfig.js'

const ATTRIBUTES =[
    'address',
    'prop_class',
    'owner_type',
    'replacement_value',
];
let length = 0;
const owner_types = ['1','2','3','4','5','6','7','8','9','10','-999']

class AssetsListByTypeByHazard extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            geoid: '',
            data: [],
            loading: false,
            columns : ATTRIBUTES
        };
    }

    fetchFalcorDeps(){
        if(this.props.match.params.hazardIds){
            let assetByTypeIds = [];
            assetByTypeIds.push(...this.props.match.params.typeIds.split('-'));
            return this.props.falcor.get(['building','byGeoid'
                ,this.props.activeGeoid,
                this.props.match.params.type,assetByTypeIds,this.props.match.params.hazardIds,
                'sum',['count','replacement_value']])
                .then(response => {
                    let graph = response.json.building.byGeoid[this.props.activeGeoid][this.props.match.params.type];
                    Object.keys(graph).filter(d => d !== '$__path').forEach(item =>{
                        length += parseInt(graph[item][this.props.match.params.hazardIds].sum.count)
                    })

                })

        }else{
            let assetByTypeIds = [];
            assetByTypeIds.push(...this.props.match.params.typeIds.split('-'));
            return this.props.falcor.get(['building','byGeoid'
                ,this.props.activeGeoid,
                this.props.match.params.type,assetByTypeIds,'sum',['count','replacement_value']])
                .then(response => {
                    let graph = response.json.building.byGeoid[this.props.activeGeoid][this.props.match.params.type]
                    Object.keys(graph).filter(d => d !== '$__path').forEach(item =>{
                        length += parseInt(graph[item].sum.count)
                    })

                })
        }

    }

    componentDidMount(){
        let data = [];
        let types = this.props.match.params.typeIds.toString()
        let assetByTypeIds = [];
        config.forEach(item =>{
            assetByTypeIds.push(item.value)
        });
        assetByTypeIds.push(...this.props.match.params.typeIds.split('-'))
        assetByTypeIds.push(...owner_types)
        if(this.props.match.params.hazardIds){
            this.setState({
                loading : true
            });
            return this.props.falcor.get(['building', 'byGeoid',
                    this.props.activeGeoid,
                    this.props.match.params.type,
                    types,
                    [this.props.match.params.hazardIds],
                    'byIndex',{from:0, to:50},ATTRIBUTES],
                ['building','meta',assetByTypeIds,'name'])
                .then(response => {
                    let meta = response.json.building.meta;
                    let graph = response.json.building.byGeoid[this.props.activeGeoid][this.props.match.params.type][types][this.props.match.params.hazardIds].byIndex;
                    Object.keys(graph).forEach(item =>{
                        if (graph[item] && graph[item]['$__path'] !== undefined && meta[graph[item].prop_class] !== undefined){
                            data.push({
                                'address':graph[item].address,
                                'prop_class':meta[graph[item].prop_class].name || 'None',
                                'owner_type':meta[graph[item].owner_type].name,
                                'replacement_value': graph[item].replacement_value,
                                'building_id':graph[item]['$__path'][2]
                            })
                        }

                    });
                    data.sort((a,b) => (parseInt(a.replacement_value) < parseInt(b.replacement_value)) ? 1: -1);
                    data.map(d =>{
                        d.replacement_value = '$'+d.replacement_value
                    })
                    this.setState({data: data, loading: false});
                })
        }
        else{
            this.setState({
                loading : true
            });
            return this.props.falcor.get(['building', 'byGeoid',
                    this.props.activeGeoid,
                    this.props.match.params.type,
                    types,
                    'byIndex',{from:0, to:50},ATTRIBUTES],
                ['building','meta',assetByTypeIds,'name'])
                .then(response => {
                    let meta = response.json.building.meta;
                    let graph = response.json.building.byGeoid[this.props.activeGeoid][this.props.match.params.type][types].byIndex;
                    Object.keys(graph).forEach(item =>{
                        if (graph[item] && graph[item]['$__path'] !== undefined && meta[graph[item].prop_class] !== undefined){
                            data.push({
                                'address':graph[item].address,
                                'prop_class':meta[graph[item].prop_class].name,
                                'owner_type':meta[graph[item].owner_type].name,
                                'replacement_value': graph[item].replacement_value,
                                'building_id':graph[item]['$__path'][2]
                            })
                        }

                    });
                    data.sort((a,b) => (parseInt(a.replacement_value) < parseInt(b.replacement_value)) ? 1: -1);
                    data.map(d =>{
                        d.replacement_value = '$'+d.replacement_value
                    })
                    this.setState({data: data, loading: false});
                })
        }

    }
    onPageChange(from, to) {
        let data = [];
        let types = this.props.match.params.typeIds.toString()
        let assetByTypeIds = [];
        config.forEach(item =>{
            assetByTypeIds.push(item.value)
        });
        assetByTypeIds.push(...this.props.match.params.typeIds.split('-'))
        assetByTypeIds.push(...owner_types)
        if(this.props.match.params.hazardIds){
            this.setState({
                loading : true
            })
            return this.props.falcor.get(
                ['building', 'byGeoid',
                    this.props.activeGeoid,
                    this.props.match.params.type,
                    types,
                    [this.props.match.params.hazardIds],
                    'byIndex',{from:from, to:to},ATTRIBUTES],
                ['building','meta',assetByTypeIds,'name'])
                .then(response => {
                    let meta = response.json.building.meta;
                    let graph = response.json.building.byGeoid[this.props.activeGeoid][this.props.match.params.type][types][this.props.match.params.hazardIds].byIndex;
                    Object.keys(graph).forEach(item =>{
                        if (graph[item] && graph[item]['$__path'] !== undefined && meta[graph[item].prop_class] !== undefined){
                            data.push({
                                'address':graph[item].address,
                                'prop_class':meta[graph[item].prop_class].name,
                                'owner_type':meta[graph[item].owner_type].name,
                                'replacement_value': graph[item].replacement_value,
                                'building_id':graph[item]['$__path'][2]
                            })
                        }
                    })
                    data.sort((a,b) => (parseInt(a.replacement_value) < parseInt(b.replacement_value)) ? 1: -1);
                    data.map(d =>{
                        d.replacement_value = '$'+d.replacement_value
                    })
                    this.setState({data: data, loading: false});
                })
        }else{
            this.setState({
                loading : true
            })
            return this.props.falcor.get(
                ['building', 'byGeoid',
                    this.props.activeGeoid,
                    this.props.match.params.type,
                    types,
                    'byIndex',{from:from, to:to},ATTRIBUTES],
                ['building','meta',assetByTypeIds,'name'])
                .then(response => {
                    let meta = response.json.building.meta;
                    let graph = response.json.building.byGeoid[this.props.activeGeoid][this.props.match.params.type][types].byIndex;
                    Object.keys(graph).forEach(item =>{
                        if (graph[item] && graph[item]['$__path'] !== undefined && meta[graph[item].prop_class] !== undefined){
                            data.push({
                                'address':graph[item].address,
                                'prop_class':meta[graph[item].prop_class].name,
                                'owner_type':meta[graph[item].owner_type].name,
                                'replacement_value': graph[item].replacement_value,
                                'building_id':graph[item]['$__path'][2]
                            })
                        }
                    })
                    data.sort((a,b) => (parseInt(a.replacement_value) < parseInt(b.replacement_value)) ? 1: -1);
                    data.map(d =>{
                        d.replacement_value = '$'+d.replacement_value
                    })
                    this.setState({data: data, loading: false});
                })
        }


    }

    render(){
        let hazard_risk = ''
        let property_type = ''
        if (this.props.match.params.hazardIds === 'flood_100' ){
            hazard_risk = '100-year Flood Zone'
        }
        else if (this.props.match.params.hazardIds === 'flood_500') {
            hazard_risk = '500-year Flood Zone'
        }
        if(this.props.match.params.type === 'propType'){
            property_type = 'Property'
        }
        else if(this.props.match.params.type === 'ownerType'){
            let owner_type = this.props.match.params.typeIds.split('-')
            console.log('owner',owner_type)
            if(owner_type.length === 1){
                owner_config.forEach(d=>{
                    if (d.value === owner_type[0]){
                        property_type = d.name + ' ' + 'Owner'
                    }
                })
            }
            else{
                property_type = 'Municipal' +' '+ 'Owner'
            }
        }
        else if(this.props.match.params.type === 'critical'){
            property_type = 'Critical Infrastructure'
        }
        return (
            <div>
                <Element>
                    <h4>Assets Listed By {property_type} - {this.props.match.params.typeIds.split('-').join(',')} {hazard_risk ? 'and' + ' ' + hazard_risk : null}</h4>
                    <div id="dataTable1_wrapper" className="dataTables_wrapper container-fluid dt-bootstrap4" >
                        <div className="row">
                            <TableBox
                                page={0}
                                size={this.props.size}
                                length={[length]}
                                loading={this.state.loading}
                                onPage={this.onPageChange.bind(this)}
                                filterData = {true}
                                tableData = {this.state.data}
                                columns = {this.state.columns}
                            />
                        </div>
                    </div>
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
        filter_type : ownProps.filter_type,
        filter_value : ownProps.filter_value,
        //geoid: ownProps.geoid,
        prop_class: ownProps.prop_class,
        buildingMeta: get(state.graph,'building.meta',{}),
    })
};

const mapDispatchToProps = {};

export default [{
        icon: 'os-icon',
        path: '/assets/list/:type/:typeIds',
        exact: true,
        mainNav: false,
        breadcrumbs: [
            { name: 'Assets', path: '/assets/' },
            { name: 'type', path: '/assets/list/:type' },
            { name: 'typeIds',path:'/assets/list/:type/:typeIds'}
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
        component: connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(AssetsListByTypeByHazard))
    },
    {
        path: '/assets/list/:type/:typeIds/hazard/:hazardIds',
        name: 'Asset List',
        mainNav: false,
        auth: true,
        exact: true,
        breadcrumbs: [
            { name: 'Assets', path: '/assets/' },
            { name: 'type', path: '/assets/list/:type' },
            { name: 'typeIds',path:'/assets/list/:type/:typeIds'},
            { name: 'hazardIds',path:'/assets/list/:type/:typeIds/hazard/:hazardIds'}
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(AssetsListByTypeByHazard))
    },
    ]

