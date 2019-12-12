import React from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import {falcorGraph} from "store/falcorGraph";
import {Link} from "react-router-dom"
import {sendSystemMessage} from 'store/modules/messages';
import pick from "lodash.pick"

export const ATTRIBUTES_PROJECT = [
    "id",

    // step 2
    "action_name",
    "action_number",
    "action_type", // dropdown
    "action_category",
    "description_of_problem_being_mitigated",
    "action_description",
    "associated_hazards", // dropdown
    "metric_for_measurement",
    "action_url",

    // step 1
    "action_point_of_contact", // select from dropdown or add new contact - opens contact entry form

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
    "plan_maintenance_progress_report",

    "plan_id"

]

class ActionsProjectIndex extends React.Component {

    constructor(props) {
        super(props);

        this.deleteproject = this.deleteproject.bind(this);
        this.actionTableData = this.actionTableData.bind(this);
    }

    fetchFalcorDeps() {
        let length = 0;
        return this.props.falcor.get(['actions', [this.props.activePlan], 'project', 'length'])
            .then(response => {
                Object.keys(response.json.actions).filter(d => d !== '$__path').forEach(planId => {
                    length = response.json.actions[planId].project.length;
                });
                return length
            }).then(length => this.props.falcor.get(
                ['actions', [this.props.activePlan], 'project', 'byIndex', {from: 0, to: length - 1}, ATTRIBUTES_PROJECT]))
            .then(response => {
                return response
            })


    }

    deleteproject(e) {
        e.persist();
        let projectId = e.target.id;
        this.props.sendSystemMessage(
            `Are you sure you want to delete this project id "${projectId}"?`,
            {
                onConfirm: () => falcorGraph.call(['actions', 'project', 'remove'], [projectId])
                    .then(() => this.fetchFalcorDeps()),
                id: `delete-content-${projectId}`,
                type: "danger",
                duration: 0
            }
        )

    }

    actionTableData() {
        let attributes = ATTRIBUTES_PROJECT.slice(0, 4);
        let data = [];
        Object.values(this.props.actions)
            .forEach(action => {
                data.push(Object.values(pick(action, ...attributes)))
            });

        return (
            <div className='container'>
                <Element>
                    <h4 className="element-header">Actions Project
                        <span style={{float: 'right'}}>
                            <Link
                                className="btn btn-sm btn-primary"
                                to={`/actions/project/new`}>
                                Create Action project
                            </Link>
                            {/*<Link
                                className="btn btn-sm btn-primary"
                                to={`/actions/project/upload`}>
                                Upload Action project
                            </Link>*/}
                    </span>
                    </h4>
                    <div className="element-box">
                        <div className="table-responsive">
                            <table className="table table lightBorder">
                                <thead>
                                <tr>
                                    {attributes.map(function (action) {
                                        return (
                                            <th>{action}</th>
                                        )
                                    })
                                    }
                                </tr>
                                </thead>
                                <tbody>
                                {data.map((item, i) => {
                                    if (item.length !== 0) {
                                        return (
                                            <tr>
                                                {
                                                    item.map((d) => {

                                                        return (
                                                            <td>{d ? d.value : d}</td>
                                                        )
                                                    })
                                                }
                                                <td>
                                                    <Link className="btn btn-sm btn-outline-primary"
                                                          to={`/actions/project/edit/${item[0].value}`}>
                                                        Edit
                                                    </Link>
                                                </td>
                                                <td>
                                                    <Link className="btn btn-sm btn-outline-primary"
                                                          to={`/actions/project/view/${item[0].value}`}>
                                                        View
                                                    </Link>
                                                </td>
                                                <td>
                                                    <button id={item[0].value} className="btn btn-sm btn-outline-danger"
                                                            onClick={this.deleteproject}>
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    }

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
        return (
            <div>{this.actionTableData()}</div>
        )
    }
}

const mapStateToProps = state => (
    {
        activePlan: state.user.activePlan,
        isAuthenticated: !!state.user.authed,
        attempts: state.user.attempts,
        actions: get(state.graph, 'actions.project.byId', {})// so componentWillReceiveProps will get called.
    });

const mapDispatchToProps = {
    sendSystemMessage
};

export default [
    {
        path: '/actions/project',
        exact: true,
        name: 'ActionsProject',
        auth: true,
        mainNav: false,
        icon: 'os-icon-pencil-2',
        breadcrumbs: [
            {name: 'Actions Project', path: '/actions/project'}
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(ActionsProjectIndex))
    }
]
/*

 */