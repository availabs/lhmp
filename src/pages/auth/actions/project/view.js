import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get"
import Element from 'components/light-admin/containers/Element'
import {falcorGraph} from "store/falcorGraph";
import { Link } from "react-router-dom"
import {sendSystemMessage} from 'store/modules/messages';
import pick from "lodash.pick";

let countyName = '';
const ATTRIBUTES = [
    //"id",
    // step 1
    "action_point_of_contact", // select from dropdown or add new contact - opens contact entry form

    // step 2
    "action_name",
    "action_category",
    "action_type", // dropdown
    "action_number",
    "description_of_problem_being_mitigated",
    "action_description",
    "associated_hazards", // dropdown
    "metric_for_measurement",
    "action_url",

    // step 3
    "new_or_update", // change to null
    "status", // dropdown: Ongoing, discontinued, completed, in-progress
    "status_justification",
    "plan_maintenance_update_evaluation_of_problem_solution",
    "phased_action", // bool
    "name_of_associated_hazard_mitigation_plan",

    // step 4
    "action_county",
    "action_jurisdiction", // selected from dropdown (includes municipalities and county)
    "action_location",
    "location_points", // add to db
    "site_photographs", // upload
    "property_names_or_hist_dist", // add to db

    // step 5
    "estimated_cost_range", // drop down: range 0-50, 50-100, 100-1,000, 1,000+, Jurisdictional
    "calculated_cost",
    "primary_or_potential_funding_sources_name", // dropdown
    "secondary_funding_source_name", // dropdown
    "funding_received_to_date",

    // step 6
    "bca", // upload?
    "bca_to_bcr", // need to be added to db?
    "bcr", // upload
    "level_of_protection",
    "recurrence_interval", // add to db
    "useful_life",
    "estimated_timeframe_for_action_implementation",
    "exact_timeframe_for_action_implementation", // add to db

    // step 7
    "associated_mitigation_capability",

    // step 8
    "boolalternative",
    "alternative_action_1",
    "alternative_action_1_evaluation",
    "alternative_action_2",
    "alternative_action_2_evaluation",

    // step 9
    "priority_scoring_probability_of_acceptance_by_population",
    "priority_scoring_funding_availability",
    "priority_scoring_probability_of_matching_funds",
    "priority_scoring_benefit_cost_review",
    "priority_scoring_environmental_benefit",
    "priority_scoring_technical_feasibility",
    "priority_scoring_timeframe_of_implementation",

    // step 10
    "relates_to_protects_critical_facility_infrastructure",
    "relates_to_protects_community_lifeline_by_fema",
    "is_pnp", // bool
    "is_state_agency",
    "is_community_member_of_crs",
    "is_community_member_of_good_standing_with_nfip",
    "is_community_participate_in_climate_smart_communities",
    "is_community_have_local_adopted_hmp",
    "is_community_have_comprehensive_plan",
    "is_community_have_land_use_zoning",
    "is_community_have_subdivision_ordinances",
    "is_community_have_building_codes",
    "engineering_required", // bool
    "is_final_engineering_design_completes", // bool
    "is_mitigation", // bool
    "is_preparedness", // bool
    "is_response", // bool
    "is_recovery", // bool
    "is_climate_adaptation", // bool
    "is_proposed_project_located_in_sfha", // bool
    "is_project_structure_located_in_sfha", // bool
    "is_protects_repetitive_loss_property", // bool
    "is_protects_severe_repetitive_loss_property", // bool
    "known_environmental_historic_preservation_protected_species_iss", // bool
    "ground_distributed_other_than_agriculture", // bool
    "indian_or_historic_artifacts_found_on_or_adjacent_project_area", // bool
    "building_50_years_or_older_within_or_near", // bool
    "is_shpo_survey", // bool
    "shpo_survey", // upload

    // step 11
    "climate_smart_communities_action_type",

    // step 12
    "plan_maintenance_date_of_status_report", // date
    "plan_maintenance_progress_report"

]
let roleData = [];

class ActionsIndex extends React.Component {

    constructor(props){
        super(props)

        this.actionViewData = this.actionViewData.bind(this)

    }

    fetchFalcorDeps() {

        return falcorGraph.get(
            ['actions','project','byId', [this.props.match.params.projectId], ATTRIBUTES],
            ['geo', [this.props.geoid], ['name']]
        ).then(d => {
            if (falcorGraph.getCache().geo &&
                falcorGraph.getCache().geo[this.props.geoid] &&
                falcorGraph.getCache().geo[this.props.geoid]['name']){
                countyName = falcorGraph.getCache().geo[this.props.geoid]['name']
            }
        })
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
                                                if (falcorGraph.getCache().roles.byId[roleId].associated_plan.value && this.props.activePlan &&
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
    componentDidMount() {
        this.getRolesData()
    }

    actionViewData(){
        let table_data = [];
        let data = [];
        if(this.props.actionViewData[this.props.match.params.projectId] !== undefined){
            let graph = this.props.actionViewData[this.props.match.params.projectId];
            data.push(pick(graph,...ATTRIBUTES));
            data.forEach(item =>{
                Object.keys(item).forEach(i =>{
                    if (item[i].value){
                        if (item[i].value.toString() === 'false'){
                            table_data.push({
                                attribute: i,
                                value: 'no'
                            })
                        }
                        else if(item[i].value.toString() === 'true'){
                            table_data.push({
                                attribute : i,
                                value : 'yes'
                            })
                        }else{
                            table_data.push({
                                attribute : i,
                                value: item[i].value
                            })
                        }
                    }else{
                        table_data.push({
                            attribute : i,
                            value: item[i].value
                        })
                    }

                })
            })
        }
        return (
            <div className='container'>
                <Element>
                    <h6 className="element-header">Actions project</h6>
                    <div className="element-box">
                        <div className="table-responsive" >
                            <table className="table table lightBorder">
                                <thead>
                                <tr>
                                    <th>ATTRIBUTE</th>
                                    <th>VALUE</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    table_data.map(data =>{
                                        return(
                                            <tr>
                                                <td>{data.attribute}</td>
                                                <td>{
                                                    typeof data.value === 'object' && data.value !== null ?
                                                        data.attribute === 'action_point_of_contact' ?
                                                            data.value.map(d => {
                                                                if(roleData.length>0){
                                                                    let tmpFilter = roleData.filter(role => role.id.value.toString() === d.toString())
                                                                    return tmpFilter.length > 0 &&
                                                                    tmpFilter[0] &&
                                                                    tmpFilter[0].contact_name &&
                                                                    tmpFilter[0].contact_name.value ? tmpFilter[0].contact_name.value : d
                                                                }
                                                            }).join(',') :
                                                        data.value.join(',') :
                                                        data.attribute === 'action_county' ?
                                                            countyName :
                                                            data.value
                                                }</td>
                                            </tr>
                                        )
                                    })

                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Element>
            </div>

        )
    }

    render() {
        console.log('role data', roleData)
        return(
            <div>
                {this.actionViewData()}
            </div>

        )

    }
}

const mapStateToProps = state => ({
    isAuthenticated: !!state.user.authed,
    activePlan: state.user.activePlan,
    geoid: state.user.activeGeoid,
    attempts: state.user.attempts, // so componentWillReceiveProps will get called.
    actionViewData : get(state.graph,'actions.project.byId',{})
});

const mapDispatchToProps = {
    sendSystemMessage
};

export default [
    {
        path: '/actions/project/view/:projectId',
        exact: true,
        name: 'Actions',
        auth: true,
        mainNav: false,
        breadcrumbs: [
            { name: 'Actions', path: '/actions/' },
            { param: 'projectId', path: '/actions/project/view/' }
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(ActionsIndex))
    }
]
