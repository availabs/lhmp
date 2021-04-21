import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import turfContains from '@turf/boolean-contains'
import turfCrosses from '@turf/boolean-crosses'
import Element from 'components/light-admin/containers/Element'
import {sendSystemMessage} from 'store/modules/messages';
import { fnum } from "utils/sheldusUtils"
import {falcorGraph} from "../../../../store/falcorGraph";
import SearchableDropDown from "../../../../components/filters/searchableDropDown";
import ZoneTable from "../components/zoneTable"
import functions from "../../Plan/functions";
import zoneConfig from "../../Zones/config";
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
            jurisdictionIds: [],
            jurisdiction_data: {},
            new_zone:false
        }

        this.handleChange = this.handleChange.bind(this);
        this.zoneDropDown = this.zoneDropDown.bind(this);
        this.selectedZones = this.selectedZones.bind(this);
    }

    componentDidUpdate(oldProps,oldState) {
        if (oldProps.activeMode.length !== this.props.activeMode.length) {
            if (localStorage.getItem("zone") === null || JSON.parse("[" + localStorage.getItem("zone") + "]")[0].length === 0) {
                // this.noSelectedZones()
            } else{
                this.fetchFalcorDeps()
                this.selectedZones()
            }
        }

        if(!_.isEqual(oldProps.layer.layer.zoneLayer.centroids, this.props.layer.layer.zoneLayer.centroids)){
            this.props.layer.layer.zoneLayer.forceUpdate()
        }

    }

    fetchFalcorDeps(){
        return this.props.falcor.get(
            ['forms',['zones', 'jurisdictions'],'byPlanId',this.props.activePlan,'length'], ['forms','zones','meta'])
            .then(response =>{

                let length = get(response,['json','forms','zones','byPlanId',this.props.activePlan,'length'],1) === null ?
                    1 :  get(response,['json','forms','zones','byPlanId',this.props.activePlan,'length'],0)
                let jurisdictionsLength = get(response,['json','forms','jurisdictions','byPlanId',this.props.activePlan,'length'],0);
                // if (length <= 1 || jurisdictionsLength <= 0) return Promise.resolve();
                this.props.falcor.get(
                    ['forms',['zones'],'byPlanId',this.props.activePlan,'byIndex',[{from:0,to:length-1}],['name','geom','building']],
                    ['forms',['jurisdictions'],'byPlanId',this.props.activePlan,'byIndex',[{from:0,to:jurisdictionsLength-1}],['name','geom','building']]
                )
                    .then(response =>{
                        let graph = get(response,['json','forms','zones','byPlanId',this.props.activePlan,'byIndex'],{})
                        let jurisdiction_data = get(response,['json','forms','jurisdictions','byPlanId',this.props.activePlan,'byIndex'],{})
                        let ids = [], jurisdictionIds = [];
                        if(graph){
                            Object.keys(graph).filter(d => d !=='$__path').forEach(item =>{
                                if(graph[item]){
                                    ids.push(graph[item].id)
                                }
                            })
                        }
                        if(jurisdiction_data){
                            Object.keys(jurisdiction_data).filter(d => d !=='$__path').forEach(item =>{
                                if(jurisdiction_data[item]){
                                    jurisdictionIds.push(jurisdiction_data[item].id)
                                }
                            })
                        }
                        this.setState({
                            zone_ids : ids,
                            zones_data:graph,
                            jurisdictionIds,
                            jurisdiction_data
                        })
                        return response
                    })
            })
    }

    handleChange(e) {
        this.setState({ ...this.state, [e.target.id]: e.target.value });

    };

    zoneDropDown(){
        if(this.props.zonesList){
            let current_jurisdiction = Object.values(get(this.state, ['jurisdiction_data'], {}))
                .filter(f => f)
                .filter(f => get(f, ['id'], null) === this.state.jurisdiction)[0]
            current_jurisdiction = get(current_jurisdiction, ['attributes', 'geojson'], null) ||
                get(current_jurisdiction, ['attributes', 'st_asgeojson'], null)
            let zones_list  = []
            let graph = this.state.zones_data

            if(Object.keys(graph).length >0){
                Object.keys(graph)
                    .filter(d => {
                        if (current_jurisdiction && d !== '$__path'){
                           return (
                               turfContains(
                                   {
                                       type: "Polygon",
                                       coordinates : get(JSON.parse(current_jurisdiction), ['coordinates', 0])
                                   },
                                   get(graph, [d, 'attributes', 'geojson'], null) ||
                                   get(graph, [d, 'attributes', 'st_asgeojson'], null)
                               )
                           )
                        }
                        return  d !== '$__path'
                    })
                    .filter(d =>  !this.state.zone_type || this.state.zone_type === graph[d].attributes.zone_type)
                    .forEach(item =>{
                        if(graph[item] /*&& this.state.zone_ids.includes(graph[item].id)*/){
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

    jurisdictionDropDown(){
        if(this.props.jurisdiction_data){
            let zones_list  = [{
                'label': '',
                'value': '',
            }]
            let graph = this.state.jurisdiction_data
            if(Object.keys(graph).length >0){
                Object.keys(graph).filter(d => d !== '$__path').forEach(item =>{
                    if(graph[item] /*&& this.state.jurisdictionIds.includes(graph[item].id)*/){
                        zones_list.push({
                            'label': graph[item].attributes ? functions.formatName(graph[item].attributes.name, graph[item].attributes.geoid) : 'None',
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
                    bbox: zone.bbox || '',
                    type: zone.type || 'No Type Data'
                })
            })
            selectedZonesData = _.uniqBy(selectedZonesData.filter(d => d.geoid !== null || d.geom !== "[]"),'zone_id')

            return (
                <ZoneTable
                    zone_id = {this.state.zone_id}
                    zones = {_.uniqBy(selectedZonesData,'zone_id')}
                    scenario_id={scenario_id}
                    noShowBoundary = {this.props.layer.layer.zoneLayer}
                    layer = {this.props.layer.layer.zoneLayer}
                />
            )
        }
    }

    render(){
        let zones_list = this.zoneDropDown();
        let jurisdictions_list = this.jurisdictionDropDown()
        let zones = JSON.parse(localStorage.getItem('zone')) || []
        let zoneMetaTypes = get(zoneConfig, [0,'attributes', 'zone_type', 'meta_filter', 'value'], null) ||  this.props.formsZonesMeta
        zoneMetaTypes =
            zoneMetaTypes
                .filter(zmt => !['Select All', 'Select None'].includes(zmt))
                .map(zmt => ({label: zmt.type || zmt, value: zmt.type || zmt}));
            return (
                <div>
                    <div style={{marginTop: '-30px', display: 'flex', justifyContent: 'flex-end'}}>
                        <button
                            id="new_zone_button"
                            className="mr-2 mb-2 btn btn-primary btn-sm"
                            type="button"
                            onClick = {(e) =>{
                                this.props.layer.layer.addNewZoneOnClick(e)
                            }}
                        >Add New Zone</button>
                    </div>
                    <div style={{display:'table-row'}}>
                        <div className="col-sm-12">
                            <div className="form-group"><h6>Zone list</h6>
                                {zones_list && zones_list.length ?
                                    <div style={{paddingTop: '5px'}}>
                                        <SearchableDropDown
                                            data={zones_list}
                                            placeholder={'Select a Zone'}
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
                                                            bbox: zone.bbox,
                                                            type: zone.zone_type
                                                        });
                                                    }
                                                })
                                                localStorage.setItem('zone', JSON.stringify(zones));
                                                this.props.layer.layer.zoneLayer.showTownBoundary(localStorage.getItem("zone"))
                                                this.selectedZones()
                                            }}
                                        />
                                    </div> : null}
                            </div>
                        </div>

                        <div className="col-sm-12">
                            <div className="form-group"><h6>Filter by Jurisdiction</h6>
                                {
                                    jurisdictions_list && jurisdictions_list.length ?
                                        <SearchableDropDown
                                            data={jurisdictions_list}
                                            placeholder={'Select a Municipality'}
                                            value={jurisdictions_list.filter(f => f.value === this.state.jurisdiction)[0]}
                                            hideValue={false}
                                            onChange={(value) => {
                                                this.setState({jurisdiction:value})
                                            }}
                                        /> : null
                                }
                            </div>
                        </div>

                        <div className="col-sm-12">
                            <div className="form-group"><h6>Filter by Type</h6>
                                <SearchableDropDown
                                    data={zoneMetaTypes}
                                    placeholder={'Select Type'}
                                    value={zoneMetaTypes.filter(f => f.value === this.state.zone_type)[0]}
                                    hideValue={false}
                                    onChange={(value) => {
                                        this.setState({zone_type:value})
                                    }}
                                />
                            </div>
                        </div>

                    </div>
                    <div>
                        {
                            zones && zones.length>0 ? this.selectedZones() : <div>Please Create or Select a zone</div>
                        }
                    </div>
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
        zonesList : get(state.graph,['forms','byId'],{}),
        jurisdiction_data: get(state.graph, ['forms',['jurisdictions'],'byPlanId',state.user.activePlan,'byIndex'], {}),
        formsZonesMeta : get(state.graph,['forms','zones','meta','value'],[]),
        assetsData : get(state.graph,['building','byGeoid'],{}),
    });

const mapDispatchToProps = {
    sendSystemMessage
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(ZoneControl))
