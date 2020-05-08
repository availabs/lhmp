import React from 'react';
import AvlFormsViewData from 'components/AvlForms/displayComponents/viewData';
import config from 'pages/auth/Roles/roles_forms/config.js'
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import {sendSystemMessage} from 'store/modules/messages';
import { fnum } from "utils/sheldusUtils"
import ScenarioControl from "./scenarioControl";
import ZoneControl from "./zoneControls";
import ProjectControl from "./projectControl"
import LandUseControl from "./landUseControl";
import {setActiveRiskZoneIdOff} from "store/modules/scenario"
var _ = require('lodash');
const AllModes =[{id:'scenario',title:'Risk Scenarios'},{id:'zone',title:'Zones'},{id:'landUse',title:'Land Use'}];
//,{id:'projects',title:'Project'}
const AllBlocks = [{id:'scenario_block',title:'Risk Scenarios'},{id:'zone_block',title:'Zones'},{id:'landUse_block',title:'Land Use'}]
//{id:'projects_block',title:'Projects'},

class MainControls extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeMode: ['scenario','zone'],
            modeOff:''
        }

        this.handleChange = this.handleChange.bind(this)

    }

    componentDidMount(){
        if(this.state.activeMode !== ''){
            this.props.layer.loadLayers()

        }

    }

    componentDidUpdate(oldProps,oldState){
        if(this.state.activeMode.length === 0 && this.state.modeOff !== "" && this.state.modeOff !== "landUse") {
            //console.log('in firs if',this.state.modeOff,this.state.activeMode)
            this.props.layer.mainLayerToggleVisibilityOff([this.state.modeOff])
        }
        if(!this.state.activeMode.includes(oldState.activeMode) && this.state.modeOff === ""){
            //console.log('in second if',this.state.activeMode,this.state.modeOff)
            this.props.layer.mainLayerToggleVisibilityOff(["landUse"])
            this.props.layer.mainLayerToggleVisibilityOn(this.state.activeMode)
        }
        if(this.state.modeOff !== "" && this.state.modeOff !== 'landUse' ){
            //console.log('in third if',this.state.modeOff)
            this.props.setActiveRiskZoneIdOff(this.state.activeMode)
            this.props.layer.mainLayerToggleVisibilityOff([this.state.modeOff])
            this.props.layer.mainLayerToggleVisibilityOn(this.state.activeMode.filter(d => d !== 'landUse'))
        }
        if(this.state.activeMode.length > oldState.activeMode.length && this.state.activeMode[0] !== 'landUse'){
            //console.log('in fourth if',this.state.activeMode,oldState.activeMode,this.state.activeMode)
            this.props.layer.mainLayerToggleVisibilityOn(this.state.activeMode)
        }
        if(JSON.stringify(this.state.activeMode) === JSON.stringify(["scenario","zone"]) && this.state.modeOff === 'landUse'){
            this.props.layer.mainLayerToggleVisibilityOff([this.state.modeOff])
        }

    }

    handleChange(e) {
        console.log('e',e.target.id)

    }

    render(){
        return (
            <div style={{'overflowX':'auto'}}>
                <table className='table table-sm table-hover'>
                    <thead>
                    <tr>
                        {AllModes.map((mode,i) =>{
                            return (
                                <th key = {i}>
                                    <button className="btn btn-rounded" type="button" style={{padding:'0px'}}>
                                        <div id = {mode.id}
                                             className={this.state.activeMode.includes(mode.id) ? "os-toggler-w on" : "os-toggler-w"}
                                             key={i}
                                             >
                                            <div className="os-toggler-i">
                                                <div
                                                    className="os-toggler-pill"
                                                    id = {mode.id}
                                                    key={i}
                                                     onClick={(e) => {
                                                             this.setState(currentState =>(
                                                                 {
                                                                 activeMode: this.state.activeMode.includes(mode.id) ? _.pull(this.state.activeMode,mode.id) : [mode.id,...this.state.activeMode],
                                                                 modeOff : mode.id
                                                             }))
                                                             this.handleChange(e)

                                                     }}>
                                                </div>
                                            </div>
                                        </div>
                                        {mode.title}
                                    </button>
                                </th>
                            )
                        })}
                    </tr>
                    </thead>
                </table>
                {AllBlocks.map((block,i) =>{
                    if(this.state.activeMode.length > 0){
                        if(this.state.activeMode.includes(block.id.split('_')[0]) && block.id.split('_')[0] === 'scenario'){
                            return (
                                <div id={`closeMe`+block.id} key={i}>
                                    <h4 style ={{display: 'inline'}}>{block.title}</h4>
                                    <button
                                            aria-label="Close"
                                            className="close"
                                            data-dismiss="alert"
                                            type="button"
                                            key={i}
                                            onClick={(e) =>{
                                                e.target.closest(`#closeMe`+block.id).style.display = 'none'
                                                this.setState({
                                                    activeMode:_.pull(this.state.activeMode,block.id)
                                                })
                                                document.getElementById(block.id.split('_')[0]).className = "os-toggler-w"
                                            }}
                                    >
                                        <span aria-hidden="true"> ×</span>
                                    </button>
                                    <ScenarioControl
                                        layer = {this.props}
                                    />
                                </div>
                            )
                        }
                        if(this.state.activeMode.includes(block.id.split('_')[0]) && block.id.split('_')[0] === 'zone'){
                            return (
                                <div id={`closeMe`+block.id} key = {i}>
                                    <h4 style ={{display: 'inline'}}>{block.title}</h4>
                                    <button
                                        aria-label="Close"
                                        className="close"
                                        data-dismiss="alert"
                                        type="button"
                                        onClick={(e) =>{
                                            e.target.closest(`#closeMe`+block.id).style.display = 'none'
                                            this.setState({
                                                activeMode:_.pull(this.state.activeMode,block.id)
                                            })
                                            document.getElementById(block.id.split('_')[0]).className = "os-toggler-w"
                                        }}
                                    >
                                        <span aria-hidden="true"> ×</span>
                                    </button>
                                    <ZoneControl
                                        layer = {this.props}
                                        activeMode = {this.state.activeMode}
                                    />
                                </div>
                            )
                        }
                        if(this.state.activeMode.includes(block.id.split('_')[0]) && block.id.split('_')[0] === 'projects'){
                            return (
                                <div id={`closeMe`+block.id} key ={i}>
                                    <h4 style ={{display: 'inline'}}>{block.title}</h4>
                                    <button
                                        aria-label="Close"
                                        className="close"
                                        data-dismiss="alert"
                                        type="button"
                                        onClick={(e) =>{
                                            e.target.closest(`#closeMe`+block.id).style.display = 'none'
                                            this.setState({
                                                activeMode:_.pull(this.state.activeMode,block.id)
                                            })
                                            document.getElementById(block.id.split('_')[0]).className = "os-toggler-w"
                                        }}
                                    >
                                        <span aria-hidden="true"> ×</span>
                                    </button>
                                    <ProjectControl
                                        layer = {this.props}
                                    />
                                </div>
                            )
                        }
                        if(this.state.activeMode.includes(block.id.split('_')[0]) && block.id.split('_')[0] === 'landUse'){
                            return (
                                <div id={`closeMe`+block.id} key ={i}>
                                    <h4 style ={{display: 'inline'}}>{block.title}</h4>
                                    <button
                                        aria-label="Close"
                                        className="close"
                                        data-dismiss="alert"
                                        type="button"
                                        onClick={(e) =>{
                                            e.target.closest(`#closeMe`+block.id).style.display = 'none'
                                            this.setState({
                                                activeMode:_.pull(this.state.activeMode,block.id)
                                            })
                                            document.getElementById(block.id.split('_')[0]).className = "os-toggler-w"
                                        }}
                                    >
                                        <span aria-hidden="true"> ×</span>
                                    </button>
                                    <LandUseControl
                                        layer = {this.props}
                                    />
                                </div>
                            )
                        }
                    }
                })}
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
        assetsData : get(state.graph,['building','byGeoid'],{})
    });

const mapDispatchToProps = {
    sendSystemMessage,
    setActiveRiskZoneIdOff
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(MainControls))
