import React from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import {falcorGraph} from "store/falcorGraph";
import {Link} from "react-router-dom"
import {sendSystemMessage} from 'store/modules/messages';
import pick from "lodash.pick"

const ATTRIBUTES = [
    "id",
    "action_name",
    "action_number",
    "action_type",
    "description_of_problem_being_mitigated",
    "action_description",
    "associated_hazards",
    "metric_for_measurement",
    "name_of_associated_hazard_mitigation_plan",
    "date_of_lhmp_plan_approval",
    "action_county",
    "action_jurisdiction",
    "action_location",
    "action_located_in_special_flood_hazard_area",
    "action_located_in_hazard_zone",
    "recent_damages_incurred_at_action_locations",
    "action_point_of_contact",
    "poc_title",
    "contact_department_agency_or_organization",
    "lead_department_agency_or_organization",
    "action_partners",
    "alternative_action_1",
    "alternative_action_2",
    "no_alternative",
    "estimated_timeframe_for_action_implementation",
    "status",
    "is_pnp",
    "action_associated_with_critical_facility",
    "structure_type",
    "level_of_protection",
    "useful_life",
    "local_planning_mechanisms_in_implementation", // []
    "project_milestones",
    "estimated_cost_range",
    "calculated_cost",
    "population_served",
    "estimated_benefit_future_losses_avoided",
    "phased_action",
    "engineering_required",
    "bca",
    "primary_or_potential_funding_sources_type",
    "primary_or_potential_funding_sources_name",
    "secondary_funding_source_type",
    "secondary_funding_source_name",
    "funding_received_to_date",
    "associated_mitigation_capability",
    "associated_goals_objectives",
    "prioritization",
    "priority_scoring",
    "priority_scoring_funding_availability",
    "priority_scoring_probability_of_matching_funds",
    "priority_scoring_benefit_cost_review",
    "priority_scoring_environmental_benefit",
    "priority_scoring_technical_feasibility",
    "priority_scoring_timeframe_of_implementation",
    "plan_maintenance_date_of_status_report",
    "plan_maintenance_progress_report",
    "plan_maintenance_update_evaluation_of_problem_solution"
];

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
                ['actions', [this.props.activePlan], 'project', 'byIndex', {from: 0, to: length - 1}, ATTRIBUTES]))
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
        let attributes = ATTRIBUTES.slice(0, 4);
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
                                                            <td>{d.value}</td>
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