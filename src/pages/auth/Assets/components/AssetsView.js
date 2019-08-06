import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import pick from "lodash.pick"
import Element from 'components/light-admin/containers/Element'
import {Link} from "react-router-dom";
const CHARACTERISTICS = [
    'prop_class',
    'replacement_value',
    'num_units',
    'basement',
    'num_stories',
    'building_type',
    'roof_type'
];
const RISKS = [
    'flood_zone',
    'flood_depth',
    'flood_velocity',
    'flood_base_elevation'
];
const GENERAL_INFO = [
    'parcel_addr',
    'muni_name',
    'loc_zip',
    'prop_class',
    'land_av',
    'total_av',
    'full_market_val',
    'owner_type',
    'address'
];
const STRUCTURAL = [
    'bldg_style',
    'bldg_style_desc',
    'sqft_living',
    'nbr_kitchens',
    'nbr_full_baths',
    'nbr_bedrooms'
];
const SERVICES = [
    'sewer_type',
    'sewer_desc',
    'water_supply',
    'water_desc',
    'utilities',
    'utilities_desc',
    'heat_type',
    'heat_type_desc',
    'fuel_type',
    'fuel_type_desc'
];

class AssetsView extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            address : ''
        }
        this.buildingTableCharacteristics = this.buildingTableCharacteristics.bind(this);
        this.buildingTableRisks = this.buildingTableRisks.bind(this);
        this.parcelTableGeneralInfo = this.parcelTableGeneralInfo.bind(this);
        this.parcelTableStructuralInfo = this.parcelTableStructuralInfo.bind(this);
        this.parcelTableServicesInfo = this.parcelTableServicesInfo.bind(this);
    }

    componentWillMount(){
        this.fetchFalcorDeps();
    }

    fetchFalcorDeps(){
        if(this.props.match.params.assetId !== null)
        return this.props.falcor.get(
            ['building','byId',[this.props.match.params.assetId],CHARACTERISTICS],
            ['building','byId',[this.props.match.params.assetId],RISKS],
            ['parcel','byId',[this.props.match.params.assetId],GENERAL_INFO],
            ['parcel','byId',[this.props.match.params.assetId],STRUCTURAL],
            ['parcel','byId',[this.props.match.params.assetId],SERVICES]
        )
            .then(response =>{
                this.setState({
                    address : response.json.parcel.byId[this.props.match.params.assetId].address.toUpperCase()
                });
                return response
            })
    }
    buildingTableCharacteristics(){
        if(this.props.buildingData[this.props.match.params.assetId] !== undefined){
            let graph = this.props.buildingData[this.props.match.params.assetId];
            let tableData = [];
            if(graph){
                Object.keys(graph).forEach((item)=>{
                    if(CHARACTERISTICS.includes(item)){
                        tableData.push({
                            "characteristic" : item,
                            "value": graph[item] || 'Not available'
                        })
                    }

                })
            }
            return(
                <div>
                    <Element>
                        <h6>Buildings By Characteristics</h6>
                        <div className="table-responsive">
                            <table className="table table lightBorder">
                                <thead>
                                <tr>
                                    <th>ATTRIBUTE</th>
                                    <th>VALUE</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    tableData.map((data)=>{
                                        if(data.characteristic === 'replacement_value'){
                                            return(
                                                <tr>
                                                    <td>{data.characteristic}</td>
                                                    <td>${data.value}</td>
                                                </tr>
                                            )
                                        }
                                        else{
                                            return(
                                                <tr>
                                                    <td>{data.characteristic}</td>
                                                    <td>{data.value}</td>
                                                </tr>
                                            )
                                        }

                                    })
                                }
                                </tbody>
                            </table>
                        </div>
                        <div>
                        </div>
                    </Element>
                </div>
            )
        }

    }
    buildingTableRisks(){
        if(this.props.buildingData[this.props.match.params.assetId] !== undefined){
            let graph = this.props.buildingData[this.props.match.params.assetId];
            let tableData = [];
            if(graph){
                Object.keys(graph).forEach((item)=>{
                    if(RISKS.includes(item)){
                        tableData.push({
                            "risk":item,
                            "value":graph[item] || 'Not available'
                        })
                    }
                })
            }
            return(
                <div>
                    <Element>
                        <h6>Buildings By Risks</h6>
                        <div className="table-responsive">
                            <table className="table table lightBorder">
                                <thead>
                                <tr>
                                    <th>ATTRIBUTE</th>
                                    <th>VALUE</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    tableData.map((data)=>{
                                        return(
                                            <tr>
                                                <td>{data.risk}</td>
                                                <td>{data.value}</td>
                                            </tr>
                                        )
                                    })
                                }
                                </tbody>
                            </table>
                        </div>
                        <div>
                        </div>

                    </Element>
                </div>
            )
        }
    }

    parcelTableGeneralInfo(){
        if(this.props.parcelData[this.props.match.params.assetId] !== undefined){
            let graph = this.props.parcelData[this.props.match.params.assetId];
            let tableData = [];
            if(graph){
                Object.keys(graph).forEach((item)=>{
                    if (item !== 'parcel_addr' && item !== 'muni_name' && item !== 'loc_zip' && GENERAL_INFO.includes(item)){
                        this.address =  item['address'];
                        tableData.push({
                            "attribute":item,
                            "value" : graph[item] || 'Not available'
                        })
                    }

                });
            }
            return(
                <div>
                    <Element>
                        <h6>Parcels By General Info</h6>
                        <div className="table-responsive">
                            <table className="table table lightBorder">
                                <thead>
                                <tr>
                                    <th>ATTRIBUTE</th>
                                    <th>VALUE</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    tableData.map((data)=>{
                                        if(data.attribute === 'land_av' || data.attribute === 'total_av' || data.attribute === 'full_market_val'){
                                            return(
                                                <tr>
                                                    <td>{data.attribute}</td>
                                                    <td>${data.value}</td>
                                                </tr>
                                            )
                                        }else{
                                            return(
                                                <tr>
                                                    <td>{data.attribute}</td>
                                                    <td>{data.value}</td>
                                                </tr>
                                            )
                                        }

                                    })
                                }
                                </tbody>
                            </table>
                        </div>
                        <div>
                        </div>

                    </Element>
                </div>
            )
        }
    }

    parcelTableStructuralInfo(){
        if(this.props.parcelData[this.props.match.params.assetId] !== undefined){
            let graph = this.props.parcelData[this.props.match.params.assetId];
            let tableData = [];
            if(graph){
                Object.keys(graph).forEach((item)=>{
                    if (STRUCTURAL.includes(item))
                        tableData.push({
                            "attribute":item,
                            "value" : graph[item] || 'Not available'
                        })
                });
            }

            return(
                <div>
                    <Element>
                        <h6>Parcels By Structural Info</h6>
                        <div className="table-responsive">
                            <table className="table table lightBorder">
                                <thead>
                                <tr>
                                    <th>ATTRIBUTE</th>
                                    <th>VALUE</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    tableData.map((data)=>{
                                        return(
                                            <tr>
                                                <td>{data.attribute}</td>
                                                <td>{data.value}</td>
                                            </tr>
                                        )
                                    })
                                }
                                </tbody>
                            </table>
                        </div>
                        <div>
                        </div>

                    </Element>
                </div>
            )
        }
    }

    parcelTableServicesInfo(){
        if(this.props.parcelData[this.props.match.params.assetId] !== undefined){
            let graph = this.props.parcelData[this.props.match.params.assetId];
            let tableData = [];
            if(graph){
                Object.keys(graph).forEach((item)=>{
                    if (SERVICES.includes(item))
                        tableData.push({
                            "attribute":item,
                            "value" : graph[item] || 'Not available'
                        })
                });
            }

            return(
                <div>
                    <Element>
                        <h6>Parcels By Services Info</h6>
                        <div className="table-responsive">
                            <table className="table table lightBorder">
                                <thead>
                                <tr>
                                    <th>ATTRIBUTE</th>
                                    <th>VALUE</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    tableData.map((data)=>{
                                        return(
                                            <tr>
                                                <td>{data.attribute}</td>
                                                <td>{data.value}</td>
                                            </tr>
                                        )
                                    })
                                }
                                </tbody>
                            </table>
                        </div>
                        <div>
                        </div>
                    </Element>
                </div>
            )
        }

    }

    render(){
        return(
            <div className='container'>
                <Element>
                    <form>
                        <h6 className="element-header">{this.state.address}
                        <span style={{float:'right'}}>
                        <Link
                            className="btn btn-sm btn-primary"
                            to={ `/assets/edit/${this.props.match.params.assetId}` } >
                                Edit Asset
                        </Link>
                        </span>
                        </h6>
                    </form>
                    <div className="row">
                        <div className="col-md-6 col-xxxl-16">
                            <div className='element-wrapper'>
                                <div className='element-box'>
                                    <span><h4>Buildings Data</h4></span>
                                    {this.buildingTableCharacteristics()}
                                    {this.buildingTableRisks()}
                                </div>
                            </div>
                        </div>
                        <div className='col-sm-6 d-xxl-16'>
                            <div className='element-wrapper'>
                                <div className='element-box'>
                                    <span><h4>Parcels Data</h4></span>
                                    {this.parcelTableGeneralInfo()}
                                    {this.parcelTableStructuralInfo()}
                                    {this.parcelTableServicesInfo()}
                                </div>
                            </div>
                        </div>
                    </div>
                </Element>
            </div>
        )
    }
}

const mapStateToProps = (state,ownProps) => {
    return {
        geoid : ownProps.geoid,
        cousubs: get(state.graph, 'geo',{}),
        buildingData : get(state.graph,'building.byId',{}),
        parcelData : get(state.graph,'parcel.byId',{})
    }
};

const mapDispatchToProps =  {
//sendSystemMessage,
};
export default [
    {
        path: '/assets/:assetId',
        exact: true,
        name: 'Assets',
        auth: true,
        mainNav: false,
        breadcrumbs: [
            { name: 'Assets', path: '/assets' },
            { param: 'assetId', path: '/assets/' }
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(AssetsView))
    }
]