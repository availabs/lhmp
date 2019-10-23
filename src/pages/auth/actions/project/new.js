import React from 'react';
import Wizard from 'components/light-admin/wizard'
import {reduxFalcor} from 'utils/redux-falcor'
import {sendSystemMessage} from 'store/modules/messages';
import {connect} from "react-redux";
import Element from 'components/light-admin/containers/Element'
import get from "lodash.get";
import MultiSelectFilter from 'components/filters/multi-select-filter.js'
import PromptModal from "../../../../components/light-admin/prompt/promptModal";
import {falcorGraph} from "../../../../store/falcorGraph";
import {Link} from "react-router-dom";


export const counties = ["36","36101", "36003", "36091", "36075", "36111", "36097", "36089", "36031", "36103", "36041", "36027", "36077",
    "36109", "36001", "36011", "36039", "36043", "36113", "36045", "36019", "36059", "36053", "36115", "36119", "36049", "36069",
    "36023", "36085", "36029", "36079", "36057", "36105", "36073", "36065", "36009", "36123", "36107", "36055", "36095", "36007",
    "36083", "36099", "36081", "36037", "36117", "36063", "36047", "36015", "36121", "36061", "36021", "36013", "36033", "36017",
    "36067", "36035", "36087", "36051", "36025", "36071", "36093", "36005"];
let countyName = [];
let cousubsArray = [];
let cousubsNames = [];
let allCountyNames = [];
let roleData = [];
let actionCategory = [];
let capabilitiesCategory = [];
let capabilitiesAll = [];
let hazardList = ['Avalanche', 'Coastal Hazards', 'Coldwave', 'Drought',
    'Earthquake', 'Hail', 'Heat Wave', 'Hurricane', 'Ice Storm', 'Landslide', 'Lightning',
    'Flooding', 'Tornado', 'Tsunami/Seiche', 'Volcano', 'Wildfire', 'Wind', 'Snow Storm'
]

class project extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            // step 1
            action_point_of_contact: [], // select from dropdown or add new contact - opens contact entry form

            //step 2
            action_name: '',
            action_category: '',
            action_type: '', // dropdown
            action_number: '',
            description_of_problem_being_mitigated: '',
            action_description: '',
            associated_hazards: [], // dropdown
            metric_for_measurement: '',
            action_url: '',

            //step 3
            new_or_update: '',
            status: '', // dropdown: Ongoing, discontinued, completed, in-progress
            status_justification: null,
            plan_maintenance_update_evaluation_of_problem_solution: '',
            phased_action: '',
            name_of_associated_hazard_mitigation_plan: '',

            //step 4
            action_county: parseInt(this.props.geoid),
            action_jurisdiction: '', // selected from dropdown (includes municipalities and county)
            action_location: '',
            location_points: '', // add to db
            site_photographs: '', //upload
            property_names_or_hist_dist: '', // add to db

            //step 5
            estimated_cost_range: '', // drop down: range 0-50, 50-100, 100-1,000, 1,000+, Jurisdictional
            calculated_cost: null,
            primary_or_potential_funding_sources_name: '', // dropdown
            secondary_funding_source_name: '', // dropdown
            funding_received_to_date: '',

            //step 6
            bca: '', // upload?
            bca_to_bcr: '', // need to be added to db?
            bcr:'', // upload
            level_of_protection: '',
            recurrence_interval: null, //add to db
            useful_life: null,
            estimated_timeframe_for_action_implementation: '',
            exact_timeframe_for_action_implementation: '', // add to db

            //step 7
            associated_mitigation_capability: '',

            //step 8
            boolalternative: null,
            alternative_action_1: '',
            alternative_action_1_evaluation: '',
            alternative_action_2: '',
            alternative_action_2_evaluation: '',

            //step 9
            priority_scoring_probability_of_acceptance_by_population: '',
            priority_scoring_funding_availability: '',
            priority_scoring_probability_of_matching_funds: '',
            priority_scoring_benefit_cost_review: '',
            priority_scoring_environmental_benefit: '',
            priority_scoring_technical_feasibility: '',
            priority_scoring_timeframe_of_implementation: '',

            //step 10
            relates_to_protects_critical_facility_infrastructure: null,
            relates_to_protects_community_lifeline_by_fema: '',
            is_pnp: null, //bool
            is_state_agency: null,
            is_community_member_of_crs: null,
            is_community_member_of_good_standing_with_nfip: null,
            is_community_participate_in_climate_smart_communities: null,
            is_community_have_local_adopted_hmp: null,
            is_community_have_comprehensive_plan: null,
            is_community_have_land_use_zoning: null,
            is_community_have_subdivision_ordinances: null,
            is_community_have_building_codes: null,
            engineering_required: null, // bool
            is_final_engineering_design_completes: null, // bool
            is_mitigation: null, // bool
            is_preparedness: null, // bool
            is_response: null, // bool
            is_recovery: null, // bool
            is_climate_adaptation: null, // bool
            is_proposed_project_located_in_sfha: null, // bool
            is_project_structure_located_in_sfha: null, // bool
            is_protects_repetitive_loss_property: null, // bool
            is_protects_severe_repetitive_loss_property: null, // bool
            known_environmental_historic_preservation_protected_species_iss: null, // bool
            ground_distributed_other_than_agriculture: null, // bool
            indian_or_historic_artifacts_found_on_or_adjacent_project_area: null, // bool
            building_50_years_or_older_within_or_near: null, // bool
            is_shpo_survey: null, // bool
            shpo_survey: '', //upload

            //step 11
            climate_smart_communities_action_type: '',

            //step 12
            plan_maintenance_date_of_status_report: null, // date
            plan_maintenance_progress_report: '',

            plan_id: parseInt(this.props.activePlan)
        };

        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.listCousubDropdown = this.listCousubDropdown.bind(this);
        this.handleMultiSelectFilterChange = this.handleMultiSelectFilterChange.bind(this)
        this.getEditData = this.getEditData.bind(this)

    }

    fetchFalcorDeps() {
        return this.props.falcor.get(
            ['geo', [this.props.geoid], ['name']],
            ['geo', counties, ['name']]
        )
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
    getEditData(){
        if (this.props.match.params.projectId) {
            this.props.falcor.get(['actions', 'project', 'byId', [this.props.match.params.projectId], Object.keys(this.state)])
                .then(response => {
                    console.log('Edit Action project data res',response.json.actions.project.byId[this.props.match.params.projectId])
                    Object.keys(this.state)
                        .forEach((key, i) => {
                            let tmp_state = {};
                            console.log('edit res',response.json.actions.project.byId[this.props.match.params.projectId][key], key)
                            tmp_state[key] = response.json.actions.project.byId[this.props.match.params.projectId][key];
                            this.setState(
                                tmp_state
                            )
                        });

                })
        }
    }
    getRolesData(){
        this.props.falcor
            .get(['roles','length'])
            .then(d => {
                if (falcorGraph.getCache() &&
                    falcorGraph.getCache().roles &&
                    falcorGraph.getCache().roles.length &&
                    falcorGraph.getCache().roles.length.value){
                    this.props.falcor
                        .get(['roles','byIndex',{from:0, to:falcorGraph.getCache().roles.length.value-1}, 'id'])
                        .then(d => {
                            if (falcorGraph.getCache().roles && falcorGraph.getCache().roles.byIndex){
                                const ids = [];
                                    for (let i = 0; i < falcorGraph.getCache().roles.length.value; ++i) {
                                        const graph = falcorGraph.getCache().roles.byIndex[i];
                                        if (graph && graph.id && graph.id.value) {
                                            ids.push(graph.id.value);
                                        }
                                    }
                                    return ids;
                            }
                        })
                        .then(ids => {
                            if (ids.length > 0){
                                this.props.falcor
                                    .get(
                                        ['roles','byId',ids,['id','contact_name','associated_plan']]
                                    ).then(d => {
                                        if (falcorGraph.getCache().roles &&
                                            falcorGraph.getCache().roles.byId &&
                                            Object.keys(falcorGraph.getCache().roles.byId).length > 0
                                        ){
                                            Object.keys(falcorGraph.getCache().roles.byId)
                                                .forEach(roleId => {
                                                    if (falcorGraph.getCache().roles.byId[roleId].associated_plan.value &&
                                                        falcorGraph.getCache().roles.byId[roleId].associated_plan.value.toString() === this.props.activePlan.toString()
                                                    ){
                                                        roleData.push(falcorGraph.getCache().roles.byId[roleId])
                                                    }
                                                })
                                        }
                                })
                            }
                        })

                }
            })
    }
    getActionsCategoryAndType(){
        this.props.falcor.get(
            ['actions','project','meta']
        )
            .then(d => {
                if (falcorGraph.getCache().actions &&
                    falcorGraph.getCache().actions.project &&
                    falcorGraph.getCache().actions.project.meta
                ){
                    falcorGraph.getCache().actions.project.meta.value
                        .forEach(meta => {
                            if (!actionCategory.includes(meta.actions_tracker_category)) actionCategory.push(meta.actions_tracker_category)
                        })
                }
            })
    }
    getCapabilitiesCategoryAndType(){
        this.props.falcor.get(
            ['capabilitiesLHMP', 'meta']
        ).then(d => {
            if (falcorGraph.getCache() &&
                falcorGraph.getCache().capabilitiesLHMP &&
                falcorGraph.getCache().capabilitiesLHMP.meta &&
                falcorGraph.getCache().capabilitiesLHMP.meta.value
            ){
                capabilitiesAll = falcorGraph.getCache().capabilitiesLHMP.meta.value
                falcorGraph.getCache().capabilitiesLHMP.meta.value
                    .filter(meta => meta.capability_type === 'planning and regulatory')
                    .forEach(meta => capabilitiesCategory.push(meta.capability))
            }
        })
    }
    componentDidMount() {
        this.getRolesData()
        this.getActionsCategoryAndType()
        this.getEditData()
        this.getCapabilitiesCategoryAndType()

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

    handleMultiSelectFilterChange(e, id, domain=[]) {
        let tmpObj = {};
        if (e.includes('Select All') && domain.length > 0){
            tmpObj[id] = domain.filter(f => f !== 'Select All' && f !== 'Select None');
        }else if (e.includes('Select None')){
            tmpObj[id] = [];
        }else{
            tmpObj[id] = [...e];
        }
        console.log('multi select', e, tmpObj, this.state);
        this.setState(tmpObj);
    }

    onSubmit(event) {
        event.preventDefault();
        console.log('on submit', this.state);
        let args = [];
        if (!this.props.match.params.projectId) {
            Object.values(this.state)
                .forEach(function (step_content) {
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
                    <br/><span style={{fontSize: '0.9em'}}>Point of Contact</span></span>),
                content: (
                    <div>
                        <div className='col-sm-12'>
                            <div className="form-group"><label htmlFor>Action Point of Contact</label>
                                <span style={{float:'right'}}>
                                    <PromptModal prompt={'Provide the name of the person responsible for the action.'} id={'action_point_of_contact'}/>
                                </span>
                                <MultiSelectFilter
                                    filter={{
                                        domain: roleData.map((role, i) => {
                                            return ({name: role.contact_name.value, value:role.id.value.toString()})
                                        }),
                                        value: this.state.action_point_of_contact
                                    }}
                                    setFilter={(e) => {
                                        this.handleMultiSelectFilterChange(e, 'action_point_of_contact')
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )
            },
            {
                title: (<span>
                    <span style={{fontSize: '0.7em'}}>Step 2</span>
                    <br/><span style={{fontSize: '0.9em'}}>General Information</span></span>),
                content: (
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="form-group"><label htmlFor> Action Name</label>
                                <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'Provide a name for the action. Be as concise and specific as possible.'}
                                        id={'action_name'}/>
                                </span>
                                <input id='action_name' onChange={this.handleChange} className="form-control"
                                       placeholder="Action Name" type="text" value={this.state.action_name}/></div>
                        </div>

                        
                        <div className="col-sm-12">
                            <div className="form-group"><label htmlFor> Action Category</label>
                                <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'Choose the category that best describes the action from the dropdown menu. ' +
                                        'The category you choose will limit the possible responses to question 4. ' +
                                        'If you do not see the action type you are expecting in the dropdown for question 4,' +
                                        ' you may need to change the action category you’ve selected in question 3.'}
                                        id={'action_category'}/>
                                </span>
                                <select className="form-control justify-content-sm-end" id='action_category'
                                        onChange={this.handleChange} value={this.state.action_category}>
                                    <option default>--Select Category Type--</option>
                                    <option className="form-control" key={0} value="None">No Action Category selected</option>
                                    {
                                        actionCategory.map((cat, i) => {
                                            return (<option className="form-control" key={i + 1}
                                                            value={cat}>{cat}</option>)
                                        })
                                    }

                                </select>
                            </div>
                        </div>

                        <div className="col-sm-12">
                            <div className="form-group"><label htmlFor>Action Type</label>
                                <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'Choose an action type from the dropdown menu. The action types available ' +
                                        'in this dropdown menu are filtered by the choice you made in question 3. ' +
                                        'If you do not see the action type you are expecting you may need to change the ' +
                                        'action category in question 3.'}
                                        id={'action_type'}/>
                                </span>
                                <select className="form-control justify-content-sm-end" id='action_type'
                                        onChange={this.handleChange} value={this.state.action_type}>
                                    <option default>--Select Action Type--</option>
                                    <option className="form-control" key={0} value="None">No Action Type selected</option>
                                    {falcorGraph.getCache().actions &&
                                    falcorGraph.getCache().actions.project &&
                                    falcorGraph.getCache().actions.project.meta &&
                                    falcorGraph.getCache().actions.project.meta.value ?
                                        falcorGraph.getCache().actions.project.meta.value
                                        .filter(meta => meta.actions_tracker_category === this.state.action_category)
                                        .map((meta,meta_i) =>
                                            <option className="form-control" key={meta_i} value={meta.actions_tracker_type}>
                                                {meta.actions_tracker_type}
                                            </option>
                                        ) : null
                                    }
                                </select>
                            </div>
                        </div>

                        <div className="col-sm-12">
                            <div className="form-group"><label htmlFor>Action Number</label>
                                <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={''}
                                        id={'action_number'}/>
                                </span>
                                <input id='action_number' onChange={this.handleChange} className="form-control"
                                       placeholder="Action Number" type="number" value={this.state.action_number}/></div>
                        </div>

                        <div className="col-sm-12">
                            <div className="form-group"><label htmlFor>Description of the Problem</label>
                                <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={' Provide a detailed narrative of the problem. Describe the natural' +
                                        ' hazard you wish to mitigate, its impacts to the community, past damages and' +
                                        ' loss of service, etc. Include the street address of the property/project location' +
                                        ' (if applicable), adjacent streets, and easily identified landmarks such as water' +
                                        ' bodies and well-known structures, and end with a brief description of existing' +
                                        ' conditions (topography, terrain, hydrology) of the site.'}
                                        id={'description_of_problem_being_mitigated'}/>
                                </span>
                                <input id='description_of_problem_being_mitigated' onChange={this.handleChange}
                                       className="form-control"
                                       placeholder="Description of Problem" type="text"
                                       value={this.state.description_of_problem_being_mitigated}/></div>
                        </div>

                        // todo: textbox AND upload?
                        <div className="col-sm-12">
                            <div className="form-group"><label htmlFor>Action Description</label>
                                <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'Provide a detailed narrative of the solution. Describe the physical ' +
                                        'area (project limits) to be affected, both by direct work and by the project\'s ' +
                                        'effects; how the action would address the existing conditions previously identified;' +
                                        ' proposed construction methods, including any excavation and earth-moving activities;' +
                                        ' where you are in the development process (e.g., are studies and/or drawings complete),' +
                                        ' etc., the extent of any analyses or studies performed (attach any reports or studies).'}
                                        id={'action_description'}/>
                                </span>
                                <input id='action_description' onChange={this.handleChange} className="form-control"
                                       placeholder="Description of the Solution (Action)" type="text"
                                       value={this.state.action_description}/></div>
                        </div>

                        <div className="col-sm-12">
                            <div className="form-group"><label htmlFor>Associated Hazard</label>
                                <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'Identify the hazard(s) being addressed with this action.'}
                                        id={'associated_hazards'}/>
                                </span>
                                <MultiSelectFilter
                                    filter={{
                                        domain: ['Select All', 'Select None', ...hazardList
                                        ],
                                        value: this.state.associated_hazards
                                    }}
                                    setFilter={(e) => {
                                        this.handleMultiSelectFilterChange(e, 'associated_hazards', hazardList)
                                    }}
                                />
                            </div>
                        </div>

                        <div className="col-sm-12">
                            <div className="form-group"><label htmlFor>Metric for Evaluation</label>
                                <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={' Identify one or more measurable elements that can be used to track the' +
                                        ' progress of implementation and/or impact of this action. Quantitative values like' +
                                        ' number of culverts widened or acres of agricultural land protected are recommended.'}
                                        id={'metric_for_measurement'}/>
                                </span>
                                <input id='metric_for_measurement' onChange={this.handleChange} className="form-control"
                                       placeholder="Metric for Evaluation" type="text"
                                       value={this.state.metric_for_measurement}/></div>
                        </div>

                        // todo : add to db
                        <div className="col-sm-12">
                            <div className="form-group"><label htmlFor>Action URL (if applicable)</label>
                                <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={' If the action has a website or online document associated with the capability,' +
                                        ' enter it here. Examples include; emergency manager/department,' +
                                        ' soil and water conservation districts’ websites, weblink to a policy.'}
                                        id={'action_url'}/>
                                </span>
                                <input id='action_url' onChange={this.handleChange} className="form-control"
                                       placeholder="Action URL (if applicable)" type="text"
                                       value={this.state.action_url}/></div>
                        </div>
                    </div>
                )
            },
          {
                title: (<span>
                    <span style={{fontSize: '0.7em'}}>Step 3</span>
                    <br/><span style={{fontSize: '0.9em'}}>Status</span></span>),
                content: (
                    <div>
                        <div className='row'>
                            <label htmlFor className='col-sm-6'>New or Update</label>
                            <div className='col-sm-1'>
                                <div className='form-inline'>
                                    <label className='mb-2 mr-sm-2 mb-sm-0'>
                                        <input
                                            checked={this.state.new_or_update === 'new'}
                                            id='new_or_update'
                                            className="form-check-input"
                                            type="radio"
                                            value={'new'}
                                            onChange={this.handleChange}/>
                                        New
                                    </label>
                                </div>
                            </div>
                            <div className='col-sm-1'>
                                <div className='form-inline'>
                                    <label className='mb-2 mr-sm-2 mb-sm-0'>
                                        <input
                                            checked={this.state.new_or_update === 'update'}
                                            id='new_or_update'
                                            className="form-check-input"
                                            type="radio"
                                            value={'update'}
                                            onChange={this.handleChange}/>
                                        Update
                                    </label>
                                </div>
                            </div>
                            <div className='col-sm-4'>
                                <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'Choose one. Select update if you are entering an action from a previous plan.' +
                                        ' Select new only if you are entering a new action during the hazard mitigation planning process.'}
                                        id={'new_or_update'}/>
                                </span>
                            </div>
                        </div>

                        <div className='row'>
                            <div className='col-sm-12'>
                                <div className="form-group"><label htmlFor>Update Status</label>
                                <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'Select the current status of the project: discontinued, completed, in-progress, unchanged, proposed.'}
                                        id={'status'}/>
                                </span>
                                    <select className="form-control justify-content-sm-end" id='status'
                                            onChange={this.handleChange} value={this.state.status} disabled={this.state.new_or_update !== 'update'}>
                                        <option className="form-control" key={0} value="None">No Status Selected</option>
                                        <option className="form-control" key={2} value='discontinued'>discontinued</option>
                                        <option className="form-control" key={3} value='completed'>Completed</option>
                                        <option className="form-control" key={4} value='in-progress'>In-progress</option>
                                        <option className="form-control" key={5} value='unchanged'>Unchanged</option>
                                        <option className="form-control" key={6} value='proposed'>Proposed</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        
                        <div className='form-group row'>
                            <label htmlFor className='col-sm-6'>Status Justification</label>

                            <div className='col-sm-5'>
                                <div className='form-check' style={{
                                    display: ['discontinued','unchanged'].includes(this.state.status) ? 'block' :  'none'}}>
                                    <label className='form-check-label'>
                                        <input
                                            checked={this.state.status_justification === 'Lack of Funding'}
                                            id='status_justification'
                                            className="form-check-input"
                                            type="radio"
                                            value={'Lack of Funding'}
                                            onChange={this.handleChange}/>
                                        Lack of Funding
                                    </label>
                                </div>

                                <div className='form-check' style={{
                                    display: ['discontinued','unchanged'].includes(this.state.status) ? 'block' :  'none'}}>
                                    <label className='form-check-label'>
                                        <input
                                            checked={this.state.status_justification === 'Funding Change'}
                                            id='status_justification'
                                            className="form-check-input"
                                            type="radio"
                                            value={'Funding Change'}
                                            onChange={this.handleChange}/>
                                        Funding Change
                                    </label>
                                </div>

                                <div className='form-check' style={{display: ['discontinued','unchanged'].includes(this.state.status) ? 'block' :  'none'}}>
                                    <label className='form-check-label'>
                                        <input
                                            checked={this.state.status_justification === 'Env. / Hist. Preservation'}
                                            id='status_justification'
                                            className="form-check-input"
                                            type="radio"
                                            value={'Env. / Hist. Preservation'}
                                            onChange={this.handleChange}/>
                                        Env. / Hist. Preservation
                                    </label>
                                </div>

                                <div className='form-check' style={{display: ['discontinued','unchanged'].includes(this.state.status) ? 'block' :  'none'}}>
                                    <label className='form-check-label'>
                                        <input
                                            checked={this.state.status_justification === 'Staffing'}
                                            id='status_justification'
                                            className="form-check-input"
                                            type="radio"
                                            value={'Staffing'}
                                            onChange={this.handleChange}/>
                                        Staffing
                                    </label>
                                </div>

                                <div className='form-check' style={{display: ['discontinued','unchanged'].includes(this.state.status) ? 'block' :  'none'}}>
                                    <label className='form-check-label'>
                                        <input
                                            checked={this.state.status_justification === 'Public Support'}
                                            id='status_justification'
                                            className="form-check-input"
                                            type="radio"
                                            value={'Public Support'}
                                            onChange={this.handleChange}/>
                                        Public Support
                                    </label>
                                </div>

                                <div className='form-check' style={{display: ['discontinued','unchanged'].includes(this.state.status) ? 'block' :  'none'}}>
                                    <label className='form-check-label'>
                                        <input
                                            checked={this.state.status_justification === 'Legal'}
                                            id='status_justification'
                                            className="form-check-input"
                                            type="radio"
                                            value={'Legal'}
                                            onChange={this.handleChange}/>
                                        Legal
                                    </label>
                                </div>

                                <div className='form-check' style={{display: ['discontinued','unchanged'].includes(this.state.status) ? 'block' :  'none'}}>
                                    <label className='form-check-label'>
                                        <input
                                            checked={this.state.status_justification === 'Fixed or Otherwise Mitigated'}
                                            id='status_justification'
                                            className="form-check-input"
                                            type="radio"
                                            value={'Fixed or Otherwise Mitigated'}
                                            onChange={this.handleChange}/>
                                        Fixed or Otherwise Mitigated
                                    </label>
                                </div>

                                <div className='form-check' style={{display: ['discontinued','unchanged'].includes(this.state.status) ? 'block' :  'none'}}>
                                    <label className='form-check-label'>
                                        <input
                                            checked={this.state.status_justification === 'Priority Change'}
                                            id='status_justification'
                                            className="form-check-input"
                                            type="radio"
                                            value={'Priority Change'}
                                            onChange={this.handleChange}/>
                                        Priority Change
                                    </label>
                                </div>
                            </div>
                            <div className='col-sm-1'>
                                <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={''}
                                        id={'status_justification'}/>
                                </span>
                            </div>
                        </div>

                        <div className='row'>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Update Evaluation of the Problem and/or Solution</label>
                                <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'Provide an updated description of the problem and solution, and what has' +
                                        ' happened since initial consideration/development.'}
                                        id={'plan_maintenance_update_evaluation_of_problem_solution'}/>
                                </span>
                                    <select className="form-control justify-content-sm-end"
                                            disabled={this.state.new_or_update !== 'update'}
                                            id='plan_maintenance_update_evaluation_of_problem_solution'
                                            onChange={this.handleChange}
                                            value={this.state.plan_maintenance_update_evaluation_of_problem_solution}>
                                        <option className="form-control" key={0} value="None">None Selected</option>
                                        {capabilitiesCategory.length > 0 ?
                                            capabilitiesCategory.map((f,f_i) =>
                                                <option className="form-control" key={f_i + 1} value={f}>{f}</option>
                                            ) : null
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor> Phased Action </label>
                                    <span style={{float:'right'}}>
                                        <PromptModal
                                            prompt={'Will the action be implemented in phases? Types of phases include: planning, designing, and constructing.'}
                                            id={'phased_action'}/>
                                    </span>
                                    <select className="form-control justify-content-sm-end"
                                            disabled={this.state.new_or_update !== 'update'}
                                            id='plan_maintenance_update_evaluation_of_problem_solution'
                                            onChange={this.handleChange}
                                            value={this.state.plan_maintenance_update_evaluation_of_problem_solution}>
                                        <option className="form-control" key={0} value={null}>None Selected</option>
                                        <option className="form-control" key={1} value="Not A Phased Project"> Not A Phased Project</option>
                                        <option className="form-control" key={2} value="Phased-Planning">Phased-Planning</option>
                                        <option className="form-control" key={3} value="Phased-Design">Phased-Design</option>
                                        <option className="form-control" key={4} value="Phased-Construction">Phased-Construction</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Name of Associated Hazard Mitigation Plan</label>
                                <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'Provide the official name of the adopted hazard mitigation plan.'}
                                        id={'name_of_associated_hazard_mitigation_plan'}/>
                                </span>
                                    <select className="form-control justify-content-sm-end" id='name_of_associated_hazard_mitigation_plan'
                                            onChange={this.handleChange} value={this.state.name_of_associated_hazard_mitigation_plan}>
                                        <option className="form-control" key={0} value="None">None Selected</option>
                                        <option className="form-control" key={1} value=''>Add New Plan</option>
                                        {capabilitiesCategory.length > 0 ?
                                            capabilitiesCategory.map((f,f_i) =>
                                                <option className="form-control" key={f_i + 2} value={f}>{f}</option>
                                            ) : null
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            },
          {
                title: (<span>
                    <span style={{fontSize: '0.7em'}}>Step 4</span>
                    <br/><span style={{fontSize: '0.9em'}}>Location</span></span>),
                content: (
                    <div>
                        <div className='row'>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Action County</label>
                                <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'Select the county where the action takes place. If the action is located' +
                                        ' in a different county you can select it by clicking the dropdown.'}
                                        id={'action_county'}/>
                                </span>
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
                        </div>

                        <div className='row'>
                            <div className="col-sm-12">
                                {cousubsNames.length ?
                                    (
                                        <div className="form-group"><label htmlFor>Action Jurisdiction</label>
                                <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'Provide the name of the Town, Village or City where the action is located.' +
                                        ' For example; Sullivan County has adopted a hazard mitigation plan, the Town of Callicoon' +
                                        ' is the jurisdiction location of the specific action,' +
                                        ' such as acquiring emergency generators for critical facilities.'}
                                        id={'action_jurisdiction'}/>
                                </span>
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
                        </div>

                        <div className='row'>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Action Location</label>
                                <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'Provide a narrative description of where the action is located. ' +
                                        '(For example: At the intersection of Broadway and South St.)'}
                                        id={'action_location'}/>
                                </span>
                                    <input id='action_location' onChange={this.handleChange} className="form-control"
                                           placeholder="Action Location" type="text" value={this.state.action_location}/>
                                </div>
                            </div>
                        </div>

                        
                        <div className='row'>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Location Points</label>
                                <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={' Provide the exact location(s) where the action takes place. Multiple points may be selected.'}
                                        id={'location_points'}/>
                                </span>
                                    <input disabled id='location_points' onChange={this.handleChange} className="form-control"
                                           placeholder="map" type="text" value={this.state.location_points}/>
                                </div>
                            </div>
                        </div>

                        
                        <div className='row'>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Site Photographs (if applicable)</label>
                                <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'Upload photographs of the site that are relevant to outlining, describing,' +
                                        ' depicting, or otherwise enhancing the description of this action.'}
                                        id={'site_photographs'}/>
                                </span>
                                    <input id='site_photographs' disabled onChange={this.handleChange} className="form-control"
                                           placeholder="Site Photographs " type="file"/>
                                </div>
                            </div>
                        </div>

                        
                        <div className='row'>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>List the property name(s) or historic district(s)</label>
                                <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'Provide the name of properties and/or districts designated as State and National Registers of Historic Places.'}
                                        id={'property_names_or_hist_dist'}/>
                                </span>
                                    <input disabled id='property_names_or_hist_dist' onChange={this.handleChange} className="form-control"
                                           placeholder="List the property name(s) or historic district(s)" type="text" value={this.state.property_names_or_hist_dist}/>
                                </div>
                            </div>
                        </div>

                    </div>
                )
            },
          {
                title: (<span>
                    <span style={{fontSize: '0.7em'}}>Step 5</span>
                    <br/><span style={{fontSize: '0.9em'}}>Budget and Funding</span></span>),
                content: (
                    <div>
                        <div className='row'>
                            <div className='col-sm-12'>
                                <div className="form-group"><label htmlFor>Estimated Cost Range</label>
                                <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={' Select the cost range that most accurately reflects the costs associated with the action.'}
                                        id={'estimated_cost_range'}/>
                                </span>
                                    <select className="form-control justify-content-sm-end" id='estimated_cost_range'
                                            onChange={this.handleChange} value={this.state.estimated_cost_range}>
                                        <option className="form-control" key={0} value="None">No Cost Range Selected
                                        </option>
                                        <option className="form-control" key={1} value='<$100K'> {'<$100K'}</option>
                                        <option className="form-control" key={2} value='$100K-$500K'>$100K-$500K</option>
                                        <option className="form-control" key={3} value='$500K-$1M'>$500K-$1M</option>
                                        <option className="form-control" key={4} value='1M-$5M'>$1M-$5M</option>
                                        <option className="form-control" key={5} value='$5M-$10M'>$5M-$10M</option>
                                        <option className="form-control" key={6} value='$10M+'>$10M+</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Calculated Cost</label>
                                <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'Provide the total dollar amount calculated in association with the action.'}
                                        id={'calculated_cost'}/>
                                </span>
                                    <input id='calculated_cost' onChange={this.handleChange} className="form-control"
                                           placeholder="Calculated Cost" type="number"
                                           value={this.state.calculated_cost}/>
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className='col-sm-12'>
                                <div className="form-group"><label htmlFor>Secured funding sources name
                                    Name</label>
                                <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'Identify the name of the secured funding source. Or enter a new funding source.'}
                                        id={'primary_or_potential_funding_sources_name'}/>
                                </span>
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
                                <div className="form-group"><label htmlFor>Potential funding sources name</label>
                                <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'Identify the name of the potential funding source.'}
                                        id={'secondary_funding_source_name'}/>
                                </span>
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
                                <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'Provide the exact dollar amount of secured funding.'}
                                        id={'funding_received_to_date'}/>
                                </span>
                                    <div className='input-group'>
                                        <div className='input-group-prepend'>
                                            <div className="input-group-text">$</div>
                                        </div>
                                        <input id='funding_received_to_date' onChange={this.handleChange}
                                               className="form-control currency"
                                               placeholder="Funding Received to Date" type="number"
                                               value={this.state.funding_received_to_date}/>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                )
            },
          {
                title: (<span>
                    <span style={{fontSize: '0.7em'}}>Step 6</span>
                    <br/><span style={{fontSize: '0.9em'}}>BCA and Useful Life</span></span>),
                content: (
                    <div>
                        <div className='row'>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>BCA</label>
                                <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'Upload the Benefit Cost Analysis document performed for the action.'}
                                        id={'bca'}/>
                                </span>
                                    <input id='bca' disabled onChange={this.handleChange} className="form-control"
                                           placeholder="BCA " type="file"/>
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <label htmlFor className='col-sm-6'> Does the BCA lead to BCR (Benefit Cost Ratio)? </label>
                            <div className='col-sm-1'>
                                <div className='form-inline'>
                                    <label className='mb-2 mr-sm-2 mb-sm-0'>
                                        <input
                                            checked={['yes', 'true', true].includes(this.state.bca_to_bcr)}
                                            id='bca_to_bcr'
                                            className="form-check-input"
                                            type="radio"
                                            value={true}
                                            onChange={this.handleChange}/>
                                        Yes
                                    </label>
                                </div>
                            </div>
                            <div className='col-sm-1'>
                                <div className='form-inline'>
                                    <label className='mb-2 mr-sm-2 mb-sm-0'>
                                        <input
                                            checked={['no', 'false', false].includes(this.state.bca_to_bcr)}
                                            id='bca_to_bcr'
                                            className="form-check-input"
                                            type="radio"
                                            value={false}
                                            onChange={this.handleChange}/>
                                        No
                                    </label>
                                </div>
                            </div>
                            <div className='col-sm-4'>
                                <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'Was a Benefit Cost Report established as an outcome of the Benefit Cost Analysis?'}
                                        id={'bca_to_bcr'}/>
                                </span>
                            </div>
                        </div>

                        <div className='row'>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>BCR Upload</label>
                                <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'If you answered yes to question 28, provide an upload the Benefit Cost Report document'}
                                        id={'bcr'}/>
                                </span>
                                    <input id='bcr' disabled onChange={this.handleChange} className="form-control"
                                           placeholder="BCR " type="file"/>
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Level of Protection</label>
                                <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'Identify the level of protection the proposed project will provide.  Ex. 100-year (1%) flood.'}
                                        id={'level_of_protection'}/>
                                </span>
                                    <input id='level_of_protection' onChange={this.handleChange} className="form-control"
                                           placeholder="Level of Protection" type="text"
                                           value={this.state.level_of_protection}/>
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Recurrence Interval</label>
                                <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={''}
                                        id={'recurrence_interval'}/>
                                </span>
                                    <input disabled id='recurrence_interval' onChange={this.handleChange}
                                           className="form-control"
                                           placeholder="Recurrence Interval" type="number"
                                           value={this.state.recurrence_interval}/>
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Useful Life</label>
                                <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'Identify the number of years the implemented action will provide protection against the hazard(s).'}
                                        id={'useful_life'}/>
                                </span>
                                    <input id='useful_life' onChange={this.handleChange} className="form-control"
                                           placeholder="Useful Life" type="number" value={this.state.useful_life}/>
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Estimated Timeframe for Action
                                    Implementation</label>
                                <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'Provided the estimated time required to complete the project from start to finish.'}
                                        id={'estimated_timeframe_for_action_implementation'}/>
                                </span>
                                    <input id='estimated_timeframe_for_action_implementation' onChange={this.handleChange}
                                           className="form-control"
                                           placeholder="Estimated Timeframe for Action Implementation" type="text"
                                           value={this.state.estimated_timeframe_for_action_implementation}/>
                                </div>
                            </div>
                        </div>

                        
                        <div className='row'>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Exact Timeframe for Action
                                    Implementation (if applicable)</label>
                                <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'Provided the specific timeline for action implementation as it exists.' +
                                        ' How long it takes from beginning of action implementation to end of action implementation.'}
                                        id={'exact_timeframe_for_action_implementation'}/>
                                </span>
                                    <input id='exact_timeframe_for_action_implementation' onChange={this.handleChange}
                                           className="form-control"
                                           placeholder="Exact Timeframe for Action Implementation" type="text"
                                           value={this.state.exact_timeframe_for_action_implementation}/>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            },
          {
                title: (<span>
                    <span style={{fontSize: '0.7em'}}>Step 7</span>
                    <br/><span style={{fontSize: '0.9em'}}>Associated Goals/Capabilities</span></span>),
                content: (
                    <div>
                        <div className='row'>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Associated Mitigation Capability Category</label>
                                <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'From the dropdown menu, select the capability that best describes the action.'}
                                        id={'associated_mitigation_capability'}/>
                                </span>
                                    <select className="form-control justify-content-sm-end" id='associated_mitigation_capability'
                                            onChange={this.handleChange} value={this.state.associated_mitigation_capability}>
                                        <option className="form-control" key={0} value="None">None Selected</option>
                                        {capabilitiesAll.length > 0 ?
                                            capabilitiesAll.map((f,f_i) =>
                                                <option className="form-control" key={f_i + 1} value={f.capability}>{f.capability}</option>
                                            ) : null
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            },
          {
                title: (<span>
                    <span style={{fontSize: '0.7em'}}>Step 8</span>
                    <br/><span style={{fontSize: '0.9em'}}>Alternatives</span></span>),
                content: (
                    <div>
                        <div className='row'>
                            <label htmlFor className='col-sm-6'> Is there an alternative? </label>
                            <div className='col-sm-1'>
                                <div className='form-inline'>
                                    <label className='mb-2 mr-sm-2 mb-sm-0'>
                                        <input
                                            checked={['yes', 'true', true].includes(this.state.boolalternative)}
                                            id='boolalternative'
                                            className="form-check-input"
                                            type="radio"
                                            value={true}
                                            onChange={this.handleChange}/>
                                        Yes
                                    </label>
                                </div>
                            </div>
                            <div className='col-sm-1'>
                                <div className='form-inline'>
                                    <label className='mb-2 mr-sm-2 mb-sm-0'>
                                        <input
                                            checked={['no', 'false', false].includes(this.state.boolalternative)}
                                            id='boolalternative'
                                            className="form-check-input"
                                            type="radio"
                                            value={false}
                                            onChange={this.handleChange}/>
                                        No
                                    </label>
                                </div>
                            </div>
                            <div className='col-sm-4'>
                                <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={''}
                                        id={''}/>
                                </span>
                            </div>
                        </div>

                        <div className='row'>
                            <div className="col-sm-12" style={{display: ['yes', 'true', true].includes(this.state.boolalternative) ? 'block' : 'none'}}>
                                <div className="form-group"><label htmlFor>Alternative Action 1</label>
                                <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'What alternatives were considered when identifying and developing this action?'}
                                        id={'alternative_action_1'}/>
                                </span>
                                    <input id='alternative_action_1' onChange={this.handleChange} className="form-control"
                                           placeholder="Alternative Action 1" type="text"
                                           value={this.state.alternative_action_1}/>
                                </div>
                            </div>
                        </div>

                        // todo : add to db
                        <div className='row'>
                            <div className="col-sm-12" style={{display: ['yes', 'true', true].includes(this.state.boolalternative) ? 'block' : 'none'}}>
                                <div className="form-group"><label htmlFor>Alternative Action 1 Evaluation</label>
                                <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'Explain why the alternative action was not selected; include the estimated cost and reasoning.'}
                                        id={'alternative_action_1_evaluation'}/>
                                </span>
                                    <input id='alternative_action_1_evaluation' onChange={this.handleChange} className="form-control"
                                           placeholder="Alternative Action 1" type="text"
                                           value={this.state.alternative_action_1_evaluation}/>
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className="col-sm-12" style={{display: ['yes', 'true', true].includes(this.state.boolalternative) ? 'block' : 'none'}}>
                                <div className="form-group"><label htmlFor>Alternative Action 2</label>
                                <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'What alternatives were considered when identifying and developing this action?'}
                                        id={'alternative_action_2'}/>
                                </span>
                                    <input id='alternative_action_2' onChange={this.handleChange} className="form-control"
                                           placeholder="Alternative Action 2" type="text"
                                           value={this.state.alternative_action_2}/>
                                </div>
                            </div>
                        </div>

                        // todo : add to db
                        <div className='row'>
                            <div className="col-sm-12" style={{display: ['yes', 'true', true].includes(this.state.boolalternative) ? 'block' : 'none'}}>
                                <div className="form-group"><label htmlFor>Alternative Action 2 Evaluation (if available)</label>
                                <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'Explain why the alternative action was not selected; include the estimated cost and reasoning.'}
                                        id={'alternative_action_2_evaluation'}/>
                                </span>
                                    <input id='alternative_action_2_evaluation' onChange={this.handleChange} className="form-control"
                                           placeholder="Alternative Action 2" type="text"
                                           value={this.state.alternative_action_2_evaluation}/>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            },
          {
                    title: (<span>
                    <span style={{fontSize: '0.7em'}}>{this.state.new_or_update === 'new' ? 'Step 10' : 'Step 9'}</span>
                    <br/><span style={{fontSize: '0.9em'}}>Supplemental Location Information</span></span>),
                    content: (
                        <div>
                            
                            <div className='row'>
                                <label htmlFor className='col-sm-6'>Relates to/ Protects Critical Facility/ Infrastructure</label>

                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['yes', 'true', true].includes(this.state.relates_to_protects_critical_facility_infrastructure)}
                                                id='relates_to_protects_critical_facility_infrastructure'
                                                className="form-check-input"
                                                type="radio"
                                                value={true}
                                                onChange={this.handleChange}/>
                                            Yes
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['no', 'false', false].includes(this.state.relates_to_protects_critical_facility_infrastructure)}
                                                id='relates_to_protects_critical_facility_infrastructure'
                                                className="form-check-input"
                                                type="radio"
                                                value={false}
                                                onChange={this.handleChange}/>
                                            No
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-4'>
                                    <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'Is the action directly related to any critical facilities or infrastructure?' +
                                        ' Critical facilities include; utilities, emergency services, governmental structures,' +
                                        ' bridges, transportation corridors, etc.'}
                                        id={'relates_to_protects_critical_facility_infrastructure'}/>
                                </span>
                                </div>
                            </div>

                            
                            <div className='row'>
                                <div className='col-sm-12'>
                                    <div className="form-group"><label htmlFor>Relates to / Protects Community Lifeline(s) as defined by FEMA</label>
                                <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'Categories include; Safety & Security, Food/Water/Sheltering, Health & Medical,' +
                                        ' Energy, Communications, Transportation, and Hazardous Material.'}
                                        id={'relates_to_protects_community_lifeline_by_fema'}/>
                                </span>
                                        <select className="form-control justify-content-sm-end" id='relates_to_protects_community_lifeline_by_fema'
                                                onChange={this.handleChange} value={this.state.relates_to_protects_community_lifeline_by_fema}>
                                            <option className="form-control" key={0} value="None">No Structure type
                                                Selected
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className='row'>
                                <label htmlFor className='col-sm-6'> Is PNP (private non-profit)? </label>
                                <div className='col-sm-1'>
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
                                </div>
                                <div className='col-sm-1'>
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
                                <div className='col-sm-4'>
                                    <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'Is this the responsibility of a private non-profit?'}
                                        id={'is_pnp'}/>
                                </span>
                                </div>
                            </div>

                            
                            <div className='row'>
                                <label htmlFor className='col-sm-6'>Is State Agency?</label>

                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['yes', 'true', true].includes(this.state.is_state_agency)}
                                                id='is_state_agency'
                                                className="form-check-input"
                                                type="radio"
                                                value={true}
                                                onChange={this.handleChange}/>
                                            Yes
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['no', 'false', false].includes(this.state.is_state_agency)}
                                                id='is_state_agency'
                                                className="form-check-input"
                                                type="radio"
                                                value={false}
                                                onChange={this.handleChange}/>
                                            No
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-4'>
                                    <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'Is this the responsibility of a State Agency?'}
                                        id={'is_state_agency'}/>
                                </span>
                                </div>
                            </div>

                            
                            <div className='row'>
                                <label htmlFor className='col-sm-6'>Is the community a member of CRS?</label>
                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['yes', 'true', true].includes(this.state.is_community_member_of_crs)}
                                                id='is_community_member_of_crs'
                                                className="form-check-input"
                                                type="radio"
                                                value={true}
                                                onChange={this.handleChange}/>
                                            Yes
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input //from here in state
                                                checked={['no', 'false', false].includes(this.state.is_community_member_of_crs)}
                                                id='is_community_member_of_crs'
                                                className="form-check-input"
                                                type="radio"
                                                value={false}
                                                onChange={this.handleChange}/>
                                            No
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-4'>
                                    <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={''}
                                        id={'is_community_member_of_crs'}/>
                                </span>
                                </div>
                            </div>

                            
                            <div className='row'>
                                <label htmlFor className='col-sm-6'>Is the community a member of good standing with the NFIP?</label>
                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['yes', 'true', true].includes(this.state.is_community_member_of_good_standing_with_nfip)}
                                                id='is_community_member_of_good_standing_with_nfip'
                                                className="form-check-input"
                                                type="radio"
                                                value={true}
                                                onChange={this.handleChange}/>
                                            Yes
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['no', 'false', false].includes(this.state.is_community_member_of_good_standing_with_nfip)}
                                                id='is_community_member_of_good_standing_with_nfip'
                                                className="form-check-input"
                                                type="radio"
                                                value={false}
                                                onChange={this.handleChange}/>
                                            No
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-4'>
                                    <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'Is the community a member of good standing with the National Flood Insurance Program?'}
                                        id={'is_community_member_of_good_standing_with_nfip'}/>
                                </span>
                                </div>
                            </div>

                            
                            <div className='row'>
                                <label htmlFor className='col-sm-6'>Does the community participate in Climate Smart Communities?</label>
                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['yes', 'true', true].includes(this.state.is_community_participate_in_climate_smart_communities)}
                                                id='is_community_participate_in_climate_smart_communities'
                                                className="form-check-input"
                                                type="radio"
                                                value={true}
                                                onChange={this.handleChange}/>
                                            Yes
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['no', 'false', false].includes(this.state.is_community_participate_in_climate_smart_communities)}
                                                id='is_community_participate_in_climate_smart_communities'
                                                className="form-check-input"
                                                type="radio"
                                                value={false}
                                                onChange={this.handleChange}/>
                                            No
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-4'>
                                    <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={''}
                                        id={'is_community_participate_in_climate_smart_communities'}/>
                                </span>
                                </div>
                            </div>

                            
                            <div className='row'>
                                <label htmlFor className='col-sm-6'>Does the community have a local adopted Hazard Mitigation Plan?</label>
                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['yes', 'true', true].includes(this.state.is_community_have_local_adopted_hmp)}
                                                id='is_community_have_local_adopted_hmp'
                                                className="form-check-input"
                                                type="radio"
                                                value={true}
                                                onChange={this.handleChange}/>
                                            Yes
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['no', 'false', false].includes(this.state.is_community_have_local_adopted_hmp)}
                                                id='is_community_have_local_adopted_hmp'
                                                className="form-check-input"
                                                type="radio"
                                                value={false}
                                                onChange={this.handleChange}/>
                                            No
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-4'>
                                    <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={''}
                                        id={'is_community_have_local_adopted_hmp'}/>
                                </span>
                                </div>
                            </div>

                            
                            <div className='row'>
                                <label htmlFor className='col-sm-6'>Does the community have a comprehensive plan?</label>
                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['yes', 'true', true].includes(this.state.is_community_have_comprehensive_plan)}
                                                id='is_community_have_comprehensive_plan'
                                                className="form-check-input"
                                                type="radio"
                                                value={true}
                                                onChange={this.handleChange}/>
                                            Yes
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['no', 'false', false].includes(this.state.is_community_have_comprehensive_plan)}
                                                id='is_community_have_comprehensive_plan'
                                                className="form-check-input"
                                                type="radio"
                                                value={false}
                                                onChange={this.handleChange}/>
                                            No
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-4'>
                                    <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={''}
                                        id={'is_community_have_comprehensive_plan'}/>
                                </span>
                                </div>
                            </div>

                            
                            <div className='row'>
                                <label htmlFor className='col-sm-6'>Does the community have land use zoning?</label>
                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['yes', 'true', true].includes(this.state.is_community_have_land_use_zoning)}
                                                id='is_community_have_land_use_zoning'
                                                className="form-check-input"
                                                type="radio"
                                                value={true}
                                                onChange={this.handleChange}/>
                                            Yes
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['no', 'false', false].includes(this.state.is_community_have_land_use_zoning)}
                                                id='is_community_have_land_use_zoning'
                                                className="form-check-input"
                                                type="radio"
                                                value={false}
                                                onChange={this.handleChange}/>
                                            No
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-4'>
                                    <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={''}
                                        id={'is_community_have_land_use_zoning'}/>
                                </span>
                                </div>
                            </div>

                            
                            <div className='row'>
                                <label htmlFor className='col-sm-6'>Does the community have subdivision ordinances?</label>
                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['yes', 'true', true].includes(this.state.is_community_have_subdivision_ordinances)}
                                                id='is_community_have_subdivision_ordinances'
                                                className="form-check-input"
                                                type="radio"
                                                value={true}
                                                onChange={this.handleChange}/>
                                            Yes
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['no', 'false', false].includes(this.state.is_community_have_subdivision_ordinances)}
                                                id='is_community_have_subdivision_ordinances'
                                                className="form-check-input"
                                                type="radio"
                                                value={false}
                                                onChange={this.handleChange}/>
                                            No
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-4'>
                                    <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={''}
                                        id={'is_community_have_subdivision_ordinances'}/>
                                </span>
                                </div>
                            </div>

                            
                            <div className='row'>
                                <label htmlFor className='col-sm-6'>Does the community have building codes?</label>
                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['yes', 'true', true].includes(this.state.is_community_have_building_codes)}
                                                id='is_community_have_building_codes'
                                                className="form-check-input"
                                                type="radio"
                                                value={true}
                                                onChange={this.handleChange}/>
                                            Yes
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['no', 'false', false].includes(this.state.is_community_have_building_codes)}
                                                id='is_community_have_building_codes'
                                                className="form-check-input"
                                                type="radio"
                                                value={false}
                                                onChange={this.handleChange}/>
                                            No
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-4'>
                                    <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={''}
                                        id={''}/>
                                </span>
                                </div>
                            </div>

                            <div className='row'>
                                <label htmlFor className='col-sm-6'> Engineering Required? </label>

                                <div className='col-sm-1'>
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
                                </div>
                                <div className='col-sm-1'>
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
                                <div className='col-sm-4'>
                                    <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'Does proposed action require input or designs from engineering professionals?'}
                                        id={'engineering_required'}/>
                                </span>
                                </div>
                            </div>

                            
                            <div className='row'>
                                <label htmlFor className='col-sm-6'>Final Engineering Design Complete?</label>
                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['yes', 'true', true].includes(this.state.is_final_engineering_design_completes)}
                                                id='is_final_engineering_design_completes'
                                                className="form-check-input"
                                                type="radio"
                                                value={true}
                                                onChange={this.handleChange}/>
                                            Yes
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['no', 'false', false].includes(this.state.is_final_engineering_design_completes)}
                                                id='is_final_engineering_design_completes'
                                                className="form-check-input"
                                                type="radio"
                                                value={false}
                                                onChange={this.handleChange}/>
                                            No
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-4'>
                                    <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'Is the final engineering design complete?'}
                                        id={'is_final_engineering_design_completes'}/>
                                </span>
                                </div>
                            </div>

                            
                            <div className='row'>
                                <label htmlFor className='col-sm-6'>Is Mitigation?</label>
                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['yes', 'true', true].includes(this.state.is_mitigation)}
                                                id='is_mitigation'
                                                className="form-check-input"
                                                type="radio"
                                                value={true}
                                                onChange={this.handleChange}/>
                                            Yes
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['no', 'false', false].includes(this.state.is_mitigation)}
                                                id='is_mitigation'
                                                className="form-check-input"
                                                type="radio"
                                                value={false}
                                                onChange={this.handleChange}/>
                                            No
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-4'>
                                    <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'select yes or no if the action falls under mitigation'}
                                        id={'is_mitigation'}/>
                                </span>
                                </div>
                            </div>

                            
                            <div className='row'>
                                <label htmlFor className='col-sm-6'>Is Preparedness?</label>
                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['yes', 'true', true].includes(this.state.is_preparedness)}
                                                id='is_preparedness'
                                                className="form-check-input"
                                                type="radio"
                                                value={true}
                                                onChange={this.handleChange}/>
                                            Yes
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['no', 'false', false].includes(this.state.is_preparedness)}
                                                id='is_preparedness'
                                                className="form-check-input"
                                                type="radio"
                                                value={false}
                                                onChange={this.handleChange}/>
                                            No
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-4'>
                                    <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'select yes or no if the action falls under preparedness'}
                                        id={'is_preparedness'}/>
                                </span>
                                </div>
                            </div>

                            
                            <div className='row'>
                                <label htmlFor className='col-sm-6'>Is Response?</label>

                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['yes', 'true', true].includes(this.state.is_response)}
                                                id='is_response'
                                                className="form-check-input"
                                                type="radio"
                                                value={true}
                                                onChange={this.handleChange}/>
                                            Yes
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['no', 'false', false].includes(this.state.is_response)}
                                                id='is_response'
                                                className="form-check-input"
                                                type="radio"
                                                value={false}
                                                onChange={this.handleChange}/>
                                            No
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-4'>
                                    <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'select yes or no if the action falls under response'}
                                        id={'is_response'}/>
                                </span>
                                </div>
                            </div>

                            
                            <div className='row'>
                                <label htmlFor className='col-sm-6'>Is Recovery?</label>
                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['yes', 'true', true].includes(this.state.is_recovery)}
                                                id='is_recovery'
                                                className="form-check-input"
                                                type="radio"
                                                value={true}
                                                onChange={this.handleChange}/>
                                            Yes
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['no', 'false', false].includes(this.state.is_recovery)}
                                                id='is_recovery'
                                                className="form-check-input"
                                                type="radio"
                                                value={false}
                                                onChange={this.handleChange}/>
                                            No
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-4'>
                                    <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'select yes or no if the action falls under recovery'}
                                        id={'is_recovery'}/>
                                </span>
                                </div>
                            </div>

                            
                            <div className='row'>
                                <label htmlFor className='col-sm-6'>Is Climate Adaptation?</label>
                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['yes', 'true', true].includes(this.state.is_climate_adaptation)}
                                                id='is_climate_adaptation'
                                                className="form-check-input"
                                                type="radio"
                                                value={true}
                                                onChange={this.handleChange}/>
                                            Yes
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['no', 'false', false].includes(this.state.is_climate_adaptation)}
                                                id='is_climate_adaptation'
                                                className="form-check-input"
                                                type="radio"
                                                value={false}
                                                onChange={this.handleChange}/>
                                            No
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-4'>
                                    <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'What categories of the disaster cycle would the action be considered?'}
                                        id={'is_climate_adaptation'}/>
                                </span>
                                </div>
                            </div>

                            
                            <div className='row'>
                                <label htmlFor className='col-sm-6'>Is proposed project located in SFHA?</label>
                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['yes', 'true', true].includes(this.state.is_proposed_project_located_in_sfha)}
                                                id='is_proposed_project_located_in_sfha'
                                                className="form-check-input"
                                                type="radio"
                                                value={true}
                                                onChange={this.handleChange}/>
                                            Yes
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['no', 'false', false].includes(this.state.is_proposed_project_located_in_sfha)}
                                                id='is_proposed_project_located_in_sfha'
                                                className="form-check-input"
                                                type="radio"
                                                value={false}
                                                onChange={this.handleChange}/>
                                            No
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-4'>
                                    <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'if yes, select zone'}
                                        id={'is_proposed_project_located_in_sfha'}/>
                                </span>
                                </div>
                            </div>

                            
                            <div className='row'>
                                <label htmlFor className='col-sm-6'>Is Project Structure (s) Located in SFHA?</label>
                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['yes', 'true', true].includes(this.state.is_project_structure_located_in_sfha)}
                                                id='is_project_structure_located_in_sfha'
                                                className="form-check-input"
                                                type="radio"
                                                value={true}
                                                onChange={this.handleChange}/>
                                            Yes
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['no', 'false', false].includes(this.state.is_project_structure_located_in_sfha)}
                                                id='is_project_structure_located_in_sfha'
                                                className="form-check-input"
                                                type="radio"
                                                value={false}
                                                onChange={this.handleChange}/>
                                            No
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-4'>
                                    <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'This can be any project or building located in the Special Flood Hazard Area'}
                                        id={'is_project_structure_located_in_sfha'}/>
                                </span>
                                </div>
                            </div>

                            
                            <div className='row'>
                                <label htmlFor className='col-sm-6'>Protects Repetitive Loss Property?</label>
                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['yes', 'true', true].includes(this.state.is_protects_repetitive_loss_property)}
                                                id='is_protects_repetitive_loss_property'
                                                className="form-check-input"
                                                type="radio"
                                                value={true}
                                                onChange={this.handleChange}/>
                                            Yes
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['no', 'false', false].includes(this.state.is_protects_repetitive_loss_property)}
                                                id='is_protects_repetitive_loss_property'
                                                className="form-check-input"
                                                type="radio"
                                                value={false}
                                                onChange={this.handleChange}/>
                                            No
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-4'>
                                    <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'Does the action protect a “Repetitive Loss Property” as defined by FEMA?' +
                                        ' “Repetitive Loss Structure. An NFIP-insured structure that has had at least 2 ' +
                                        'paid flood losses of more than $1,000 each in any 10-year period since 1978.” (FEMA)'}
                                        id={'is_protects_repetitive_loss_property'}/>
                                </span>
                                </div>
                            </div>

                            
                            <div className='row'>
                                <label htmlFor className='col-sm-6'>Protects Severe Repetitive Loss Property?</label>

                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['yes', 'true', true].includes(this.state.is_protects_severe_repetitive_loss_property)}
                                                id='is_protects_severe_repetitive_loss_property'
                                                className="form-check-input"
                                                type="radio"
                                                value={true}
                                                onChange={this.handleChange}/>
                                            Yes
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['no', 'false', false].includes(this.state.is_protects_severe_repetitive_loss_property)}
                                                id='is_protects_severe_repetitive_loss_property'
                                                className="form-check-input"
                                                type="radio"
                                                value={false}
                                                onChange={this.handleChange}/>
                                            No
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-4'>
                                    <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'Does the action protect a “Severe Repetitive Loss Property” as defined by FEMA? \n' +
                                        '“Severe Repetitive Loss Building. Any building that:\n' +
                                        'Is covered under a Standard Flood Insurance Policy made available under this title;\n' +
                                        'Has incurred flood damage for which:\n' +
                                        'a. 4 or more separate claim payments have been made under a Standard Flood Insurance ' +
                                        'Policy issued pursuant to this title, with the amount of each such claim exceeding $5,000, ' +
                                        'and with the cumulative amount of such claims payments exceeding $20,000; or\n' +
                                        'b. At least 2 separate claims payments have been made under a Standard Flood Insurance Policy,' +
                                        ' with the cumulative amount of such claim payments exceed the fair market value of the' +
                                        ' insured building on the day before each loss.” (FEMA)'}
                                        id={'is_protects_severe_repetitive_loss_property'}/>
                                </span>
                                </div>
                            </div>

                            
                            <div className='row'>
                                <label htmlFor className='col-sm-6'>Known Environmental/Historic Preservation/Protected Species Issues?</label>

                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['yes', 'true', true].includes(this.state.known_environmental_historic_preservation_protected_species_iss)}
                                                id='known_environmental_historic_preservation_protected_species_iss'
                                                className="form-check-input"
                                                type="radio"
                                                value={true}
                                                onChange={this.handleChange}/>
                                            Yes
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['no', 'false', false].includes(this.state.known_environmental_historic_preservation_protected_species_iss)}
                                                id='known_environmental_historic_preservation_protected_species_iss'
                                                className="form-check-input"
                                                type="radio"
                                                value={false}
                                                onChange={this.handleChange}/>
                                            No
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-4'>
                                    <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={''}
                                        id={'known_environmental_historic_preservation_protected_species_iss'}/>
                                </span>
                                </div>
                            </div>

                            
                            <div className='row'>
                                <label htmlFor className='col-sm-6'>Has the ground at the project location been disturbed other than by agriculture?</label>
                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['yes', 'true', true].includes(this.state.ground_distributed_other_than_agriculture)}
                                                id='ground_distributed_other_than_agriculture'
                                                className="form-check-input"
                                                type="radio"
                                                value={true}
                                                onChange={this.handleChange}/>
                                            Yes
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['no', 'false', false].includes(this.state.ground_distributed_other_than_agriculture)}
                                                id='ground_distributed_other_than_agriculture'
                                                className="form-check-input"
                                                type="radio"
                                                value={false}
                                                onChange={this.handleChange}/>
                                            No
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-4'>
                                    <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'Has there been any instances of development, clearing, or other ground altering activity'}
                                        id={'ground_distributed_other_than_agriculture'}/>
                                </span>
                                </div>
                            </div>

                            
                            <div className='row'>
                                <label htmlFor className='col-sm-6'>To your knowledge, have Indian or historic artifacts been found on or adjacent to the project area?</label>
                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['yes', 'true', true].includes(this.state.indian_or_historic_artifacts_found_on_or_adjacent_project_area)}
                                                id='indian_or_historic_artifacts_found_on_or_adjacent_project_area'
                                                className="form-check-input"
                                                type="radio"
                                                value={true}
                                                onChange={this.handleChange}/>
                                            Yes
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['no', 'false', false].includes(this.state.indian_or_historic_artifacts_found_on_or_adjacent_project_area)}
                                                id='indian_or_historic_artifacts_found_on_or_adjacent_project_area'
                                                className="form-check-input"
                                                type="radio"
                                                value={false}
                                                onChange={this.handleChange}/>
                                            No
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-4'>
                                    <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={''}
                                        id={'indian_or_historic_artifacts_found_on_or_adjacent_project_area'}/>
                                </span>
                                </div>
                            </div>

                            
                            <div className='row'>
                                <label htmlFor className='col-sm-6'>Is there a building 50 years or older within or near the project area?</label>
                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['yes', 'true', true].includes(this.state.building_50_years_or_older_within_or_near)}
                                                id='building_50_years_or_older_within_or_near'
                                                className="form-check-input"
                                                type="radio"
                                                value={true}
                                                onChange={this.handleChange}/>
                                            Yes
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['no', 'false', false].includes(this.state.building_50_years_or_older_within_or_near)}
                                                id='building_50_years_or_older_within_or_near'
                                                className="form-check-input"
                                                type="radio"
                                                value={false}
                                                onChange={this.handleChange}/>
                                            No
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-4'>
                                    <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={''}
                                        id={'building_50_years_or_older_within_or_near'}/>
                                </span>
                                </div>
                            </div>

                            <div className='row'>
                                <label htmlFor className='col-sm-6'>SHPO survey?</label>
                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['yes', 'true', true].includes(this.state.is_shpo_survey)}
                                                id='is_shpo_survey'
                                                className="form-check-input"
                                                type="radio"
                                                value={true}
                                                onChange={this.handleChange}/>
                                            Yes
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-1'>
                                    <div className='form-inline'>
                                        <label className='mb-2 mr-sm-2 mb-sm-0'>
                                            <input
                                                checked={['no', 'false', false].includes(this.state.is_shpo_survey)}
                                                id='is_shpo_survey'
                                                className="form-check-input"
                                                type="radio"
                                                value={false}
                                                onChange={this.handleChange}/>
                                            No
                                        </label>
                                    </div>
                                </div>
                                <div className='col-sm-4'>
                                    <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'Has a State Historic Preservation Office survey been conducted in the ' +
                                        'location of the action? If the survey is available, upload the PDF.'}
                                        id={'is_shpo_survey'}/>
                                </span>
                                </div>
                            </div>

                            
                            <div className='row'>
                                <div className="col-sm-12" style={{display:['yes', 'true', true].includes(this.state.is_shpo_survey) ? 'block' : 'none'}}>
                                    <div className="form-group"><label htmlFor>SHPO survey File</label>
                                <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={''}
                                        id={'shpo_survey'}/>
                                </span>
                                        <input id='shpo_survey' disabled onChange={this.handleChange} className="form-control"
                                               placeholder="shpo_survey" type="file"/>
                                    </div>
                                </div>
                            </div>



                        </div>
                    )
                },
          {
                title: (<span>
                    <span style={{fontSize: '0.7em'}}>{this.state.new_or_update === 'new' ? 'Step 11' : 'Step 10'}</span>
                    <br/><span style={{fontSize: '0.9em'}}>Other</span></span>),
                content: (
                    <div>
                        
                        <div className='row'>
                            <div className='col-sm-12'>
                                <div className="form-group"><label htmlFor>Climate Smart Communities action type?</label>
                                <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'From the Climate Smart Community action type dropdown, select the category that best describes your action.'}
                                        id={'climate_smart_communities_action_type'}/>
                                </span>
                                    <select className="form-control justify-content-sm-end" id='climate_smart_communities_action_type?'
                                            onChange={this.handleChange} value={this.state.climate_smart_communities_action_type}>
                                        <option className="form-control" key={0} value="None">None Selected
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            },
          {
                title: (<span>
                    <span style={{fontSize: '0.7em'}}>{this.state.new_or_update === 'new' ? 'Step 12' : 'Step 11'}</span>
                    <br/><span style={{fontSize: '0.9em'}}>Hazard Mitigation Plan Maintenance</span></span>),
                content: (
                    <div>
                        <div className='row'>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Plan Maintenance - Date of Status
                                    Report</label>
                                <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'This section should be completed during plan maintenance/evaluation.'}
                                        id={'plan_maintenance_date_of_status_report'}/>
                                </span>
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
                                <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'Describe what progress, if any, has been made on this project.  ' +
                                        'If it has been determined the community no longer wishes to pursue project, state that here and indicate why.'}
                                        id={'plan_maintenance_progress_report'}/>
                                </span>
                                    <input id='plan_maintenance_progress_report' onChange={this.handleChange}
                                           className="form-control"
                                           placeholder="Plan Maintenance - Progress Report" type="text"
                                           value={this.state.plan_maintenance_progress_report}/>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        ];

        let hiddenStep9 = {title: (
                <span>
                    <span style={{fontSize: '0.7em'}}>Step 9</span>
                    <br/><span style={{fontSize: '0.9em'}}>Prioritization</span></span>),
            content: (
                <div>
                    Priority Score Is additive of the following questions:
                    
                    <div className='row'>
                        <div className="col-sm-12">
                            <div className="form-group"><label htmlFor>Priority Scoring:
                                Probability of Acceptance by Population</label>
                                <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'Priority Information is Only Applicable to New Actions'}
                                        id={'priority_scoring_probability_of_acceptance_by_population'}/>
                                </span>
                                <select className="form-control justify-content-sm-end" id='priority_scoring_probability_of_acceptance_by_population'
                                        onChange={this.handleChange} value={this.state.priority_scoring_probability_of_acceptance_by_population}>
                                    <option className="form-control" key={0} value="None">None Selected</option>
                                    <option className="form-control" key={1}
                                            value="(4) Likely to be endorsed by the entire population">
                                        (4) Likely to be endorsed by the entire population
                                    </option>
                                    <option className="form-control" key={2}
                                            value="(3) Of benefit only to those directly affected and would not adversely affect others">
                                        (3) Of benefit only to those directly affected and would not adversely affect others
                                    </option>
                                    <option className="form-control" key={3}
                                            value="(2) Would be somewhat controversial with special interest groups or a small percentage of the population">
                                        (2) Would be somewhat controversial with special interest groups or a small percentage of the population
                                    </option>
                                    <option className="form-control" key={4}
                                            value="(1) Would be strongly opposed by special interest groups or a significant percentage of the population">
                                        (1) Would be strongly opposed by special interest groups or a significant percentage of the population
                                    </option>
                                    <option className="form-control" key={5}
                                            value="(0) Would be strongly opposed by nearly all of the population">
                                        (0) Would be strongly opposed by nearly all of the population
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className='row'>
                        <div className="col-sm-12">
                            <div className="form-group"><label htmlFor>Priority Scoring: Funding
                                Availability</label>
                                <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'Priority Information is Only Applicable to New Actions'}
                                        id={'priority_scoring_funding_availability'}/>
                                </span>
                                <select className="form-control justify-content-sm-end" id='priority_scoring_funding_availability'
                                        onChange={this.handleChange} value={this.state.priority_scoring_funding_availability}>
                                    <option className="form-control" key={0} value="None">None Selected</option>
                                    <option className="form-control" key={1} value="(4) Little to no direct expenses">(4) Little to no direct expenses</option>
                                    <option className="form-control" key={2} value="(3) Can be funded by operating budget">(3) Can be funded by operating budget</option>
                                    <option className="form-control" key={3} value="(2) Grant funding identified">(2) Grant funding identified</option>
                                    <option className="form-control" key={4} value="(1) Grant funding needed">(1) Grant funding needed</option>
                                    <option className="form-control" key={5} value="(0) Potential funding source unknown">(0) Potential funding source unknown</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className='row'>
                        <div className="col-sm-12">
                            <div className="form-group"><label htmlFor>Priority Scoring: Probability of Matching
                                Funds</label>
                                <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'Priority Information is Only Applicable to New Actions'}
                                        id={'priority_scoring_probability_of_matching_funds'}/>
                                </span>
                                <select className="form-control justify-content-sm-end" id='priority_scoring_probability_of_matching_funds'
                                        onChange={this.handleChange} value={this.state.priority_scoring_probability_of_matching_funds}>
                                    <option className="form-control" key={0} value="None">None Selected</option>
                                    <option className="form-control" key={1} value="(4) Funding match is available or funding match not required">(4) Funding match is available or funding match not required</option>
                                    <option className="form-control" key={2} value="(2) Partial funding match available">(2) Partial funding match available</option>
                                    <option className="form-control" key={3} value="(0) No funding match available or funding match unknown">(0) No funding match available or funding match unknown</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className='row'>
                        <label htmlFor className='col-sm-6'>Priority Scoring: Benefit Cost Review</label>
                        <div className='col-sm-5'>
                            <div className='form-check'>
                                <label className='form-check-label'>
                                    <input
                                        checked={['(4) Likely to meet Benefit Cost Review'].includes(this.state.priority_scoring_benefit_cost_review)}
                                        id='priority_scoring_benefit_cost_review'
                                        className="form-check-input"
                                        type="radio"
                                        value={'(4) Likely to meet Benefit Cost Review'}
                                        onChange={this.handleChange}/>
                                    (4) Likely to meet Benefit Cost Review
                                </label>
                            </div>
                            <div className='form-check'>
                                <label className='form-check-label'>
                                    <input
                                        checked={['(2) Benefit Cost Review not required'].includes(this.state.priority_scoring_benefit_cost_review)}
                                        id='priority_scoring_benefit_cost_review'
                                        className="form-check-input"
                                        type="radio"
                                        value={'(2) Benefit Cost Review not required'}
                                        onChange={this.handleChange}/>
                                    (2) Benefit Cost Review not required
                                </label>
                            </div>
                            <div className='form-check'>
                                <label className='form-check-label'>
                                    <input
                                        checked={['(0) Benefit Cost Review unknown'].includes(this.state.priority_scoring_benefit_cost_review)}
                                        id='priority_scoring_benefit_cost_review'
                                        className="form-check-input"
                                        type="radio"
                                        value={'(0) Benefit Cost Review unknown'}
                                        onChange={this.handleChange}/>
                                    (0) Benefit Cost Review unknown
                                </label>
                            </div>
                        </div>
                        <div className='col-sm-1'>
                            <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'Priority Information is Only Applicable to New Actions.'}
                                        id={'priority_scoring_benefit_cost_review'}/>
                                </span>
                        </div>
                    </div>
                    <div className='row'>
                        <label htmlFor className='col-sm-6'>Priority Scoring: Environmental
                            Benefit</label>
                        <div className='col-sm-5'>
                            <div className='form-check'>
                                <label className='form-check-label'>
                                    <input
                                        checked={['(4) Environmentally sound and relatively easy to implement; or no adverse impact on environment']
                                            .includes(this.state.priority_scoring_environmental_benefit)}
                                        id='priority_scoring_environmental_benefit'
                                        className="form-check-input"
                                        type="radio"
                                        value={'(4) Environmentally sound and relatively easy to implement; or no adverse impact on environment'}
                                        onChange={this.handleChange}/>
                                    (4) Environmentally sound and relatively easy to implement; or no adverse impact on environment
                                </label>
                            </div>

                            <div className='form-check'>
                                <label className='form-check-label'>
                                    <input
                                        checked={['(3) Environmentally acceptable and not anticipated to be difficult to implement']
                                            .includes(this.state.priority_scoring_environmental_benefit)}
                                        id='priority_scoring_environmental_benefit'
                                        className="form-check-input"
                                        type="radio"
                                        value={'(3) Environmentally acceptable and not anticipated to be difficult to implement'}
                                        onChange={this.handleChange}/>
                                    (3) Environmentally acceptable and not anticipated to be difficult to implement
                                </label>
                            </div>

                            <div className='form-check'>
                                <label className='form-check-label'>
                                    <input
                                        checked={['(2) Environmental concerns and somewhat difficult to implement because of complex requirements']
                                            .includes(this.state.priority_scoring_environmental_benefit)}
                                        id='priority_scoring_environmental_benefit'
                                        className="form-check-input"
                                        type="radio"
                                        value={'(2) Environmental concerns and somewhat difficult to implement because of complex requirements'}
                                        onChange={this.handleChange}/>
                                    (2) Environmental concerns and somewhat difficult to implement because of complex requirements
                                </label>
                            </div>

                            <div className='form-check'>
                                <label className='form-check-label'>
                                    <input
                                        checked={['(1) Difficult to implement because of significantly complex requirements and environmental permitting']
                                            .includes(this.state.priority_scoring_environmental_benefit)}
                                        id='priority_scoring_environmental_benefit'
                                        className="form-check-input"
                                        type="radio"
                                        value={'(1) Difficult to implement because of significantly complex requirements and environmental permitting'}
                                        onChange={this.handleChange}/>
                                    (1) Difficult to implement because of significantly complex requirements and environmental permitting
                                </label>
                            </div>

                            <div className='form-check'>
                                <label className='form-check-label'>
                                    <input
                                        checked={['(0) Very difficult to implement due to extremely complex requirements and environmental permitting problems']
                                            .includes(this.state.priority_scoring_environmental_benefit)}
                                        id='priority_scoring_environmental_benefit'
                                        className="form-check-input"
                                        type="radio"
                                        value={'(0) Very difficult to implement due to extremely complex requirements and environmental permitting problems'}
                                        onChange={this.handleChange}/>
                                    (0) Very difficult to implement due to extremely complex requirements and environmental permitting problems
                                </label>
                            </div>
                        </div>
                        <div className='col-sm-1'>
                            <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'Priority Information is Only Applicable to New Actions.'}
                                        id={'priority_scoring_environmental_benefit'}/>
                                </span>
                        </div>
                    </div>

                    <div className='row'>
                        <label htmlFor className='col-sm-6'>Priority Scoring: Technical
                            Feasibility</label>
                        <div className='col-sm-5'>
                            <div className='form-check'>
                                <label className='form-check-label'>
                                    <input
                                        checked={['(4) Proven to be technically feasible']
                                            .includes(this.state.priority_scoring_technical_feasibility)}
                                        id='priority_scoring_technical_feasibility'
                                        className="form-check-input"
                                        type="radio"
                                        value={'(4) Proven to be technically feasible'}
                                        onChange={this.handleChange}/>
                                    (4) Proven to be technically feasible
                                </label>
                            </div>

                            <div className='form-check'>
                                <label className='form-check-label'>
                                    <input
                                        checked={['(2) Expected to be technically feasible']
                                            .includes(this.state.priority_scoring_technical_feasibility)}
                                        id='priority_scoring_technical_feasibility'
                                        className="form-check-input"
                                        type="radio"
                                        value={'(2) Expected to be technically feasible'}
                                        onChange={this.handleChange}/>
                                    (2) Expected to be technically feasible
                                </label>
                            </div>

                            <div className='form-check'>
                                <label className='form-check-label'>
                                    <input
                                        checked={['(0) Technical feasibility unknown or additional information needed']
                                            .includes(this.state.priority_scoring_technical_feasibility)}
                                        id='priority_scoring_technical_feasibility'
                                        className="form-check-input"
                                        type="radio"
                                        value={'(0) Technical feasibility unknown or additional information needed'}
                                        onChange={this.handleChange}/>
                                    (0) Technical feasibility unknown or additional information needed
                                </label>
                            </div>
                        </div>

                        <div className='col-sm-1'>
                            <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'Priority Information is Only Applicable to New Actions.'}
                                        id={'priority_scoring_technical_feasibility'}/>
                                </span>
                        </div>
                    </div>

                    <div className='row'>
                        <label htmlFor className='col-sm-6'>Priority Scoring: Timeframe of
                            Implementation</label>
                        <div className='col-sm-5'>
                            <div className='form-check'>
                                <label className='form-check-label'>
                                    <input
                                        checked={['(4) 1 year or less (Short Term)']
                                            .includes(this.state.priority_scoring_timeframe_of_implementation)}
                                        id='priority_scoring_timeframe_of_implementation'
                                        className="form-check-input"
                                        type="radio"
                                        value={'(4) 1 year or less (Short Term)'}
                                        onChange={this.handleChange}/>
                                    (4) 1 year or less (Short Term)
                                </label>
                            </div>

                            <div className='form-check'>
                                <label className='form-check-label'>
                                    <input
                                        checked={['(2) 2 – 5 years (Long-Term)']
                                            .includes(this.state.priority_scoring_timeframe_of_implementation)}
                                        id='priority_scoring_timeframe_of_implementation'
                                        className="form-check-input"
                                        type="radio"
                                        value={'(2) 2 – 5 years (Long-Term)'}
                                        onChange={this.handleChange}/>
                                    (2) 2 – 5 years (Long-Term)
                                </label>
                            </div>

                            <div className='form-check'>
                                <label className='form-check-label'>
                                    <input
                                        checked={['(0) More than 5 years (Long-Term)']
                                            .includes(this.state.priority_scoring_timeframe_of_implementation)}
                                        id='priority_scoring_timeframe_of_implementation'
                                        className="form-check-input"
                                        type="radio"
                                        value={'(0) More than 5 years (Long-Term)'}
                                        onChange={this.handleChange}/>
                                    (0) More than 5 years (Long-Term)
                                </label>
                            </div>
                        </div>

                        <div className='col-sm-1'>
                            <span style={{float:'right'}}>
                                    <PromptModal
                                        prompt={'Priority Information is Only Applicable to New Actions.'}
                                        id={'priority_scoring_timeframe_of_implementation'}/>
                                </span>
                        </div>
                    </div>
                </div>

            )
        };

        if (this.state.new_or_update === 'new') wizardSteps.splice(8,0, hiddenStep9);

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

