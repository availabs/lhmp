import React from 'react';
import { connect } from 'react-redux';
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import {sendSystemMessage} from 'store/modules/messages';
import { fnum } from "utils/sheldusUtils"
import { register, unregister } from "components/AvlMap/ReduxMiddleware.js"
import { reduxFalcor, UPDATE as REDUX_UPDATE } from 'utils/redux-falcor'

import * as d3 from "d3";
import ZoneModalData from "./zoneModalData";

var _ = require("lodash")
var format =  d3.format("~s")
const fmt = (d) => d < 1000 ? d : format(d)

const showZoneModal = (zone_id,zone_geoid,name,activeScenarioId,activeRiskZoneId,geom,setState) => {
    return (
        <div aria-labelledby="mySmallModalLabel" className="modal fade bd-example-modal-lg show" role="dialog"
             tabIndex="-1" aria-modal="true" style={{paddingRight: '15px', display: 'block'}}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header"><h5 className="modal-title" id="exampleModalLabel">Zone Buildings By Scenario : {name}</h5>
                        <button aria-label="Close" className="close" data-dismiss="modal" type="button"
                                onClick={() => setState({ showZoneModal: false })}
                        >
                            <span aria-hidden="true"> ×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <ZoneModalData
                            name = {name}
                            zone_id = {zone_id}
                            geoid ={zone_geoid}
                            scenario_id = {activeScenarioId}
                            risk_zone_id ={activeRiskZoneId}
                            geom = {geom}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

class ZoneTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            zone_clicked:false,
            data: [],
            zone_id : ''
        }
        //this.populateZonesData = this.populateZonesData.bind(this)
    }

    componentDidUpdate(oldProps,oldState){

        if(oldProps.zones.length !== this.props.zones.length){
            this.fetchFalcorDeps()
        }
        if(oldProps.activeScenarioId !== this.props.activeScenarioId){
            this.fetchFalcorDeps()
        }
        if(oldProps.zone_id !== this.props.zone_id){
            this.fetchFalcorDeps()
        }
    }

    fetchFalcorDeps(){
        if(this.props.zones){
            let data = []
            let graph_zones = {}
            let scenario_id = this.props.activeScenarioId.map(d => d.id)
            return this.props.falcor.get(['building', 'byGeoid', this.props.activeGeoid, 'county',this.props.activeGeoid, 'byRiskScenario',scenario_id, 'byRiskZone', 'all'])
                .then(response =>{
                    this.props.zones.forEach(item =>{
                        if(item.geoid){
                            if(item.geoid.length === 5){
                                this.props.falcor.get(['building', 'byGeoid', this.props.activeGeoid,['county'],item.geoid, 'byRiskScenario',scenario_id, 'byRiskZone', 'all'],
                                    ['form_zones',['zones'],'byPlanId',this.props.activePlan,'byId',item.zone_id,['none'],['none'],'sum',['num_buildings','replacement_value']])
                                    .then(response =>{
                                        return response
                                    })
                            }else{
                                this.props.falcor.get(['building', 'byGeoid', this.props.activeGeoid, 'jurisdiction',item.geoid, 'byRiskScenario',scenario_id, 'byRiskZone', 'all'],
                                    ['form_zones',['zones'],'byPlanId',this.props.activePlan,'byId',item.zone_id,['none'],['none'],'sum',['num_buildings','replacement_value']])
                                    .then(response =>{
                                        return response
                                    })
                            }
                            let graph_scenario_county = get(this.props.zonesByActiveScenarioData,['county',`${item.geoid}`,'byRiskScenario',`${scenario_id}`,'byRiskZone','all','value'],[])
                            let graph_scenario_jurisdiction= get(this.props.zonesByActiveScenarioData,['jurisdiction',`${item.geoid}`,'byRiskScenario',`${scenario_id}`,'byRiskZone','all','value'],[])
                            let forms_zone= get(this.props.zonesFormsList ,[`${item.zone_id}`,'value','attributes'],{})
                            let zone_buildings_data = get(this.props.zonesByBuildingsData,[`${item.zone_id}`,'none','none','sum'],{})
                            //console.log('check',this.props.zonesByActiveScenarioData)
                            if((graph_scenario_county.length > 0 || graph_scenario_jurisdiction.length > 0) && Object.keys(forms_zone).length > 0 && Object.keys(zone_buildings_data).length > 0){
                                data.push({
                                    zone_geoid : item.geoid,
                                    zone_id : item.zone_id,
                                    zone_name : item.name || '',
                                    num_buildings : zone_buildings_data.num_buildings ? fmt(zone_buildings_data.num_buildings.value) :0,
                                    replacement_value : zone_buildings_data.replacement_value ? fnum(zone_buildings_data.replacement_value.value) : 0,
                                    count_buildings_scenarios:graph_scenario_county.length > 0 ?
                                        fmt(graph_scenario_county.reduce((a, b) => a + (parseInt(b['count']) || 0), 0)) :
                                        graph_scenario_jurisdiction.length > 0 ?
                                            fmt(graph_scenario_jurisdiction.reduce((a, b) => a + (parseInt(b['count']) || 0), 0)) :0,
                                    sum_buildings_value : graph_scenario_county.length > 0 ?
                                        fnum(graph_scenario_county.reduce((a, b) => a + (parseFloat(b['sum']) || 0), 0)) :
                                        graph_scenario_jurisdiction.length > 0 ?
                                            fnum(graph_scenario_jurisdiction.reduce((a, b) => a + (parseFloat(b['sum']) || 0), 0)) :0
                                })

                            }
                        }else{
                            //if geoid is null,
                            this.props.falcor.get(['form_zones',['zones'],'byPlanId',this.props.activePlan,'byId',item.zone_id,['none'],['none'],'sum',['num_buildings','replacement_value']],
                                ['form_zones',['zones'],'byPlanId',this.props.activePlan,'byId',item.zone_id,['none'],['none']
                                    ,'byRiskScenario',scenario_id,'byRiskZone','all'
                                ]
                                )
                                .then(response =>{
                                    return response
                                })
                            let graph_scenario_new_zone = get(this.props.zonesByBuildingsData,[`${item.zone_id}`,'none','none','byRiskScenario',`${scenario_id}`,'byRiskZone','all','value'],[])
                            let zone_buildings_data = get(this.props.zonesByBuildingsData,[`${item.zone_id}`,'none','none','sum'],{})
                            let forms_zone= get(this.props.zonesFormsList ,[`${item.zone_id}`,'value','attributes'],{})
                            if(graph_scenario_new_zone.length > 0 && Object.keys(forms_zone).length > 0 && Object.keys(zone_buildings_data).length > 0){
                                data.push({
                                    zone_geoid : item.geoid,
                                    zone_id : item.zone_id,
                                    zone_name : item.name || '',
                                    num_buildings : zone_buildings_data.num_buildings ? fmt(zone_buildings_data.num_buildings.value) :0,
                                    replacement_value : zone_buildings_data.replacement_value ? fnum(zone_buildings_data.replacement_value.value) : 0,
                                    count_buildings_scenarios:graph_scenario_new_zone.length > 0 ? fmt(graph_scenario_new_zone.reduce((a, b) => a + (parseInt(b['count']) || 0), 0)) : 0,
                                    sum_buildings_value : graph_scenario_new_zone.length > 0 ? fnum(graph_scenario_new_zone.reduce((a, b) => a + (parseFloat(b['sum']) || 0), 0)) : 0
                                })
                            }
                        }
                    })
                    this.setState({
                        data : _.uniqBy(data,'zone_id')
                    })
                    return response
                })
        }
    }

    removeZone(e){
        let ids = [];
        ids = JSON.parse("[" + localStorage.getItem("zone") + "]")[0] || [];
        let removeNoIdZone = ids.find(id => {
            if(id.bbox){
                if(_.isEqual(JSON.stringify(id.bbox.map(d => [d[0], d[1]])),this.props.zonesFormsList[e.target.id].value.attributes.bbox)){
                    return id
                }
            }else{
                return null
            }
        })
        if(removeNoIdZone){
            _.remove(ids, {
                name:removeNoIdZone.name,
            });
        }else{
            _.remove(ids, {
                zone_id:e.target.id
            });
        }
        localStorage.setItem('zone', JSON.stringify(ids));
        let data = this.state.data
        this.setState({
            data : data.filter(d => d.zone_id.toString() !== e.target.id)
        })
        this.props.noShowBoundary.showTownBoundary(localStorage.getItem("zone"),e.target.id)
    }

    render(){

        return (
            <div>
                <table className='table table-sm table-hover'>
                    <thead>
                    <tr>
                        <th/><th colSpan='2'>Total</th><th colSpan='2'>{this.props.offRiskZoneId.length !== 0 && !this.props.offRiskZoneId.includes("scenario") ? null : this.props.activeScenarioId.map(d => d.name.includes('hazus') ? 'HAZUS' : 'DFIRM')}</th>
                    </tr>
                    <tr>
                        <th>Zone</th><th>#</th><th>$</th>{this.props.offRiskZoneId.length !== 0 && !this.props.offRiskZoneId.includes("scenario") ? null : <React.Fragment><th>#</th><th>$</th></React.Fragment>}
                    </tr>
                    </thead>
                    <tbody>
                    { this.state.data.length > 0 ? this.state.data.map((d,i) =>{
                            return (
                                <tr key ={i}>
                                    <td>
                                        <a href={"#"}
                                           id={d.zone_geoid}
                                           name={d.zone_name}
                                           onClick={e => this.setState({
                                               showZoneModal: true,
                                               zone_id: d.zone_id,
                                               geoid : e.target.id,
                                               name: e.target.name,
                                               geom : d.zone_name === e.target.name ? d.zone_geom : ''
                                           })}>
                                            {d.zone_name}
                                        </a>
                                        {this.state.showZoneModal ? showZoneModal(this.state.zone_id,this.state.geoid,this.state.name,this.props.activeScenarioId,this.props.activeRiskZoneId,this.state.geom,this.setState.bind(this)) : null}
                                    </td>
                                    <td>{d.num_buildings}</td>
                                    <td>{d.replacement_value}</td>
                                    {this.props.offRiskZoneId.length !== 0 && !this.props.offRiskZoneId.includes("scenario") ? null
                                        :
                                        <React.Fragment>
                                            <td>{d.count_buildings_scenarios}</td>
                                            <td>{d.sum_buildings_value}</td>
                                        </React.Fragment>
                                    }
                                    <td>
                                        <div id={`closeMe`+ d.zone_id}>
                                            <button
                                                aria-label="Close"
                                                className="close"
                                                data-dismiss="alert"
                                                type="button"
                                                onClick={(e) =>{
                                                    this.removeZone(e)
                                                    this.setState({
                                                        zone_clicked : !this.state.zone_clicked
                                                    })
                                                }}
                                            >
                                                <span aria-hidden="true"
                                                      id = {d.zone_id}
                                                >×</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                    }):
                        <tr>
                            <td>Loading ...</td>
                        </tr>
                    }
                    </tbody>
                </table>
            </div>
        )

    }
}

const mapStateToProps = state => (
    {
        activePlan : state.user.activePlan,
        activeScenarioId:state.scenario.activeRiskScenarioId,
        offRiskZoneId:state.scenario.offRiskZoneId,
        activeGeoid:state.user.activeGeoid,
        isAuthenticated: !!state.user.authed,
        attempts: state.user.attempts,
        zonesByActiveScenarioData : get(state.graph,['building','byGeoid',`${state.user.activeGeoid}`]),
        zonesByBuildingsData : get(state.graph,['form_zones','zones','byPlanId',`${state.user.activePlan}`,'byId']),
        zonesFormsList : get(state.graph,['forms','byId'],{}),
        activeRiskZoneId: state.scenario.activeRiskZoneId
    });

const mapDispatchToProps = {
    sendSystemMessage,

};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(ZoneTable))
