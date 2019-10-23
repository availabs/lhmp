import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import Wizard from 'components/light-admin/wizard'
import Element from 'components/light-admin/containers/Element'
import {sendSystemMessage} from 'store/modules/messages';
import {Link} from "react-router-dom";
import {falcorGraph} from "../../../../store/falcorGraph";

const actionCategory = [];
class AssetsEdit extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            prop_class : '',
            replacement_value : '',
            critical : '',
            num_residents : '',
            num_employees: '',
            num_occupants : '',
            num_vehicles_inhabitants : '',
            num_units : '',
            basement : '',
            building_type : '',
            roof_type: '',
            height : '',
            num_stories : '',
            structure_type: '',
            bldg_style: '',
            address: '',
            sqft_living : '',
            nbr_kitchens : '',
            nbr_full_baths: '',
            nbr_bedrooms: '',
            first_floor_elevation: '',
            heat_type: '',
            naics_code: '',
            census_industry_code : '',
            contents_replacement_value : '',
            inventory_replacement_value: '',
            establishment_revenue : '',
            business_hours: '',
            seismic_zone : '',
            flood_plain:'',
            flood_depth: '',
            flood_duration : '',
            flood_velocity: '',
            high_wind_speed: '',
            soil_type: '',
            storage_hazardous_materials: '',
            topography: '',
            action_type: '',
            /*
            flood_zone: '',


            flood_base_elevation: '',
            land_av: '',
            total_av: '',
            full_market_val: '',
            owner_type: '',
            sewer_type: '',
            water_supply: '',
            utilities: '',
            fuel_type: '',
             */

        };
        this.handleChange = this.handleChange.bind(this);
        this.propClassDropDown = this.propClassDropDown.bind(this);
        this.buildingTypeDropDown = this.buildingTypeDropDown.bind(this);
        this.actionTypeDropDown = this.actionTypeDropDown.bind(this);
        //this.floodZoneDropDown = this.floodZoneDropDown.bind(this);
        //this.ownerTypeDropDown = this.ownerTypeDropDown.bind(this);
        this.buildingTypeDropDown = this.buildingTypeDropDown.bind(this);
        //this.sewerTypeDropDown = this.sewerTypeDropDown.bind(this);
        //this.waterSupplyDropDown = this.waterSupplyDropDown.bind(this);
        //this.utilitiesDropDown = this.utilitiesDropDown.bind(this);
       // this.fuelTypeDropDown = this.fuelTypeDropDown.bind(this);
        this.heatTypeDropDown = this.heatTypeDropDown.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.getActionsCategoryAndType = this.getActionsCategoryAndType.bind(this);
    }

    handleChange(e) {
        console.log('---',e.target.id,e.target.value,this.state);
        this.setState({ ...this.state, [e.target.id]: e.target.value });
    }

    fetchFalcorDeps(){
        return this.props.falcor.get(['parcel','meta',['prop_class','owner_type','bldg_style','sewer_type','water_supply','utilities','heat_type','fuel_type']])
            .then(response =>{
                return response
            })
    }

    componentDidMount(){
        this.getActionsCategoryAndType();
        if(this.props.match.params.assetId) {
            this.props.falcor.get(['building','byId',[this.props.match.params.assetId],Object.keys(this.state)])
                .then(response =>{
                    Object.keys(this.state).forEach((key,i)=>{
                        let tmp_state = {};
                        tmp_state[key] = response.json.building.byId[this.props.match.params.assetId][key] || '' ;
                        this.setState(
                            tmp_state
                        );

                    });

                })
        }

    }
    getActionsCategoryAndType(){
        this.props.falcor.get(
            ['actions','project','meta']
        )
            .then(d => {
                if (falcorGraph.getCache().actions &&
                    falcorGraph.getCache().actions.project &&
                    falcorGraph.getCache().actions.project.meta &&
                    falcorGraph.getCache().actions.project.meta.value
                ){
                    actionCategory.push(...falcorGraph.getCache().actions.project.meta.value)

                }
            })
    }
    propClassDropDown(){
        if(this.props.parcelMetaData !== undefined && this.props.parcelMetaData['prop_class'] !== undefined){
            const graph = this.props.parcelMetaData['prop_class'];
            let propClassDropDownData = [];
            Object.values(graph).filter(d => d !== 'atom').forEach(item =>{
                item.forEach(i =>{
                    propClassDropDownData.push(i)
                })
            })
            return(
                <select className="form-control justify-content-sm-end" id='prop_class' onChange={this.handleChange} value={this.state.prop_class}>
                    <option default>--Select Prop Class--</option>
                    <option className="form-control" key={0} value="None">No Prop Class Selected</option>
                    {
                        propClassDropDownData.map((data,i) =>{
                            return(<option className="form-control" key={i+1} value={parseInt(data.value)}>{data.name}</option>)
                        })
                    }
                </select>
            )
        }
    }

    //TODO : - yet to be entered in DB
    buildingTypeDropDown(){
        let buildingTypeDropDownData = [];
        return(
            <select className="form-control justify-content-sm-end" id='building_type' onChange={this.handleChange} value={this.state.building_type}>
                <option default>--Select Building Type--</option>
                <option className="form-control" key={0} value="None">No Building Type Selected</option>
                {
                    buildingTypeDropDownData.map((data,i) =>{
                        return(<option className="form-control" key={i+1} value={data.value}>{data.name}</option>)
                    })
                }
            </select>
        )
    }

    actionTypeDropDown(){
        return (
            <select className="form-control justify-content-sm-end" id='action_type' onChange={this.handleChange} value={this.state.action_type}>
                <option default>--Select Action Type--</option>
                <option className="form-control" key={0} value="None">No Action Type Selected</option>
                {
                    actionCategory.map((cat, i) => {
                        console.log('cat',cat)
                        return (<option className="form-control" key={i + 1}
                                        value={cat.id}>{cat.actions_tracker_category | cat.actions_tracker_type}</option>)
                    })
                }
            </select>

        )
    }

    buildingStyleDropDown(){
        if(this.props.parcelMetaData !== undefined && this.props.parcelMetaData['bldg_style']){
            const graph = this.props.parcelMetaData['bldg_style'];
            let buildingStyleDropDownData = []
            Object.values(graph).filter(d => d !== 'atom').forEach(item =>{
                item.forEach(i =>{
                    buildingStyleDropDownData.push(i)
                })
            })
            return(
                <select className="form-control justify-content-sm-end" id='bldg_style' onChange={this.handleChange} value={this.state.bldg_style}>
                    <option default>--Select Building Style--</option>
                    <option className="form-control" key={0} value="None">No Building Style Selected</option>
                    {
                        buildingStyleDropDownData.map((data,i) =>{
                            return(<option className="form-control" key={i+1} value={data.value}>{data.name}</option>)
                        })
                    }
                </select>
            )
        }
    }
    heatTypeDropDown(){
        if(this.props.parcelMetaData !== undefined && this.props.parcelMetaData['heat_type']){
            const graph = this.props.parcelMetaData['heat_type'];
            let heatTypeDropDownData = []
            Object.values(graph).filter(d => d !== 'atom').forEach(item =>{
                item.forEach(i =>{
                    heatTypeDropDownData.push(i)
                })
            })
            return(
                <select className="form-control justify-content-sm-end" id='heat_type' onChange={this.handleChange} value={this.state.heat_type}>
                    <option default>--Select Heat Type--</option>
                    <option className="form-control" key={0} value="None">No Heat Type Selected</option>
                    {
                        heatTypeDropDownData.map((data,i) =>{
                            return(<option className="form-control" key={i+1} value={data.value}>{data.name}</option>)
                        })
                    }
                </select>
            )
        }
    }

    onSubmit(event){
        event.preventDefault();
        let args = [];
        if(this.props.match.params.assetId){
            let attributes = Object.keys(this.state)
            let updated_data ={};
            Object.keys(this.state).forEach((d, i) => {
                console.log(this.state[d], d)
                updated_data[d] = this.state[d]
            })
            return this.props.falcor.set({
                paths: [
                    ['building','byId', [this.props.match.params.assetId], attributes]
                ],
                jsonGraph: {
                    building: {
                        byId: {
                            [this.props.match.params.assetId]: updated_data
                        }
                    }
                }
            })
            .then(response => {
                this.props.sendSystemMessage(`Asset was successfully edited.`, {type: "success"});
            })
        }

    }

    render(){
        const wizardSteps = [
            {
                title: (<span>
                    <span style={{fontSize:'0.7em'}}>Step 1</span>
                    <br /><span style={{fontSize:'0.9em'}}>Basic Info</span></span>),
                content: (<div className="row">
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Prop Type</label>
                            {this.propClassDropDown()}</div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Replacement value</label>
                            <input id='replacement_value' onChange={this.handleChange} className="form-control" placeholder="Replacement value" type="text" value={this.state.replacement_value}/></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Critical Infrastructure</label>
                            <input id='critical' onChange={this.handleChange} className="form-control" placeholder="Critical Infrastructure" type="text" value={this.state.critical}/></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Address</label>
                            <input id='address' onChange={this.handleChange} className="form-control" placeholder="Address" type="text" value={this.state.address}/></div>
                    </div>

                </div>)
            },
            {
                title: (<span>
                    <span style={{fontSize:'0.7em'}}>Step 2</span>
                    <br /><span style={{fontSize:'0.9em'}}>Occupancy Info</span></span>),
                content: (<div className="row">
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Number of residents</label>
                            <input id='num_residents' onChange={this.handleChange} className="form-control" placeholder="Number of residents" type="text" value={this.state.num_residents}/></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Number of Employees</label>
                            <input id='num_employees' onChange={this.handleChange} className="form-control" placeholder="Number of employees" type="text" value={this.state.num_employees}/></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Number of occupants</label>
                            <input id='num_occupants' onChange={this.handleChange} className="form-control" placeholder="Number of occupants" type="text" value={this.state.num_occupants}/></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Number of vehicles owned by inhabitants</label>
                            <input id='num_vehicles_inhabitants' onChange={this.handleChange} className="form-control" placeholder="Number of vehicles owned by inhabitants" type="text" value={this.state.num_vehicles_inhabitants}/></div>
                    </div>
                </div>)
            },
            {
                title: (<span>
                    <span style={{fontSize:'0.7em'}}>Step 3</span>
                    <br /><span style={{fontSize:'0.9em'}}>Structural Info</span></span>),
                content: (<div className="row">
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Number of units</label>
                            <input id='num_units' onChange={this.handleChange} className="form-control" placeholder="Number of units" type="text" value={this.state.num_units}/></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Basement</label>
                            <input id='basement' onChange={this.handleChange} className="form-control" placeholder="Basement" type="text" value={this.state.basement}/></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Building Type</label>
                            {this.buildingTypeDropDown()}</div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Roof type</label>
                            <input id='roof_type' onChange={this.handleChange} className="form-control" placeholder="Roof type" type="text" value={this.state.roof_type}/></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Height</label>
                            <input id='height' onChange={this.handleChange} className="form-control" placeholder="Height" type="text" value={this.state.height}/></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Number of Stories</label>
                            <input id='num_stories' onChange={this.handleChange} className="form-control" placeholder="Number of stories" type="text" value={this.state.num_stories}/></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Structure type</label>
                            <input id='structure_type' onChange={this.handleChange} className="form-control" placeholder="Structure type" type="text" value={this.state.structure_type}/></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Building style</label>
                            {this.buildingStyleDropDown()}</div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Square foot living</label>
                            <input id='sqft_living' onChange={this.handleChange} className="form-control" placeholder="Square foot living" type="text" value={this.state.sqft_living}/></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Number of kitchens</label>
                            <input id='nbr_kitchens' onChange={this.handleChange} className="form-control" placeholder="Number of kitchens" type="text" value={this.state.nbr_kitchens}/></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Number of bedrooms</label>
                            <input id='nbr_bedrooms' onChange={this.handleChange} className="form-control" placeholder="Number of bedrooms" type="text" value={this.state.nbr_bedrooms}/></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Number of full bathrooms</label>
                            <input id='nbr_full_baths' onChange={this.handleChange} className="form-control" placeholder="Number of full bathrooms" type="text" value={this.state.nbr_full_baths}/></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>First floor elevation</label>
                            <input id='first_floor_elevation' onChange={this.handleChange} className="form-control" placeholder="First floor elevation" type="text" value={this.state.first_floor_elevation}/></div>
                    </div>
                </div>)
            },
            {
                title: (<span>
                    <span style={{fontSize:'0.7em'}}>Step 4</span>
                    <br /><span style={{fontSize:'0.9em'}}>Services Info</span></span>),
                content: (<div className="row">
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Heat Type</label>
                            {this.heatTypeDropDown()}</div>
                    </div>
                </div>)
            },
            {
                title: (<span>
                    <span style={{fontSize:'0.7em'}}>Step 5</span>
                    <br /><span style={{fontSize:'0.9em'}}>Commercial Info</span></span>),
                content: (<div className="row">
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>NAICS code</label>
                            <input id='naics_code' onChange={this.handleChange} className="form-control" placeholder="NAICS code" type="text" value={this.state.naics_code}/></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Census industry code</label>
                            <input id='census_industry_code' onChange={this.handleChange} className="form-control" placeholder="Census industry code" type="text" value={this.state.census_industry_code}/></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Replacement value</label>
                            <input id='replacement_value' onChange={this.handleChange} className="form-control" placeholder="Replacement value" type="text" value={this.state.replacement_value}/></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Contents replacement value</label>
                            <input id='contents_replacement_value' onChange={this.handleChange} className="form-control" placeholder="Contents replacement value" type="text" value={this.state.contents_replacement_value}/></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Inventory replacement value</label>
                            <input id='inventory_replacement_value' onChange={this.handleChange} className="form-control" placeholder="Inventory replacement value" type="text" value={this.state.inventory_replacement_value}/></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Establishment revenue</label>
                            <input id='establishment_revenue' onChange={this.handleChange} className="form-control" placeholder="Establishment revenue" type="text" value={this.state.establishment_revenue}/></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Business hours</label>
                            <input id='business_hours' onChange={this.handleChange} className="form-control" placeholder="Business hours" type="text" value={this.state.business_hours}/></div>
                    </div>
                </div>)
            },
            {
                title: (<span>
                    <span style={{fontSize:'0.7em'}}>Step 6</span>
                    <br /><span style={{fontSize:'0.9em'}}>Risk Info</span></span>),
                content: (<div className="row">
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Seismic zone</label>
                            <input id='seismic_zone' onChange={this.handleChange} className="form-control" placeholder="seismic_zone" type="text" value={this.state.seismic_zone}/></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Flood plain</label>
                            <input id='flood_plain' onChange={this.handleChange} className="form-control" placeholder="Flood plain" type="text" value={this.state.flood_plain}/></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Flood depth</label>
                            <input id='flood_depth' onChange={this.handleChange} className="form-control" placeholder="Flood depth" type="text" value={this.state.flood_depth}/></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Flood duration</label>
                            <input id='flood_duration' onChange={this.handleChange} className="form-control" placeholder="Flood duration" type="text" value={this.state.flood_duration}/></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Flood water velocity</label>
                            <input id='flood_velocity' onChange={this.handleChange} className="form-control" placeholder="Flood water velocity" type="text" value={this.state.flood_velocity}/></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>High wind speed</label>
                            <input id='high_wind_speed' onChange={this.handleChange} className="form-control" placeholder="High wind speed" type="text" value={this.state.high_wind_speed}/></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Soil type</label>
                            <input id='soil_type' onChange={this.handleChange} className="form-control" placeholder="Soil type" type="text" value={this.state.soil_type}/></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Storage of hazardous materials</label>
                            <input id='storage_hazardous_materials' onChange={this.handleChange} className="form-control" placeholder="Storage of hazardous materials" type="text" value={this.state.storage_hazardous_materials}/></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Topography : slope</label>
                            <input id='topography' onChange={this.handleChange} className="form-control" placeholder="Topography : slope" type="text" value={this.state.topography}/></div>
                    </div>
                </div>)
            },
            {
                title: (<span>
                    <span style={{fontSize:'0.7em'}}>Step 7</span>
                    <br /><span style={{fontSize:'0.9em'}}>Actions</span></span>),
                content: (
                    <div className="row">
                        {this.actionTypeDropDown()}
                    </div>
                    )
                    }

        ]
        return (
            <div className='container'>
                <Element>
                    <h6 className="element-header">Edit Assets
                        <span style={{float:'right'}}>
                        <Link
                            className="btn btn-sm btn-primary"
                            to={ `/assets/${this.props.match.params.assetId}` } >
                                View Asset
                        </Link>
                        </span>
                    </h6>
                    <Wizard steps={wizardSteps} submit={this.onSubmit}/>
                </Element>
            </div>
        )
    }
}

const mapStateToProps = (state,ownProps) => {
    return {
        geoid : ownProps.geoid,
        parcelMetaData : get(state.graph,'parcel.meta',{})
    }
};

const mapDispatchToProps =  {
sendSystemMessage,
};

export default [{
    path: '/assets/list/edit/:assetId',
        name: 'Edit Actions',
    mainNav: false,
    auth: true,
    exact: true,
    breadcrumbs: [
    { name: 'Assets', path: '/assets/' },
    { param: 'assetId', path: '/assets/edit/' }
],
    menuSettings: {
    image: 'none',
        scheme: 'color-scheme-light',
        position: 'menu-position-left',
        layout: 'menu-layout-compact',
        style: 'color-style-default'
},
    component: connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(AssetsEdit))
}
]

/*
sewerTypeDropDown(){
        if(this.props.parcelMetaData !== undefined && this.props.parcelMetaData['sewer_type']){
            const graph = this.props.parcelMetaData['sewer_type'];
            let sewerTypeDropDownData = []
            Object.values(graph).filter(d => d !== 'atom').forEach(item =>{
                item.forEach(i =>{
                    sewerTypeDropDownData.push(i)
                })
            })
            return(
                <select className="form-control justify-content-sm-end" id='sewer_type' onChange={this.handleChange} value={this.state.sewer_type}>
                    <option default>--Select Sewer Type--</option>
                    <option className="form-control" key={0} value="None">No Sewer Type Selected</option>
                    {
                        sewerTypeDropDownData.map((data,i) =>{
                            return(<option className="form-control" key={i+1} value={data.value}>{data.name}</option>)
                        })
                    }
                </select>
            )
        }
    }

    waterSupplyDropDown(){
        if(this.props.parcelMetaData !== undefined && this.props.parcelMetaData['water_supply']){
            const graph = this.props.parcelMetaData['water_supply'];
            let waterSupplyDropDownData = []
            Object.values(graph).filter(d => d !== 'atom').forEach(item =>{
                item.forEach(i =>{
                    waterSupplyDropDownData.push(i)
                })
            })
            return(
                <select className="form-control justify-content-sm-end" id='water_supply' onChange={this.handleChange} value={this.state.water_supply}>
                    <option default>--Select Water Supply--</option>
                    <option className="form-control" key={0} value="None">No Water Supply Selected</option>
                    {
                        waterSupplyDropDownData.map((data,i) =>{
                            return(<option className="form-control" key={i+1} value={data.value}>{data.name}</option>)
                        })
                    }
                </select>
            )
        }
    }

    utilitiesDropDown(){
        if(this.props.parcelMetaData !== undefined && this.props.parcelMetaData['utilities']){
            const graph = this.props.parcelMetaData['utilities'];
            let utilitiesDropDownData = []
            Object.values(graph).filter(d => d !== 'atom').forEach(item =>{
                item.forEach(i =>{
                    utilitiesDropDownData.push(i)
                })
            })
            return(
                <select className="form-control justify-content-sm-end" id='utilities' onChange={this.handleChange} value={this.state.utilities}>
                    <option default>--Select Utilities--</option>
                    <option className="form-control" key={0} value="None">No Utilities Selected</option>
                    {
                        utilitiesDropDownData.map((data,i) =>{
                            return(<option className="form-control" key={i+1} value={data.value}>{data.name}</option>)
                        })
                    }
                </select>
            )
        }
    }

    fuelTypeDropDown(){
        if(this.props.parcelMetaData !== undefined && this.props.parcelMetaData['fuel_type']){
            const graph = this.props.parcelMetaData['fuel_type'];
            let fuelTypeDropDownData = []
            Object.values(graph).filter(d => d !== 'atom').forEach(item =>{
                item.forEach(i =>{
                    fuelTypeDropDownData.push(i)
                })
            })
            return(
                <select className="form-control justify-content-sm-end" id='fuel_type' onChange={this.handleChange} value={this.state.fuel_type}>
                    <option default>--Select Fuel Type--</option>
                    <option className="form-control" key={0} value="None">No Fuel Type Selected</option>
                    {
                        fuelTypeDropDownData.map((data,i) =>{
                            return(<option className="form-control" key={i+1} value={data.value}>{data.name}</option>)
                        })
                    }
                </select>
            )
        }
    }

    //TODO : yet to be entered in database
    floodZoneDropDown(){
        let floodZoneDropDownData = [];
        return(
            <select className="form-control justify-content-sm-end" id='flood_zone' onChange={this.handleChange} value={this.state.flood_zone}>
                <option default>--Select Flood Zone--</option>
                <option className="form-control" key={0} value="None">No Flood Zone Selected</option>
                {
                    floodZoneDropDownData.map((data,i) =>{
                        return(<option className="form-control" key={i+1} value={data.value}>{data.name}</option>)
                    })
                }
            </select>
        )
    }

    ownerTypeDropDown(){
        if(this.props.parcelMetaData !== undefined && this.props.parcelMetaData['owner_type'] !== undefined){
            const graph = this.props.parcelMetaData['owner_type'];
            let ownerTypeDropDownData = []
            Object.values(graph).filter(d => d !== 'atom').forEach(item =>{
                item.forEach(i =>{
                    ownerTypeDropDownData.push(i)
                })
            })
            return(
                <select className="form-control justify-content-sm-end" id='owner_type' onChange={this.handleChange} value={this.state.owner_type}>
                    <option default>--Select Owner Type--</option>
                    <option className="form-control" key={0} value="None">No Owner Type Selected</option>
                    {
                        ownerTypeDropDownData.map((data,i) =>{
                            return(<option className="form-control" key={i+1} value={data.value}>{data.name}</option>)
                        })
                    }
                </select>
            )
        }
    }
 */