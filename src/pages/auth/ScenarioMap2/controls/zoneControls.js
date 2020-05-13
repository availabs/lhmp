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
            zone_ids : [],
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
                let length = response.json.forms['zones'].byPlanId[this.props.activePlan].length
                this.props.falcor.get(['forms',['zones'],'byPlanId',this.props.activePlan,'byIndex',[{from:0,to:length-1}],['name','geom','building']])
                    .then(response =>{
                        let graph = response.json.forms['zones'].byPlanId[this.props.activePlan].byIndex
                        let ids = []
                        if(graph){
                            Object.keys(graph).forEach(item =>{
                                ids.push(graph[item].id)
                            })
                        }
                        this.setState({
                            zone_ids : ids
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
            let graph = this.props.zonesList
            if(Object.keys(graph).length >0){
                Object.keys(graph).forEach(item =>{
                    if(this.state.zone_ids.includes(graph[item].value.id)){
                        zones_list.push({
                            'label': graph[item].value.attributes ? graph[item].value.attributes.name : 'None',
                            'value': graph[item].value ? graph[item].value.id : '',
                            'geoid': graph[item].value.attributes ? graph[item].value.attributes.geoid : '',
                            'geom' : graph[item].value.attributes ? graph[item].value.attributes.geom : '',
                            'geojson' : graph[item].value.attributes.geojson ? graph[item].value.attributes.geojson : ''
                        })
                    }
                })
                return zones_list
            }
        }
    }


    noSelectedZones(){
        let currentZoneData = []
        let scenario_id = localStorage.getItem("scenario_id")
        let graph = this.props.zonesList
        let ids = JSON.parse(localStorage.getItem('zone')) || [];
        if(Object.keys(graph).length > 0){
            if(localStorage.getItem("zone") === null || JSON.parse("[" + localStorage.getItem("zone") + "]")[0].length === 0){
                Object.keys(graph).forEach(item =>{
                    if(graph[item].value.attributes.geoid === this.props.activeGeoid){
                        currentZoneData.push({
                            zone_id:  graph[item].value ? graph[item].value.id : '',
                            geoid : graph[item].value.attributes ? graph[item].value.attributes.geoid : '',
                            name: graph[item].value.attributes ? graph[item].value.attributes.name : 'None',
                            geom: graph[item].value.attributes ? graph[item].value.attributes.geom : '',
                        })
                    }

                })
                ids = currentZoneData
                localStorage.setItem('zone', JSON.stringify(ids));
            }
            return (
                <ZoneTable
                    zones = {currentZoneData}
                    scenario_id={scenario_id}
                />
            )
        }

    }

    selectedZones(){
        let selectedZonesData = [];
        let graph = this.props.zonesList
        let scenario_id = localStorage.getItem("scenario_id");
        let ids = JSON.parse("[" + localStorage.getItem("zone") + "]")[0];
        if(Object.keys(graph).length > 0){
            Object.keys(graph).forEach(item =>{
                ids.forEach(zone_id =>{
                    //if already in database
                    if(zone_id['zone_id'] === graph[item].value.id){
                        selectedZonesData.push({
                            zone_id:  graph[item].value ? graph[item].value.id : '',
                            geoid : graph[item].value.attributes ? graph[item].value.attributes.geoid : '',
                            name: graph[item].value.attributes ? graph[item].value.attributes.name : 'None',
                            geom: graph[item].value.attributes ? graph[item].value.attributes.geom : '',
                        })
                    }
                    //if a new zone is created
                    else if(zone_id.zone_id === null && _.isEqual(JSON.stringify(zone_id.bbox.map(d => [d[0], d[1]])),graph[item].value.attributes.bbox)){
                        selectedZonesData.push({
                            zone_id: graph[item].value ? graph[item].value.id : '',
                            geoid: graph[item].value.attributes ? graph[item].value.attributes.geoid : null,
                            geom: graph[item].value.attributes ? graph[item].value.attributes.geom : '',
                            name: graph[item].value.attributes ? graph[item].value.attributes.name : 'None',
                            bbox: graph[item].value.attributes ? graph[item].value.attributes.bbox : ''
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
                    noShowBoundary = {this.props.layer.layer.zoneLayer}
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
                            hideValue={false}
                            onChange={(value) => {
                                this.setState({zone_id:value})
                                ids = JSON.parse(localStorage.getItem('zone'));
                                zones_list.forEach(zone =>{
                                    if(zone.value === value){
                                        ids.push({
                                            zone_id:value,
                                            geoid:zone.geoid || null,
                                            geom: zone.geom,
                                            name:zone.label,
                                            geojson: zone.geojson
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
        zonesList : get(state.graph,['forms','byId'],{}),
        assetsData : get(state.graph,['building','byGeoid'],{})
    });

const mapDispatchToProps = {
    sendSystemMessage
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(ZoneControl))