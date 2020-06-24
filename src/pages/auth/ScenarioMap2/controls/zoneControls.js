import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import {sendSystemMessage} from 'store/modules/messages';
import { fnum } from "utils/sheldusUtils"
import {falcorGraph} from "../../../../store/falcorGraph";
import SearchableDropDown from "../../../../components/filters/searchableDropDown";
import ZoneTable from "../components/zoneTable"
var _ = require("lodash")
class ZoneControl extends React.Component{
    constructor(props){
        super(props);

        this.state ={
            zone_id : '',
            geoid: '',
            zone_name:'',
            zone_ids : [],
            zones_data:{},
            new_zone:false
        }
    }

    componentDidUpdate(oldProps,oldState) {
        if (oldProps.activeMode.length !== this.props.activeMode.length) {
            if (localStorage.getItem("zone") === null || JSON.parse("[" + localStorage.getItem("zone") + "]")[0].length === 0) {
                console.log('in if of component did update')
                this.noSelectedZones()
            } else{
                this.fetchFalcorDeps()
                this.selectedZones()
            }
        }


    }

    fetchFalcorDeps(){
        return this.props.falcor.get(['forms',['zones'],'byPlanId',this.props.activePlan,'length'])
            .then(response =>{
                let length = get(response,['json','forms','zones','byPlanId',this.props.activePlan,'length'],1) === null ? 1 :  get(response,['json','forms','zones','byPlanId',this.props.activePlan,'length'],0)
                this.props.falcor.get(['forms',['zones'],'byPlanId',this.props.activePlan,'byIndex',[{from:0,to:length-1}],['name','geom','building']])
                    .then(response =>{
                        let graph = get(response,['json','forms','zones','byPlanId',this.props.activePlan,'byIndex'],{})
                        let ids = []
                        if(graph){
                            Object.keys(graph).filter(d => d !=='$__path').forEach(item =>{
                                if(graph[item]){
                                    ids.push(graph[item].id)
                                }
                            })
                        }
                        this.setState({
                            zone_ids : ids,
                            zones_data:graph
                        })
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
            let graph = this.state.zones_data
            if(Object.keys(graph).length >0){
                Object.keys(graph).filter(d => d !== '$__path').forEach(item =>{
                    if(graph[item] && this.state.zone_ids.includes(graph[item].id)){
                        zones_list.push({
                            'label': graph[item].attributes ? graph[item].attributes.name : 'None',
                            'value': graph[item] ? graph[item].id : '',
                            'geoid': graph[item].attributes ? graph[item].attributes.geoid : '',
                            'geom' : graph[item].attributes ? graph[item].attributes.geom : '',
                            'geojson' : graph[item].attributes.geojson ? graph[item].attributes.geojson : '',
                            'bbox':graph[item].attributes.bbox ? graph[item].attributes.bbox : ''
                        })
                    }
                })
                return zones_list
            }
        }
    }

    selectedZones(){
        let selectedZonesData = [];
        let scenario_id = localStorage.getItem("scenario_id");
        let zones = JSON.parse("[" + localStorage.getItem("zone") + "]")[0];
        if(zones && zones.length > 0){
            zones.forEach(zone =>{
                selectedZonesData.push({
                    zone_id: zone.zone_id || '',
                    geoid: zone.geoid || '',
                    geom: zone.geom || '',
                    name: zone.name || 'None',
                    bbox: zone.bbox || ''
                })
            })
            selectedZonesData = _.uniqBy(selectedZonesData.filter(d => d.geoid !== null || d.geom !== "[]"),'zone_id')
            return (
                <ZoneTable
                    zone_id = {this.state.zone_id}
                    zones = {_.uniqBy(selectedZonesData,'zone_id')}
                    scenario_id={scenario_id}
                    noShowBoundary = {this.props.layer.layer.zoneLayer}
                />
            )
        }
    }


    render(){
        //localStorage.removeItem("zone")
        let zones_list = this.zoneDropDown();
        let zones = JSON.parse(localStorage.getItem('zone')) || []
        if(zones_list){
            return (
                <div>
                    <div style={{display:'flex',justifyContent:'space-between'}}>
                        <SearchableDropDown
                            data={zones_list}
                            placeholder={'Select a Type'}
                            value={zones_list.filter(f => f.value === this.state.zone_id)[0]}
                            hideValue={false}
                            onChange={(value) => {
                                this.setState({zone_id:value})
                                zones_list.forEach(zone =>{
                                    if(zone.value === value){
                                        zones.push({
                                            zone_id:value,
                                            geoid:zone.geoid || null,
                                            geom: zone.geom,
                                            name:zone.label,
                                            geojson: zone.geojson,
                                            bbox: zone.bbox
                                        });
                                    }
                                })
                                localStorage.setItem('zone', JSON.stringify(zones));
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
                            zones && zones.length>0 ? this.selectedZones() : <div>Please Create or Select a zone</div>
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
        zonesList : get(state.graph,['forms','byId'],{}),
        assetsData : get(state.graph,['building','byGeoid'],{})
    });

const mapDispatchToProps = {
    sendSystemMessage
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(ZoneControl))