import React from 'react';
import { connect } from 'react-redux';
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import {sendSystemMessage} from 'store/modules/messages';
import { fnum } from "utils/sheldusUtils"
import { register, unregister } from "components/AvlMap/ReduxMiddleware.js"
import { reduxFalcor, UPDATE as REDUX_UPDATE } from 'utils/redux-falcor'
import {setActiveRiskZoneId} from 'store/modules/scenario'

class ScenarioTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visibility:false,
            risk_zone_ids : [],
            riskZoneId : '',
            scenario:'',
            map_source:'',
            activeToggle:''
        }
        this.handleChange = this.handleChange.bind(this)
    }

    fetchFalcorDeps(){
        return this.props.falcor.get(['scenarios','byId',this.props.scenario_id,'risk_zones','length'])
            .then(response =>{
                let length = response.json.scenarios.byId[this.props.scenario_id].risk_zones.length
                this.props.falcor.get(['scenarios','byId',this.props.scenario_id,'byIndex',[{from:0,to:length-1}],'risk_zones',['table_name','map_source','annual_occurance','risk_zone_id']])
                    .then(response =>{
                        let graph = response.json.scenarios.byId[this.props.scenario_id].byIndex;
                        let risk_zone_ids = []
                        if(graph){
                            Object.keys(graph).filter(d => d!== '$__path').forEach(item =>{
                                risk_zone_ids.push(graph[item].risk_zones.risk_zone_id)
                                this.setState({
                                    risk_zone_ids : risk_zone_ids
                                })
                            })
                            return risk_zone_ids
                        }
                    })
                    .then(ids =>{
                        this.props.falcor.get(['risk_zones','byId',ids,'sum',['num_buildings','total_loss']])
                            .then(response =>{
                                return response
                            })
                    })
                return response
            })
    }

    componentDidUpdate(oldProps){
        if(oldProps.scenario_id !== this.props.scenario_id){
            this.fetchFalcorDeps()
        }
    }


    handleChange(e) {
        let id = e.target.id

        let data = this.processTableData()
        data.map(d =>{
            if(id.toString() === d.id.toString()){
                this.props.setActiveRiskZoneId(d.id)
                this.setState((currentState) =>({
                    visibility: !currentState.visibility,
                    scenario : d.scenario,
                    map_source:d.visibility
                }))

            }
        })

    };


    processTableData(){
        if(this.props.scenarioData && this.props.riskData){
            let graph = this.props.scenarioData;
            let data = [];
            let resultData = []
            Object.keys(graph).forEach(item=>{
                if(graph[item].risk_zone_id){
                    data.push({
                        'id':graph[item].risk_zone_id || '',
                        'scenario':graph[item].table_name || '',
                        'visibility':graph[item].map_source || '',
                        'total_loss':fnum(this.props.riskData[graph[item].risk_zone_id].sum.total_loss.value) || '',
                        'annual_loss':fnum(((graph[item].annual_occurance/100) * this.props.riskData[graph[item].risk_zone_id].sum.total_loss.value).toString()) || ''
                    })
                }
            });
            data.map(d =>{
                if(this.state.risk_zone_ids.includes(d.id)){
                    resultData.push(d)
                }
            })

            return resultData
        }
    }

    processTotalLoss(){
        if(this.props.scenarioData && this.props.riskData){
            let graph = this.props.scenarioData;
            let total_loss = 0;
            let annual_loss = 0
            Object.keys(graph).forEach(item=>{
                if(graph[item].risk_zone_id && this.state.risk_zone_ids.includes(graph[item].risk_zone_id)){
                    total_loss += parseFloat(this.props.riskData[graph[item].risk_zone_id].sum.total_loss.value)
                    annual_loss += (graph[item].annual_occurance/100) * this.props.riskData[graph[item].risk_zone_id].sum.total_loss.value
                }

            })
            return total_loss
        }
    }

    processAnnualLoss(){
        if(this.props.scenarioData && this.props.riskData){
            let graph = this.props.scenarioData;
            let annual_loss = 0
            Object.keys(graph).forEach(item=>{
                if(graph[item].risk_zone_id && this.state.risk_zone_ids.includes(graph[item].risk_zone_id)){
                    annual_loss += (graph[item].annual_occurance/100) * this.props.riskData[graph[item].risk_zone_id].sum.total_loss.value
                }

            })
            return annual_loss
        }
    }



    render(){
        let resultData = this.processTableData();
        let total_loss = this.processTotalLoss()
        let annual_loss = this.processAnnualLoss();
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
                        resultData ?
                            (resultData).map(item =>{
                                return (
                                    <tr>
                                        <td>{item.scenario}</td>
                                        <td id ='visibility_column'>
                                            <button className="btn btn-rounded"
                                                    type="button"
                                                    style={{padding:'0px'}}>
                                                <div id = 'visibility'
                                                     className={this.state.activeToggle === item.id ? "os-toggler-w on" : "os-toggler-w"}
                                                     style={this.state.activeToggle === item.id || this.state.activeToggle === '' ? {}:{pointerEvents:'none'}}
                                                >
                                                    <div className="os-toggler-i" >
                                                        <div className="os-toggler-pill"
                                                             id = {item.id}
                                                             onClick={(e) =>{
                                                                 this.setState({
                                                                     activeToggle:this.state.activeToggle === item.id ? '':item.id
                                                                 })
                                                                 this.handleChange(e)
                                                             }}
                                                             >
                                                            {
                                                                this.state.visibility === true?
                                                                    this.props.check_visibility.visibilityToggleModeOn(this.state.map_source,this.state.scenario)
                                                                    :
                                                                    this.props.check_visibility.visibilityToggleModeOff(this.state.map_source,this.state.scenario)
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        </td>
                                        <td>{item.total_loss}</td>
                                        <td>{item.annual_loss}</td>
                                    </tr>

                                )
                            })
                        :
                            null
                    }
                    </tbody>
                    <tfoot>
                    <tr>
                        <td><h6>Total Loss:</h6></td>
                        <td></td>
                        <td><h6>{fnum(total_loss)}</h6></td>
                        <td><h6>{fnum(annual_loss)}</h6></td>
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
        scenarioData : get(state.graph,['scenarios','byId'],{}),
        riskData : get(state.graph,['risk_zones','byId']),
        riskZoneId: state.scenario.activeRiskZoneId
    });

const mapDispatchToProps = {
    sendSystemMessage,
    setActiveRiskZoneId,
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(ScenarioTable))