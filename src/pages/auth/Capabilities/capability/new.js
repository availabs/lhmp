import React from 'react';
import Wizard from 'components/light-admin/wizard'
import { reduxFalcor } from 'utils/redux-falcor'
import {sendSystemMessage} from 'store/modules/messages';
import {connect} from "react-redux";
import Element from 'components/light-admin/containers/Element'
import get from "lodash.get";
import {falcorGraph} from "../../../../store/falcorGraph";

const counties = ["36101","36003","36091","36075","36111","36097","36089","36031","36103","36041","36027","36077",
    "36109","36001","36011","36039","36043","36113","36045","36019","36059","36053","36115","36119","36049","36069",
    "36023","36085","36029","36079","36057","36105","36073","36065","36009","36123","36107","36055","36095","36007",
    "36083","36099","36081","36037","36117","36063","36047","36015","36121","36061","36021","36013","36033","36017",
    "36067","36035","36087","36051","36025","36071","36093","36005"];
let cousubsData = []
class CapabilityNew extends React.Component {

    constructor (props) {
        super(props)

        this.state = {
            county: '',
            cousub:'',
            capability: '',
            capability_name:'',
            regulatory_name:'',
            adoption_date:null,
            expiration_date:null,
            development_update:null,
            jurisdiction_utilization:'',
            adopting_authority:'',
            responsible_authority:'',
            support_authority:'',
            affiliated_agency:'',
            link_url:'',
            plan_id: parseInt(this.props.activePlan)
        }


        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.capabilityDropdown = this.capabilityDropdown.bind(this)
        this.capabilityCountyDropDown = this.capabilityCountyDropDown.bind(this)
        this.capabilityCousubDropDown = this.capabilityCousubDropDown.bind(this)

    }
    fetchFalcorDeps(){
        return this.props.falcor.get(['capabilitiesLHMP','meta'],
            ['geo',counties,['name']]
            )
            .then(response => {
                return response
            });
    }


    componentDidMount(){
        if(this.props.match.params.capabilityId) {
            this.props.falcor.get(['capabilitiesLHMP','byId',[this.props.match.params.capabilityId],Object.keys(this.state)])
                .then(response =>{
                    Object.keys(this.state).forEach((key,i)=>{
                        let tmp_state = {};
                        if(key === 'adoption_date' || key === 'expiration_date'){
                            var d = response.json.capabilitiesLHMP.byId[this.props.match.params.capabilityId][key].slice(0, 10).split('-');
                            let date = d[0] +'-'+ d[1] +'-'+ d[2] // 10/30/2010
                            tmp_state[key] = date
                            this.setState(
                                tmp_state
                            )
                        }
                        else{
                            tmp_state[key] = response.json.capabilitiesLHMP.byId[this.props.match.params.capabilityId][key];
                            this.setState(
                                tmp_state
                            )
                        }
                    });

                })
        }

    }

    capabilityDropdown(){
        let capabilityDropDown = []
        Object.values(this.props.capabilitiesMeta).filter(d => d!=='atom').forEach(meta =>{
            meta.forEach(item =>{
                capabilityDropDown.push({
                    type: 'capability',
                    value: item['capability']
                })
            })
        })
        return(
            <div className="col-sm-12">
                <div className="form-group"><label htmlFor>Capability Category</label>
                    <select className="form-control justify-content-sm-end" id='capability' onChange={this.handleChange} value={this.state.capability}>
                        <option default>--Select Capability Category--</option>
                        <option className="form-control" key={0} value="None">No Capability Selected</option>
                        {
                            capabilityDropDown.map((capability,i) =>{
                                return(<option  className="form-control" key={i+1} value={capability.value}>{capability.value}</option>)
                            })
                        }
                    </select>
                </div>
            </div>
        )
    }

    capabilityCountyDropDown(){
        let countyData = []
        if(this.props.countyData){
            let graph = this.props.countyData
            Object.keys(graph).forEach(item =>{
                countyData.push({
                    'geoid':item,
                    'name':graph[item].name
                })
            })
        }
        return countyData
    }

    capabilityCousubDropDown(event){
        let county = event.target.value;
        let cousubsArray = []
        if(county !== 'None'){
            return this.props.falcor.get(['geo',county,'cousubs'])
                .then(response =>{
                    cousubsArray = response.json.geo[county].cousubs;
                    return cousubsArray
                })
                .then(cousubsArray =>{
                    return this.props.falcor.get(['geo',cousubsArray,['name']])
                        .then(response =>{
                            Object.keys(response.json.geo).filter(d => d !== '$__path').forEach(item =>{
                                cousubsData.push({
                                    'geoid':item,
                                    'name':response.json.geo[item].name
                                })
                            })
                        })
                })

        }
        else{
            return null
        }



    }

    handleChange(e) {
        console.log('---',e.target.id,e.target.value,this.state);
        this.setState({ ...this.state, [e.target.id]: e.target.value });
    };

    changeRadio = (id) => {
        console.log(id,this.state);
        this.setState({development_update: id});
    }


    onSubmit(event){
        event.preventDefault();
        let args = [];
        if(!this.props.match.params.capabilityId){
            Object.values(this.state).forEach(function(step_content){
                args.push(step_content)
            });
            return this.props.falcor.call(['capabilitiesLHMP','insert'], args, [], [])
                .then(response => {
                    this.props.sendSystemMessage(`Capability was successfully created.`, {type: "success"});
                })
        }else {
            let attributes = Object.keys(this.state);
            let updated_data ={};
            let data = {};
            Object.values(this.state).forEach(function(step_content){
                args.push(step_content)
            });
            Object.keys(this.state).forEach((d, i) => {
                //if (this.state[d] !== '') {
                    console.log(data[d], d);
                    updated_data[d] = this.state[d];
                //}
            });

            return this.props.falcor.set({
                paths: [
                    ['capabilitiesLHMP', 'byId', [this.props.match.params.capabilityId], attributes]
                ],
                jsonGraph: {
                    capabilitiesLHMP: {
                        byId: {
                            [this.props.match.params.capabilityId]: updated_data
                        }
                    }
                }
            })
                .then(response => {
                    this.props.sendSystemMessage(`Capability was successfully edited.`, {type: "success"});
                })
        }

    }

    render () {
        let countyData = this.capabilityCountyDropDown();
        return (
            <div className='container'>
                <Element>
                    <h6 className="element-header">New Capability</h6>
                    <div className="element-box">
                        <div className="form-group">
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Capability County Location</label>
                                    <select className="form-control justify-content-sm-end" id='county' onChange={this.handleChange} value={this.state.county} onClick={this.capabilityCousubDropDown}>
                                        <option default>--Select County--</option>
                                        <option className="form-control" key={0} value="None">No County selected</option>
                                        {
                                            countyData.map((county,i) =>{
                                                return(<option  className="form-control" key={i+1} value={county.geoid}>{county.name}</option>)
                                            })
                                        }
                                    </select>
                            </div>
                            </div>
                            <div className="col-sm-12">
                                { cousubsData.length !== 0 ?
                                    (
                                        <div className="form-group"><label htmlFor>Municipality</label>
                                            <select className="form-control justify-content-sm-end" id='cousub' onChange={this.handleChange} value={this.state.cousub}>
                                                <option default>--Select Town--</option>
                                                {
                                                    cousubsData.map((cousub,i) =>{
                                                        if(cousub.geoid.slice(0,5) === this.state.county){
                                                            return(<option className="form-control" key={i} value={cousub.geoid}>{cousub.name}</option>)
                                                        }

                                                    })
                                                }
                                            </select>
                                        </div>
                                    ) :(
                                        <div>

                                        </div>
                                    )

                                }
                            </div>
                            {this.capabilityDropdown()}
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Capability Name</label>
                                    <input id='capability_name' onChange={this.handleChange} className="form-control" placeholder="Capability Name" type="text" value={this.state.capability_name}/></div>
                            </div>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Regulatory Name</label>
                                    <input id='regulatory_name' onChange={this.handleChange} className="form-control" placeholder="Regulatory Name" type="text" value={this.state.regulatory_name}/></div>
                            </div>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Adoption Date</label>
                                    <input id='adoption_date' onChange={this.handleChange} className="form-control" placeholder="Adoption Date" type="date" value={this.state.adoption_date}/></div>
                            </div>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Expiration Date</label>
                                    <input id='expiration_date' onChange={this.handleChange} className="form-control" placeholder="Expiration Date" type="date" value={this.state.expiration_date}/></div>
                            </div>
                            <div className="form-check"><label htmlFor>Development/Update in process?</label>{''} {''} {''} {''}
                                <input id='development_update' onChange={this.changeRadio.bind(this, 'yes')} type="radio" checked={this.state.development_update === 'yes'}/>Yes {''} {''}
                                <input id='development_update' onChange={this.changeRadio.bind(this, 'no')} type="radio" checked={this.state.development_update === 'no'}/>No
                            </div>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>How Does Your Jurisdiction Utilize the capability?</label>
                                    <input id='jurisdiction_utilization' onChange={this.handleChange} className="form-control" placeholder="How Does Your Jurisdiction Utilize the capability?" type="text" value={this.state.jurisdiction_utilization}/></div>
                            </div>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Adopting Authority</label>
                                    <input id='adopting_authority' onChange={this.handleChange} className="form-control" placeholder="Adopting Authority" type="text" value={this.state.adopting_authority}/></div>
                            </div>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Responsible Authority</label>
                                    <input id='responsible_authority' onChange={this.handleChange} className="form-control" placeholder="Responsible Authority" type="text" value={this.state.responsible_authority}/></div>
                            </div>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Support Authority</label>
                                    <input id='support_authority' onChange={this.handleChange} className="form-control" placeholder="Support Authority" type="text" value={this.state.support_authority}/></div>
                            </div>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Affiliated Agency</label>
                                    <input id='affiliated_agency' onChange={this.handleChange} className="form-control" placeholder="Affiliated Agency" type="text" value={this.state.affiliated_agency}/></div>
                            </div>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Link URL</label>
                                    <input id='link_url' onChange={this.handleChange} className="form-control" placeholder="Link URL" type="text" value={this.state.link_url}/></div>
                            </div>
                            <div className="form-buttons-w text-right">
                                <button className="btn btn-primary step-trigger-btn" href ={'#'} onClick={this.onSubmit}> Submit</button>
                            </div>
                        </div>
                    </div>
                </Element>
            </div>
        )
    }
}

const mapDispatchToProps = {
    sendSystemMessage
};

const mapStateToProps = state => {
    return {
        activePlan: state.user.activePlan,
        isAuthenticated: !!state.user.authed,
        attempts: state.user.attempts, // so componentWillReceiveProps will get called.
        capabilitiesMeta : get(state.graph,'capabilitiesLHMP.meta',{}),
        countyData: get(state.graph,'geo',{})

    };
};

export default [
    {
        icon: 'os-icon',
        path: '/capabilities/new',
        exact: true,
        mainNav: false,
        breadcrumbs: [
            { name: 'Capabilities', path: '/capabilities/' },
            { name: 'New Capability', path: '/capabilities/new' }
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        name: 'Create Actions Worksheet',
        auth: true,
        component: connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(CapabilityNew))
    },
    {
        path: '/capabilities/edit/:capabilityId',
        name: 'Edit Capabilities',
        mainNav: false,
        auth: true,
        exact: true,
        breadcrumbs: [
            { name: 'Capabilities', path: '/capabilities/' },
            { param: 'capabilityId', path: '/capabilities/edit' }
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(CapabilityNew))
    }

]

