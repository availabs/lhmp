import React from 'react';
import AvlFormsViewData from 'components/AvlForms/displayComponents/viewData';
import config from 'pages/auth/Roles/roles_forms/config.js'
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import {sendSystemMessage} from 'store/modules/messages';
import { fnum } from "utils/sheldusUtils"
import ControlLayers from 'pages/auth/ScenarioMap2/layers/controlLayers.js'
import ScenarioTable from "../components/scenariosTable";

const AllModes =[{id:'scenario',title:'Risk Scenarios'},{id:'zone',title:'Zones'},{id:'projects',title:'Project'}];
const AllBlocks = [{id:'scenario_block',title:'Risk Scenarios'},{id:'zone_block',title:'Zones'},{id:'projects_block',title:'Projects'}]
class ScenarioControl extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            scenario_id : '',
            risk_zone_id : ''
        }
        //this.onClickScenario = this.onClickScenario.bind(this)
        this.handleChange = this.handleChange.bind(this);
    }

    fetchFalcorDeps(){
        return this.props.falcor.get(['plan',[this.props.activePlan],'scenarios'])
            .then(response =>{
                //console.log('response',response)
                return response
            })
    }

    componentDidMount(){
        this.setState({
            scenario_id: '2'
        })
    }



    componentDidUpdate(oldProps,oldState){
        if(oldState.scenario_id !== this.state.scenario_id){
            this.renderScenarioTable()
        }
    }


    scenarioDropDown(){
        if(this.props.scenariosList[this.props.activePlan]){
            let scenarios_list  = []
            let graph = this.props.scenariosList[this.props.activePlan].scenarios
            if(graph){
                Object.keys(graph.value).filter(d => d !== '$type').forEach(item =>{
                    scenarios_list.push({
                        'name':graph.value[item] ? graph.value[item].name : 'None' ,
                        'id':graph.value[item] ? graph.value[item].id : ''
                    })

                })

                return scenarios_list
            }


        }
    }

    renderScenarioTable(){
        return (
            <div>
                {this.state.scenario_id !== '' ?
                    <ScenarioTable
                        scenario_id={[this.state.scenario_id]}
                        check_visibility = {this.props.layer.layer}
                    />
                    :
                    null
                }
            </div>
        )
    }

    handleChange(e) {
        console.log('---',e.target.id,e.target.value,this.state);
        this.setState({ ...this.state, [e.target.id]: e.target.value });

    };


    render(){
        let scenarios_list = this.scenarioDropDown()
        if(scenarios_list && scenarios_list.length > 0){
            return (
                <div>
                    <select className="form-control justify-content-sm-end"
                            id="scenario_id"
                            value = {this.state.scenario_id || ''}
                            onChange={this.handleChange}>
                        <option value="None">---Select Value---</option>
                        {scenarios_list.map(list =>{
                            if(list.id === '2'){
                                return (<option
                                    value={list.id}
                                    selected = "selected">{list.name}
                                </option>)
                            }else{
                                return (<option
                                    value={list.id}>{list.name}
                                </option>)
                            }

                        })}
                    </select>
                    <div>
                        {this.renderScenarioTable()}
                    </div>

                </div>
            )
        }else{
            return(
                <div>
                    Loading..
                </div>
            )
        }

    }
}

const mapStateToProps = state => (
    {
        activePlan : state.user.activePlan,
        activeGeoid:state.user.activeGeoid,
        isAuthenticated: !!state.user.authed,
        attempts: state.user.attempts,
        scenariosList : get(state.graph,['plan'],{})
    });

const mapDispatchToProps = {
    sendSystemMessage
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(ScenarioControl))