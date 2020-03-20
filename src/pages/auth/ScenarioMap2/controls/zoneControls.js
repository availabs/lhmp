import React from 'react';
import AvlFormsViewData from 'components/AvlForms/displayComponents/viewData';
import config from 'pages/auth/Roles/roles_forms/config.js'
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import {sendSystemMessage} from 'store/modules/messages';
import { fnum } from "utils/sheldusUtils"
import {falcorGraph} from "../../../../store/falcorGraph";
import ScenarioTable from "../components/scenariosTable";
import SearchableDropDown from "../components/searchableDropDown";
import ZoneTable from "../components/zoneTable"
import {ZoneLayer,ZoneOptions} from "../layers/zoneLayer.js";

class ZoneControl extends React.Component{
    constructor(props){
        super(props);

        this.state ={
            zone_id : [],
            geoid: '',
            zone_name:'',

        }
    }

    componentDidUpdate(oldProps){
        console.log('props',oldProps.activeMode.length,this.props.activeMode.length)
        if(oldProps.activeMode.length !== this.props.activeMode.length){
            if(localStorage.getItem("zone") === null || JSON.parse("[" + localStorage.getItem("zone") + "]")[0].length === 0){
                console.log('in if of component did update')
                this.noSelectedZones()
            }else{
                if(this.props.zonesList[this.props.activePlan] && this.props.zonesList[this.props.activePlan].zones){
                    console.log('in else of component did update')
                    this.selectedZones()
                }
            }
        }
    }

    fetchFalcorDeps(){
        return this.props.falcor.get(['plan',this.props.activePlan,'zones'])
            .then(response =>{
                return response
            })
    }

    handleChange(e) {
        console.log('---',e.target.id,e.target.value,this.state);
        this.setState({ ...this.state, [e.target.id]: e.target.value });

    };

    zoneDropDown(){
        if(this.props.zonesList[this.props.activePlan]){
            let zones_list  = []
            let graph = this.props.zonesList[this.props.activePlan].zones
            if(graph){
                Object.keys(graph.value).filter(d => d !== '$type').forEach(item =>{
                    zones_list.push({
                        'label':graph.value[item] ? graph.value[item].name : 'None' ,
                        'value':graph.value[item] ? graph.value[item].id : '',
                        'geoid':graph.value[item] ? graph.value[item].geoid : ''
                    })

                })

                return zones_list
            }


        }
    }


    noSelectedZones(){
        let zonesByGeoid = [];
        let currentZoneData = []
        let scenario_id = localStorage.getItem("scenario_id")
        if(this.props.zonesList[this.props.activePlan] && this.props.zonesList[this.props.activePlan].zones){
            zonesByGeoid = this.props.zonesList[this.props.activePlan].zones.value
        }
        if(localStorage.getItem("zone") === null || JSON.parse("[" + localStorage.getItem("zone") + "]")[0].length === 0){
            zonesByGeoid.forEach(zone =>{
                if(zone['geoid'] === this.props.activeGeoid){
                    currentZoneData.push({
                        zone_id: zone.id,
                        geoid : zone.geoid,
                        name: zone.name
                    })
                    let ids = JSON.parse(localStorage.getItem('zone')) || [];
                    ids.push({id:zone.id,geoid:this.props.activeGeoid});
                    localStorage.setItem('zone', JSON.stringify(ids));
                }
            });
            return (
                <ZoneTable
                    //activeMode = {this.props.activeMode}
                    zones = {currentZoneData}
                    scenario_id={scenario_id}
                />
            )
        }

    }



    selectedZones(){
        let zonesByGeoid = [];
        let selectedZonesData = [];
        let scenario_id = localStorage.getItem("scenario_id");
        if(this.props.zonesList[this.props.activePlan] && this.props.zonesList[this.props.activePlan].zones){
            zonesByGeoid = this.props.zonesList[this.props.activePlan].zones.value;
            let zone_ids = JSON.parse("[" + localStorage.getItem("zone") + "]")[0];
            zone_ids.forEach(zone_id =>{
                zonesByGeoid.forEach(zone =>{
                    if(zone_id['id'] === zone.id){
                        selectedZonesData.push({
                            zone_id : zone.id,
                            geoid : zone.geoid,
                            name: zone.name
                        })
                    }else{
                        if(zone_id['id'] !==zone.id && zone.geoid === this.props.activeGeoid && JSON.parse("[" + localStorage.getItem("zone") + "]")[0].length === 0){
                            selectedZonesData.push({
                                zone_id : zone.id,
                                geoid : zone.geoid,
                                name: zone.name
                            })
                        }

                    }

                });
            });
            return (
                <ZoneTable
                    //activeMode = {this.props.activeMode}
                    zones = {selectedZonesData}
                    scenario_id={scenario_id}
                    noShowBoundary = {this.props.layer.layer.zoneLayer ? this.props.layer.layer.zoneLayer : ''}
                />
            )


        }
    }


    render(){
        let zones_list = this.zoneDropDown();
        //localStorage.removeItem("zone")
        if(zones_list && zones_list.length > 0){
            let ids = []
            return (
                <div>
                    <SearchableDropDown
                        data={zones_list}
                        placeholder={'Select a Type'}
                        value={zones_list.filter(f => f.value === this.state.zone_id)[0]}
                        onChange={(value) => {
                            this.setState({zone_id:value})
                            ids = JSON.parse(localStorage.getItem('zone')) || [];
                            zones_list.forEach(zone =>{
                                if(zone.value === value){
                                    ids.push({id:value,geoid:zone.geoid});
                                }
                            })
                            localStorage.setItem('zone', JSON.stringify(ids));
                            this.props.layer.layer.zoneLayer.showTownBoundary(localStorage.getItem("zone"))
                            this.selectedZones()
                        }}
                    />
                    <div>
                        {
                            localStorage.getItem("zone") === null || JSON.parse("[" + localStorage.getItem("zone") + "]")[0].length === 0?
                                this.noSelectedZones()
                                :
                                this.selectedZones()
                        }
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
        zonesList : get(state.graph,['plan'],{}),
        assetsData : get(state.graph,['building','byGeoid'],{})
    });

const mapDispatchToProps = {
    sendSystemMessage
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(ZoneControl))