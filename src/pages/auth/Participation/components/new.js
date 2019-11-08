import React from 'react';
import Wizard from 'components/light-admin/wizard'
import { reduxFalcor } from 'utils/redux-falcor'
import {sendSystemMessage} from 'store/modules/messages';
import {connect} from "react-redux";
import Element from 'components/light-admin/containers/Element'
import get from "lodash.get";




class ParticipationNew extends React.Component {

    constructor (props) {
        super(props)

        this.state = {
            type: null, 
            plan_id: parseInt(this.props.activePlan), 
            owner_id: null, 
            start_date: null, 
            end_date: null, 
            hours: null, 
          /*  users: [], 
            roles: []*/
            narrative: null,
            topics_list:null
        }




        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        //this.capabilityDropdown = this.capabilityDropdown.bind(this)

    }

   /* fetchFalcorDeps(){
        return this.props.falcor.get(['capabilitiesLHMP','meta'])
            .then(response => {
                return response
            });

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
                    <div className="form-group"><label htmlFor>Capability</label>
                        <select className="form-control justify-content-sm-end" id='capability' onChange={this.handleChange} value={this.state.capability}>
                            <option default>--Select Capability--</option>
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

    }*/
 

    componentDidMount(){
        if(this.props.match.params.participationId) {
            this.props.falcor.get(['participation','byId',[this.props.match.params.participationId],Object.keys(this.state)])
                .then(response =>{

                    Object.keys(this.state).forEach((key,i)=>{
                        let tmp_state = {};

                        if(key === 'start_date' || key === 'end_date'){
                            var d = response.json.participation.byId[this.props.match.params.participationId][key].slice(0, 10).split('-');
                            let date = d[0] +'-'+ d[1] +'-'+ d[2] // 10/30/2010
                            tmp_state[key] = date
                            this.setState(
                                tmp_state
                            )
                        }
                        else{
                            tmp_state[key] = response.json.participation.byId[this.props.match.params.participationId][key];
                                console.log('what is my state?', tmp_state)
                            this.setState(
                                tmp_state
                            )
                        }
                    });

                })
        }

    }





/*    handleChange(e) {
        console.log('-------',e.target.id,e.target.value,this.state);
        if(['users','roles'].includes(e.target.id)){
            this.setState({ ...this.state, [e.target.id]: [e.target.value] });
        } else { 
            this.setState({ ...this.state, [e.target.id]: e.target.value });
        }

    };*/
      handleChange(e) {
            console.log('---',e.target.id,e.target.value,this.state);
            this.setState({ ...this.state, [e.target.id]: e.target.value });
        };

    
    onSubmit(event){
        event.preventDefault();
        let args = [];
        if(!this.props.match.params.participationId){
            
            Object.values(this.state).forEach(function(step_content){
                args.push(step_content)
            });


                    console.log('args', args)


            return this.props.falcor.call(['participation','insert'], args )

                .then(response => {

                     console.log('response----', response)

                    this.props.sendSystemMessage(`New participation was successfully created.`, {type: "success"});
                })
        } 

        else 
        {
            let attributes = Object.keys(this.state);
            let updated_data ={};
            let data = {};
            // Object.values(this.state).forEach(function(step_content){
            //     args.push(step_content)
            // });
            Object.keys(this.state).forEach((d, i) => {
                console.log(data[d], d);
                    updated_data[d] = this.state[d];

        
            });

            console.log('updated_data',  updated_data)

            return this.props.falcor.set({
                paths: [
                    ['participation', 'byId', [this.props.match.params.participationId], attributes]
                ],
                jsonGraph: {
                    participation: {
                        byId: {
                            [this.props.match.params.participationId]: updated_data
                        }
                    }
                }
            })
                .then(response => {
                    this.props.sendSystemMessage(`Participation was successfully edited.`, {type: "success"});
                })
        }

    }

    render () {
        return (
            <div className='container'>
                <Element>
                    <h6 className="element-header">New Participation</h6>
                    <div className="element-box">
                        

                    
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Type</label>
                                    <input id='type' onChange={this.handleChange} className="form-control" placeholder="Type Name" type="text" value={this.state.type}/></div>
                            </div>
                            
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Owner ID</label>
                                    <input id='owner_id' onChange={this.handleChange} className="form-control" placeholder="Owner Id" type="number" value={this.state.owner_id}/></div>
                            </div>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Start Date</label>
                                    <input id='start_date' onChange={this.handleChange} className="form-control" placeholder="Start Date" type="date" value={this.state.start_date}/></div>
                            </div>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>End Date</label>
                                    <input id='end_date' onChange={this.handleChange} className="form-control" placeholder="End Date" type="date" value={this.state.end_date}/></div>
                            </div>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Hours</label>
                                    <input id='hours' onChange={this.handleChange} className="form-control" placeholder="Hours" type="number" value={this.state.hours}/></div>
                            </div>
                        {/*  <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Users</label>
                                    <input id='users' onChange={this.handleChange} className="form-control" placeholder="Users" type="number" value={this.state.users[0]}/></div>
                            </div>
                            <div className="col-sm-12">
                                <div className="form-group"><label htmlFor>Role</label>
                                    <input id='roles' onChange={this.handleChange} className="form-control" placeholder="Roles" type="number" value={this.state.roles[0]}/></div>
                            </div>*/}


                            <div className="col-sm-12">
                                <div className="form-group">
                                <label htmlFor>Narrative</label>
                                    <textarea rows="4"  id='narrative' onChange={this.handleChange} className="form-control" placeholder="Type Narrative here" type="text" value={this.state.narrative}/>
                                </div>
                            </div>

                            <div className="col-sm-12">
                                <div className="form-group">
                                <label htmlFor>Topics list</label>
                                    <textarea rows="4"  id='topics_list' onChange={this.handleChange} className="form-control" placeholder="Type Topics list here" type="text" value={this.state.topics_list}/>
                                </div>
                            </div>

                            <div className="form-buttons-w text-right">
                                <button className="btn btn-primary step-trigger-btn" href ={'#'} onClick={this.onSubmit}> Submit</button>
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
        attempts: state.user.attempts // so componentWillReceiveProps will get called.
        //capabilitiesMeta : get(state.graph,'capabilitiesLHMP.meta',{})

    };
};


export default [
    {
        icon: 'os-icon',
        path: '/participation/new',
        exact: true,
        mainNav: false,
        breadcrumbs: [
            { name: 'Participation', path: '/participation/' },
            { name: 'New Participation', path: '/participation/new' }
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        name: 'Create Participation',
        auth: true,
        component: connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(ParticipationNew))
    },
    {
        path: '/participation/edit/:participationId',
        name: 'Edit Participation',
        mainNav: false,
        auth: true,
        exact: true,
        breadcrumbs: [
            { name: 'Participation', path: '/participation/' },
            { param: 'participationId', path: '/participation/edit' }
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(ParticipationNew))
    }

]

