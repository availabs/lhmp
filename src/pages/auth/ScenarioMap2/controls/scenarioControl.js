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
import {setActiveRiskZoneId} from "store/modules/scenario"
var _ = require("lodash")
let scenarios_list  = []
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
                return response
            })
    }

    componentDidMount(){
        this.fetchFalcorDeps()
            .then(response =>{
                let graph = response.json.plan[this.props.activePlan].scenarios
                if(graph){
                    graph.forEach(item =>{
                        if(item.name.includes('hazus')){
                            this.setState({
                                scenario_id : item.id
                            })
                            this.props.setActiveRiskZoneId([item])
                        }
                    })

                }
            })

    }



    componentDidUpdate(oldProps,oldState){
        if(oldState.scenario_id !== this.state.scenario_id){
            scenarios_list.forEach(item =>{
                if(item.id === this.state.scenario_id){
                    this.props.setActiveRiskZoneId([item])
                }
            })
            //if(scenarios_list.length > 0){


            //}

            this.renderScenarioTable()
        }
    }


    scenarioDropDown(){
        if(this.props.scenariosList[this.props.activePlan]){
            let graph = this.props.scenariosList[this.props.activePlan].scenarios
            scenarios_list = []
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
                        {scenarios_list.map((list,i) =>{
                            if(list.id === '2'){
                                return (<option
                                    value={list.id}
                                    key = {i}
                                    defaultValue={"2"}>{list.name}
                                </option>)
                            }else{
                                return (<option
                                    key={{i}}
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
    sendSystemMessage,
    setActiveRiskZoneId

};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(ScenarioControl))