import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import {sendSystemMessage} from 'store/modules/messages';
import { fnum } from "utils/sheldusUtils"
import {falcorGraph} from "../../../../store/falcorGraph";
import SearchableDropDown from "../../../../components/filters/searchableDropDown";
import JurisdictionTable from "../components/jurisdictionTable"
var _ = require("lodash")
class JurisdictionControl extends React.Component{
    constructor(props){
        super(props);

        this.state ={
            zone_id : '',
            geoid: '',
            zone_name:'',
            zone_ids : [],
            jurisdiction_data : {},
            new_zone:false
        }

        this.handleChange = this.handleChange.bind(this);
        this.jurisdictionDropDown = this.jurisdictionDropDown.bind(this);
        this.noSelectedZones = this.noSelectedZones.bind(this);
        this.selectedZones = this.selectedZones.bind(this);
    }

    componentDidUpdate(oldProps,oldState) {
        console.log('did update?', oldProps.layer.layer.jurisdictonLayer.centroids, this.props.layer.layer.jurisdictonLayer.centroids)
        if (oldProps.activeMode.length !== this.props.activeMode.length) {
            if (localStorage.getItem("jurisdiction") === null || JSON.parse("[" + localStorage.getItem("jurisdiction") + "]")[0].length === 0) {
                console.log('in if of component did update')
                this.noSelectedZones()
            } else{
                this.fetchFalcorDeps()
                this.selectedZones()
            }
        }

        if(!_.isEqual(oldProps.layer.layer.jurisdictonLayer.centroids, this.props.layer.layer.jurisdictonLayer.centroids)){
            console.log('force update')
            this.props.layer.layer.jurisdictonLayer.forceUpdate()
        }

    }

    fetchFalcorDeps(){
        return this.props.falcor.get(['forms',['jurisdictions'],'byPlanId',this.props.activePlan,'length'])
            .then(response =>{
                let length = get(response,['json','forms','jurisdictions','byPlanId',this.props.activePlan,'length'],0)
                this.props.falcor.get(['forms',['jurisdictions'],'byPlanId',this.props.activePlan,'byIndex',[{from:0,to:length-1}],['name','geom','building']])
                    .then(response =>{
                        let graph = get(response,['json','forms','jurisdictions','byPlanId',this.props.activePlan,'byIndex'],{})
                        let ids = []
                        if(graph){
                            Object.keys(graph).forEach(item =>{
                                ids.push(graph[item].id)
                            })
                        }
                        this.setState({
                            zone_ids : ids,
                            jurisdiction_data : graph
                        })
                        return response
                    })
            })
    }

    handleChange(e) {
        console.log('---',e.target.id,e.target.value,this.state);
        this.setState({ ...this.state, [e.target.id]: e.target.value });

    };

    jurisdictionDropDown(){
        if(this.props.zonesList){
            let jurisdiction_list  = []
            let graph = this.state.jurisdiction_data
            if(Object.keys(graph).length >0){
                Object.keys(graph).forEach(item =>{
                    jurisdiction_list.push({
                        'label': graph[item].attributes ? graph[item].attributes.name : 'None',
                        'value': graph[item] ? graph[item].id : '',
                        'geoid': graph[item].attributes ? graph[item].attributes.geoid : '',
                        'geom' : graph[item].attributes ? graph[item].attributes.geom : '',
                        'geojson' : graph[item].attributes ? graph[item].attributes.geojson : ''
                    })
                })
                return jurisdiction_list
            }
        }
    }


    noSelectedZones(){
        let currentZoneData = []
        let scenario_id = localStorage.getItem("scenario_id")
        let graph = this.state.jurisdiction_data
        let ids = JSON.parse(localStorage.getItem('jurisdiction')) || [];
        //console.log('graph',this.props.zonesList)
        if(Object.keys(graph).length > 0){
            if(localStorage.getItem("jurisdiction") === null || JSON.parse("[" + localStorage.getItem("jurisdiction") + "]")[0].length === 0){
                Object.keys(graph).filter(d => d !== '$__path').forEach(item =>{
                    if(graph[item].attributes.geoid === this.props.activeGeoid){
                        currentZoneData.push({
                            zone_id:  graph[item] ? graph[item].id : '',
                            geoid : graph[item].attributes ? graph[item].attributes.geoid : '',
                            name: graph[item].attributes ? graph[item].attributes.name : 'None',
                            geom: graph[item].attributes ? graph[item].attributes.geom : '',
                        })
                    }

                })
                ids = currentZoneData
                localStorage.setItem('jurisdiction', JSON.stringify(ids));
            }
            return (
                <JurisdictionTable
                    zones = {currentZoneData}
                    scenario_id={scenario_id}
                />
            )
        }

    }

    selectedZones(){
        let selectedZonesData = [];
        let graph = this.state.jurisdiction_data
        let scenario_id = localStorage.getItem("scenario_id");
        let ids = JSON.parse("[" + localStorage.getItem("jurisdiction") + "]")[0];
        if(Object.keys(graph).length > 0){
            Object.keys(graph).filter(d => d !== '$__path').forEach(item =>{
                ids.forEach(zone_id =>{
                    if(graph[item] && zone_id['geoid'] === graph[item].attributes.geoid){
                        selectedZonesData.push({
                            zone_id:  graph[item] ? graph[item].id : '',
                            geoid : graph[item].attributes ? graph[item].attributes.geoid : '',
                            name: graph[item].attributes ? graph[item].attributes.name : 'None',
                            geom: graph[item].attributes ? graph[item].attributes.geom : '',
                        })
                    }
                })
            })
            selectedZonesData = _.uniqBy(selectedZonesData.filter(d => d.geoid !== null || d.geom !== "[]"),'zone_id');
            return (
                <JurisdictionTable
                    zone_id = {this.state.zone_id}
                    zones = {_.uniqBy(selectedZonesData,'zone_id')}
                    scenario_id={scenario_id}
                    noShowBoundary = {this.props.layer.layer.jurisdictonLayer}
                    layer={this.props.layer.layer.jurisdictonLayer}
                />
            )

        }
    }


    render(){
        console.log('layer updated?', this.props.layer.layer.jurisdictonLayer)
        let zones_list = this.jurisdictionDropDown();
        //localStorage.removeItem("jurisdiction")
        if(zones_list && zones_list.length > 0){
            let ids = []
            return (
                <div>
                    <div style={{display:'flex',justifyContent:'space-between'}}>
                        <SearchableDropDown
                            data={zones_list}
                            placeholder={'Add Jurisdiction'}
                            value={zones_list.filter(f => f.value === this.state.zone_id)[0]}
                            hideValue={true}
                            onChange={(value) => {
                                this.setState({zone_id:value})
                                ids = JSON.parse(localStorage.getItem('jurisdiction'));
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
                                localStorage.setItem('jurisdiction', JSON.stringify(ids));
                                this.props.layer.layer.jurisdictonLayer.showTownBoundary(localStorage.getItem("jurisdiction"))
                                this.selectedZones()
                            }}
                        />
                    </div>
                    <div>
                        {
                            localStorage.getItem("jurisdiction") === null || JSON.parse("[" + localStorage.getItem("jurisdiction") + "]")[0].length === 0?
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

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(JurisdictionControl))