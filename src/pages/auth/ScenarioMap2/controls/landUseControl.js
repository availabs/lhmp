import React from 'react';
import AvlFormsViewData from 'components/AvlForms/displayComponents/viewData';
import config from 'pages/auth/Roles/roles_forms/config.js'
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import {sendSystemMessage} from 'store/modules/messages';
import {setActiveLandUseType,setActiveLandUsePropType ,setActiveOwnerType,setActiveLandUseSubPropType} from "store/modules/landUse"
import MultiSelectFilter from "../../../../components/filters/multi-select-filter";
import Legend from "../../../../components/AvlMap/components/legend/Legend";
import {getColorRange} from "../../../../constants/color-ranges";
import {fnum} from "../../../../utils/sheldusUtils";

var _ = require("lodash")

class LandUseControl extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
            land_use:[],
            land_use_id:'Land Use Type',
            owner_type : '',
            filter: {
                domain : [],
                value : []
            },
            owner_type_filter : {
                domain : [],
                value : []
            },
            subDropDownMeta: [],
            sub_dropdown_filter:{},
            prop_type:''
        }
        this.addLandUseLayer = this.addLandUseLayer.bind(this,true)
        this.handleChange= this.handleChange.bind(this)
        this.handleMultiSelectFilterChange = this.handleMultiSelectFilterChange.bind(this)
        this.handleMultiSelectSubDropDownFilterChange = this.handleMultiSelectSubDropDownFilterChange.bind(this)
        this.renderLandUsePropertySubDropDown= this.renderLandUsePropertySubDropDown.bind(this)
        this.handleMultiSelectOwnerTypeFilterChange = this.handleMultiSelectOwnerTypeFilterChange.bind(this)
    }
    componentDidMount(){
        let prop_class_meta = get(this.props.parcelsMeta, ['prop_class', 'value'], [])
        let prop_class_data = []
        prop_class_meta.map(item => {
            if (parseInt(item.value) % 100 === 0) {
                prop_class_data.push(item)
            }
        })
        this.props.setActiveLandUseType([{name:'Land Use Type',value:prop_class_data}])
    }

    fetchFalcorDeps() {
        return this.props.falcor.get(['parcel', 'meta', ['prop_class', 'owner_type']])
            .then(response => {
                let BuildingPropTypeList = get(response.json.parcel.meta, ['prop_class'], [])
                let owner_type_meta = get(response.json.parcel.meta, ['owner_type'], [])
                if(BuildingPropTypeList.length > 0){
                    this.setState((currentState) => ({
                        filter :{
                            domain : BuildingPropTypeList.filter((item) => parseInt(item.value) % 100 === 0 ? config : ''),
                            value : currentState.filter.value ? currentState.filter.value.length > 0 ? currentState.filter.value : [] : []
                        },
                        owner_type_filter : {
                            domain : owner_type_meta,
                            value : currentState.owner_type_filter.value ? currentState.owner_type_filter.value.length > 0 ? currentState.owner_type_filter.value : [] : []
                        }
                    }))
                }
                return response
            })
    }

    landUseDropDown() {
        if (Object.keys(this.props.parcelsMeta).length > 0){
            let prop_class_meta = get(this.props.parcelsMeta, ['prop_class', 'value'], [])
            let owner_class_meta = get(this.props.parcelsMeta, ['owner_type', 'value'], [])
            let prop_class_data = []
            let land_use_drop_down = []
            prop_class_meta.map(item => {
                if (parseInt(item.value) % 100 === 0) {
                    prop_class_data.push(item)
                }
            })

            land_use_drop_down.push(
                {
                    label: 'Owner Type',
                    value: owner_class_meta
                },
                {
                    label: 'Land Use Type',
                    value: prop_class_data
                },
                {
                    label: 'Property Value',
                    value: []
                },
            )

            return land_use_drop_down
        }

    }

    handleChange(e){
        console.log('---',e.target.id,e.target.value,this.state);
        let land_use_list = this.landUseDropDown()
        let value = e.target.value
        land_use_list.forEach(item =>{
            if(item.label === value){
                this.props.setActiveLandUseType([{name:item.label,value:item.value}])
            }
        })
        this.setState({ ...this.state, [e.target.id]: e.target.value });
    }

    handleMultiSelectFilterChange(e) {
        let newFilter = this.state.filter;
        let dropDownData = []
        newFilter.value = e;
        let prop_class_meta = get(this.props.parcelsMeta, ['prop_class', 'value'], [])
        e.forEach(value =>{
            let data = []
            prop_class_meta.filter(d => d.value !== value).forEach(meta =>{
                if(value.slice(0,1) === meta.value.slice(0,1)){
                    data.push(meta)
                }
            })
            dropDownData.push({
                name: this.state.filter.domain.reduce((a,c) => c.value === value ? c.name : a,''),
                value : {
                    domain : data,
                    value : []
                },
                input : this.state.filter.domain.reduce((a,c) => c.value === value ? c.value : a,'')
            })
        })
        let sub_dropdown_filter = {}
        dropDownData.map(d =>{
            sub_dropdown_filter[d.input] = {
                domain: d.value.domain,
                value :   this.state.sub_dropdown_filter[d.input] ? this.state.sub_dropdown_filter[d.input].value :[]
            }
        })
        this.props.setActiveLandUsePropType(e)
        this.setState(currentState => ({
            filter :newFilter,
            subDropDownMeta : dropDownData,
            sub_dropdown_filter :sub_dropdown_filter
        }))
    }

    handleMultiSelectOwnerTypeFilterChange(e) {
        let newFilter = this.state.owner_type_filter;
        newFilter.value = e;
        this.props.setActiveOwnerType(newFilter.value)
        this.setState({owner_type_filter: newFilter})
    }

    handleMultiSelectSubDropDownFilterChange(e,input) {
        let newFilter = this.state.sub_dropdown_filter
        let sub_inputs = []
        let domain= []
        if(e.length > 0){
            sub_inputs.push(...e)
            domain = this.state.sub_dropdown_filter[input].domain
            newFilter[input].value = sub_inputs
            newFilter[input].domain = domain
        }else{
            domain = this.state.sub_dropdown_filter[input].domain
            newFilter[input].value = []
            newFilter[input].domain = domain
        }
        this.props.setActiveLandUseSubPropType(Object.keys(newFilter).map(value => newFilter[value].value).flat(1))
        this.setState({sub_dropdown_filter: newFilter})


    }

    renderLandUsePropertySubDropDown(){
        return(
            <div>
                {
                    this.state.subDropDownMeta.map((item,i) =>{
                        return (
                            <div key={i} >
                            <h6>{item.name}</h6>
                             <MultiSelectFilter
                                    filter = {
                                        {domain : this.state.sub_dropdown_filter[item.input].domain, value : this.state.sub_dropdown_filter[item.input].value}
                                    }
                                    setFilter = {(e) => {this.handleMultiSelectSubDropDownFilterChange(e,item.input)}}
                                    placeHolder={'Select a Sub Property Type'}
                                />
                            </div>
                        )
                    })
                }
            </div>
        )

    }


    renderLandUseInfoBoxDropDowns(){
        let land_use_list = this.landUseDropDown()
        let owner_class_meta = get(this.props.parcelsMeta, ['owner_type', 'value'], [])
        return (
            <div style={{display:"flex",flexDirection:"column",justifyContent:"space-evenly",align:"auto"}}>
                <h6>View By :</h6>
                <select className="form-control justify-content-sm-end"
                        id = "land_use_id"
                        onChange={this.handleChange}
                        value={this.state.land_use_id}>
                    <option key={0} value ={''}>--None Selected--</option>
                    {land_use_list ? land_use_list.map((item,i) =>{

                            return( <option key={i+1} value={item.label}>{item.label}</option>)
                        })
                        :
                        null
                    }
                </select>
                <br/>
                <h6>Filter :</h6>
                <MultiSelectFilter
                    filter = {this.state.filter}
                    setFilter = {this.handleMultiSelectFilterChange}
                    placeHolder={'Select a Property Type'}
                />
                {this.state.filter.value ? this.state.filter.value.length > 0 ? this.renderLandUsePropertySubDropDown() : null : null}
                <h6>Owner Type Filter :</h6>
                <MultiSelectFilter
                    filter = {this.state.owner_type_filter}
                    setFilter = {this.handleMultiSelectOwnerTypeFilterChange}
                    placeHolder={'Select a Owner Type'}
                />
            </div>
        )
    }

    addLandUseLayer(){
        if(this.props.layer.layer.landUseLayer) {
            if(this.props.layer.layer.landUseLayer.map.getZoom() < 13){
                this.props.layer.layer.mainLayerToggleVisibilityOff(["landUse"])
                return (
                    <div>
                        <br/>
                        <h6 style ={{textAlign : 'center'}}>For Land Use, Select a Land Use type and zoom in</h6>
                        {this.renderLandUseInfoBoxDropDowns()}
                    </div>
                )
            }else{
                if(this.props.layer.layer.landUseLayer.map.getZoom() >=13){
                    this.props.layer.layer.mainLayerToggleVisibilityOn(["landUse"])
                    return(
                        <div>
                            {this.renderLandUseInfoBoxDropDowns()}
                        </div>
                    )
                }
            }
        }else {
            return null
        }
    }



    render() {
        let land_use_list = this.landUseDropDown()
        let domain_values = []
        if (land_use_list && land_use_list.length > 0) {
            land_use_list.forEach(item =>{
                if(item.label === this.state.land_use_id){
                    if(this.state.land_use_id === "Land Use Type"){
                        domain_values = item.value.map(d => d.name)
                        domain_values.push("None")
                    }else{
                        domain_values = item.value.map(d => d.name)
                    }
                }
            })
            return (
                <div>
                    {this.state.land_use_id === 'Land Use Type' ?
                        <Legend
                            title ={"Land Use Type"}
                            vertical ={true}
                            type={"ordinal"}
                            domain = {domain_values}
                            range = {getColorRange("10","Set3")}
                        />
                        : this.state.land_use_id === 'Owner Type' ?
                            <Legend
                                title ={"Owner Type"}
                                vertical ={true}
                                type={"ordinal"}
                                domain = {domain_values}
                                range = {getColorRange(11, "Set3")}
                            />
                            : this.state.land_use_id === 'Property Value' ?
                                <Legend
                                    title ={"Property Value"}
                                    vertical ={false}
                                    type={"linear"}
                                    domain = {[0,50000,100000,200000,500000,1000000,5000000]}
                                    range = {getColorRange(8, "YlGn")}
                                    format =  {fnum}
                                />
                        :null}
                    {this.addLandUseLayer()}
                </div>
            )
        }else {
            return (
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
        parcelsMeta: get(state.graph,['parcel','meta'],{}),
        activeLandUsePropType : state.landUse.landUsePropType,
        activeLandUseSubPropType : state.landUse.landUseSubPropType
    });

const mapDispatchToProps = {
    sendSystemMessage,
    setActiveLandUseType,
    setActiveLandUsePropType,
    setActiveLandUseSubPropType,
    setActiveOwnerType
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(LandUseControl))
