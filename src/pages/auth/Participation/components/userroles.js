import React from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import Element from 'components/light-admin/containers/Element';
import {sendSystemMessage} from 'store/modules/messages';
//import TableView from "../../../components/light-admin/tables/TableView";
import get from "lodash.get"
import pick from "lodash.pick";



const ATTRIBUTES = [
     //'id',
     'contact_name',
    // 'contact_email',
   //  'contact_phone',
   //  'contact_address',
   //  'contact_title_role',
    // 'contact_department',
    // 'contact_agency',
    // 'contact_municipality',
   //  'contact_county',
     'associated_plan',
     'role_id',
     'participation_id',
     'status',
    // 'check_in'
]


class ParticipationUserRoles extends React.Component {
    constructor(props) {
        super(props);

 /*       this.state = {
         status : this.props.userroleStatus
        }
*/

        this.planparticipationTableData = this.planparticipationTableData.bind(this);

        this.changeStatus = this.changeStatus.bind(this)
        //this.changeNStatus = this.changeNStatus.bind(this)

    }

    fetchFalcorDeps() {
       // let roles_data =[];
       // let email = this.props.email;
        return  this.props.falcor.get(['users', [this.props.email], 'roles', 'length'])

            .then(response =>{
                   //console.log('byEmail response-------------', response)  
                 const length = get(response, ['json','users', this.props.email,'roles','length'], 0)
                  console.log('byEmail length-------------', length)  
                 return length  
                     })
         
            .then(length => {

              return  this.props.falcor.get(['Users', [this.props.email], 'roles',{from: 0, to: length-1}, ATTRIBUTES]) 
             

              .then(response => {

                console.log('User test  -----', response);
                console.log('test -------', this.props.userroleparticipationViewData)
                let participationRoleData = []

                if (response.json.Users[this.props.email].roles) 
                  {
                      Object.values(
                        response.json.Users[this.props.email].roles
                        ).forEach(participation => {
                      participationRoleData.push(Object.values(pick(participation,...ATTRIBUTES)))
                    })
                   console.log('Users by emails-------', participationRoleData);
                  } 
                  return response
              })


        })

    }


/*onAttending(e){
     e.preventDefault();
     let args = [];


         if ( Yes button ) {
           updated_data.status = 'attending'

         } else {
            updated_data.status = 'not attending'
         }

             });

                   console.log('updated_data',  updated_data)

            return this.props.falcor.set({
                paths: [
                    ['Users', [this.props.email],'roles', , attributes]
                ],
                jsonGraph: {
                       Users: {
                          [this.props.email] : {
                             roles: {
                              [this.props.match.params.participationId]: updated_data
                        }
                    }
                  }
               }
            })
                .then(response => {
                    this.props.sendSystemMessage(`Status was successfully edited.`, {type: "success"});
                })


}*/

/*
  changeYStatus() {
     const newStatus = this.state.status == 'invited' ? 'attending' : null;
     this.setState({status:newStatus})
     console.log('Yes state-------', this.state.status)

  }
  

   changeNStatus() {
     const newStatus = this.state.status == 'invited' ? 'not attending' : null;
     this.setState({status:newStatus})
      console.log('No state-------', this.state.status)
  }
  
*/

  changeStatus(value,pid, /*roleId, */index) {
          const length = this.props.userroleLength.value 
       

        return this.props.falcor.set({
                paths: [
                    ['Users', [this.props.email],'roles', [index], ['status','associated_plan', 'participation_id'/*, 'role_id'*/]]
                ],
                jsonGraph: {
                       Users: {
                          [this.props.email]: {
                             roles: {
                              [index]: {
                                         'status': value,
                                         'associated_plan' : this.props.activePlan,
                                         'participation_id' : pid
                                       /*  'role_id': roleId*/
                                         
                                       }
                                }
                           }
                       }
                }
            })

                .then(response => {
                    console.log('ResponsePid-------------', JSON.stringify(response), response)
                    this.props.sendSystemMessage(`Status was successfully updated.`, {type: "success"});
                     
                })

  }


    planparticipationTableData(){

         let data =[]
         const databyId = this.props.userroleparticipationViewData;
         const length = this.props.userroleLength.value;
          console.log('length', length)
         console.log('databyId', databyId)
             
             data = Object.values(databyId);
          //let Email = this.props.email

              
         console.log('data', data)
         console.log('test email ----', this.props.email)
         console.log('test user ----', this.props.userId)
         console.log('test graph ---', this.props.geoGraph)
        // console.log('test userroleStatus----', this.props.userroleStatus)
         console.log('test userroleLength----', this.props.userroleLength.value)
         // console.log('this state-------', this.state)
        //console.log('test ---------------', databyId.roles.'0'.status)
         //console.log('test userroleLength1----', this.props.geoGraph.users.[this.props.email].roles.length.value)
      

          return (
                    <div className='container'>
                        <Element>
                            <h4 className="element-header">Participation User Roles 

                            </h4>
                            <div className="element-box">

                                 <div className="table-responsive" >
                                                    <table className="table table lightBorder">

                                                        <thead>   
                                                        <tr>
                                                        {ATTRIBUTES.map(function(participation,index){
                                                            return (
                                                                <th>{participation}</th>
                                                            )
                                                        })
                                                        }
                                                        </tr>
                                                        </thead>

                                                        <tbody>

                                                       {
                                                            data.map((item,index) =>{
                                                                console.log('what is item', item)
                                                                //console.log('what is values', item[0].associated_plan)
                                                               //console.log('what is planid', this.props.activePlan)
                                                           

                                                              return (


                                                                  <tr>
                                              
                                                                      <td>{item.contact_name}</td>
                                                                      <td>{item.associated_plan}</td> 
                                                                      <td>{item.role_id}</td> 
                                                                      <td>{item.participation_id}</td>
                                                                      <td>{item.status}</td>
                                                                      <td>  
                                                                         { item.status  === 'invited'  ?                             
                                                                        <div> 
                                                                        <button className="btn btn-primary step-trigger-btn"  href ={'#'} onClick={this.changeStatus.bind(this,'attending',item.participation_id,  index )} > Yes</button> 
                                                                        <button className="btn btn-primary step-trigger-btn"  href ={'#'} onClick={this.changeStatus.bind(this,'not attending', item.participation_id,  index )} > No </button>    
                                                                        </div>
                                                            
                                                                           :

                                                                         null

                                                                        } 

                                                                      </td>

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

    render() {
      return (
            <div>{this.planparticipationTableData()}</div>
        )
    }


    
}

const mapDispatchToProps = {
    sendSystemMessage
};


const mapStateToProps = (state, ownProps) => {
    return ({
        userId: state.user.id || 'no user',
        isAuthenticated: !!state.user.authed,
        attempts: state.user.attempts, // so componentWillReceiveProps will get called.
        geoGraph: state.graph,
        email:state.user.email,
        activePlan: state.user.activePlan,
        userroleparticipationViewData : get(state.graph,['Users',state.user.email,'roles'],{}),
        userroleLength : get(state.graph, ['users', state.user.email, 'roles', 'length'],{}),
        //userroleLength1 : state.graph.users.state.user.email.roles.length,
        //userroleStatus: get(state.graph,['Users',state.user.email,'roles', 0, 'status'],{})

               // userroleparticipationViewData : get(state.graph,['participation','byEmail',state.user.email],{})
    })
};



export default [
    {
        path: '/userroles',
        exact: true,
        name: 'User',
        auth: true,
        mainNav: false,
        icon: 'os-icon-pencil-2',
        //        breadcrumbs: [
           //         { name: 'Roles', path: '/roles/' },
              //      { param: 'roleid', path: '/roles/' }

              //  ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(ParticipationUserRoles))
    }
]