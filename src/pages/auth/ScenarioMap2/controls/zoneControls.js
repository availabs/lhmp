import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import {sendSystemMessage} from 'store/modules/messages';
import { fnum } from "utils/sheldusUtils"
import {falcorGraph} from "../../../../store/falcorGraph";
import SearchableDropDown from "../components/searchableDropDown";
import ZoneTable from "../components/zoneTable"
var _ = require("lodash")
class ZoneControl extends React.Component{
    constructor(props){
        super(props);

        this.state ={
            zone_id : '',
            geoid: '',
            zone_name:'',
            new_zone:false
        }
    }

    componentDidUpdate(oldProps,oldState) {
        if (oldProps.activeMode.length !== this.props.activeMode.length) {
            if (localStorage.getItem("zone") === null || JSON.parse("[" + localStorage.getItem("zone") + "]")[0].length === 0) {
                console.log('in if of component did update')
                this.noSelectedZones()
            } else if (this.props.zonesList[this.props.activePlan] && this.props.zonesList[this.props.activePlan].zones) {
                console.log('in else of component did update')
                this.selectedZones()
            }
        }


    }

    fetchFalcorDeps(){
        //console.log('in fetch',falcorGraph.getCache())
        return this.props.falcor.get(['zones',this.props.activePlan,'length'])
            .then(res =>{
                let length = res.json.zones[this.props.activePlan].length
                this.props.falcor.get(['zones',this.props.activePlan,'byIndex',[{from:0,to:length-1}],['id','name','geoid','geom','geojson']])
                    .then(response =>{
                        return response
                    })

            })
    }

    handleChange(e) {
        console.log('---',e.target.id,e.target.value,this.state);
        this.setState({ ...this.state, [e.target.id]: e.target.value });

    };

    zoneDropDown(){
        if(this.props.zonesList){
            let zones_list  = []
            let graph = this.props.zonesList
            if(graph){
                Object.keys(graph).forEach(item =>{
                    zones_list.push({
                        'label':graph[item].name ? graph[item].name.value : 'None' ,
                        'value':graph[item].id ? graph[item].id.value : '',
                        'geoid':graph[item].geoid ? graph[item].geoid.value : '',
                        'geom':graph[item].geom ? graph[item].geom.value : '',
                        'geojson':graph[item].geojson ? graph[item].geojson.value :''
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
        if(this.props.zonesList){
            zonesByGeoid = this.props.zonesList
        }

        if(localStorage.getItem("zone") === null || JSON.parse("[" + localStorage.getItem("zone") + "]")[0].length === 0){
            Object.keys(zonesByGeoid).forEach(zone =>{
                if(zonesByGeoid[zone].geoid.value === this.props.activeGeoid){
                    currentZoneData.push({
                        zone_id: zonesByGeoid[zone].id.value,
                        geoid : zonesByGeoid[zone].geoid.value,
                        name: zonesByGeoid[zone].name.value,
                        geom:zonesByGeoid[zone].geom.value
                    })
                    let ids = JSON.parse(localStorage.getItem('zone')) || [];
                    ids.push({
                        id:zonesByGeoid[zone].id.value,
                        geoid:this.props.activeGeoid,
                        geom:zonesByGeoid[zone].geom.value,
                        name: zonesByGeoid[zone].name.value
                    });
                    localStorage.setItem('zone', JSON.stringify(ids));

                }
            })
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
        if(this.props.zonesList){
            zonesByGeoid = this.props.zonesList;
            let zone_ids = JSON.parse("[" + localStorage.getItem("zone") + "]")[0];
            Object.keys(zonesByGeoid).forEach(zone =>{
                zone_ids.forEach(zone_id =>{
                    if(zone_id['id'] === zonesByGeoid[zone].id.value){
                        selectedZonesData.push({
                            zone_id : zonesByGeoid[zone].id.value,
                            geoid : zonesByGeoid[zone].geoid.value,
                            geom: zonesByGeoid[zone].geom.value,
                            name: zonesByGeoid[zone].name.value
                        })
                    }else{
                        selectedZonesData.push({
                            zone_id : zone_id.id,
                            geoid : zone_id.geoid,
                            geom: zone_id.geom.geometry ? JSON.stringify(get(zone_id, `geom.geometry`, [])): zone_id.geom,
                            name: zone_id.name
                        })
                    }
                })
            })
            selectedZonesData = _.uniqBy(selectedZonesData.filter(d => d.geoid !== null || d.geom !== "[]"),'zone_id');
            return (
                <ZoneTable
                    zone_id = {this.state.zone_id}
                    zones = {_.uniqBy(selectedZonesData,'zone_id')}
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
                    <div style={{display:'flex',justifyContent:'space-between'}}>
                        <SearchableDropDown
                            data={zones_list}
                            placeholder={'Select a Type'}
                            value={zones_list.filter(f => f.value === this.state.zone_id)[0]}
                            onChange={(value) => {
                                this.setState({zone_id:value})
                                ids = JSON.parse(localStorage.getItem('zone'));
                                zones_list.forEach(zone =>{
                                    if(zone.value === value){
                                        console.log('zone',zone)
                                        ids.push({
                                            id:value,
                                            geoid:zone.geoid,
                                            geom: zone.geom,
                                            name:zone.label,
                                            geojson:JSON.parse(zone.geojson)
                                        });
                                    }
                                })


                                localStorage.setItem('zone', JSON.stringify(ids));
                                this.props.layer.layer.zoneLayer.showTownBoundary(localStorage.getItem("zone"))
                                this.selectedZones()
                            }}
                        />
                    <button
                            id="new_zone_button"
                            className="mr-2 mb-2 btn btn-primary btn-sm"
                            type="button"
                            onClick = {(e) =>{
                                this.props.layer.layer.addNewZoneOnClick(e)
                            }}
                    >Add New Zone</button>
                    </div>
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
        zonesList : get(state.graph,['zones','byId'],{}),
        assetsData : get(state.graph,['building','byGeoid'],{})
    });

const mapDispatchToProps = {
    sendSystemMessage
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(ZoneControl))