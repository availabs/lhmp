import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import Toggle from 'react-toggle'
import {sendSystemMessage} from 'store/modules/messages';
import { fnum } from "utils/sheldusUtils"

class ScenarioTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visibility:false
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

    handleChange(e) {
        // if you switch on the toggle
        if(e.target.parentNode.parentNode.className === 'os-toggler-w'){
            e.target.parentNode.parentNode.className = 'os-toggler-w on'
            document.getElementById('visibility_column').parentNode.parentNode.childNodes.forEach(tr_node =>{
                tr_node.childNodes.forEach(inside_tr =>{
                    if(inside_tr.firstChild.className === 'btn btn-rounded'){
                        if(inside_tr.firstChild.firstChild.className === 'os-toggler-w'){
                            inside_tr.parentNode.setAttribute("style","pointer-events:none")
                        }
                    }
                })
            })

        }
        // if you switch off the toggle
        else{
            e.target.parentNode.parentNode.className = 'os-toggler-w'
            document.getElementById('visibility_column').parentNode.parentNode.childNodes.forEach(tr_node =>{
                tr_node.childNodes.forEach(inside_tr =>{
                    if(inside_tr.firstChild.className === 'btn btn-rounded'){
                        if(inside_tr.firstChild.firstChild.className === 'os-toggler-w'){
                            inside_tr.parentNode.setAttribute("style","pointer-events:auto")
                        }
                    }
                })
            })
        }
        this.setState((currentState) => ({
            visibility: !currentState.visibility,
        }));

    };

    processTableData(){
        if(this.props.scenarioData && this.props.riskData){
            let graph = this.props.scenarioData;
            let data = [];
            Object.keys(graph).forEach(item=>{
                data.push({
                    'id':graph[item].risk_zone_id || '',
                    'scenario':graph[item].table_name || '',
                    'visibility':graph[item].map_source || '',
                    'total_loss':fnum(this.props.riskData[graph[item].risk_zone_id].sum.total_loss.value) || '',
                    'annual_loss':fnum(((graph[item].annual_occurance/100) * this.props.riskData[graph[item].risk_zone_id].sum.total_loss.value).toString()) || ''
                })
            })
            return data
        }
    }

    processTotalLoss(){
        if(this.props.scenarioData && this.props.riskData){
            let graph = this.props.scenarioData;
            let total_loss = 0;
            let annual_loss = 0
            Object.keys(graph).forEach(item=>{
                total_loss += parseFloat(this.props.riskData[graph[item].risk_zone_id].sum.total_loss.value)
                annual_loss += (graph[item].annual_occurance/100) * this.props.riskData[graph[item].risk_zone_id].sum.total_loss.value
            })
            return total_loss
        }
    }

    processAnnualLoss(){
        if(this.props.scenarioData && this.props.riskData){
            let graph = this.props.scenarioData;
            let annual_loss = 0
            Object.keys(graph).forEach(item=>{
                annual_loss += (graph[item].annual_occurance/100) * this.props.riskData[graph[item].risk_zone_id].sum.total_loss.value
            })
            return annual_loss
        }
    }



    render(){
        let resultData = this.processTableData();
        let total_loss = this.processTotalLoss()
        let annual_loss = this.processAnnualLoss()
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
                                                    disbaled
                                                    style={{padding:'0px'}}>
                                                <div id = 'visibility'
                                                     className="os-toggler-w">
                                                    <div className="os-toggler-i" >
                                                        <div className="os-toggler-pill"
                                                             onClick={this.handleChange}
                                                             value = {this.state.visibility}>
                                                            {
                                                                this.state.visibility === true?
                                                                    this.props.check_visibility.visibilityToggleModeOn(item.visibility,item.scenario)
                                                                    :
                                                                    this.props.check_visibility.visibilityToggleModeOff(item.visibility)
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
        riskData : get(state.graph,['risk_zones','byId'])
    });

const mapDispatchToProps = {
    sendSystemMessage
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(ScenarioTable))