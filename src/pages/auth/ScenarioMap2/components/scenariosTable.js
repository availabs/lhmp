import React from 'react';
import { connect } from 'react-redux';
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import {sendSystemMessage} from 'store/modules/messages';
import { fnum } from "utils/sheldusUtils"
import { register, unregister } from "components/AvlMap/ReduxMiddleware.js"
import { reduxFalcor, UPDATE as REDUX_UPDATE } from 'utils/redux-falcor'
import {setActiveRiskZoneId} from "store/modules/scenario"

class ScenarioTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visibility:{},
            risk_zone_ids : [],
            riskZoneId : '',
            scenario:'',
            map_source:'',
            activeToggle:'',
            showTotalLoss:''
        }
        this.handleChange = this.handleChange.bind(this)
    }

    fetchFalcorDeps(){
        return this.props.falcor.get(['scenarios','byPlan',this.props.activePlan,'byId',this.props.scenario_id,'length'])
            .then(response =>{
                let length = response.json.scenarios.byPlan[this.props.activePlan].byId[this.props.scenario_id].length;
                this.props.falcor.get(['scenarios','byPlan',this.props.activePlan,'byId',this.props.scenario_id,'byIndex',[{from:0,to:length-1}],'risk_zones',['table_name','map_source','annual_occurance','risk_zone_id','risk_scenario_id']])
                    .then(response =>{
                        //console.log('response',response)
                        let graph = response.json.scenarios.byPlan[this.props.activePlan].byId[this.props.scenario_id].byIndex;
                        let risk_zone_ids = []
                        if(graph){
                            Object.keys(graph).filter(d => d!== '$__path').forEach(item =>{
                                risk_zone_ids.push(graph[item].risk_zones.risk_zone_id)
                            })
                            this.setState({
                                risk_zone_ids : risk_zone_ids
                            })
                            return risk_zone_ids
                        }
                    })
                    .then(ids =>{
                        this.props.falcor.get(['risk_zones','byId',ids,'sum',['num_buildings','total_loss']])
                            .then(response =>{
                                let graph = get(response,`json.risk_zones.byId`,{})
                                let data = []
                                let total_loss = 0;
                                let annual_loss = 0
                                if(graph && this.props.scenarioData){
                                    Object.keys(graph).filter(f => f !== '$__path').forEach((item,i) =>{
                                        if(this.props.scenarioData[item]){
                                            if(i === 0){
                                                this.props.check_visibility.visibilityToggleModeOn(this.props.scenarioData[item].map_source,this.props.scenarioData[item].table_name)
                                                this.setState({
                                                    initial_source : this.props.scenarioData[item].map_source,
                                                    initial_table_name : this.props.scenarioData[item].table_name
                                                })
                                            }
                                            data.push({
                                                'id':item,
                                                'scenario':this.props.scenarioData[item].table_name || '',
                                                'visibility':this.props.scenarioData[item].map_source || '',
                                                'total_loss': fnum(graph[item].sum.total_loss) || 0,
                                                'annual_loss': fnum((this.props.scenarioData[item].annual_occurance/100) * graph[item].sum.total_loss) || 0
                                            })
                                            total_loss += parseFloat(graph[item].sum.total_loss)
                                            annual_loss += parseFloat((this.props.scenarioData[item].annual_occurance/100) * graph[item].sum.total_loss)
                                        }

                                    })
                                }
                                this.setState({
                                    data : data,
                                    total_loss : total_loss,
                                    annual_loss : annual_loss
                                })
                                return response
                            })
                    })
                return response
            })
    }

    componentDidMount(){
        this.fetchFalcorDeps()
            .then(d=>{
                let length = d.json.scenarios.byPlan[this.props.activePlan].byId[this.props.scenario_id].length;
                return this.props.falcor.get(['scenarios','byPlan',this.props.activePlan,'byId',this.props.scenario_id,'byIndex',[{from:0,to:length-1}],'risk_zones',['risk_zone_id','risk_scenario_id']])
                    .then(response =>{
                        //console.log('response',response)
                        let graph = response.json.scenarios.byPlan[this.props.activePlan].byId[this.props.scenario_id].byIndex;
                        let risk_zone_ids = []
                        if(graph){
                            Object.keys(graph).filter(d => d!== '$__path').forEach((item,i) =>{
                                risk_zone_ids.push(graph[item].risk_zones.risk_zone_id)
                            })

                            this.props.setActiveRiskZoneId(Math.min.apply(Math, risk_zone_ids))
                        }
                    })
            })
    }

    componentDidUpdate(oldProps,oldState) {
        if (oldProps.scenario_id[0] !== this.props.scenario_id[0]) {
            this.fetchFalcorDeps().then(response => {
                let length = response.json.scenarios.byPlan[this.props.activePlan].byId[this.props.scenario_id].length;
                this.props.falcor.get(['scenarios', 'byPlan', this.props.activePlan, 'byId', this.props.scenario_id, 'byIndex', [{
                    from: 0,
                    to: length - 1
                }], 'risk_zones', ['table_name', 'map_source', 'annual_occurance', 'risk_zone_id', 'risk_scenario_id']])
                    .then(response => {
                        //console.log('response',response)
                        let graph = response.json.scenarios.byPlan[this.props.activePlan].byId[this.props.scenario_id].byIndex;
                        let risk_zone_ids = []
                        if (graph) {
                            Object.keys(graph).filter(d => d!== '$__path').forEach((item,i) =>{
                                risk_zone_ids.push(graph[item].risk_zones.risk_zone_id)
                            })
                            this.props.setActiveRiskZoneId(Math.min.apply(Math, risk_zone_ids))
                        }
                    })
            })
        }
    }


    handleChange(e) {
        let id = e.target.id
        let data = this.state.data
        data.map(d =>{
            if(id.toString() === d.id.toString()){
                this.props.setActiveRiskZoneId([d.id])
                this.setState((currentState) =>({
                    scenario : d.scenario,
                    map_source: d.visibility,
                }))
            }
        });


    };


    render(){

        if(this.state.visibility['map_source'] && this.state.visibility['scenario'] && this.state.visibility['map_source'] !== '' && this.state.visibility['scenario']){
            this.props.check_visibility.visibilityToggleModeOff(this.state.visibility['map_source'],this.state.visibility['scenario'])
        }
        if(this.state.visibility['map_source'] === "" && this.state.visibility['scenario'] === ""){
            this.props.check_visibility.visibilityToggleModeOff(this.state.initial_source,this.state.initial_table_name)
        }
        return (
            <div>
                <table className='table table-sm table-hover'>
                    <thead>
                    <tr>
                        <th>Scenario</th>
                        <th>Visibility</th>
                        <th>Total Loss</th>
                        <th>Annual Loss</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.data && this.state.data.length > 0 ?
                            this.state.data.map((item,i) =>{
                                return (
                                    <tr key = {i}>
                                        <td>{item.scenario}</td>
                                        <td id ='visibility_column'>
                                        <input
                                            style={{padding:'0px'}}
                                            id={item.id}
                                            checked={this.state.activeToggle ? (this.state.activeToggle === item.id) : (i === 0)}
                                            type="radio"
                                            value={item.id}
                                            key = {i}
                                            onChange={(e) =>{
                                                this.setState((currentState) => (
                                                    {
                                                    activeToggle:this.state.activeToggle === item.id ? '':item.id,
                                                    visibility: {map_source:currentState.map_source,scenario:currentState.scenario}
                                                    }
                                                ));
                                                this.handleChange(e,i)}
                                            }
                                        />
                                        </td>
                                        <td>{item.total_loss}</td>
                                        <td>{item.annual_loss}</td>
                                    </tr>
                                )
                            })

                        :
                            null
                    }
                    {
                        this.state.activeToggle !== '' ?
                            this.props.check_visibility.visibilityToggleModeOn(this.state.map_source,this.state.scenario)
                            :

                            null

                    }
                    </tbody>
                        <tfoot>
                        <tr>
                            <td><h6>Total Loss:</h6></td>
                            <td></td>
                            <td><h6>{fnum(this.state.total_loss ? this.state.total_loss.toString() : '')}</h6></td>
                            <td><h6>{fnum(this.state.annual_loss ? this.state.annual_loss.toString() : '')}</h6></td>
                        </tr>
                        </tfoot>
                </table>
            </div>
        )

    }
}

const mapStateToProps = state => (
    {
        activePlan : state.user.activePlan,
        activeGeoid:state.user.activeGeoid,
        isAuthenticated: !!state.user.authed,
        attempts: state.user.attempts,
        activeRiskScenarioId:state.scenario.activeRiskScenarioId,
        scenarioData : get(state.graph,['scenarios','byId'],{}),
        riskData : get(state.graph,['risk_zones','byId']),
        riskZoneId: state.scenario.activeRiskScenarioId
    });

const mapDispatchToProps = {
    sendSystemMessage,
    setActiveRiskZoneId
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(ScenarioTable))
