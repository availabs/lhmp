import React from 'react'
import SearchableDropDown from "../../filters/searchableDropDown";
import MultiSelectComponent from "./multiSelectComponent";
import get from "lodash.get";
import {sendSystemMessage} from "../../../store/modules/messages";
import {connect} from "react-redux";
import {reduxFalcor} from "../../../utils/redux-falcor";
import MultiSelectFilter from "../../filters/multi-select-filter";

class TextComponent extends React.PureComponent{
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
        this.zoneDropDown = this.zoneDropDown.bind(this)
        this.renderEdit = this.renderEdit.bind(this)
        this.renderView = this.renderView.bind(this)
        this.renderDropdown = this.renderDropdown.bind(this)
        this.renderElement = this.renderElement.bind(this)
    }
    fetchFalcorDeps(){
        let ids = [];
        return this.props.parentConfig === 'actions' ? (this.props.falcor.get(['forms',['zones'],'byPlanId',this.props.activePlan,'length'])
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
                            ids : ids,
                            data:graph
                        })
                        return response
                    })
            })) : (
                this.props.falcor.get(['forms','actions','byPlanId',this.props.activePlan,'length'])
                    .then(response =>{
                        let length = response.json.forms['actions'].byPlanId[this.props.activePlan].length;
                        if(length > 0){
                            this.props.falcor.get(['forms','actions','byPlanId',this.props.activePlan,'byIndex',[{from:0,to:length-1}], 'actions_name'])
                                .then(response =>{
                                    let graph = response.json.forms['actions'].byPlanId[this.props.activePlan].byIndex;
                                    Object.keys(graph)
                                        .filter(d => {
                                                if (this.props.filterBy){
                                                    return Object.keys(this.props.filterBy)
                                                        .reduce((a,c) =>
                                                            a && this.props.filterBy[c].includes(get(graph[d], `attributes.${c}`, null)), true)
                                                }
                                                return true
                                            }
                                        )
                                        .filter(d => d !== '$__path').forEach(id =>{
                                        if(graph[id]){
                                            ids.push(graph[id].id)
                                        }

                                    })
                                    this.setState({
                                        ids : ids,
                                        data: graph
                                    })
                                    return response
                                })
                        }
                        return response
                    })
        )
    }

    zoneDropDown(filterId){
        let zones_list  = []
        let graph = this.state.data
        if(graph && Object.keys(graph).length >0){
            Object.keys(graph)
                .filter(d =>
                    d !== '$__path' &&
                    (
                        filterId ?
                            typeof filterId === "object" ?
                                filterId.includes(graph[d].id) :
                                filterId.toString() === graph[d].id.toString() :
                            true
                    )
                )
                .forEach(item =>{
                if(graph[item] && this.state.ids.includes(graph[item].id)){
                    zones_list.push({
                        'label': graph[item].attributes ? graph[item].attributes.name || graph[item].attributes.action_name : 'None',
                        'value': graph[item] ? graph[item].id : ''
                    })
                }
            })
        }
        return zones_list
    }

    renderDropdown() {
        let zones_list = this.zoneDropDown();

        return (
            <SearchableDropDown
                data={zones_list}
                placeholder={this.props.label}
                value={zones_list.filter(f => f.value === this.props.state[this.props.title])[0]}
                hideValue={false}
                onChange={(value) => {
                    this.setState({zone_id:value})
                    this.props.handleChange({target:{id:this.props.title, value}})
                }}
            />
        )
    }

    renderElement() {
        let zones_list = this.zoneDropDown().map(f => ({value: f.value, name: f.label}));
        return (
            <MultiSelectFilter
                filter={{
                    domain: zones_list || [],
                    value: this.props.state[this.props.title] ? this.props.state[this.props.title] : []
                }}
                setFilter={(e) => {
                    this.props.handleChange(e, this.props.title, zones_list);
                    if (this.props.onClick) {
                        this.props.onClick({target: {value: e}})
                    }
                }}
                placeHolder={this.props.placeholder}
            />
        )
    }

    renderEdit(){
        if(this.props.display_condition !== '' && this.props.display_condition){
            return (
                <div className="col-sm-12" style={{display: this.props.display_condition.check.includes(this.props.state[this.props.display_condition.attribute]) ? 'block' : 'none'}}>
                    <div className="form-group"><label htmlFor={this.props.label}>{this.props.label}
                        <span style={{color: 'red'}}>{this.props.required ? ' *' : null}</span>
                    </label><span style={{'float': 'right'}}>{this.props.prompt !== '' ? this.props.prompt(this.props.title) : ''}</span>
                        {this.renderElement()}
                    </div>
                    <br/>
                </div>

            )
        }else{
            return (
                <div className="col-sm-12">
                    <div className="form-group"><label htmlFor={this.props.label}>{this.props.label}
                        <span style={{color: 'red'}}>{this.props.required ? ' *' : null}</span>
                    </label><span style={{'float': 'right'}}>{this.props.prompt !== '' ? this.props.prompt(this.props.title) : ''}</span>
                        {this.renderElement()}
                    </div>
                    <br/>
                </div>

            )
        }

    }

    renderView(){
        return this.props.id && this.props.id !== 'None' ? this.zoneDropDown(this.props.id).map(d => d.label).join() : 'None'
    }

    render() {
        return this.props.editView ? this.renderEdit() : this.renderView()
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

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(TextComponent))