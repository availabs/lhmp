import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import {sendSystemMessage} from 'store/modules/messages';
import ScenarioControl from "./scenarioControl";
import ZoneControl from "./zoneControls";
import LandUseControl from "./landUseControl";
import CommentMapControl from "./commentMapControl";
import CulvertsControl from "./culvertsControl";
import JurisdictionControl from "./jurisdictionControls";
import EvacuationControl from "./evacuationControl";
import VulnerableDemographicsControl from "./vulnerableDemographicsControl";
import {setActiveRiskZoneIdOff} from "store/modules/scenario"
import SearchableDropDown from "../../../../components/filters/searchableDropDown";
import styled from "styled-components";
import {falcorGraph} from "../../../../store/falcorGraph";
import store from "../../../../store";
import HazardEventsControl from "./hazardEventsControls";
import CriticalInfrastructureControls from './criticalInfrastructureControls'
import NfipControls from './nfipControls'
import StateAssetsControls from './stateAssetsControls'
import ActionsControls from "./ActionsControls";

var _ = require('lodash');
const AllModes =[
    {value:'scenario',label:'Risk Scenarios'},
    {value:'jurisdiction',label:'Jurisdictions'},
    {value:'zone',label:'Zones'},
    {value:'landUse',label:'Land Use'},
    {value:'commentMap',label:'Comment Map'},
    {value:'culverts',label:'Culverts'},
    {value:'evacuationRoutes',label:'Evacuation Routes'},
    {value:'vulnerableDemographics',label:'Vulnerable Demographics'},
    {value:'hazardEvents',label:'Hazard Events'},
    {value:'criticalInfrastructure',label:'Critical Infrastructure'},
    {value:'nfip',label:'NFIP'},
    {value:'stateAssets',label:'State Assets'},
    {value:'actions',label:'Actions'}
    ];
const AllBlocks = [
    {id:'scenario_block',title:'Risk Scenarios'},
    {id:'jurisdiction_block',title:'Jurisdictions'},
    {id:'zone_block',title:'Zones'},
    {id:'landUse_block',title:'Land Use'},
    {id:'commentMap_block',title:'Comment Map'},
    {id:'culverts_block',title:'Culverts'},
    {id:'evacuationRoutes_block',title:'Evacuation Routes'},
    {id:'vulnerableDemographics_block',title:'Vulnerable Demographics'},
    {id:'hazardEvents_block',title:'Hazard Events'},
    {id:'criticalInfrastructure_block',title:'Critical Infrastructure'},
    {id:'nfip_block',title:'NFIP'},
    {id:'stateAssets_block',title:'State Assets'},
    {id:'actions_block',title:'Actions'}
    ]

const DROPDOWN = styled.div`
                  select,button {
                    color: #000000;
                    font-size: 1.2rem;
                    font-weight: 500;
                    width:100%;
                    padding: 0px;
                   }`

class MainControls extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeMode: props.activeGeoid.length === 2 ? ['stateAssets'] : ['scenario','jurisdiction'],
            modeOff:'',
            layerSelected:'',
            showLayers : props.activeGeoid.length === 2 ? ['stateAssets'] : ['landUse','commentMap','culverts','zone','evacuationRoutes','vulnerableDemographics', 'hazardEvents', 'criticalInfrastructure', 'nfip', 'stateAssets', 'actions'],
            selected : true
        }

        this.handleChange = this.handleChange.bind(this)
        this.renderLayersDropDown = this.renderLayersDropDown.bind(this)
    }

    componentDidMount(){
        if(this.state.activeMode !== ''){
            this.props.layer.loadLayers()
        }
    }


    componentDidUpdate(oldProps,oldState){
        if(_.isEqual(this.state.activeMode, ["scenario","jurisdiction"]) && this.state.modeOff !== "scenario" && this.state.modeOff !== "jurisdiction" && this.state.layerSelected !=='scenario' && this.state.layerSelected !== 'jurisdiction'){
            //console.log('in first if')
            this.props.layer.mainLayerToggleVisibilityOn(["scenario"])
            this.props.layer.mainLayerToggleVisibilityOn(["jurisdiction"])
        }

        if(_.isEqual(this.state.activeMode, ['stateAssets']) ){
            this.props.layer.mainLayerToggleVisibilityOn(["stateAssets"])
        }
        //landuse is active only when needed and zoomes in
        if(_.isEqual(this.state.showLayers,['landUse','commentMap','culverts','zone','evacuationRoutes','vulnerableDemographics', 'hazardEvents', 'criticalInfrastructure', 'nfip', 'stateAssets', 'actions'])){
            //console.log('in second if')
            this.props.layer.mainLayerToggleVisibilityOff(["landUse"])
            this.props.layer.mainLayerToggleVisibilityOff(["commentMap"])
            this.props.layer.mainLayerToggleVisibilityOff(["culverts"])
            this.props.layer.mainLayerToggleVisibilityOff(["zone"])
            this.props.layer.mainLayerToggleVisibilityOff(["evacuationRoutes"])
            this.props.layer.mainLayerToggleVisibilityOff(['vulnerableDemographics'])
            this.props.layer.mainLayerToggleVisibilityOff(['hazardEvents'])
            this.props.layer.mainLayerToggleVisibilityOff(['criticalInfrastructure'])
            this.props.layer.mainLayerToggleVisibilityOff(['nfip'])
            this.props.layer.mainLayerToggleVisibilityOff(['stateAssets'])
            this.props.layer.mainLayerToggleVisibilityOff(['actions'])
        }
        // if a layer is removed by X
        if((this.state.modeOff !== oldState.modeOff || this.state.modeOff !== "")  && this.state.showLayers.includes(this.state.modeOff)){
            //console.log('in third if')
            this.props.setActiveRiskZoneIdOff(this.state.activeMode)
            this.props.layer.mainLayerToggleVisibilityOff([this.state.modeOff])
            if(this.state.modeOff === 'scenario') {
                this.props.layer.visibilityToggleModeOff(this.props.activeRiskLayerVisibility[0], this.props.activeRiskLayerVisibility[1])
                //this.props.layer.scenarioLayer.legend.active = false
                this.props.layer.scenarioLayer.forceUpdate()
            }
            if(this.state.modeOff === 'landUse'){
                //this.props.layer.landUseLayer.legend.active = false
                this.props.layer.landUseLayer.forceUpdate()
            }
            if(this.state.modeOff === 'vulnerableDemographics'){
                //this.props.layer.vulnerableDemographicsLayer.legend.active = false
                this.props.layer.vulnerableDemographicsLayer.forceUpdate()
            }

        }
        // if a layer is selected after being turned off
        if(this.state.layerSelected !== "" && this.state.layerSelected !== 'landUse' && !this.state.showLayers.includes(this.state.layerSelected)){
            //console.log('in fourth if')
            this.props.layer.mainLayerToggleVisibilityOn([this.state.layerSelected],this.state.selected)
            if(this.state.layerSelected === 'scenario') {
                this.props.layer.visibilityToggleModeOn(this.props.activeRiskLayerVisibility[0], this.props.activeRiskLayerVisibility[1])
                //this.props.layer.scenarioLayer.legend.active = true
                this.props.layer.scenarioLayer.forceUpdate()
            }
            if(this.state.layerSelected === 'evacuationRoutes'){
                this.props.layer.evacuationRoutesLayer.showInfoBox(true)
            }
        }
        //to active the legend if selected landUse
        if(this.state.layerSelected === 'landUse' && !this.state.showLayers.includes('landUse')){
            //console.log('in fifth if')
            //this.props.layer.landUseLayer.legend.active = true
            this.props.layer.landUseLayer.forceUpdate()
        }
        if(this.state.layerSelected === 'vulnerableDemographics'){
            //this.props.layer.vulnerableDemographicsLayer.legend.active = true
            this.props.layer.vulnerableDemographicsLayer.forceUpdate()
        }

    }


    handleChange(e) {
        if(document.getElementById('closeMe'+e+'_block')){
            document.getElementById('closeMe'+e+'_block').style.display = 'initial'
        }
    }

    renderLayersDropDown(){
        return (
            <DROPDOWN>
                <SearchableDropDown
                    data={this.state.showLayers === ['landUse'] ? AllModes.filter(d => !this.state.activeMode.includes(d.value)) : AllModes.filter(d => this.state.showLayers.includes(d.value))}
                    placeholder={'Add Layer'}
                    hideValue={true}
                    onChange={(value,e) => {
                        this.setState(currentState =>(
                            {
                                activeMode: this.state.activeMode.includes(value) ? this.state.activeMode : [value,...this.state.activeMode],
                                layerSelected : value,
                                showLayers : _.pull(this.state.showLayers,value)
                            }))
                        this.handleChange(value)
                    }}
                    width={'100%'}
                />
            </DROPDOWN>

        )
    }

    render(){
        return (
            <div style={{'overflowX':'auto'}}>
                {this.renderLayersDropDown()}
                <br/>
                {AllBlocks.map((block,i) =>{
                    if(this.state.activeMode.includes(block.id.split('_')[0]) && block.id.split('_')[0] === 'scenario'){
                        return (
                            <div id={`closeMe`+ block.id} key={i}>
                                <h4 style ={{display: 'inline'}}>{block.title}</h4>
                                <button
                                    aria-label="Close"
                                    className="close"
                                    data-dismiss="alert"
                                    type="button"
                                    key={i}
                                    onClick={(e) =>{
                                        e.preventDefault();
                                        e.target.closest(`#closeMe`+ block.id).style.display = 'none'
                                        this.setState(currentState =>(
                                            {
                                                showLayers: [block.id.split('_')[0],...this.state.showLayers],
                                                modeOff : block.id.split('_')[0]
                                            }
                                        ))
                                        this.props.layer.mainLayerToggleVisibilityOff("scenario")
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
                    if(this.state.activeMode.includes(block.id.split('_')[0]) && block.id.split('_')[0] === 'jurisdiction'){
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
                                        this.setState(currentState =>(
                                            {
                                                showLayers: [block.id.split('_')[0],...this.state.showLayers],
                                                modeOff : block.id.split('_')[0]
                                            }
                                        ))
                                    }}
                                >
                                    <span aria-hidden="true"> ×</span>
                                </button>
                                <br/>
                                <JurisdictionControl
                                    layer = {this.props}
                                    activeMode = {this.state.activeMode}
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
                                        this.setState(currentState =>(
                                            {
                                                showLayers: [block.id.split('_')[0],...this.state.showLayers],
                                                modeOff : block.id.split('_')[0]
                                            }
                                        ))
                                        this.props.layer.mainLayerToggleVisibilityOff("zone")
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
                                        this.setState(currentState =>(
                                            {
                                                showLayers: [block.id.split('_')[0],...this.state.showLayers],
                                                modeOff : block.id.split('_')[0]
                                            }
                                        ))
                                    }}
                                >
                                    <span aria-hidden="true"> ×</span>
                                </button>
                                <br/>
                                <LandUseControl
                                    layer = {this.props}
                                />
                            </div>
                        )
                    }
                    if(this.state.activeMode.includes(block.id.split('_')[0]) && block.id.split('_')[0] === 'commentMap'){
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
                                        this.setState(currentState =>(
                                            {
                                                showLayers: [block.id.split('_')[0],...this.state.showLayers],
                                                modeOff : block.id.split('_')[0]
                                            }
                                        ))
                                    }}
                                >
                                    <span aria-hidden="true"> ×</span>
                                </button>
                                <br/>
                                <CommentMapControl
                                    layer = {this.props}
                                />
                            </div>
                        )
                    }
                    if(this.state.activeMode.includes(block.id.split('_')[0]) && block.id.split('_')[0] === 'culverts'){
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
                                        this.setState(currentState =>(
                                            {
                                                showLayers: [block.id.split('_')[0],...this.state.showLayers],
                                                modeOff : block.id.split('_')[0]
                                            }
                                        ))
                                    }}
                                >
                                    <span aria-hidden="true"> ×</span>
                                </button>
                                <br/>
                                <CulvertsControl
                                    layer = {this.props}
                                />
                            </div>
                        )
                    }
                    if(this.state.activeMode.includes(block.id.split('_')[0]) && block.id.split('_')[0] === 'evacuationRoutes'){

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
                                        this.setState(currentState =>(
                                            {
                                                showLayers: [block.id.split('_')[0],...this.state.showLayers],
                                                modeOff : block.id.split('_')[0]
                                            }
                                        ))
                                        this.props.layer.evacuationRoutesLayer.showInfoBox(false)

                                    }}
                                >
                                    <span aria-hidden="true"> ×</span>
                                </button>
                                <br/>
                                <EvacuationControl
                                    layer = {this.props}
                                />
                            </div>
                        )
                    }
                    if(this.state.activeMode.includes(block.id.split('_')[0]) && block.id.split('_')[0] === 'vulnerableDemographics'){
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
                                        this.setState(currentState =>(
                                            {
                                                showLayers: [block.id.split('_')[0],...this.state.showLayers],
                                                modeOff : block.id.split('_')[0]
                                            }
                                        ))
                                        this.props.layer.evacuationRoutesLayer.showInfoBox(false)
                                    }}
                                >
                                    <span aria-hidden="true"> ×</span>
                                </button>
                                <br/>
                                <VulnerableDemographicsControl
                                    layer = {this.props}
                                />
                            </div>
                        )
                    }
                    if(this.state.activeMode.includes(block.id.split('_')[0]) && block.id.split('_')[0] === 'hazardEvents'){
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
                                        this.setState(currentState =>(
                                            {
                                                showLayers: [block.id.split('_')[0],...this.state.showLayers],
                                                modeOff : block.id.split('_')[0]
                                            }
                                        ))
                                        this.props.layer.evacuationRoutesLayer.showInfoBox(false)
                                    }}
                                >
                                    <span aria-hidden="true"> ×</span>
                                </button>
                                <br/>
                                <HazardEventsControl
                                    layer = {this.props}
                                />
                            </div>
                        )
                    }

                    if(this.state.activeMode.includes(block.id.split('_')[0]) && block.id.split('_')[0] === 'criticalInfrastructure'){
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
                                        this.setState(currentState =>(
                                            {
                                                showLayers: [block.id.split('_')[0],...this.state.showLayers],
                                                modeOff : block.id.split('_')[0]
                                            }
                                        ))
                                        this.props.layer.evacuationRoutesLayer.showInfoBox(false)
                                    }}
                                >
                                    <span aria-hidden="true"> ×</span>
                                </button>
                                <br/>
                                <CriticalInfrastructureControls
                                    layer = {this.props}
                                />
                            </div>
                        )
                    }

                    if(this.state.activeMode.includes(block.id.split('_')[0]) && block.id.split('_')[0] === 'nfip'){
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
                                        this.setState(currentState =>(
                                            {
                                                showLayers: [block.id.split('_')[0],...this.state.showLayers],
                                                modeOff : block.id.split('_')[0]
                                            }
                                        ))
                                        this.props.layer.evacuationRoutesLayer.showInfoBox(false)
                                    }}
                                >
                                    <span aria-hidden="true"> ×</span>
                                </button>
                                <br/>
                                <NfipControls
                                    layer = {this.props}
                                />
                            </div>
                        )
                    }

                    if(this.state.activeMode.includes(block.id.split('_')[0]) && block.id.split('_')[0] === 'stateAssets'){
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
                                        this.setState(currentState =>(
                                            {
                                                showLayers: [block.id.split('_')[0],...this.state.showLayers],
                                                modeOff : block.id.split('_')[0]
                                            }
                                        ))
                                        this.props.layer.evacuationRoutesLayer.showInfoBox(false)
                                    }}
                                >
                                    <span aria-hidden="true"> ×</span>
                                </button>
                                <br/>
                                <StateAssetsControls
                                    layer = {this.props}
                                />
                            </div>
                        )
                    }

                    if(this.state.activeMode.includes(block.id.split('_')[0]) && block.id.split('_')[0] === 'actions'){
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
                                        this.setState(currentState =>(
                                            {
                                                showLayers: [block.id.split('_')[0],...this.state.showLayers],
                                                modeOff : block.id.split('_')[0]
                                            }
                                        ))
                                        this.props.layer.evacuationRoutesLayer.showInfoBox(false)
                                    }}
                                >
                                    <span aria-hidden="true"> ×</span>
                                </button>
                                <br/>
                                <ActionsControls
                                    layer = {this.props}
                                />
                            </div>
                        )
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
        assetsData : get(state.graph,['building','byGeoid'],{}),
        activeRiskLayerVisibility : state.scenario.activeRiskLayerVisibility
    });

const mapDispatchToProps = {
    sendSystemMessage,
    setActiveRiskZoneIdOff
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(MainControls))
