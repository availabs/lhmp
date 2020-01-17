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


const AllModes =[{id:'scenario',title:'Risk Scenarios'},{id:'zone',title:'Zones'},{id:'projects',title:'Project'}];
const AllBlocks = [{id:'scenario_block',title:'Risk Scenarios'},{id:'zone_block',title:'Zones'},{id:'projects_block',title:'Projects'}]
class MainControls extends React.Component {
    constructor(props) {
        super(props);

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
                                        <div id = {mode.id} className="os-toggler-w" onClick={() => {
                                            if(document.getElementById(mode.id).className === "os-toggler-w"){
                                                document.getElementById(mode.id).className = "os-toggler-w on"
                                                let x = document.getElementById(mode.id+'_block')
                                                if(x.style.display === 'none') {
                                                    x.style.display = "block"
                                                    this.props.layer.toggleModesOn(mode.id)
                                                }
                                            }else{
                                                document.getElementById(mode.id).className = "os-toggler-w"
                                                let x = document.getElementById(mode.id+"_block")
                                                if(x.style.display === 'block') {
                                                    x.style.display = "none"
                                                    this.props.layer.toggleModesOff(mode.id)
                                                }
                                            }
                                        }}>
                                            <div className="os-toggler-i">
                                                <div className="os-toggler-pill"></div>
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
                    return (
                        <div id = {block.id} style={{display:'none'}}>
                            <h4 style ={{display: 'inline'}}>{block.title}</h4>
                            <button aria-label="Close" className="close" data-dismiss="alert" type="button" onClick={() =>{
                                let x = document.getElementById(block.id);
                                if(x.style.display === "block"){
                                    x.style.display = "none"
                                    document.getElementById(block.id.split('_')[0]).className = "os-toggler-w"
                                    this.props.layer.toggleModesOff(block.id.split('_')[0])
                                }

                            }}>
                                <span aria-hidden="true"> ×</span></button>
                        </div>
                    )
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