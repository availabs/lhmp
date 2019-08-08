import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import pick from "lodash.pick"
import Element from 'components/light-admin/containers/Element'
import {Link} from "react-router-dom";
const BASIC_INFO = [
    'prop_class',
    'replacement_value',
    'critical',
    'address'
];
const OCCUPANCY_INFO = [
    'num_residents',
    'num_employees',
    'num_occupants',
    'num_vehicles_inhabitants'
];
const STRUCTURAL_INFO = [
    'num_units',
    'basement',
    'building_type',
    'roof_type',
    'height',
    'num_stories',
    'structure_type',
    'bldg_style',
    'sqft_living',
    'nbr_kitchens',
    'nbr_full_baths',
    'nbr_bedrooms',
    'first_floor_elevation'

];
const SERVICES_INFO = [
    'heat_type'
];

const COMMERCIAL_INFO = [
    'naics_code',
    'census_industry_code',
    'replacement_value',
    'contents_replacement_value',
    'inventory_replacement_value',
    'establishment_revenue',
    'business_hours'

];
const RISK_INFO = [
    'seismic_zone',
    'flood_plain',
    'flood_depth',
    'flood_duration',
    'flood_velocity',
    'high_wind_speed',
    'soil_type',
    'storage_hazardous_materials',
    'topography'
]

class AssetsView extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            address : ''
        }
        this.basicInfo = this.basicInfo.bind(this);
        this.occupancyInfo = this.occupancyInfo.bind(this);
        this.structuralInfo = this.structuralInfo.bind(this);
        this.servicesInfo = this.servicesInfo.bind(this);
        this.commercialInfo = this.commercialInfo.bind(this);
        this.riskInfo = this.riskInfo.bind(this);
    }

    componentWillMount(){
        this.fetchFalcorDeps();
    }

    fetchFalcorDeps(){
        if(this.props.match.params.assetId !== null)
        return this.props.falcor.get(
            ['building','byId',[this.props.match.params.assetId],BASIC_INFO],
            ['building','byId',[this.props.match.params.assetId],OCCUPANCY_INFO],
            ['building','byId',[this.props.match.params.assetId],STRUCTURAL_INFO],
            ['building','byId',[this.props.match.params.assetId],SERVICES_INFO],
            ['building','byId',[this.props.match.params.assetId],COMMERCIAL_INFO],
            ['building','byId',[this.props.match.params.assetId],RISK_INFO]
        )
            .then(response =>{
                this.setState({
                    address : response.json.building.byId[this.props.match.params.assetId].address.toUpperCase()
                });
                return response
            })
    }
    basicInfo(){
        if(this.props.buildingData[this.props.match.params.assetId] !== undefined){
            let graph = this.props.buildingData[this.props.match.params.assetId];
            let tableData = [];
            if(graph){
                Object.keys(graph).forEach((item)=>{
                    if(BASIC_INFO.includes(item)){
                        if(graph[item] === true){
                            tableData.push({
                                "characteristic" : item,
                                "value": graph[item].toString()
                            })
                        }
                        else{
                            tableData.push({
                                "characteristic" : item,
                                "value": graph[item] || 'Not available'
                            })
                        }

                    }

                })
            }
            return(
                <div>
                    <Element>
                        <h4>Basic Info</h4>
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
    occupancyInfo(){
        if(this.props.buildingData[this.props.match.params.assetId] !== undefined){
            let graph = this.props.buildingData[this.props.match.params.assetId];
            let tableData = [];
            if(graph){
                Object.keys(graph).forEach((item)=>{
                    if(OCCUPANCY_INFO.includes(item)){
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
                        <h4>Occupancy Info</h4>
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

    structuralInfo(){
        if(this.props.buildingData[this.props.match.params.assetId] !== undefined){
            let graph = this.props.buildingData[this.props.match.params.assetId];
            let tableData = [];
            if(graph){
                Object.keys(graph).forEach((item)=>{
                    if (item !== 'parcel_addr' && item !== 'muni_name' && item !== 'loc_zip' && STRUCTURAL_INFO.includes(item)){
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
                        <h4>Structural Info</h4>
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

    servicesInfo(){
        if(this.props.buildingData[this.props.match.params.assetId] !== undefined){
            let graph = this.props.buildingData[this.props.match.params.assetId];
            let tableData = [];
            if(graph){
                Object.keys(graph).forEach((item)=>{
                    if (SERVICES_INFO.includes(item))
                        tableData.push({
                            "attribute":item,
                            "value" : graph[item] || 'Not available'
                        })
                });
            }

            return(
                <div>
                    <Element>
                        <h4>Services Info</h4>
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

    commercialInfo(){
        if(this.props.buildingData[this.props.match.params.assetId] !== undefined){
            let graph = this.props.buildingData[this.props.match.params.assetId];
            let tableData = [];
            if(graph){
                Object.keys(graph).forEach((item)=>{
                    if (COMMERCIAL_INFO.includes(item))
                        tableData.push({
                            "attribute":item,
                            "value" : graph[item] || 'Not available'
                        })
                });
            }

            return(
                <div>
                    <Element>
                        <h4>Commercial Info</h4>
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
                                        if(data.attribute === 'replacement_value' || data.attribute === 'inventory_replacement_value' || data.attribute === 'contents_replacement_value' || data.attribute === 'establishment_revenue'){
                                            return(
                                                <tr>
                                                    <td>{data.attribute}</td>
                                                    <td>${data.value}</td>
                                                </tr>
                                            )
                                        }
                                        else{
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

    riskInfo(){
        if(this.props.buildingData[this.props.match.params.assetId] !== undefined){
            let graph = this.props.buildingData[this.props.match.params.assetId];
            let tableData = [];
            if(graph){
                Object.keys(graph).forEach((item)=>{
                    if (RISK_INFO.includes(item))
                        tableData.push({
                            "attribute":item,
                            "value" : graph[item] || 'Not available'
                        })
                });
            }

            return(
                <div>
                    <Element>
                        <h4>Risk Info</h4>
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
                                    {this.basicInfo()}
                                    {this.occupancyInfo()}
                                    {this.structuralInfo()}
                                </div>
                            </div>
                        </div>
                        <div className='col-sm-6 d-xxl-16'>
                            <div className='element-wrapper'>
                                <div className='element-box'>
                                    {this.servicesInfo()}
                                    {this.commercialInfo()}
                                    {this.riskInfo()}
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