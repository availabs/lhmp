import React from 'react';
import AvlFormsViewData from 'components/AvlForms/displayComponents/viewData';
import config from 'pages/auth/Roles/roles_forms/config.js'
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import {sendSystemMessage} from 'store/modules/messages';
import { fnum } from "utils/sheldusUtils"
import Legend from "../../../../components/AvlMap/components/legend/Legend";
import ScenarioTable from "../components/scenariosTable";
import {setActiveRiskScenarioId} from "store/modules/scenario"
import {getColorRange} from "../../../../constants/color-ranges";
var _ = require("lodash")
const LEGEND_COLOR_RANGE = getColorRange(8, "YlGn");
let scenarios_list  = []
class ScenarioControl extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            scenario_id : '2',
            risk_zone_id : '',
            scenarios_data : [],

        }
        //this.onClickScenario = this.onClickScenario.bind(this)
        this.handleChange = this.handleChange.bind(this);
    }

    callbackFunction = (childData) => {
        this.setState({message: childData})
    }

    fetchFalcorDeps(){
        if(this.state.scenario_id){
            return this.props.falcor.get(['plan',[this.props.activePlan],'scenarios'])
                .then(response =>{
                    return response
                })
        }

    }

    componentDidMount(){
        this.fetchFalcorDeps()
            .then(response =>{
                let graph = response.json.plan[this.props.activePlan].scenarios
                if(graph){
                    graph.forEach(item =>{
                        if(item.name.includes('HAZUS')){
                            this.setState({
                                scenario_id : item.id
                            })
                            this.props.setActiveRiskScenarioId([item])
                        }
                    })

                }
            })

    }



    componentDidUpdate(oldProps,oldState){
        if(oldState.scenario_id !== this.state.scenario_id){
            scenarios_list.forEach(item =>{
                if(item.id === this.state.scenario_id){
                    this.props.setActiveRiskScenarioId([item])
                }
            })
            this.renderScenarioTable()

        }
    }


    scenarioDropDown(){
        if(this.props.scenariosList[this.props.activePlan]){
            let graph = this.props.scenariosList[this.props.activePlan].scenarios
            scenarios_list = []
            if(graph && graph.value){
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
                        parentCallback = {this.callbackFunction.bind(this)}
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
        let data = []

        Object.keys(this.props.scenarioData).forEach((item,i) =>{
            if(this.state.scenario_id === this.props.scenarioData[item].risk_scenario_id.toString()){
                data.push(this.props.scenarioData[item])
            }
        })
        if(this.state.message){
            this.props.layer.layer.visibilityToggleModeOff(this.props.scenarioData[this.state.message].map_source,this.props.scenarioData[this.state.message].table_name)
        }
        else{
            data.forEach((item,i) =>{
                if(i === 0){
                    this.props.layer.layer.visibilityToggleModeOff(item.map_source,item.table_name)
                }

            })
        }


    };




    render(){
        let scenarios_list = this.scenarioDropDown()
        if(scenarios_list && scenarios_list.length > 0){
            return (
                <div>
                    <Legend
                        title = {'Total Hazard Loss'}
                        type = {"linear"}
                        vertical= {false}
                        range= {LEGEND_COLOR_RANGE}
                        domain = {[0,10000,50000,100000, 250000, 500000, 1000000]}
                        format= {fnum}
                    />
                    <select className="form-control justify-content-sm-end"
                            id="scenario_id"
                            value = {this.state.scenario_id || ''}
                            onChange={this.handleChange}>
                        {scenarios_list.map((list,i) =>{
                            if(list.id === '2'){
                                return (<option
                                    value={list.id}
                                    key = {i+1}
                                    defaultValue={"2"}>{list.name}
                                </option>)
                            }else{
                                return (<option
                                    key={i+1}
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
        activeScenarioId:state.scenario.activeRiskZoneId,
        activePlan : state.user.activePlan,
        activeGeoid:state.user.activeGeoid,
        isAuthenticated: !!state.user.authed,
        attempts: state.user.attempts,
        scenariosList : get(state.graph,['plan'],{}),
        scenarioData : get(state.graph,['scenarios','byId'],{}),
    });

const mapDispatchToProps = {
    sendSystemMessage,
    setActiveRiskScenarioId

};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(ScenarioControl))