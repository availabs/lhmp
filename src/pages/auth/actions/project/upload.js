import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import Element from 'components/light-admin/containers/Element'
import {sendSystemMessage} from 'store/modules/messages';
import ReactFileReader from 'react-file-reader'
const csv = require('csv-parser')
const fs = require('fs')

const ATTRIBUTES = [
    //"id"
    "action_name",//0
    "action_number",//1
    "action_type",//2
    "description_of_problem_being_mitigated", //3
    "action_description", //4
    "associated_hazards", //5
    "metric_for_measurement", //6
    "name_of_associated_hazard_mitigation_plan", //7
    "date_of_lhmp_plan_approval", // date 8
    "action_county",//9
    "action_jurisdiction",//10
    "action_location",//11
    "action_located_in_special_flood_hazard_area", // bool 12
    "action_located_in_hazard_zone", // bool 13
    "recent_damages_incurred_at_action_locations", // num 14
    "action_point_of_contact",//15
    "poc_title",//16
    "contact_department_agency_or_organization",//17
    "lead_department_agency_or_organization",//18
    "action_partners",//19
    "alternative_action_1",//20
    "alternative_action_2",//21
    "no_alternative",//22
    "estimated_timeframe_for_action_implementation",//23
    "status",//24
    "is_pnp", // bool 25
    "action_associated_with_critical_facility", // bool 26
    "structure_type",//27
    "level_of_protection",//28
    "useful_life", // num 29
    "local_planning_mechanisms_in_implementation", // [] 30
    "project_milestones",//31
    "estimated_cost_range",//32
    "calculated_cost", // num 33
    "population_served",//34
    "estimated_benefit_future_losses_avoided",//35
    "phased_action", // bool 36
    "engineering_required", // bool 37
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
    "plan_maintenance_date_of_status_report", // date
    "plan_maintenance_progress_report",
    "plan_maintenance_update_evaluation_of_problem_solution"
]

class ActionsUploadIndex extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            data : []
        }
        this.confirmUpload = this.confirmUpload.bind(this)
        this.handleFiles = this.handleFiles.bind(this)
        this.validateBool = this.validateBool.bind(this)
        this.handleArray = this.handleArray.bind(this)

    }

    confirmUpload() {
        console.log('confirm', this.state.data)
        let a = this.state.data.reduce( (previousPromise, nextID) => {
                return previousPromise.then(() => {
                    return this.props.falcor.call(
                        ['actions', 'project', 'insert'], nextID, [], []
                    );
                });
            }, Promise.resolve());
       a.then(response => {
                this.props.sendSystemMessage(`Action project was successfully created.`, {type: "success"});
            })
    }
    validateBool(value){
        console.log('BoolCheck', value, value.toLowerCase().includes('yes') || value.toLowerCase().includes('true') ? 'TRUE' :
            value.toLowerCase().includes('no') || value.toLowerCase().includes('false') ? 'FALSE' : null)
        return value.toLowerCase().includes('yes') || value.toLowerCase().includes('true') ? 'TRUE' :
            value.toLowerCase().includes('no') || value.toLowerCase().includes('false') ? 'FALSE' : null
    }
    handleArray(value){
        //return typeof value === 'object' ?'{' + value.join(',') + '}' : value;
        return typeof value === 'object' ? '{' + value.join(',') + '}' : '{' + value + '}';
    }
    handleFiles() {
        let reader = new FileReader();
        let fileArray = [];
        const selectedFile = document.getElementById('csvFile').files;
        reader.onload = (e) => {
            console.log('reader.result', reader.result)
            let res = reader.result;
            res = res.split('\t')
            let j = 0;
            for (let i = 0 ; i < res.length/ATTRIBUTES.length; i++){
                console.log('loop', i, j, j+ATTRIBUTES.length);
                let row = res.slice(j,j+ATTRIBUTES.length);
                row[8] = null;
                row[9] = this.props.user.activePlan;
                row[12] = this.validateBool(row[12]);
                row[13] = this.validateBool(row[13]);
                row[14] = null;
                row[25] = this.validateBool(row[25]);
                row[26] = this.validateBool(row[26]);
                row[29] = null;
                row[30] = this.handleArray(row[30]);
                row[33] = null;
                row[36] = this.validateBool(row[36]);
                row[37] = this.validateBool(row[37]);
                row[54] = null;

                fileArray.push(row);
                j += (ATTRIBUTES.length - 1)
            }
            this.setState({'data': fileArray})
            return fileArray;
        }
        console.log('content', fileArray)

        reader.readAsText(selectedFile[0]);
    }

    render() {
        return(
            <div className='container'>
                <Element>
                    <h6 className="element-header">Upload Action project 1</h6>
                    {this.state.data.length > 0 ? (
                        <div>
                            <div className='col-sm-12' style={{'overflow': 'auto', 'maxHeight': '70vh', 'max-width': '80vw', 'display': 'block'}}>
                                <table className='table table lightBorder'>
                                    <thead>
                                    <tr>
                                        {ATTRIBUTES.map(f => <th style={{minWidth: '100%', position: 'sticky', top: '0', backgroundColor: '#CCC'}}> {f.split('_').join(' ')} </th>)}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.data.map( row =>
                                        <tr> {row.map(cell => <td> {cell} </td>)} </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                            <div>
                                <button className="btn btn-primary step-trigger-btn" style={{height: '100%', position: 'sticky',
                                    float:'right', bottom:'10%', 'z-index': '100'}} onClick={this.confirmUpload}> Confirm Upload </button>
                            </div>
                        </div>
                    ) : <div>
                        <div className='table-responsive'>
                            <h8>Upload format: </h8>
                            <div className='col-sm-12' style={{'overflow': 'auto', 'maxHeight': '90vh', 'max-width': '80vw'}}>
                                <table className='table table lightBorder'>
                                    <thead>
                                    <tr>
                                        {ATTRIBUTES.map(f => <th style={{minWidth: '100%'}}> {f.split('_').join(' ')} </th>)}
                                    </tr>
                                    </thead>
                                </table>
                            </div>
                        </div>
                        <div className='row'>
                            <div className="col-sm-6">
                                <input type='file' id='csvFile'/>
                                <button className="btn btn-primary step-trigger-btn" style={{height: '100%'}} onClick={this.handleFiles}> Upload </button>
                            </div>
                        </div>
                    </div>
                    }
                </Element>
            </div>
        )

    }
}

const mapStateToProps = state => ({
    isAuthenticated: !!state.user.authed,
    attempts: state.user.attempts, // so componentWillReceiveProps will get called.
});

const mapDispatchToProps = {
    sendSystemMessage
};

export default [
    {
        path: '/actionsOld/project/upload/',
        exact: true,
        name: 'ActionsUpload',
        auth: true,
        mainNav: false,
        breadcrumbs: [
            { name: 'Actions Upload', path: '/actionsOld/project/' },
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(ActionsUploadIndex))
    }
]