import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get"
import Element from 'components/light-admin/containers/Element'
import {falcorGraph} from "store/falcorGraph";
import { Link } from "react-router-dom"
import {sendSystemMessage} from 'store/modules/messages';
import pick from "lodash.pick";
import Modal from './modal'



const ATTRIBUTES = [
       'id',
       'type', 
       'plan_id', 
       'owner_id', 
       'start_date', 
       'end_date', 
       'hours', 
       'users', 
       'roles'
]

class ParticipationMeetingIndex extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            showModal: false
        }

        this.participationMeetingViewTable = this.participationMeetingViewTable.bind(this)
        this.toggleModal = this.toggleModal.bind(this)
    }

    fetchFalcorDeps() {

        return falcorGraph.get(['participation','byId', [this.props.match.params.Id], ATTRIBUTES])
            .then(response => {
                return response

            })
    }

    participationMeetingViewTable(){
        let table_data = [];
        let data = [];
        if(this.props.participationViewData[this.props.match.params.Id] !== undefined){
            let graph = this.props.participationViewData[this.props.match.params.Id];

          console.log('graph of participationViewTable', graph)

            data.push(pick(graph,...ATTRIBUTES));

         console.log('data of participationViewTable', data)
         

            data.forEach(item =>{
                Object.keys(item).forEach(i =>{
                   /* if (item[i].value.toString() === 'false'){
                        table_data.push({
                            attribute: i,
                            value: 'no'
                        })
                    }
                    else if(item[i].value.toString() === 'true'){
                        table_data.push({
                            attribute : i,
                            value : 'yes'
                        })
                    }else{


                    }*/
   
                        table_data.push({
                            attribute : i,
                            value: item[i].value
                        })
                })
            })
        }  
        console.log('table_data', table_data)
        
        return (
            <div className='container'>
                <Element>

                    <h6 className="element-header">Meetings View</h6>
                    
                    <div className="element-box">
                        <h6>Meeting</h6>
                        <div className="table-responsive" >
                            <table className="table table lightBorder">
                                <thead>
                                <tr>
                                    <th>ATTRIBUTE</th>
                                    <th>VALUE</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    table_data.map(data =>{
                                        return(
                                            <tr>
                                                <td>{data.attribute}</td>
                                                <td>{data.value}</td>
                                            </tr>
                                        )
                                    })

                                }
                                </tbody>
                            </table>
                        </div>
                    </div>



                    <div className="element-box">
                        <h6>Attendees
                            <span style={{float:'right'}}>
                                
                                <button onClick = {this.toggleModal} >
                                          Invite
                                </button>

                      
                            </span>
                        </h6> 
                            <div className="table-responsive" >

                                <table className="table table lightBorder">
                                    <thead>
                                    <tr>
                                        <th>ATTRIBUTE</th>
                                        <th>VALUE</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        table_data.map(data =>{
                                            return(
                                                <tr>
                                                    <td>{data.attribute}</td>
                                                    <td>{data.value}</td>
                                                </tr>
                                            )
                                        })

                                    }
                                    </tbody>
                                </table>
                            </div>
                        </div>          



                </Element>
            </div>

        )
    }

    toggleModal () {
        this.setState({showModal: !this.state.showModal})
    }

    render() {
        return(
            <div>
                {this.participationMeetingViewTable()}
                <Modal display={this.state.showModal} close={this.toggleModal}/>

            </div>

        )

    }
}

const mapStateToProps = state => {
        return{
        isAuthenticated: !!state.user.authed,
        attempts: state.user.attempts, // so componentWillReceiveProps will get called.
        participationViewData : get(state.graph,['participation','byId'],{})
    };    
};

/*

*/


const mapDispatchToProps = {
    sendSystemMessage
};



export default [
    {
        path: '/meeting/view/:Id',
        exact: true,
        name: 'Meeting',
        auth: true,
        mainNav: false,
        breadcrumbs: [
            { name: 'Meeting', path: '/meeting/' },
            { param: 'Id', path: '/meeting/view/' }
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps,mapDispatchToProps)(ParticipationMeetingIndex)
    }
]

