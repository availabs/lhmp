import React from 'react'
import Wizard from 'components/light-admin/wizard'

class HomeView extends React.Component {

    constructor (props) {
        super(props)
        this.state = {
            project_name: '',
            project_number: '',
            hazard_of_concern: '',
            problem_description: '',
            solution_description: '',
            critical_facility: '',
            protection_level: '',
            useful_life: '',
            estimated_cost: '',
            estimated_benefits: '',
            priority: '',
            estimated_implementation_time: '',
            organization_responsible: '',
            desired_implementation_time: '',
            funding_source: '',
            planning_mechanism: '',
            alternative_action_1: '',
            alternative_estimated_cost_1: '',
            alternative_evaluation_1: '',
            alternative_action_2: '',
            alternative_estimated_cost_2: '',
            alternative_evaluation_2: '',
            alternative_action_3: '',
            alternative_estimated_cost_3: '',
            alternative_evaluation_3: '',
            date_of_report: '',
            progress_report: '',
            updated_evaluation: ''
        }
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(e) {
        console.log(e.target.id,e.target.value,this.state)
        this.setState({ ...this.state, [e.target.id]: e.target.value });
    };

    changeRadio = (id) => {
        console.log(id,this.state)
        this.setState({critical_facility: id});
    }

    render () {
        const wizardSteps = [
            {
                title: "Step 1",
                content: (<div className="row">
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor> Project Name</label>
                            <input id='project_name' onChange={this.handleChange} className="form-control" placeholder="Project Name" type="text" value={this.state.project_name} /></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Project Number</label>
                        <input id='project_number' onChange={this.handleChange} className="form-control" placeholder="Project Number" type="text" value={this.state.project_number}/></div>
                    </div>
                </div>)
            },
            {
                title: "Step 2",
                content: (<div className="form-group">
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor> Hazard for concern</label>
                            <input id='hazard_of_concern' onChange={this.handleChange} className="form-control" placeholder="Hazard for concern" type="text" value={this.state.hazard_of_concern}/></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Description of the Problem</label>
                        <textarea id='problem_description' onChange={this.handleChange} className="form-control" placeholder="Description of the Problem" rows="4" spellCheck="false" value={this.state.problem_description}/></div>
                    </div>
                </div>)
            },
            {
                title: "Step 3",
                content: (<div className="form-group">
                <div className="col-sm-12">
                    <div className="form-group"><label htmlFor>Description of the Solution</label>
                    <textarea id='solution_description' onChange={this.handleChange} className="form-control" placeholder="Description of the Solution" rows="4" spellCheck="false" value={this.state.solution_description}/></div>
                </div>
                <div className="form-check"><label htmlFor> Is this project related to a Critical Facility?</label>{''} {''} {''} {''}
                    <input id='critical_facility' onChange={this.changeRadio.bind(this, 1)} type="radio" checked={this.state.critical_facility === 1}/>Yes {''} {''}
                    <input id='critical_facility' onChange={this.changeRadio.bind(this, 0)} type="radio" checked={this.state.critical_facility === 0}/>No
                    <label htmlFor style={{fontSize: '11px',fontStyle: 'italic'}}>(If yes, this project must intend to protect the Critical Facility to the 500-year flood event or the actual worst damage scenario, whichever is greater.)</label>
                    <div className="form-group"><label htmlFor>Level of Protection </label>
                        <input id='protection_level' onChange={this.handleChange} className="form-control" placeholder="Level of Protection" type="text" value={this.state.protection_level}/>
                    </div>
                    <div className="form-group"><label htmlFor>Useful for Life </label>
                        <input id='useful_life' onChange={this.handleChange} className="form-control" placeholder="Useful for Life" type="text" value={this.state.useful_life}/>
                    </div>
                    <div className="form-group"><label htmlFor>Estimated cost </label>
                        <input id='estimated_cost' onChange={this.handleChange} className="form-control" placeholder="Estimated cost" type="text" value={this.state.estimated_cost}/>
                    </div>
                    <div className="form-group"><label htmlFor>Estimated benefits(losses avoided)</label>
                        <textarea id='estimated_benefits' onChange={this.handleChange} className="form-control" placeholder="Estimated benefits" rows="4" spellCheck="false" value={this.state.estimated_benefits}/>
                    </div>
                </div>
            </div>)
            },
            {
                title: "Step 4",
                content: (<div className="form-group">
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Prioritization </label>
                            <input id='priority' onChange={this.handleChange} className="form-control" placeholder="Prioritization" type="text" value={this.state.priority}/>
                        </div>
                        <div className="form-group"><label htmlFor>Estimated Time Required for Project Implementation </label>
                            <input id='estimated_implementation_time' onChange={this.handleChange} className="form-control" placeholder="Estimated Time Required for Project Implementation" type="text" value={this.state.estimated_implementation_time}/>
                        </div>
                        <div className="form-group"><label htmlFor>Responsible Organization </label>
                            <input id='organization_responsible' onChange={this.handleChange} className="form-control" placeholder="Responsible organization" type="text" value={this.state.organization_responsible}/>
                        </div>
                        <div className="form-group"><label htmlFor>Desired Timeframe for Implementation</label>
                            <input id='desired_implementation_time' onChange={this.handleChange} className="form-control" placeholder="Desired Timeframe for Implementation" type="text" value={this.state.desired_implementation_time}/>
                        </div>
                        <div className="form-group"><label htmlFor>Potential funding sources</label>
                            <input id='funding_source' onChange={this.handleChange} className="form-control" placeholder="Potential funding sources" type="text" value={this.state.funding_source}/>
                        </div>
                        <div className="form-group"><label htmlFor>Local Planning Mechanisms to be Used in Implementation, if any</label>
                            <input id='planning_mechanism' onChange={this.handleChange} className="form-control" placeholder="Local Planning Mechanisms to be Used in Implementation, if any" type="text" value={this.state.planning_mechanism}/>
                        </div>
                    </div>
                </div>)
            },
            {
                title: "Step 5",
                content: (<div className="form-group">
                    <div className="col-sm-12">
                        <div className="form-group">
                            <strong htmlFor style={{fontSize: '18px'}}>Alternatives </strong><br/>
                            <div className="form-group"><label htmlFor>Action</label>
                                <input id='alternative_action_1' onChange={this.handleChange} className="form-control" placeholder="Action" type="text" value={this.state.alternative_action_1}/>
                            </div>
                            <div className="form-group"><label htmlFor>Estimated Cost</label>
                                <input id='alternative_estimated_cost_1' onChange={this.handleChange} className="form-control" placeholder="Estimated cost" type="text" value={this.state.alternative_estimated_cost_1}/>
                            </div>
                            <div className="form-group"><label htmlFor>Evaluation</label>
                                <textarea id='alternative_evaluation_1' onChange={this.handleChange} className="form-control" placeholder="Evaluation" rows="4" spellCheck="false" value={this.state.alternative_evaluation_1}/>
                            </div>
                            <strong htmlFor style={{fontSize: '18px'}}>Alternatives </strong><br/>
                            <div className="form-group"><label htmlFor>Action</label>
                                <input id='alternative_action_2' onChange={this.handleChange} className="form-control" placeholder="Action" type="text" value={this.state.alternative_action_2}/>
                            </div>
                            <div className="form-group"><label htmlFor>Estimated Cost</label>
                                <input id='alternative_estimated_cost_2' onChange={this.handleChange} className="form-control" placeholder="Estimated cost" type="text" value={this.state.alternative_estimated_cost_2}/>
                            </div>
                            <div className="form-group"><label htmlFor>Evaluation</label>
                                <textarea id='alternative_evaluation_2' onChange={this.handleChange} className="form-control" placeholder="Evaluation" rows="4" spellCheck="false" value={this.state.alternative_evaluation_2}/>
                            </div>
                            <strong htmlFor style={{fontSize: '18px'}}>Alternatives </strong><br/>
                            <div className="form-group"><label htmlFor>Action</label>
                                <input id='alternative_action_3' onChange={this.handleChange} className="form-control" placeholder="Action" type="text" value={this.state.alternative_action_3}/>
                            </div>
                            <div className="form-group"><label htmlFor>Estimated Cost</label>
                                <input id='alternative_estimated_cost_3' onChange={this.handleChange} className="form-control" placeholder="Estimated cost" type="text" value={this.state.alternative_estimated_cost_3}/>
                            </div>
                            <div className="form-group"><label htmlFor>Evaluation</label>
                                <textarea id='alternative_evaluation_3' onChange={this.handleChange} className="form-control" placeholder="Evaluation" rows="4" spellCheck="false" value={this.state.alternative_evaluation_3}/>
                            </div>
                        </div>
                    </div>
                </div>)
            },
            {
                title: "Step 6",
                content: (<div className="form-group">
                    <div className="col-sm-12">
                        <div className="form-group">
                            <div className="form-group"><label htmlFor>Date of Status Report</label>
                                <input id='date_of_report' onChange={this.handleChange} className="form-control" placeholder="" type="date" value={this.state.date_of_report}/>
                            </div>
                            <div className="form-group"><label htmlFor>Report of Progress</label>
                                <textarea id='progress_report' onChange={this.handleChange} className="form-control" placeholder="Report of Progress" rows="4" spellCheck="false" value={this.state.progress_report}/>
                            </div>
                            <div className="form-group"><label htmlFor>Update Evaluation of the Problem and/or Solution</label>
                                <textarea id='updated_evaluation' onChange={this.handleChange} className="form-control" placeholder="Update Evaluation of the Problem and/or Solution" rows="4" spellCheck="false" value={this.state.updated_evaluation}/>
                            </div>
                        </div>
                    </div>
                </div>)
            }
        ]

        return (
            <div className='container'>
                <Wizard steps={wizardSteps}/>
            </div>
        )
    }
}

export default {
    icon: 'os-icon-home',
    path: '/test',
    exact: true,
    mainNav: true,
    menuSettings: {
        image: 'none',
        scheme: 'color-scheme-dark',
        position: 'menu-position-left',
        layout: 'menu-layout-compact',
        style: 'color-style-default'
    },
    name: 'Home',
    auth: true,
    component: HomeView
};

