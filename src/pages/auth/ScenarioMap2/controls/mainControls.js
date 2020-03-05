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

const AllModes =[{id:'scenario',title:'Risk Scenarios'},{id:'zone',title:'Zones'},{id:'projects',title:'Project'}];
const AllBlocks = [{id:'scenario_block',title:'Risk Scenarios'},{id:'zone_block',title:'Zones'},{id:'projects_block',title:'Projects'}]
let currentInfoBox = []
class MainControls extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeMode: 'scenario',
            activeBlock:''
        }

        this.handleChange = this.handleChange.bind(this)

    }

    componentDidMount(){
        if(this.state.activeMode !== ''){
            //this.props.layer.onLoadActiveLayers(['scenario','zone'])
            this.props.layer.toggleModesOn(this.state.activeMode )
        }

    }

    handleChange(e) {
        console.log('e',e.target.id)
        let mode_id = ''

        currentInfoBox.push({
            block:mode_id,
            on:true
        })
    }

    render(){
        return (
            <div>
                <table className='table table-sm table-hover'>
                    <thead>
                    <tr>
                        {AllModes.map(mode =>{
                            return (
                                <th>
                                    <button className="btn btn-rounded" type="button" style={{padding:'0px'}}>
                                        <div id = {mode.id}
                                             className={this.state.activeMode === mode.id ? "os-toggler-w on" : "os-toggler-w"}
                                             >
                                            <div className="os-toggler-i">
                                                <div
                                                    className="os-toggler-pill"
                                                    id = {mode.id}
                                                     onClick={(e) => {
                                                             this.setState({
                                                                 activeMode:this.state.activeMode === mode.id ? '':mode.id
                                                             })
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
                {AllBlocks.map(block =>{
                    if(this.state.activeMode !== ''){
                        if(block.id.split('_')[0] === this.state.activeMode && block.id.split('_')[0] === 'scenario'){
                            return (
                                <div id={`closeMe`+block.id}>
                                    <h4 style ={{display: 'inline'}}>{block.title}</h4>
                                    <button
                                            aria-label="Close"
                                            className="close"
                                            data-dismiss="alert"
                                            type="button"
                                            onClick={(e) =>{
                                                e.target.closest(`#closeMe`+block.id).style.display = 'none'
                                                this.setState({
                                                    activeMode:''
                                                })
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
    sendSystemMessage
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(MainControls))
