import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get"
import Element from 'components/light-admin/containers/Element'
import {falcorGraph} from "store/falcorGraph";
import { Link } from "react-router-dom"
import {sendSystemMessage} from 'store/modules/messages';
import pick from "lodash.pick";


const ATTRIBUTES = [
    //"id"
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
]

class ActionsIndex extends React.Component {

    constructor(props){
        super(props)

        this.actionViewData = this.actionViewData.bind(this)

    }

    fetchFalcorDeps() {

        return falcorGraph.get(['actions','project','byId', [this.props.match.params.projectId], ATTRIBUTES])
            .then(response => {
                return response
            })
    }

    actionViewData(){
        let table_data = [];
        let data = [];
        if(this.props.actionViewData[this.props.match.params.projectId] !== undefined){
            let graph = this.props.actionViewData[this.props.match.params.projectId];
            data.push(pick(graph,...ATTRIBUTES));
            data.forEach(item =>{
                Object.keys(item).forEach(i =>{
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
                                                <td>{data.value}</td>
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
        return(
            <div>
                {this.actionViewData()}
            </div>

        )

    }
}

const mapStateToProps = state => ({
    isAuthenticated: !!state.user.authed,
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
            { name: 'Actions', path: '/actions/project/' },
            { param: 'projectId', path: '/actions/project/view/' }
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps,mapDispatchToProps)(ActionsIndex)
    }
]
