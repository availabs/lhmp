import React from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import get from "lodash.get";
import Wizard from 'components/light-admin/wizard'
import Element from 'components/light-admin/containers/Element'
import {sendSystemMessage} from 'store/modules/messages';
import {Link} from "react-router-dom";
import {falcorGraph} from "../../../../store/falcorGraph";
import criticalFacilityMeta from './criticalFacilityMeta'

const actionList = [];
const ATTRIBUTES = [
    'owner_type', 'sewer_type', 'water_supply', 'utilities', 'fuel_type', 'prop_class', 'replacement_value',
    'critical',
    'num_residents',
    'num_employees',
    'num_occupants',
    'num_vehicles_inhabitants',
    'num_units',
    'basement',
    'building_type',
    'roof_type',
    'height',
    'num_stories',
    'structure_type',
    'bldg_style',
    'address',
    'sqft_living',
    'nbr_kitchens',
    'nbr_full_baths',
    'nbr_bedrooms',
    'first_floor_elevation',
    'heat_type',
    'naics_code',
    'census_industry_code',
    'contents_replacement_value',
    'inventory_replacement_value',
    'establishment_revenue',
    'business_hours',
    'seismic_zone',
    'flood_plain',
    'flood_depth',
    'flood_duration',
    'flood_velocity',
    'high_wind_speed',
    'soil_type',
    'storage_hazardous_materials',
    'topography',
    'action_type',
    'shelter',
    'user_property_class',
    'emergency_generator'
],
    SHELTER_ATTRIBUTES = [
        'shelter_id',
        'building_id',
        'shelter_name',
        'facility_usage_code',
        'evacuation_capacity',
        'post_impact_capacity',
        'ada_compliant',
        'wheelchair_accessible',
        'pet_accomodations',
        'generator_onsite',
        'self_suffienct_electricty',
        'lat',
        'lon',
        'shelter_code',
        'location'
    ]
const numerics = ['flood_depth', 'flood_velocity', 'flood_base_elevation', 'num_residents', 'num_employees', 'num_occupants',
    'num_vehicles_inhabitants', 'height', 'sqft_living', 'nbr_kitchens', 'nbr_full_baths', 'nbr_bedrooms', 'contents_replacement_value',
    'inventory_replacement_value', 'establishment_revenue', 'topography', 'parcel_id', 'shelter']
const booleans = ['basement', 'emergency_generator']

class AssetsEdit extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            /*            prop_class : '',
                        replacement_value : '',
                        critical : '',
                        num_residents : '',
                        num_employees: '',
                        num_occupants : '',
                        num_vehicles_inhabitants : '',
                        num_units : '',
                        // basement : '',
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
                        // business_hours: '',
                        seismic_zone : '',
                        flood_plain:'',
                        flood_depth: '',
                        flood_duration : '',
                        flood_velocity: '',
                        high_wind_speed: '',
                        soil_type: '',
                        storage_hazardous_materials: '',
                        topography: '',
                        action_type: '',*/
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
        this.userPropClassDropDown = this.userPropClassDropDown.bind(this);
        this.buildingTypeDropDown = this.buildingTypeDropDown.bind(this);
        this.actionTypeDropDown = this.actionTypeDropDown.bind(this);
        this.addActionToAsset = this.addActionToAsset.bind(this);
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
        this.criticalInfraDropdown = this.criticalInfraDropdown.bind(this)
    }

    handleChange(e) {
        if (numerics.includes(e.target.id) && e.target.value === '') {
            this.setState({...this.state, [e.target.id]: null});
        } else {
            this.setState({...this.state, [e.target.id]: e.target.value});
        }
    }

    fetchFalcorDeps() {
        return this.props.falcor.get(['parcel', 'meta', ATTRIBUTES])
            .then(response => {
                return response
            })
    }

    componentDidMount() {
        this.getActionsCategoryAndType();
        if (this.props.match.params.assetId) {
            this.props.falcor.get(['building', 'byId', [this.props.match.params.assetId], ATTRIBUTES])
                .then(response => {
                    ATTRIBUTES
                        .filter(key => response.json.building.byId[this.props.match.params.assetId][key] ||
                            booleans.includes(key) && response.json.building.byId[this.props.match.params.assetId][key] === false)
                        .forEach((key, i) => {
                            let tmp_state = {};
                            tmp_state[key] = booleans.includes(key) && response.json.building.byId[this.props.match.params.assetId][key] === false ? false :
                                response.json.building.byId[this.props.match.params.assetId][key] || '';
                            this.setState(
                                tmp_state,
                            );

                        });
                    this.setState({isShelter: (this.state.shelter && this.state.shelter !== '') ? 'true' : 'false'})
                })
                .then(() => {
                    if(this.state.isShelter === 'true'){
                        let tmp_state = {}
                        this.props.falcor.get(['shelters', 'byId', this.state.shelter, SHELTER_ATTRIBUTES])
                            .then(response => {
                                SHELTER_ATTRIBUTES
                                    .forEach(key => {
                                        tmp_state[key] = response.json.shelters.byId[this.state.shelter][key]
                                    })
                                this.setState(tmp_state)
                            })
                    }
                })
        }

    }

    getActionsCategoryAndType() {
        this.props.falcor.get(['actions', [this.props.activePlan], 'project', 'length'])
            .then(response => {
                if (
                    falcorGraph.getCache().actions &&
                    falcorGraph.getCache().actions[this.props.activePlan] &&
                    falcorGraph.getCache().actions[this.props.activePlan].project &&
                    falcorGraph.getCache().actions[this.props.activePlan].project.length
                ) {
                    return falcorGraph.getCache().actions[this.props.activePlan].project.length
                }
            }).then(length => this.props.falcor.get(
            ['actions', [this.props.activePlan], 'project', 'byIndex', {
                from: 0,
                to: length - 1
            }, ['id', 'action_name']]))
            .then(response => {
                if (
                    falcorGraph.getCache().actions &&
                    falcorGraph.getCache().actions.project &&
                    falcorGraph.getCache().actions.project.byId &&
                    Object.keys(falcorGraph.getCache().actions.project.byId).length > 0
                ) {
                    actionList.push(...Object.values(falcorGraph.getCache().actions.project.byId))
                }
                return response
            })
    }

    propClassDropDown() {
        if (this.props.parcelMetaData !== undefined && this.props.parcelMetaData['prop_class'] !== undefined) {
            const graph = this.props.parcelMetaData['prop_class'];
            let propClassDropDownData = [];
            Object.values(graph).filter(d => d !== 'atom').forEach(item => {
                item.forEach(i => {
                    propClassDropDownData.push(i)
                })
            })
            return (
                <select className="form-control justify-content-sm-end" id='prop_class' onChange={this.handleChange}
                        value={this.state.prop_class} disabled={this.props.match.params.assetId}>
                    <option default>--Select Prop Class--</option>
                    <option className="form-control" key={0} value="None">No Prop Class Selected</option>
                    {
                        propClassDropDownData.map((data, i) => {
                            return (<option className="form-control" key={i + 1}
                                            value={parseInt(data.value)}>{data.name}</option>)
                        })
                    }
                </select>
            )
        }
    }

    userPropClassDropDown(level) {
        if (this.props.parcelMetaData !== undefined && this.props.parcelMetaData['prop_class'] !== undefined) {
            const graph = this.props.parcelMetaData['prop_class'];
            let propClassDropDownData = [];
            Object.values(graph).filter(d => d !== 'atom').forEach(item => {
                item.forEach(i => {
                    propClassDropDownData.push(i)
                })
            })
            return (
                <select className="form-control justify-content-sm-end" id='user_property_class' onChange={this.handleChange}
                        value={level === 'parent' ?
                            `${get(this.state, `user_property_class`, '').slice(0,1)}00` : this.state.user_property_class}>
                    <option default>--Select Prop Class--</option>
                    <option className="form-control" key={0} value="None">No Prop Class Selected</option>
                    {
                        propClassDropDownData
                            .filter(data => level === 'parent' ? data.value.slice(1,3) == '00' :
                                            data.value.slice(0,1) == get(this.state, `user_property_class`, '').slice(0,1))
                            .map((data, i) => {
                            return (<option className="form-control" key={i + 1}
                                            value={parseInt(data.value)}>{data.name}</option>)
                        })
                    }
                </select>
            )
        }
    }

    //TODO : - yet to be entered in DB
    buildingTypeDropDown() {
        let buildingTypeDropDownData = [];
        return (
            <select className="form-control justify-content-sm-end" id='building_type' onChange={this.handleChange}
                    value={this.state.building_type}>
                <option default>--Select Building Type--</option>
                <option className="form-control" key={0} value="None">No Building Type Selected</option>
                {
                    buildingTypeDropDownData.map((data, i) => {
                        return (<option className="form-control" key={i + 1} value={data.value}>{data.name}</option>)
                    })
                }
            </select>
        )
    }

    actionTypeDropDown() {
        return (
            <select className="form-control justify-content-sm-end" id='action_type' onChange={this.handleChange}
                    value={this.state.action_type}>
                <option default>--Select Action Type--</option>
                <option className="form-control" key={0} value="None">No Action Type Selected</option>
                {actionList.length > 0 ?
                    actionList.map((cat, i) => {
                        return (<option className="form-control" key={i + 1} value={cat.id.value}>
                            {cat.id.value} - {cat.action_name ? cat.action_name.value : ''}
                        </option>)
                    }) : null
                }
            </select>

        )
    }

    addActionToAsset() {
        this.props.falcor.call(['actions', 'assets', 'insert'], [this.props.match.params.assetId, this.state.action_type], [], [])
            .then(response => {
                this.props.sendSystemMessage(`Action was successfully added.`, {type: "success"});
            })
    }

    buildingStyleDropDown() {
        if (this.props.parcelMetaData !== undefined && this.props.parcelMetaData['bldg_style']) {
            const graph = this.props.parcelMetaData['bldg_style'];
            let buildingStyleDropDownData = []
            Object.values(graph).filter(d => d !== 'atom').forEach(item => {
                item.forEach(i => {
                    buildingStyleDropDownData.push(i)
                })
            })
            return (
                <select className="form-control justify-content-sm-end" id='bldg_style' onChange={this.handleChange}
                        value={this.state.bldg_style}>
                    <option default>--Select Building Style--</option>
                    <option className="form-control" key={0} value="None">No Building Style Selected</option>
                    {
                        buildingStyleDropDownData.map((data, i) => {
                            return (
                                <option className="form-control" key={i + 1} value={data.value}>{data.name}</option>)
                        })
                    }
                </select>
            )
        }
    }

    criticalInfraDropdown(level) {
        return (
            <select className="form-control justify-content-sm-end" id='critical' onChange={this.handleChange}
                    value={level === 'parent' ? `${ get(this.state, `critical`, '').toString().slice(0,3)}00` : this.state.critical}>
                <option default>--Select Critical Infrastructure--</option>
                {
                    Object.keys(criticalFacilityMeta)
                        .filter(key => level === 'parent' ? key.toString().slice(3,5) == '00' :
                        level === 'child' ? key.toString().slice(0,3) == get(this.state, `critical`, '').toString().slice(0,3) : true)
                        .map((data, i) => {
                        return (<option className="form-control" key={i + 1}
                                        value={data}>{criticalFacilityMeta[data]}</option>)
                    })
                }
            </select>
        )
    }

    heatTypeDropDown() {
        if (this.props.parcelMetaData !== undefined && this.props.parcelMetaData['heat_type']) {
            const graph = this.props.parcelMetaData['heat_type'];
            let heatTypeDropDownData = []
            Object.values(graph).filter(d => d !== 'atom').forEach(item => {
                item.forEach(i => {
                    heatTypeDropDownData.push(i)
                })
            })
            return (
                <select className="form-control justify-content-sm-end" id='heat_type' onChange={this.handleChange}
                        value={this.state.heat_type}>
                    <option default>--Select Heat Type--</option>
                    <option className="form-control" key={0} value="None">No Heat Type Selected</option>
                    {
                        heatTypeDropDownData.map((data, i) => {
                            return (
                                <option className="form-control" key={i + 1} value={data.value}>{data.name}</option>)
                        })
                    }
                </select>
            )
        }
    }

    onSubmit(event) {
        event.preventDefault();
        let args = [];
        if (this.props.match.params.assetId) {
            let attributes = Object.keys(this.state)
            let updated_data = {};
            Object.keys(this.state)
                .filter(f => f !== 'action_type')
                .forEach((d, i) => {
                    updated_data[d] = this.state[d]
                })
            if (this.state.isShelter === 'false') {
                updated_data.shelter = null
            }
            if (!this.state.shelter && this.state.isShelter === 'true') {
                args = SHELTER_ATTRIBUTES
                return this.props.falcor.call(['shelters', 'insert'], args.map(a => a === 'building_id' ? this.props.match.params.assetId : this.state[a] ), [], [])
                    .then((res) =>
                    {
                        updated_data.shelter = Object.keys(res.json.shelters.byId)[0]
                        return this.props.falcor.set({
                            paths: [
                                ['building', 'byId', [this.props.match.params.assetId], Object.keys(updated_data)]
                            ],
                            jsonGraph: {
                                building: {
                                    byId: {
                                        [this.props.match.params.assetId]: updated_data
                                    }
                                }
                            }
                        })
                    })
                    .then(response => {
                        this.props.sendSystemMessage(`Asset was successfully edited.`, {type: "success"});
                    })
            } else if (this.state.shelter && this.state.isShelter === 'true') {
                return this.props.falcor.set({
                    paths: [
                        ['shelters', 'byId', [this.state.shelter], Object.keys(updated_data)]
                    ],
                    jsonGraph: {
                        shelters: {
                            byId: {
                                [this.state.shelter]: updated_data
                            }
                        }
                    }
                })
                    .then(response => {
                        return this.props.falcor.set({
                            paths: [
                                ['building', 'byId', [this.props.match.params.assetId], Object.keys(updated_data)]
                            ],
                            jsonGraph: {
                                building: {
                                    byId: {
                                        [this.props.match.params.assetId]: updated_data
                                    }
                                }
                            }
                        })
                    })
                    .then(response => {
                        this.props.sendSystemMessage(`Asset was successfully edited.`, {type: "success"});
                    })
            }else{
                return this.props.falcor.set({
                    paths: [
                        ['building', 'byId', [this.props.match.params.assetId], attributes]
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
    }
    render() {
        const wizardSteps = [
            {
                title: (<span>
                    <span style={{fontSize: '0.7em'}}>Step 1</span>
                    <br/><span style={{fontSize: '0.9em'}}>Basic Info</span></span>),
                content: (<div className="row">
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Prop Type</label>
                            {this.propClassDropDown()}</div>
                    </div>

                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Secondary Prop Type</label>
                            {this.userPropClassDropDown('parent')}</div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor></label>
                            {this.userPropClassDropDown('chile')}</div>
                    </div>
                    {
                        this.state.prop_class && ['4'].includes(this.state.prop_class.slice(0, 1)) ? null :
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Replacement value</label>
                                    <input id='replacement_value' onChange={this.handleChange} className="form-control"
                                           placeholder="Replacement value" type="text"
                                           value={this.state.replacement_value}
                                           disabled={this.props.match.params.assetId}/></div>
                            </div>
                    }
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Critical Infrastructure</label>
                            {this.criticalInfraDropdown('parent')}
                        </div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor></label>
                            {this.criticalInfraDropdown('child')}
                        </div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Address</label>
                            <input id='address' onChange={this.handleChange} className="form-control"
                                   placeholder="Address" type="text" value={this.state.address}
                                   disabled={this.props.match.params.assetId}/></div>
                    </div>

                    <div className="col-sm-12">
                        <div className="form-group form-inline"
                             style={{gridArea: 'main', width: 'fit-content', float: 'left'}}>
                            <label className='mb-2 mr-sm-2 mb-sm-0' htmlFor>Shelter? </label>
                            <label className='mb-2 mr-sm-2 mb-sm-0' key={'true'}>
                                <input
                                    checked={this.state.isShelter === 'true'}
                                    id={'isShelter'}
                                    className="form-check-input"
                                    type={'radio'}
                                    value={'true'}
                                    onChange={this.handleChange}/><span><label>Yes</label></span>
                            </label>
                            <label className='mb-2 mr-sm-2 mb-sm-0' key={'false'}>
                                <input
                                    checked={this.state.isShelter === 'false'}
                                    id={'isShelter'}
                                    className="form-check-input"
                                    type={'radio'}
                                    value={'false'}
                                    onChange={this.handleChange}/><span><label>No</label></span>
                            </label>
                        </div>
                    </div>

                    {this.state.isShelter === 'true' ?
                        <React.Fragment>
                            {/*<div className="col-sm-12">
                                <div className="form-group">
                                    <input id='shelter' onChange={this.handleChange} className="form-control"
                                           placeholder="Shelter id" type="hidden" value={this.props.match.params.assetId}/></div>
                            </div>*/}
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Shelter Name</label>
                                    <input id='shelter_name' onChange={this.handleChange} className="form-control"
                                           placeholder="Shelter Name" type="text" value={this.state.shelter_name}
                                    /></div>
                            </div>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Facility Usage Code</label>
                                    <input id='facility_usage_code' onChange={this.handleChange}
                                           className="form-control"
                                           placeholder="Facility Usage Code" type="text"
                                           value={this.state.facility_usage_code}
                                    /></div>
                            </div>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Evacuation Capacity</label>
                                    <input id='evacuation_capacity' onChange={this.handleChange}
                                           className="form-control"
                                           placeholder="Evacuation Capacity" type="number"
                                           value={this.state.evacuation_capacity}
                                    /></div>
                            </div>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Post Impact Capacity</label>
                                    <input id='post_impact_capacity' onChange={this.handleChange}
                                           className="form-control"
                                           placeholder="Post Impact Capacity" type="number"
                                           value={this.state.post_impact_capacity}
                                    /></div>
                            </div>
                            <div className="col-sm-12">
                                <div className="form-group form-inline"
                                     style={{gridArea: 'main', width: 'fit-content', float: 'left'}}>
                                    <label className='mb-2 mr-sm-2 mb-sm-0' htmlFor>ADA Compliant? </label>
                                    <label className='mb-2 mr-sm-2 mb-sm-0' key={'true'}>
                                        <input
                                            checked={[true, 'true', 'yes'].includes(this.state.ada_compliant)}
                                            id={'ada_compliant'}
                                            className="form-check-input"
                                            type={'radio'}
                                            value={'yes'}
                                            onChange={this.handleChange}/><span><label>Yes</label></span>
                                    </label>
                                    <label className='mb-2 mr-sm-2 mb-sm-0' key={'false'}>
                                        <input
                                            checked={[false, 'false', 'no'].includes(this.state.ada_compliant)}
                                            id={'ada_compliant'}
                                            className="form-check-input"
                                            type={'radio'}
                                            value={'no'}
                                            onChange={this.handleChange}/><span><label>No</label></span>
                                    </label>
                                </div>
                            </div>
                            <div className="col-sm-12">
                                <div className="form-group form-inline"
                                     style={{gridArea: 'main', width: 'fit-content', float: 'left'}}>
                                    <label className='mb-2 mr-sm-2 mb-sm-0' htmlFor>Wheelchair Accessible? </label>
                                    <label className='mb-2 mr-sm-2 mb-sm-0' key={'true'}>
                                        <input
                                            checked={[true, 'true'].includes(this.state.wheelchair_accessible)}
                                            id={'wheelchair_accessible'}
                                            className="form-check-input"
                                            type={'radio'}
                                            value={true}
                                            onChange={this.handleChange}/><span><label>Yes</label></span>
                                    </label>
                                    <label className='mb-2 mr-sm-2 mb-sm-0' key={'false'}>
                                        <input
                                            checked={[false, 'false'].includes(this.state.wheelchair_accessible)}
                                            id={'wheelchair_accessible'}
                                            className="form-check-input"
                                            type={'radio'}
                                            value={false}
                                            onChange={this.handleChange}/><span><label>No</label></span>
                                    </label>
                                </div>
                            </div>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Pet Accommodations</label>
                                    <input id='pet_accomodations' onChange={this.handleChange} className="form-control"
                                           placeholder="Pet Accommodations" type="text"
                                           value={this.state.pet_accomodations}
                                    /></div>
                            </div>
                            <div className="col-sm-12">
                                <div className="form-group form-inline"
                                     style={{gridArea: 'main', width: 'fit-content', float: 'left'}}>
                                    <label className='mb-2 mr-sm-2 mb-sm-0' htmlFor>Generator Onsite? </label>
                                    <label className='mb-2 mr-sm-2 mb-sm-0' key={'true'}>
                                        <input
                                            checked={[true, 'true'].includes(this.state.generator_onsite)}
                                            id={'generator_onsite'}
                                            className="form-check-input"
                                            type={'radio'}
                                            value={true}
                                            onChange={this.handleChange}/><span><label>Yes</label></span>
                                    </label>
                                    <label className='mb-2 mr-sm-2 mb-sm-0' key={'false'}>
                                        <input
                                            checked={[false, 'false'].includes(this.state.generator_onsite)}
                                            id={'generator_onsite'}
                                            className="form-check-input"
                                            type={'radio'}
                                            value={false}
                                            onChange={this.handleChange}/><span><label>No</label></span>
                                    </label>
                                </div>
                            </div>
                            <div className="col-sm-12">
                                <div className="form-group form-inline"
                                     style={{gridArea: 'main', width: 'fit-content', float: 'left'}}>
                                    <label className='mb-2 mr-sm-2 mb-sm-0' htmlFor>Self Sufficient
                                        Electricity? </label>
                                    <label className='mb-2 mr-sm-2 mb-sm-0' key={'true'}>
                                        <input
                                            checked={[true, 'true'].includes(this.state.self_suffienct_electricty)}
                                            id={'self_suffienct_electricty'}
                                            className="form-check-input"
                                            type={'radio'}
                                            value={true}
                                            onChange={this.handleChange}/><span><label>Yes</label></span>
                                    </label>
                                    <label className='mb-2 mr-sm-2 mb-sm-0' key={'false'}>
                                        <input
                                            checked={[false, 'false'].includes(this.state.self_suffienct_electricty)}
                                            id={'self_suffienct_electricty'}
                                            className="form-check-input"
                                            type={'radio'}
                                            value={false}
                                            onChange={this.handleChange}/><span><label>No</label></span>
                                    </label>
                                </div>
                            </div>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Latitude</label>
                                    <input id='lat' onChange={this.handleChange} className="form-control"
                                           placeholder="Latitude" type="number" value={this.state.lat}
                                    /></div>
                            </div>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Longitude</label>
                                    <input id='lon' onChange={this.handleChange} className="form-control"
                                           placeholder="Longitude" type="number" value={this.state.lon}
                                    /></div>
                            </div>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Shelter Code</label>
                                    <input id='shelter_code' onChange={this.handleChange} className="form-control"
                                           placeholder="Shelter Code" type="text" value={this.state.shelter_code}
                                    /></div>
                            </div>
                        </React.Fragment> : null}
                </div>)
            },
            {
                title: (<span>
                    <span style={{fontSize: '0.7em'}}>Step 2</span>
                    <br/><span style={{fontSize: '0.9em'}}>Occupancy Info</span></span>),
                content: (<div className="row">
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Number of residents</label>
                            <input id='num_residents' onChange={this.handleChange} className="form-control"
                                   placeholder="Number of residents" type="text" value={this.state.num_residents}/>
                        </div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Number of Employees</label>
                            <input id='num_employees' onChange={this.handleChange} className="form-control"
                                   placeholder="Number of employees" type="text" value={this.state.num_employees}/>
                        </div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Number of occupants</label>
                            <input id='num_occupants' onChange={this.handleChange} className="form-control"
                                   placeholder="Number of occupants" type="text" value={this.state.num_occupants}/>
                        </div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Number of vehicles owned by inhabitants</label>
                            <input id='num_vehicles_inhabitants' onChange={this.handleChange} className="form-control"
                                   placeholder="Number of vehicles owned by inhabitants" type="text"
                                   value={this.state.num_vehicles_inhabitants}/></div>
                    </div>
                </div>)
            },
            {
                title: (<span>
                    <span style={{fontSize: '0.7em'}}>Step 3</span>
                    <br/><span style={{fontSize: '0.9em'}}>Structural Info</span></span>),
                content: (<div className="row">
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Number of units</label>
                            <input id='num_units' onChange={this.handleChange} className="form-control"
                                   placeholder="Number of units" type="text" value={this.state.num_units}/></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group form-inline"
                             style={{gridArea: 'main', width: 'fit-content', float: 'left'}}>
                            <label className='mb-2 mr-sm-2 mb-sm-0' htmlFor>Basement? </label>
                            <label className='mb-2 mr-sm-2 mb-sm-0' key={'true'}>
                                <input
                                    checked={this.state.basement === 'true'}
                                    id={'basement'}
                                    className="form-check-input"
                                    type={'radio'}
                                    value={'true'}
                                    onChange={this.handleChange}/><span><label>Yes</label></span>
                            </label>
                            <label className='mb-2 mr-sm-2 mb-sm-0' key={'false'}>
                                <input
                                    checked={this.state.basement === 'false'}
                                    id={'basement'}
                                    className="form-check-input"
                                    type={'radio'}
                                    value={'false'}
                                    onChange={this.handleChange}/><span><label>No</label></span>
                            </label>
                        </div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group form-inline"
                             style={{gridArea: 'main', width: 'fit-content', float: 'left'}}>
                            <label className='mb-2 mr-sm-2 mb-sm-0' htmlFor>Emergency Generator? </label>
                            <label className='mb-2 mr-sm-2 mb-sm-0' key={'true'}>
                                <input
                                    checked={['true', true, 't'].includes(this.state.emergency_generator)}
                                    id={'emergency_generator'}
                                    className="form-check-input"
                                    type={'radio'}
                                    value={'true'}
                                    onChange={this.handleChange}/><span><label>Yes</label></span>
                            </label>
                            <label className='mb-2 mr-sm-2 mb-sm-0' key={'false'}>
                                <input
                                    checked={['false', false, 'f'].includes(this.state.emergency_generator)}
                                    id={'emergency_generator'}
                                    className="form-check-input"
                                    type={'radio'}
                                    value={'false'}
                                    onChange={this.handleChange}/><span><label>No</label></span>
                            </label>
                        </div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Building Type</label>
                            {this.buildingTypeDropDown()}</div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Roof type</label>
                            <input id='roof_type' onChange={this.handleChange} className="form-control"
                                   placeholder="Roof type" type="text" value={this.state.roof_type}/></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Height</label>
                            <input id='height' onChange={this.handleChange} className="form-control"
                                   placeholder="Height" type="text" value={this.state.height}/></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Number of Stories</label>
                            <input id='num_stories' onChange={this.handleChange} className="form-control"
                                   placeholder="Number of stories" type="text" value={this.state.num_stories}/></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Structure type</label>
                            <input id='structure_type' onChange={this.handleChange} className="form-control"
                                   placeholder="Structure type" type="text" value={this.state.structure_type}/></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Building style</label>
                            {this.buildingStyleDropDown()}</div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Square foot living</label>
                            <input id='sqft_living' onChange={this.handleChange} className="form-control"
                                   placeholder="Square foot living" type="text" value={this.state.sqft_living}/></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Number of kitchens</label>
                            <input id='nbr_kitchens' onChange={this.handleChange} className="form-control"
                                   placeholder="Number of kitchens" type="text" value={this.state.nbr_kitchens}/></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Number of bedrooms</label>
                            <input id='nbr_bedrooms' onChange={this.handleChange} className="form-control"
                                   placeholder="Number of bedrooms" type="text" value={this.state.nbr_bedrooms}/></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Number of full bathrooms</label>
                            <input id='nbr_full_baths' onChange={this.handleChange} className="form-control"
                                   placeholder="Number of full bathrooms" type="text"
                                   value={this.state.nbr_full_baths}/></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>First floor elevation</label>
                            <input id='first_floor_elevation' onChange={this.handleChange} className="form-control"
                                   placeholder="First floor elevation" type="text"
                                   value={this.state.first_floor_elevation}/></div>
                    </div>
                </div>)
            },
            {
                title: (<span>
                    <span style={{fontSize: '0.7em'}}>Step 4</span>
                    <br/><span style={{fontSize: '0.9em'}}>Services Info</span></span>),
                content: (<div className="row">
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Heat Type</label>
                            {this.heatTypeDropDown()}</div>
                    </div>
                </div>)
            },
            {
                title: (<span>
                    <span style={{fontSize: '0.7em'}}>Step 5</span>
                    <br/><span style={{fontSize: '0.9em'}}>Commercial Info</span></span>),
                content: (<div className="row">
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>NAICS code</label>
                            <input id='naics_code' onChange={this.handleChange} className="form-control"
                                   placeholder="NAICS code" type="text" value={this.state.naics_code}/></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Census industry code</label>
                            <input id='census_industry_code' onChange={this.handleChange} className="form-control"
                                   placeholder="Census industry code" type="text"
                                   value={this.state.census_industry_code}/></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Replacement value</label>
                            <input id='replacement_value' onChange={this.handleChange} className="form-control"
                                   placeholder="Replacement value" type="text" value={this.state.replacement_value}/>
                        </div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Contents replacement value</label>
                            <input id='contents_replacement_value' onChange={this.handleChange} className="form-control"
                                   placeholder="Contents replacement value" type="text"
                                   value={this.state.contents_replacement_value}/></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Inventory replacement value</label>
                            <input id='inventory_replacement_value' onChange={this.handleChange}
                                   className="form-control" placeholder="Inventory replacement value" type="text"
                                   value={this.state.inventory_replacement_value}/></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Establishment revenue</label>
                            <input id='establishment_revenue' onChange={this.handleChange} className="form-control"
                                   placeholder="Establishment revenue" type="text"
                                   value={this.state.establishment_revenue}/></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Business hours</label>
                            <input id='business_hours' onChange={this.handleChange} className="form-control"
                                   placeholder="Business hours" type="text" value={this.state.business_hours}/></div>
                    </div>
                </div>)
            },
            /*{
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
            },*/
            {
                title: (<span>
                    <span style={{fontSize: '0.7em'}}>Step 6</span>
                    <br/><span style={{fontSize: '0.9em'}}>Actions</span></span>),
                content: (
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Select Action</label>
                            <div className='input-group'>
                                {this.actionTypeDropDown()}
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <Link
                                            className='btn btn-sm btn-primary'
                                            onClick={this.addActionToAsset}>
                                            Add
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                )
            }

        ]
        return (
            <div className='container'>
                <Element>
                    <h6 className="element-header">Edit Assets
                        <Link
                            className="mr-2 mb-2 btn btn-sm btn-outline-info btn-rounded"
                            to={'/guidance/guidance-assets/view'} target={'_blank'}
                        >?</Link>
                        <span style={{float: 'right'}}>
                        <Link
                            className="btn btn-sm btn-primary"
                            to={`/assets/list/view/${this.props.match.params.assetId}`}>
                                View Asset
                        </Link>
                        </span>
                    </h6>
                    <Wizard steps={wizardSteps} submit={this.onSubmit} submitOnAll={true}/>
                </Element>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        geoid: ownProps.geoid,
        parcelMetaData: get(state.graph, 'parcel.meta', {}),
        activePlan: state.user.activePlan
    }
};

const mapDispatchToProps = {
    sendSystemMessage,
};

export default [{
    path: '/assets/list/edit/:assetId',
    name: 'Edit Actions',
    mainNav: false,
    auth: true,
    exact: true,
    breadcrumbs: [
        {name: 'Assets', path: '/assets/'},
        {param: 'assetId', path: '/assets/edit/'}
    ],
    menuSettings: {
        image: 'none',
        scheme: 'color-scheme-light',
        position: 'menu-position-left',
        layout: 'menu-layout-compact',
        style: 'color-style-default'
    },
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(AssetsEdit))
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