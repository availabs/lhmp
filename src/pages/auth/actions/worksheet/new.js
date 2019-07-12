import React from 'react';
import Wizard from 'components/light-admin/wizard'
import { falcorGraph } from "store/falcorGraph"
import {sendSystemMessage} from 'store/modules/messages';
import {connect} from "react-redux";
import Element from 'components/light-admin/containers/Element'
import get from "lodash.get";

const counties = ["36101","36003","36091","36075","36111","36097","36089","36031","36103","36041","36027","36077",
    "36109","36001","36011","36039","36043","36113","36045","36019","36059","36053","36115","36119","36049","36069",
    "36023","36085","36029","36079","36057","36105","36073","36065","36009","36123","36107","36055","36095","36007",
    "36083","36099","36081","36037","36117","36063","36047","36015","36121","36061","36021","36013","36033","36017",
    "36067","36035","36087","36051","36025","36071","36093","36005"]
class HomeView extends React.Component {

    constructor (props) {
        super(props)

        this.state = {
            project_name: '',
            project_number: '',
            county:'',
            cousub:'',
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
            updated_evaluation: '',
        }


        this.handleChange = this.handleChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }


    componentDidMount(){
        if(this.props.match.params.worksheetId) {
            falcorGraph.get(['actions','worksheet','byId',[this.props.match.params.worksheetId],Object.keys(this.state)])
                .then(response =>{
                    console.log('response',response)
                    Object.keys(this.state).forEach((key,i)=>{
                        let tmp_state = {};
                        tmp_state[key] = response.json.actions.worksheet.byId[this.props.match.params.worksheetId][key];
                        this.setState(
                            tmp_state
                        )
                    });

                })
        }

    }

    fetchFalcorDeps(){

        return falcorGraph.get(['geo',counties,['name']]).then(response => console.log('response',response))
    }



    listCousubDropdown(event){
        //console.log('check',event.target.value)
        let county = event.target.value
        return falcorGraph.get(['geo',[county],'cousubs'])
            .then(response => {
                 return response
            });


    }
    handleChange(e) {
        console.log('---',e.target.id,e.target.value,this.state)
        this.setState({ ...this.state, [e.target.id]: e.target.value });
    };

    changeRadio = (id) => {
        console.log(id,this.state)
        this.setState({critical_facility: id});
    }

    onSubmit(event){
        event.preventDefault();
        let args = []
        if(!this.props.match.params.worksheetId){
            Object.values(this.state).forEach(function(step_content){
                args.push(step_content)
            })
            return falcorGraph.call(['actions', 'worksheet', 'insert'], args, [], [])
                .then(response => {
                    this.props.sendSystemMessage(`Action worksheet was successfully created.`, {type: "success"});
                })
        }else {

            let attributes = Object.keys(this.state)
            let updated_data ={}
            let data = {}
            Object.values(this.state).forEach(function(step_content){
                args.push(step_content)
            })
            Object.keys(this.state).forEach((d, i) => {
                if (this.state[d] !== '') {
                    console.log(data[d], d)
                    updated_data[d] = this.state[d]
                }
            })
            return falcorGraph.set({
                paths: [
                    ['actions', 'worksheet', 'byId', [this.props.match.params.worksheetId], attributes]
                ],
                jsonGraph: {
                    actions: {
                        worksheet: {
                            byId: {
                                [this.props.match.params.worksheetId]: updated_data
                            }
                        }
                    }
                }
            })
                .then(response => {

                    this.props.sendSystemMessage(`Action worksheet was successfully edited.`, {type: "success"});
                })
        }

    }

    render () {
        let cousubsArray = []
        console.log('props',this.props.countyNames)
        if(this.props.cousubs !== undefined && this.state.county !== undefined) {

            Object.values(this.props.cousubs).forEach(item => {
                item.cousubs.value.forEach(cousub => {
                    cousubsArray.push(cousub)
                    }
                )
            })
        }
        const wizardSteps = [
            {
                title: (<span>
                    <span style={{fontSize:'0.7em'}}>Step 1</span>
                    <br /><span style={{fontSize:'0.9em'}}>Project Name</span></span>),
                content: (<div className="row">
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor> Project Name</label>
                            <input id='project_name' onChange={this.handleChange} className="form-control" placeholder="Project Name" type="text" value={this.state.project_name} /></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>Project Number</label>
                        <input id='project_number' onChange={this.handleChange} className="form-control" placeholder="Project Number" type="text" value={this.state.project_number}/></div>
                    </div>
                    <div className="col-sm-12">
                        <div className="form-group"><label htmlFor>County</label>
                            <select className="form-control justify-content-sm-end" id='county' onChange={this.handleChange} value={this.state.county} onClick={this.listCousubDropdown.bind(this)}>
                                {
                                    counties.map((county,i) =>{
                                    return(<option  className="form-control" key={i} value={county}>{county}</option>)
                                })
                                }
                            </select>
                        </div>
                    </div>
                    <div className="col-sm-12">
                        {cousubsArray.length ?
                            (
                                <div className="form-group"><label htmlFor>Municipality</label>
                                    <select className="form-control justify-content-sm-end" id='cousub' onChange={this.handleChange} value={this.state.cousub}>
                                        {
                                            cousubsArray.map((cousub,i) =>{
                                                if(cousub.slice(0,5) === this.state.county){
                                                    return(<option className="form-control" key={i} value={cousub}>{cousub}</option>)
                                                }

                                            })
                                        }
                                    </select>
                                </div>
                            ) :(
                                <div>

                                </div>
                            )
                        }
                    </div>

                </div>)
            },
            {
                title:(
                    <span>
                        <span style={{fontSize:'0.7em'}}>Step 2</span>
                        <br /><span style={{fontSize:'0.9em'}}>Hazard of Concern</span>
                    </span>
                ),
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
                title:(
                    <span>
                        <span style={{fontSize:'0.7em'}}>Step 3</span>
                        <br /><span style={{fontSize:'0.9em'}}>Describe Solution</span>
                    </span>
                ),
                content: (<div className="form-group">
                <div className="col-sm-12">
                    <div className="form-group"><label htmlFor>Description of the Solution</label>
                    <textarea id='solution_description' onChange={this.handleChange} className="form-control" placeholder="Description of the Solution" rows="4" spellCheck="false" value={this.state.solution_description}/></div>
                </div>
                <div className="form-check"><label htmlFor> Is this project related to a Critical Facility?</label>{''} {''} {''} {''}
                    <input id='critical_facility' onChange={this.changeRadio.bind(this, 'yes')} type="radio" checked={this.state.critical_facility === 'yes'}/>Yes {''} {''}
                    <input id='critical_facility' onChange={this.changeRadio.bind(this, 'no')} type="radio" checked={this.state.critical_facility === 'no'}/>No
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
                title:(
                    <span>
                        <span style={{fontSize:'0.7em'}}>Step 4</span>
                        <br /><span style={{fontSize:'0.9em'}}>Prioritization</span>
                    </span>
                ),
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
               title:(
                    <span>
                        <span style={{fontSize:'0.7em'}}>Step 5</span>
                        <br /><span style={{fontSize:'0.9em'}}>Alternatives</span>
                    </span>
                ),
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
                title:(
                    <span>
                        <span style={{fontSize:'0.7em'}}>Step 6</span>
                        <br /><span style={{fontSize:'0.9em'}}>Project Status</span>
                    </span>
                ),
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
                <Element>
                <h6 className="element-header">New Action Worksheet</h6>
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
        isAuthenticated: !!state.user.authed,
        attempts: state.user.attempts, // so componentWillReceiveProps will get called.
        cousubs: get(state.graph,'geo'),

    };
};

export default [
    {
    icon: 'os-icon',
    path: '/actions/worksheet/new',
    exact: true,
    mainNav: false,
    breadcrumbs: [
        { name: 'Actions', path: '/actions/' },
        { name: 'New Worksheet', path: '/actions/worksheet/new' }
    ],
    menuSettings: {
        image: 'none',
        scheme: 'color-scheme-light',
        position: 'menu-position-left',
        layout: 'menu-layout-compact',
        style: 'color-style-default'
    },
    name: 'Create Actions Worksheet',
    auth: true,
    component: connect(mapStateToProps,mapDispatchToProps)(HomeView)
    },
    {
        path: '/actions/worksheet/edit/:worksheetId',
        name: 'Edit Actions',
        mainNav: false,
        auth: true,
        exact: true,
        breadcrumbs: [
            { name: 'Actions', path: '/actions/' },
            { param: 'worksheetId', path: '/actions/worksheet/new/edit' }
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps,mapDispatchToProps)(HomeView)
    }

]

