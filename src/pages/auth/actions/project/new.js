import React from 'react';
import Wizard from 'components/light-admin/wizard'
import {reduxFalcor} from 'utils/redux-falcor'
import {sendSystemMessage} from 'store/modules/messages';
import {connect} from "react-redux";
import Element from 'components/light-admin/containers/Element'
import get from "lodash.get";
import MultiSelectFilter from 'components/filters/multi-select-filter.js'


const counties = ["36101", "36003", "36091", "36075", "36111", "36097", "36089", "36031", "36103", "36041", "36027", "36077",
    "36109", "36001", "36011", "36039", "36043", "36113", "36045", "36019", "36059", "36053", "36115", "36119", "36049", "36069",
    "36023", "36085", "36029", "36079", "36057", "36105", "36073", "36065", "36009", "36123", "36107", "36055", "36095", "36007",
    "36083", "36099", "36081", "36037", "36117", "36063", "36047", "36015", "36121", "36061", "36021", "36013", "36033", "36017",
    "36067", "36035", "36087", "36051", "36025", "36071", "36093", "36005"];
let countyName = [];
let cousubsArray = [];
let cousubsNames = [];
let allCountyNames = [];

class project extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            // step 1
            action_name: '',
            action_number: '',
            action_type: '', // dropdown
            description_of_problem_being_mitigated: '',
            action_description: '',
            associated_hazards: '', // dropdown
            metric_for_measurement: '',
            name_of_associated_hazard_mitigation_plan: '',
            date_of_lhmp_plan_approval: null,
            action_county: parseInt(this.props.activePlan),
            action_jurisdiction: '', // selected from dropdown (includes municipalities and county)
            action_location: '',
            // step 2
            action_located_in_special_flood_hazard_area: null, // can it be populated from EBR based on location
            action_located_in_hazard_zone: null, // can it be populated from EBR based on location
            recent_damages_incurred_at_action_locations: null,
            // step 3
            action_point_of_contact: '', // select from dropdown or add new contact - opens contact entry form
            poc_title: '',
            contact_department_agency_or_organization: '',
            lead_department_agency_or_organization: '',
            action_partners: '',
            alternative_action_1: '',
            alternative_action_2: '',
            no_alternative: '',
            estimated_timeframe_for_action_implementation: '',
            status: '', // dropdown: Ongoing, discontinued, completed, in-progress
            // step 4
            is_pnp: null, //bool
            action_associated_with_critical_facility: null, //bool
            structure_type: '', //dropdown: new, existing, both, neither
            // step 5
            level_of_protection: '',
            useful_life: null,
            // step 6
            local_planning_mechanisms_in_implementation: [], // multiselect: capabilities
            project_milestones: '',
            estimated_cost_range: '', // drop down: range 0-50, 50-100, 100-1,000, 1,000+, Jurisdictional
            // step 7
            calculated_cost: null,
            population_served: '', // drop down: range 0-50, 50-100, 100-1,000, 1,000+, Jurisdictional
            estimated_benefit_future_losses_avoided: '', // BCA Calculations, this will come from municpal data + EBR data
            // step 8
            phased_action: null, //bool
            engineering_required: null, // bool
            bca: '', // upload?
            // step 9
            primary_or_potential_funding_sources_type: '', // dropdown
            primary_or_potential_funding_sources_name: '', // dropdown
            secondary_funding_source_type: '', // dropdown
            secondary_funding_source_name: '', // dropdown
            funding_received_to_date: '',
            // step 10
            associated_mitigation_capability: '',
            associated_goals_objectives: '',
            // step 11
            prioritization: '',
            priority_scoring: '',
            priority_scoring_funding_availability: '',
            priority_scoring_probability_of_matching_funds: '',
            priority_scoring_benefit_cost_review: '',
            priority_scoring_environmental_benefit: '',
            priority_scoring_technical_feasibility: '',
            priority_scoring_timeframe_of_implementation: '',
            // step 12
            plan_maintenance_date_of_status_report: null, // date
            plan_maintenance_progress_report: '',
            plan_maintenance_update_evaluation_of_problem_solution: '',
        };


        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.listCousubDropdown = this.listCousubDropdown.bind(this);
        this.handleMultiSelectFilterChange = this.handleMultiSelectFilterChange.bind(this)

    }

    fetchFalcorDeps() {
        return this.props.falcor.get(['geo', [this.props.geoid], ['name']], ['geo', counties, ['name']])
            .then(response => {
                countyName.push(response.json.geo[this.props.geoid].name);
                counties.map(county => {
                    allCountyNames.push(response.json.geo[county].name)
                });
                this.props.falcor.get(['geo', this.props.geoid, ['cousubs']])
                    .then(res => {
                        return res
                    })
            });
    }

    componentDidMount() {
        if (this.props.match.params.projectId) {
            this.props.falcor.get(['actions', 'project', 'byId', [this.props.match.params.projectId], Object.keys(this.state)])
                .then(response => {
                    console.log('res from falcor: ',response.json.actions.project.byId[this.props.match.params.projectId])
                    Object.keys(this.state)
                        .forEach((key, i) => {
                            let tmp_state = {};
                            tmp_state[key] = response.json.actions.project.byId[this.props.match.params.projectId][key];
                            this.setState(
                                tmp_state
                            )
                        });

                })
        }

    }

    listCousubDropdown(event) {
        let county = event.target.value;
        cousubsNames = [];
        if (event.target.value !== 'None') {
            return this.props.falcor.get(['geo', county, 'cousubs'])
                .then(response => {
                    cousubsArray = response.json.geo[county].cousubs;
                    return cousubsArray
                })
                .then(cousubsArray => {
                    this.props.falcor.get(['geo', cousubsArray, ['name']])
                        .then(names => {
                            Object.keys(names.json.geo).filter(d => d !== '$__path').forEach((name, i) => {
                                cousubsNames.push({
                                    name: names.json.geo[name].name,
                                    geoid: cousubsArray[i]
                                })
                            })
                        })
                })
        } else {
            return null
        }


    }

    handleChange(e) {
        console.log('---', e.target.id, e.target.value, this.state);
        this.setState({
            [e.target.id]: e.target.value
        });
    };

    handleMultiSelectFilterChange(e, id) {
        let tmpObj = {};
        tmpObj[id] = [...e];
        console.log('multi select', e, tmpObj, this.state);
        this.setState(tmpObj);
    }

    onSubmit(event) {
        event.preventDefault();
        console.log('on submit', this.state);
        let args = [];
        if (!this.props.match.params.projectId) {
            Object.values(this.state).forEach(function (step_content) {
                console.log('step', step_content)
                if (typeof step_content === 'object' && step_content !== null) args.push('{' + step_content.join(',') + '}');
                else args.push(step_content)
                console.log('inserting... ', args)
            });

            return this.props.falcor.call(['actions', 'project', 'insert'], args, [], [])
                .then(response => {
                    this.props.sendSystemMessage(`Action project was successfully created.`, {type: "success"});
                })
        } else {
            let attributes = Object.keys(this.state);
            let updated_data = {};
            Object.keys(this.state).forEach((d, i) => {
                    if (typeof this.state[d] === 'object' && this.state[d] !== null) updated_data[d] = '{' + this.state[d].join(',') + '}';
                    else updated_data[d] = this.state[d];
            });
            console.log('updated data', updated_data);
            return this.props.falcor.set({
                paths: [
                    ['actions', 'project', 'byId', [this.props.match.params.projectId], attributes]
                ],
                jsonGraph: {
                    actions: {
                        project: {
                            byId: {
                                [this.props.match.params.projectId]: updated_data
                            }
                        }
                    }
                }
            })
                .then(response => {
                    this.props.sendSystemMessage(`Action project was successfully edited.`, {type: "success"});
                })
        }

    }

    render() {
        console.log('actions project state', this.state);
        const wizardSteps = [
            {
                title: (<span>
                    <span style={{fontSize: '0.7em'}}>Step 1</span>
                    <br/><span style={{fontSize: '0.9em'}}>Step 1</span></span>),
                content: (
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="form-group"><label htmlFor> Action Name</label>
                                <input id='action_name' onChange={this.handleChange} className="form-control"
                                       placeholder="Action Name" type="text" value={this.state.action_name}/></div>
                        </div>
                        <div className="col-sm-12">
                            <div className="form-group"><label htmlFor>Action Number</label>
                                <input id='action_number' onChange={this.handleChange} className="form-control"
                                       placeholder="Action Number" type="text" value={this.state.action_number}/></div>
                        </div>
                        <div className="col-sm-12">
                            <div className="form-group"><label htmlFor>Action Type</label>
                                <select className="form-control justify-content-sm-end" id='action_type'
                                        onChange={this.handleChange} value={this.state.action_type}>
                                    <option default>--Select Action Type--</option>
                                    <option className="form-control" key={0} value="None">No Action Type selected
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div className="col-sm-12">
                            <div className="form-group"><label htmlFor>Description of Problem being Mitigated</label>
                                <input id='description_of_problem_being_mitigated' onChange={this.handleChange}
                                       className="form-control"
                                       placeholder="description_of_problem_being_mitigated" type="text"
                                       value={this.state.description_of_problem_being_mitigated}/></div>
                        </div>
                        <div className="col-sm-12">
                            <div className="form-group"><label htmlFor>Action Description</label>
                                <input id='action_description' onChange={this.handleChange} className="form-control"
                                       placeholder="Action Description" type="text"
                                       value={this.state.action_description}/></div>
                        </div>
                        <div className="col-sm-12">
                            <div className="form-group"><label htmlFor>Associated Hazard</label>
                                <select className="form-control justify-content-sm-end" id='associated_hazards'
                                        onChange={this.handleChange} value={this.state.associated_hazards}>
                                    <option default>--Select Associated Hazard--</option>
                                    <option className="form-control" key={0} value="None">No Associated Hazard
                                        selected
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div className="col-sm-12">
                            <div className="form-group"><label htmlFor>Metric for Measurement</label>
                                <input id='metric_for_measurement' onChange={this.handleChange} className="form-control"
                                       placeholder="Metric for Measurement" type="text"
                                       value={this.state.metric_for_measurement}/></div>
                        </div>
                        <div className="col-sm-12">
                            <div className="form-group"><label htmlFor>Name of Associated Hazard Mitigation Plan</label>
                                <input id='name_of_associated_hazard_mitigation_plan' onChange={this.handleChange}
                                       className="form-control"
                                       placeholder="Name of Associated Hazard Mitigation Plan" type="text"
                                       value={this.state.name_of_associated_hazard_mitigation_plan}/></div>
                        </div>
                        <div className="col-sm-12">
                            <div className="form-group"><label htmlFor>Date of LHMP plan approval</label>
                                <input id='date_of_lhmp_plan_approval' onChange={this.handleChange}
                                       className="form-control" type="date"
                                       value={this.state.date_of_lhmp_plan_approval ? this.state.date_of_lhmp_plan_approval.split('T')[0] : ''}/></div>
                        </div>

                        <div className="col-sm-12">
                            <div className="form-group"><label htmlFor>Action County</label>
                                <select className="form-control justify-content-sm-end" id='action_county'
                                        onChange={this.handleChange} value={this.state.action_county}
                                        onClick={this.listCousubDropdown}>
                                    <option className="form-control" key={0} value="None">No County selected</option>
                                    {
                                        counties.map((county, i) => {
                                            return (<option className="form-control" key={i + 1}
                                                            value={county}>{allCountyNames[i]}</option>)
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="col-sm-12">
                            {cousubsNames.length ?
                                (
                                    <div className="form-group"><label htmlFor>Action Jurisdiction</label>
                                        <select className="form-control justify-content-sm-end" id='action_jurisdiction'
                                                onChange={this.handleChange} value={this.state.action_jurisdiction}>
                                            {this.listCousubDropdown}
                                            {
                                                cousubsNames.map((cousub, i) => {
                                                    return (<option className="form-control" key={i}
                                                                    value={cousub.geoid}>{cousub.name}</option>)
                                                })
                                            }
                                        </select>
                                    </div>
                                ) : (
                                    <div>

                                    </div>
                                )
                            }
                        </div>

                        <div className="col-sm-12">
                            <div className="form-group"><label htmlFor>Action Location</label>
                                <input id='action_location' onChange={this.handleChange} className="form-control"
                                       placeholder="Action Location" type="text" value={this.state.action_location}/>
                            </div>
                        </div>

                    </div>
                )
            },

            {
                title: (<span>
                    <span style={{fontSize: '0.7em'}}>Step 2</span>
                    <br/><span style={{fontSize: '0.9em'}}>Step 2</span></span>),
                content: (
                    <div>
                        <div className='row'>
                            <label htmlFor className='col-sm-6 col-form-label'>Action Located in Special Flood Hazard
                                Area (SFHA)? </label>
                            <div className='form-inline'>
                                <label className='mb-2 mr-sm-2 mb-sm-0'>
                                    <input
                                        checked={['yes', 'true', true].includes(this.state.action_located_in_special_flood_hazard_area)}
                                        id='action_located_in_special_flood_hazard_area'
                                        className="form-check-input"
                                        type="radio"
                                        value={true}
                                        onChange={this.handleChange}/>
                                    Yes
                                </label>
                            </div>
                            <div className='form-inline'>
                                <label className='mb-2 mr-sm-2 mb-sm-0'>
                                    <input
                                        checked={['no', 'false', false].includes(this.state.action_located_in_special_flood_hazard_area)}
                                        id='action_located_in_special_flood_hazard_area'
                                        className="form-check-input"
                                        type="radio"
                                        value={false}
                                        onChange={this.handleChange}/>
                                    No
                                </label>
                            </div>
                        </div>

                        <div className='row'>
                            <label htmlFor className='col-sm-6 col-form-label'>Action Located in Hazard Zone? </label>
                            <div className='form-inline'>
                                <label className='mb-2 mr-sm-2 mb-sm-0'>
                                    <input
                                        checked={['yes', 'true', true].includes(this.state.action_located_in_hazard_zone)}
                                        id='action_located_in_hazard_zone'
                                        className="form-check-input"
                                        type="radio"
                                        value={true}
                                        onChange={this.handleChange}/>
                                    Yes
                                </label>
                            </div>
                            <div className='form-inline'>
                                <label className='mb-2 mr-sm-2 mb-sm-0'>
                                    <input
                                        checked={['no', 'false', false].includes(this.state.action_located_in_hazard_zone)}
                                        id='action_located_in_hazard_zone'
                                        className="form-check-input"
                                        type="radio"
                                        value={false}
                                        onChange={this.handleChange}/>
                                    No
                                </label>
                            </div>
                        </div>

                        <div className='row'>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Recent Damages Incurred at Action Location
                                    ($)</label>
                                    <input id='recent_damages_incurred_at_action_locations' onChange={this.handleChange}
                                           className="form-control"
                                           placeholder="Recent Damages Incurred at Action Location ($)" type="number"
                                           value={this.state.recent_damages_incurred_at_action_locations}/>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            },

            {
                title: (<span>
                    <span style={{fontSize: '0.7em'}}>Step 3</span>
                    <br/><span style={{fontSize: '0.9em'}}>Step 3</span></span>),
                content: (
                    <div>
                        <div className='col-sm-12'>
                            <div className="form-group"><label htmlFor>Action Point of Contact</label>
                                <select className="form-control justify-content-sm-end" id='action_point_of_contact'
                                        onChange={this.handleChange} value={this.state.action_point_of_contact}>
                                    <option className="form-control" key={0} value="None">No Action Point of Contact
                                        Selected
                                    </option>
                                    <option className="form-control" key={1} value>New contact (Opens a form)</option>
                                    {/*{
                                        counties.map((county, i) => {
                                            return (<option className="form-control" key={i + 1}
                                                           value={county}>{allCountyNames[i]}</option>)
                                        })
                                   }*/}
                                </select>
                            </div>
                        </div>

                        <div className="col-sm-12">
                            <div className="form-group"><label htmlFor>POC Title</label>
                                <input id='poc_title' onChange={this.handleChange} className="form-control"
                                       placeholder="POC Title" type="text" value={this.state.poc_title}/>
                            </div>
                        </div>

                        <div className="col-sm-12">
                            <div className="form-group"><label htmlFor>Contact Department, Agency or
                                Organization</label>
                                <input id='contact_department_agency_or_organization' onChange={this.handleChange}
                                       className="form-control"
                                       placeholder="Contact Department, Agency or Organization" type="text"
                                       value={this.state.contact_department_agency_or_organization}/>
                            </div>
                        </div>

                        <div className="col-sm-12">
                            <div className="form-group"><label htmlFor>Lead Department, Agency or Organization</label>
                                <input id='lead_department_agency_or_organization' onChange={this.handleChange}
                                       className="form-control"
                                       placeholder="Lead Department, Agency or Organization" type="text"
                                       value={this.state.lead_department_agency_or_organization}/>
                            </div>
                        </div>

                        <div className="col-sm-12">
                            <div className="form-group"><label htmlFor>Action Partners</label>
                                <input id='action_partners' onChange={this.handleChange} className="form-control"
                                       placeholder="Action Partners" type="text" value={this.state.action_partners}/>
                            </div>
                        </div>

                        <div className="col-sm-12">
                            <div className="form-group"><label htmlFor>Alternative Action 1</label>
                                <input id='alternative_action_1' onChange={this.handleChange} className="form-control"
                                       placeholder="Alternative Action 1" type="text"
                                       value={this.state.alternative_action_1}/>
                            </div>
                        </div>

                        <div className="col-sm-12">
                            <div className="form-group"><label htmlFor>Alternative Action 2</label>
                                <input id='alternative_action_2' onChange={this.handleChange} className="form-control"
                                       placeholder="Alternative Action 2" type="text"
                                       value={this.state.alternative_action_2}/>
                            </div>
                        </div>

                        <div className="col-sm-12">
                            <div className="form-group"><label htmlFor>No Alternative</label>
                                <input id='no_alternative' onChange={this.handleChange} className="form-control"
                                       placeholder="No Alternative" type="text" value={this.state.no_alternative}/>
                            </div>
                        </div>

                        <div className="col-sm-12">
                            <div className="form-group"><label htmlFor>Estimated Timeframe for Action
                                Implementation</label>
                                <input id='estimated_timeframe_for_action_implementation' onChange={this.handleChange}
                                       className="form-control"
                                       placeholder="Estimated Timeframe for Action Implementation" type="text"
                                       value={this.state.estimated_timeframe_for_action_implementation}/>
                            </div>
                        </div>

                        <div className='col-sm-12'>
                            <div className="form-group"><label htmlFor>Status</label>
                                <select className="form-control justify-content-sm-end" id='status'
                                        onChange={this.handleChange} value={this.state.status}>
                                    <option className="form-control" key={0} value="None">No Status Selected</option>
                                    <option className="form-control" key={1} value='ongoing'>Ongoing</option>
                                    <option className="form-control" key={2} value='discontinued'>discontinued</option>
                                    <option className="form-control" key={3} value='completed'>Completed</option>
                                    <option className="form-control" key={4} value='in-progress'>In-progress</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )
            },
            {
                title: (<span>
                    <span style={{fontSize: '0.7em'}}>Step 4</span>
                    <br/><span style={{fontSize: '0.9em'}}>Step 4</span></span>),
                content: (
                    <div>
                        <div className='row'>
                            <label htmlFor className='col-sm-6 col-form-label'> Is PNP </label>
                            <div className='form-inline'>
                                <label className='mb-2 mr-sm-2 mb-sm-0'>
                                    <input
                                        checked={['yes', 'true', true].includes(this.state.is_pnp)}
                                        id='is_pnp'
                                        className="form-check-input"
                                        type="radio"
                                        value={true}
                                        onChange={this.handleChange}/>
                                    Yes
                                </label>
                            </div>
                            <div className='form-inline'>
                                <label className='mb-2 mr-sm-2 mb-sm-0'>
                                    <input
                                        checked={['no', 'false', false].includes(this.state.is_pnp)}
                                        id='is_pnp'
                                        className="form-check-input"
                                        type="radio"
                                        value={false}
                                        onChange={this.handleChange}/>
                                    No
                                </label>
                            </div>
                        </div>

                        <div className='row'>
                            <label htmlFor className='col-sm-6 col-form-label'> Action associated with a critical
                                facility? </label>
                            <div className='form-inline'>
                                <label className='mb-2 mr-sm-2 mb-sm-0'>
                                    <input
                                        checked={['yes', 'true', true].includes(this.state.action_associated_with_critical_facility)}
                                        id='action_associated_with_critical_facility'
                                        className="form-check-input"
                                        type="radio"
                                        value={true}
                                        onChange={this.handleChange}/>
                                    Yes
                                </label>
                            </div>
                            <div className='form-inline'>
                                <label className='mb-2 mr-sm-2 mb-sm-0'>
                                    <input
                                        checked={['no', 'false', false].includes(this.state.action_associated_with_critical_facility)}
                                        id='action_associated_with_critical_facility'
                                        className="form-check-input"
                                        type="radio"
                                        value={false}
                                        onChange={this.handleChange}/>
                                    No
                                </label>
                            </div>
                        </div>

                        <div className='row'>
                            <div className='col-sm-12'>
                                <div className="form-group"><label htmlFor>Structure Type</label>
                                    <select className="form-control justify-content-sm-end" id='structure_type'
                                            onChange={this.handleChange} value={this.state.structure_type}>
                                        <option className="form-control" key={0} value="None">No Structure type
                                            Selected
                                        </option>
                                        <option className="form-control" key={1} value='new'>New</option>
                                        <option className="form-control" key={2} value='existing'>Existing</option>
                                        <option className="form-control" key={3} value='both'>Both</option>
                                        <option className="form-control" key={4} value='neither'>Neither</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            },

            {
                title: (<span>
                    <span style={{fontSize: '0.7em'}}>Step 5</span>
                    <br/><span style={{fontSize: '0.9em'}}>Step 5</span></span>),
                content: (
                    <div>
                        <div className="col-sm-12">
                            <div className="form-group"><label htmlFor>Level of Protection</label>
                                <input id='level_of_protection' onChange={this.handleChange} className="form-control"
                                       placeholder="Level of Protection" type="text"
                                       value={this.state.level_of_protection}/>
                            </div>
                        </div>

                        <div className="col-sm-12">
                            <div className="form-group"><label htmlFor>Useful Life</label>
                                <input id='useful_life' onChange={this.handleChange} className="form-control"
                                       placeholder="Useful Life" type="number" value={this.state.useful_life}/>
                            </div>
                        </div>
                    </div>
                )
            },

            {
                title: (<span>
                    <span style={{fontSize: '0.7em'}}>Step 6</span>
                    <br/><span style={{fontSize: '0.9em'}}>Step 6</span></span>),
                content: (
                    <div>
                        <div className='row'>
                            <div className='col-sm-12'>
                                <div className="form-group"
                                     style={{
                                         'background-color': 'red !important'

                                     }}
                                ><label htmlFor>Local Planning Mechanisms (via capabilities) to be Used in
                                    Implementation</label>
                                    <MultiSelectFilter
                                        filter={{
                                            domain: ['new', 'existing', 'both', 'neither'],
                                            value: this.state.local_planning_mechanisms_in_implementation
                                        }}
                                        setFilter={(e) => {
                                            this.handleMultiSelectFilterChange(e, 'local_planning_mechanisms_in_implementation')
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Project Milestones</label>
                                    <input id='project_milestones' onChange={this.handleChange} className="form-control"
                                           placeholder="Project Milestones" type="text"
                                           value={this.state.project_milestones}/>
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className='col-sm-12'>
                                <div className="form-group"><label htmlFor>Estimated Cost Range</label>
                                    <select className="form-control justify-content-sm-end" id='estimated_cost_range'
                                            onChange={this.handleChange} value={this.state.estimated_cost_range}>
                                        <option className="form-control" key={0} value="None">No Cost Range Selected
                                        </option>
                                        <option className="form-control" key={1} value='0-50'>0-50</option>
                                        <option className="form-control" key={2} value='50-100'>50-100</option>
                                        <option className="form-control" key={3} value='100-1000'>100-1,000</option>
                                        <option className="form-control" key={4} value='1000+'>1,000+</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            },
            {
                title: (<span>
                    <span style={{fontSize: '0.7em'}}>Step 7</span>
                    <br/><span style={{fontSize: '0.9em'}}>Step 7</span></span>),
                content: (
                    <div>
                        <div className='row'>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Calculated Cost</label>
                                    <input id='calculated_cost' onChange={this.handleChange} className="form-control"
                                           placeholder="Calculated Cost" type="number"
                                           value={this.state.calculated_cost}/>
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className='col-sm-12'>
                                <div className="form-group"><label htmlFor>Population Served</label>
                                    <select className="form-control justify-content-sm-end" id='population_served'
                                            onChange={this.handleChange} value={this.state.population_served}>
                                        <option className="form-control" key={0} value="None">No Population Range
                                            Selected
                                        </option>
                                        <option className="form-control" key={1} value='0-50'>0-50</option>
                                        <option className="form-control" key={2} value='50-100'>50-100</option>
                                        <option className="form-control" key={3} value='100-1000'>100-1,000</option>
                                        <option className="form-control" key={4} value='1000+'>1,000+</option>
                                        <option className="form-control" key={4} value='jurisdictional'>Jurisdictional
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Estimated Benefit (Future Losses
                                    Avoided)</label>
                                    <input id='estimated_benefit_future_losses_avoided' onChange={this.handleChange} className="form-control"
                                           placeholder="Estimated Benefit (Future Losses Avoided)" type="text"
                                           value={this.state.estimated_benefit_future_losses_avoided}/>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            },

            {
                title: (<span>
                    <span style={{fontSize: '0.7em'}}>Step 8</span>
                    <br/><span style={{fontSize: '0.9em'}}>Step 8</span></span>),
                content: (
                    <div>
                        <div className='row'>
                            <label htmlFor className='col-sm-6 col-form-label'> Phased Action? </label>
                            <div className='form-inline'>
                                <label className='mb-2 mr-sm-2 mb-sm-0'>
                                    <input
                                        checked={['yes', 'true', true].includes(this.state.phased_action)}
                                        id='phased_action'
                                        className="form-check-input"
                                        type="radio"
                                        value={true}
                                        onChange={this.handleChange}/>
                                    Yes
                                </label>
                            </div>
                            <div className='form-inline'>
                                <label className='mb-2 mr-sm-2 mb-sm-0'>
                                    <input
                                        checked={['no', 'false', false].includes(this.state.phased_action)}
                                        id='phased_action'
                                        className="form-check-input"
                                        type="radio"
                                        value={false}
                                        onChange={this.handleChange}/>
                                    No
                                </label>
                            </div>
                        </div>

                        <div className='row'>
                            <label htmlFor className='col-sm-6 col-form-label'> Engineering Required? </label>
                            <div className='form-inline'>
                                <label className='mb-2 mr-sm-2 mb-sm-0'>
                                    <input
                                        checked={['yes', 'true', true].includes(this.state.engineering_required)}
                                        id='engineering_required'
                                        className="form-check-input"
                                        type="radio"
                                        value={true}
                                        onChange={this.handleChange}/>
                                    Yes
                                </label>
                            </div>
                            <div className='form-inline'>
                                <label className='mb-2 mr-sm-2 mb-sm-0'>
                                    <input
                                        checked={['no', 'false', false].includes(this.state.engineering_required)}
                                        id='engineering_required'
                                        className="form-check-input"
                                        type="radio"
                                        value={false}
                                        onChange={this.handleChange}/>
                                    No
                                </label>
                            </div>
                        </div>

                        <div className='row'>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>BCA</label>
                                    <input id='bca' disabled onChange={this.handleChange} className="form-control"
                                           placeholder="BCA " type="file"/>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            },

            {
                title: (<span>
                    <span style={{fontSize: '0.7em'}}>Step 9</span>
                    <br/><span style={{fontSize: '0.9em'}}>Step 9</span></span>),
                content: (
                    <div>
                        <div className='row'>
                            <div className='col-sm-12'>
                                <div className="form-group"><label htmlFor>Primary or Potential Funding Sources
                                    Type</label>
                                    <select className="form-control justify-content-sm-end"
                                            id='primary_or_potential_funding_sources_type'
                                            onChange={this.handleChange}
                                            value={this.state.primary_or_potential_funding_sources_type}>
                                        <option className="form-control" key={0} value="None">No Funding Type Selected
                                        </option>
                                        <option className="form-control" key={1} value='federal'>Federal</option>
                                        <option className="form-control" key={2} value='state'>State</option>
                                        <option className="form-control" key={3} value='local'>Local</option>
                                        <option className="form-control" key={4} value='private'>Private</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className='col-sm-12'>
                                <div className="form-group"><label htmlFor>Primary or Potential Funding Sources
                                    Name</label>
                                    <select className="form-control justify-content-sm-end"
                                            id='primary_or_potential_funding_sources_name'
                                            onChange={this.handleChange}
                                            value={this.state.primary_or_potential_funding_sources_name}>
                                        <option className="form-control" key={0} value="None">No Funding Name Selected
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className='col-sm-12'>
                                <div className="form-group"><label htmlFor>Secondary Funding Sources Type</label>
                                    <select className="form-control justify-content-sm-end"
                                            id='secondary_funding_source_type'
                                            onChange={this.handleChange}
                                            value={this.state.secondary_funding_source_type}>
                                        <option className="form-control" key={0} value="None">No Funding Type Selected
                                        </option>
                                        <option className="form-control" key={1} value='federal'>Federal</option>
                                        <option className="form-control" key={2} value='state'>State</option>
                                        <option className="form-control" key={3} value='local'>Local</option>
                                        <option className="form-control" key={4} value='private'>Private</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className='col-sm-12'>
                                <div className="form-group"><label htmlFor>Secondary Funding Sources Name</label>
                                    <select className="form-control justify-content-sm-end"
                                            id='secondary_funding_source_name'
                                            onChange={this.handleChange}
                                            value={this.state.secondary_funding_source_name}>
                                        <option className="form-control" key={0} value="None">No Funding Name Selected
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Funding Received to Date</label>
                                    <input id='funding_received_to_date' onChange={this.handleChange}
                                           className="form-control"
                                           placeholder="Funding Received to Date" type="number"
                                           value={this.state.funding_received_to_date}/>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            },

            {
                title: (<span>
                    <span style={{fontSize: '0.7em'}}>Step 10</span>
                    <br/><span style={{fontSize: '0.9em'}}>Step 10</span></span>),
                content: (
                    <div>
                        <div className='row'>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Associated Mitigation Capability</label>
                                    <input id='associated_mitigation_capability' onChange={this.handleChange}
                                           className="form-control"
                                           placeholder="Associated Mitigation Capability" type="text"
                                           value={this.state.associated_mitigation_capability}/>
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Associated Goal(s)/Objective(s)</label>
                                    <input id='associated_goals_objectives' onChange={this.handleChange}
                                           className="form-control"
                                           placeholder="Associated Goal(s)/Objective(s)" type="text"
                                           value={this.state.associated_goals_objectives}/>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            },

            {
                title: (<span>
                    <span style={{fontSize: '0.7em'}}>Step 11</span>
                    <br/><span style={{fontSize: '0.9em'}}>Step 11</span></span>),
                content: (
                    <div>
                        <div className='row'>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Prioritization</label>
                                    <input id='prioritization' onChange={this.handleChange} className="form-control"
                                           placeholder="Prioritization" type="text" value={this.state.prioritization}/>
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Priority Scoring</label>
                                    <input id='priority_scoring' onChange={this.handleChange} className="form-control"
                                           placeholder="Priority Scoring" type="text"
                                           value={this.state.priority_scoring}/>
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Priority Scoring: Funding
                                    Availability</label>
                                    <input id='priority_scoring_funding_availability' onChange={this.handleChange}
                                           className="form-control"
                                           placeholder="Priority Scoring: Funding Availability" type="text"
                                           value={this.state.priority_scoring_funding_availability}/>
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Priority Scoring: Probability of Matching
                                    Funds</label>
                                    <input id='priority_scoring_probability_of_matching_funds'
                                           onChange={this.handleChange} className="form-control"
                                           placeholder="Priority Scoring: Probability of Matching Funds" type="text"
                                           value={this.state.priority_scoring_probability_of_matching_funds}/>
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Priority Scoring: Benefit Cost Review</label>
                                    <input id='priority_scoring_benefit_cost_review' onChange={this.handleChange}
                                           className="form-control"
                                           placeholder="Priority Scoring: Benefit Cost Review" type="text"
                                           value={this.state.priority_scoring_benefit_cost_review}/>
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Priority Scoring: Environmental
                                    Benefit</label>
                                    <input id='priority_scoring_environmental_benefit' onChange={this.handleChange}
                                           className="form-control"
                                           placeholder="Priority Scoring: Environmental Benefit" type="text"
                                           value={this.state.priority_scoring_environmental_benefit}/>
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Priority Scoring: Technical
                                    Feasibility</label>
                                    <input id='priority_scoring_technical_feasibility' onChange={this.handleChange}
                                           className="form-control"
                                           placeholder="Priority Scoring: Technical Feasibility" type="text"
                                           value={this.state.priority_scoring_technical_feasibility}/>
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Priority Scoring: Timeframe of
                                    Implementation</label>
                                    <input id='priority_scoring_timeframe_of_implementation'
                                           onChange={this.handleChange} className="form-control"
                                           placeholder="Priority Scoring: Timeframe of Implementation" type="text"
                                           value={this.state.priority_scoring_timeframe_of_implementation}/>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            },

            {
                title: (<span>
                    <span style={{fontSize: '0.7em'}}>Step 12</span>
                    <br/><span style={{fontSize: '0.9em'}}>Step 12</span></span>),
                content: (
                    <div>

                        <div className='row'>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Plan Maintenance - Date of Status
                                    Report</label>
                                    <input id='plan_maintenance_date_of_status_report' onChange={this.handleChange}
                                           className="form-control"
                                           placeholder="Plan Maintenance - Date of Status Report" type="date"
                                           value={this.state.plan_maintenance_date_of_status_report
                                               ? this.state.plan_maintenance_date_of_status_report.split('T')[0] : ''}/>
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Plan Maintenance - Progress Report</label>
                                    <input id='plan_maintenance_progress_report' onChange={this.handleChange}
                                           className="form-control"
                                           placeholder="Plan Maintenance - Progress Report" type="text"
                                           value={this.state.plan_maintenance_progress_report}/>
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Plan Maintenance - Update Evaluation of the
                                    Problem an/or Solution</label>
                                    <input id='plan_maintenance_update_evaluation_of_problem_solution'
                                           onChange={this.handleChange} className="form-control"
                                           placeholder="Plan Maintenance - Update Evaluation of the Problem an/or Solution"
                                           type="text"
                                           value={this.state.plan_maintenance_update_evaluation_of_problem_solution}/>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        ];

        return (
            <div className='container'>
                <Element>
                    <h6 className="element-header">{this.props.match.params.projectId ? 'Edit' : 'New'} Action
                        project</h6>
                    <Wizard steps={wizardSteps} submit={this.onSubmit}/>
                </Element>
            </div>
        )
    }
}

const mapDispatchToProps = {
    sendSystemMessage
};

const mapStateToProps = state => {
    return {
        activePlan: state.user.activePlan,
        geoid: state.user.activeGeoid,
        isAuthenticated: !!state.user.authed,
        attempts: state.user.attempts, // so componentWillReceiveProps will get called.
        cousubs: get(state.graph, 'geo', {}),

    };
};

export default [
    {
        icon: 'os-icon',
        path: '/actions/project/new',
        exact: true,
        mainNav: false,
        breadcrumbs: [
            {name: 'Actions Project', path: '/actions/'},
            {name: 'New Actions project', path: '/actions/project/new'}
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        name: 'Create Actions project',
        auth: true,
        component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(project))
    },
    {
        path: '/actions/project/edit/:projectId',
        name: 'editActionsProject',
        mainNav: false,
        auth: true,
        exact: true,
        breadcrumbs: [
            {name: 'Edit Actions Project', path: '/actions/'},
            {param: 'projectId', path: '/actions/project/edit/'}
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(project))
    }

]

