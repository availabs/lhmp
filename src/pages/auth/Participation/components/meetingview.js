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
       'narrative', 
       'topics_list'
/*       'users', 
       'roles'*/
]


const RoleAttributes = [
        'contact_name',
       // 'check_in',
        'role_id', 
       // 'participation_id', 
        'status'

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
        return falcorGraph.get(
           ['participation','byId', [this.props.match.params.Id], ATTRIBUTES],
           ['participation','byId', [this.props.match.params.Id], 'roles','length'] 
          )

          .then(response =>{

                 const length = get(response, ['json', 'participation', 'byId', this.props.match.params.Id,'roles','length'], 0)

                        console.log('length-------------', length)   

                 return length  
            

                     })
         
            .then(length => {
              return falcorGraph.get(['participation','byId', [this.props.match.params.Id], 'roles',{from: 0, to: length-1}, RoleAttributes])
              .then(response => {
                console.log('participation byId response', response);
                let test = []

                if (response.json.participation.byId[this.props.match.params.Id].roles) 
                  {
                      Object.values(
                        response.json.participation.byId[this.props.match.params.Id].roles
                        ).forEach(participation => {
                      test.push(Object.values(pick(participation,...RoleAttributes)))
                    })
                  
                   console.log('participation byId test', test);

                  } 
                  return response

              })
            })


    }

    participationMeetingViewTable(){

        //meeting table 
        let table_data = [];
        let data = [];

        console.log('this.props.participationViewData----------', this.props.participationViewData)

        if(this.props.participationViewData[this.props.match.params.Id] !== undefined){
            let graph = this.props.participationViewData[this.props.match.params.Id];
             //console.log('graph of participationViewTable', graph)
            data.push(pick(graph,...ATTRIBUTES));
             //console.log('data of participationViewTable', data)
            data.forEach(item =>{
                Object.keys(item).forEach(i =>{
                        table_data.push({
                            attribute : i,
                            value: item[i].value
                        })
                })
            })
        }  
        console.log('table_data-----', table_data)
        console.log('this.props.match.params.Id-----', this.props.match.params.Id)

        //attendees role table 
       // let roleTable_data = [];
        let roledata = [];
           let graph = this.props.participationRoleViewData;



        if(this.props.participationRoleViewData.length !== undefined){

            let graph = this.props.participationRoleViewData;

            //console.log('graph of participationRoleViewData-------', graph)

            roledata = Object.values(graph)
            //roledata.push(pick(graph,...RoleAttributes));
         console.log('data of participationRoleViewData-------', roledata)
        }

         // console.log('participationViewData', this.props.participationViewData)
         // console.log('participationRoleViewData', this.props.participationRoleViewData)

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
                                        { RoleAttributes.map(function(role){
                                            return (
                                                <th>{role}</th>

                                            )
                                        })
                                        }
                                    </tr>
                                    </thead>

                                    <tbody>
                                      {
                                        roledata.map((item) =>{
                                          return (
                                              <tr>
                                                   <td>{item.contact_name}</td>
                                               {/*   <td>{item.check_in}</td>*/}
                                                  <td>{item.role_id}</td>
                                                  <td>{item.status}</td>
         
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
        const participationId = this.props.match.params.Id

        return(
            <div>
                {this.participationMeetingViewTable()}
                <Modal display={this.state.showModal} close={this.toggleModal} participationId={participationId}/>

            </div>

        )

    }
}

const mapStateToProps = (state,ownProps) => {
        const participationId = ownProps.match.params.Id
        return{
        isAuthenticated: !!state.user.authed,
        attempts: state.user.attempts, // so componentWillReceiveProps will get called.
        participationViewData : get(state.graph,['participation','byId'],{}),
        participationRoleViewData : get(state.graph,['participation','byId',participationId,'roles'],{})  
    };    
};

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
        component: connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(ParticipationMeetingIndex))
    }
]

