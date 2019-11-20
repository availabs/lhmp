import React from 'react'
import {connect} from 'react-redux'
import { reduxFalcor } from 'utils/redux-falcor'
import {authProjects, authGeoid} from "../../../store/modules/user";

import Element from 'components/light-admin/containers/Element'

import {sendSystemMessage} from 'store/modules/messages';
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


const PATTRIBUTES = [
       'type', 
       //'plan_id', 
       //'owner_id', 
       'start_date', 
       'end_date', 
       //'hours', 
      // 'users', 
       //'roles', 
       'id'
]


class HomeView extends React.Component {

  constructor (props) {
    super(props)

            this.planparticipationTableData = this.planparticipationTableData.bind(this);

        this.changeStatus = this.changeStatus.bind(this)
  }



  fetchFalcorDeps() {
     // let roles_data =[];
     // let email = this.props.email;

      return  this.props.falcor.get(['users', [this.props.email], 'roles', 'length'])  // how to change this to loadash


          .then(response =>{
            
                 console.log('byEmail response-------------', response)  

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

            /*      if (response.json.Users[this.props.email].roles) 
                    {
                        Object.values(
                          response.json.Users[this.props.email].roles
                          ).forEach(participation => {
                             //console.log('participation-----', participation)
                        participationRoleData.push(Object.values(pick(participation,...ATTRIBUTES)))
                      })
                     console.log('Users by emails-------', participationRoleData,  participationRoleData[2]);
                    } 
                    return response*/

                     const getResponse = get(response,['json','Users', this.props.email, 'roles'], {} )
                     
                     console.log('getResponse-------', getResponse);

                      Object.values(
                             getResponse
                              ).forEach(participation => {
                            participationRoleData.push(Object.values(pick(participation,...ATTRIBUTES)))
                          })

                      console.log('Users by emails-------', participationRoleData);

                      return response

              


                })


                    .then (responsebyId =>  { 
                    console.log('responsebyId-----------test', responsebyId )

                      let participationIds = []
                       let ParticipationIds = []
                        let NParticipationIds = []
    /*
                      if (responsebyId.json.Users[this.props.email].roles) 
                            {
                                Object.values(
                                  responsebyId.json.Users[this.props.email].roles
                                  ).forEach(participation => {
                                     console.log('participation-----', participation)
                                     //console.log('participation-----id', participation.participation_id)

                                participationIds.push(participation.participation_id)
                              })

                     
                            //  ParticipationIds  =  participationIds.filter(v => v !== undefined);
                           //  NParticipationIds =   Object.values(ParticipationIds)

                             console.log('ParticipationIds-------', participationIds);
                           
                            } */

                        const getResponseById = get(responsebyId,['json','Users', this.props.email, 'roles'], {} )

                         console.log('getResponseById-------', getResponseById);

                             Object.values(
                               getResponseById
                                ).forEach(participation => {
                                        // console.log('participation-----', participation)
                                    participationIds.push(participation.participation_id)
                            })

                             console.log('ParticipationIds-------', participationIds);





                         return this.props.falcor.get(['participation','byId',participationIds,PATTRIBUTES])



                            .then(response => {
                                console.log('responsebyId----------------------',response)
                                return response

                            })  

                    })


             })


  }


  changeStatus(value, pid, index) {
          const length = this.props.userroleLength.value 
       

        return this.props.falcor.set({
                paths: [
                    ['Users', [this.props.email],'roles', [index], ['status','associated_plan', 'participation_id']]
                ],
                jsonGraph: {
                       Users: {
                          [this.props.email]: {
                             roles: {
                              [index]: {
                                         'status': value,
                                         'associated_plan' : this.props.activePlan,
                                         'participation_id' : pid
                                         
                                       }
                                }
                           }
                       }
                }
            })
                .then(response => {
                    console.log('response-------------', JSON.stringify(response))
                    this.props.sendSystemMessage(`Status was successfully updated.`, {type: "success"});
                     
                })

  }


   planparticipationTableData(){

         let data =[]
         let pdata =[]
         const databyroles = this.props.userroleparticipationViewData;
         
         const participationtable = this.props.participationViewData;
         
          console.log('participationtable', participationtable)

         const length = this.props.userroleLength.value;
        // const databyId =databyroles.roles/*[length-1].participation_id*/
        // const participationId = participationId
          console.log('length', length)

         console.log('databyroles', databyroles)
             
             data = Object.values(databyroles);
              
           console.log('data', data)

           console.log('test email ----', this.props.email)
           console.log('test user ----', this.props.userId)
           console.log('test graph ---', this.props.geoGraph)
           console.log('test userroleStatus----', this.props.userroleStatus)
           console.log('test userroleLength----', this.props.userroleLength.value)

        //console.log('test ---------------', databyId.roles.'0'.status)
         //console.log('test userroleLength1----', this.props.geoGraph.users.[this.props.email].roles.length.value)
      

          return (
                    <div className='container'>
                        <Element>
                     
                            <div className="element-box">

                                 <div className="table-responsive" >
                                                    <table className="table table lightBorder">

                                                        <thead>   
                                                        <tr>
                                                                      <th>Type</th>
                                                                      <th>Start date</th>
                                                                      <th>End date</th>  
                                                                      <th>Role ID</th> 

                                                                      <th>Participation ID</th>
                                                                      <th>Status</th>
                                                   
                                                        </tr>
                                                        </thead>

                                                        <tbody>

                                                       {
                                                            data.map((item, index) =>{
                                                                 //console.log('what is item', item)
                                                                 //console.log( 'item.participation_id', item.participation_id)
                                                                //console.log('what is values', item[0].associated_plan)
                                                               //console.log('what is planid', this.props.activePlan)
                                                               //console.log('item[length-1]-----', item[length-1])
                                                             let pid = item.participation_id;
                                                               //console.log('pid', pid)
                                                               //console.log('pid.type.value', participationtable[pid].type.value)
                                                        


                                                              return (

                                                               item && item.associated_plan == this.props.activePlan || item && item.status == 'invited' || item && item.status == 'not attending'  || item && item.status == 'attending' ?

                                                          


                                                                  <tr>
                                               
                                                                     <th>{participationtable[pid].type.value}</th>

                                                                     <th>{participationtable[pid].start_date.value}</th>
                                                                     <th>{participationtable[pid].end_date.value}</th>

                                                                     <td>{item.role_id}</td> 
                                                                     <td>{item.participation_id}</td>
                                                                 
                                                                     <td>{item.status}</td>
                                                                     <td>    
                                                                        { item.status  === 'invited'  ?                             
                                                                         <div> 
                                                                          <button className="btn btn-primary step-trigger-btn"  href ={'#'} onClick={this.changeStatus.bind(this,'attending',item.participation_id, index)} > Yes</button> 
                                                                          <button className="btn btn-primary step-trigger-btn"  href ={'#'} onClick={this.changeStatus.bind(this,'not attending', item.participation_id, index)} > No </button>    
                                                                        </div>
                                                            
                                                                           :

                                                                         null

                                                                        } 



                                                                      </td>

                                                                  </tr>

                                                                  :  
                                                                    null

                                                                  
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
    /*
    var title ='Home';
    var subheader = 'Dashboard';setActivePlan
     */
    return(
      <div className='container'>
        <Element>
        <form>
        <h4  className="element-header">Mitigation Planner Home</h4>
        <h6>Home Page for {this.props.activePlan} {this.props.activeGeoid}</h6>
        </form>

          <div className="row">
            <div className="col-3">
                  <div className="element-wrapper">
                     <div className="element-box">

                        <h6>TEST</h6>
                 
                     </div>
                  </div>
            </div>

            <div className='col-9'>

                  <div className='element-wrapper'>
                      <div className='element-box'>
                      
                       <h6 >My Meetings</h6>
                         <div>{this.planparticipationTableData()}</div>
                         
                      </div>

                             
                 </div>

            </div>
         </div>  

        </Element>
      </div>
    )
  }
}




const mapStateToProps = state => {
  console.log('graph', state.graph)
  return ({
    activePlan: state.user.activePlan, // so componentWillReceiveProps will get called.
    activeGeoid: state.user.activeGeoid,
    userId: state.user.id || 'no user',
        isAuthenticated: !!state.user.authed,
        attempts: state.user.attempts, // so componentWillReceiveProps will get called.
        geoGraph: state.graph,
        email:state.user.email,
        userroleparticipationViewData : get(state.graph,['Users',state.user.email,'roles'],{}),
        userroleLength :  get(state.graph, ['users', state.user.email, 'roles', 'length'],{}),
        //userroleLength :  get(state.graph, `users.${state.user.email}.roles.length`,{}), //['users', state.user.email, 'roles', 'length'],{}),  
        // state.graph.users[state.user.email].roles.length
        participationViewData : get(state.graph,['participation','byId'],{})
        //userroleLength1 : state.graph.users.state.user.email.roles.length,
        //userroleStatus: get(state.graph,['Users',state.user.email,'roles', 0, 'status'],{})

  });
}

const mapDispatchToProps = ({
  sendSystemMessage
  //authProjects,
  //authGeoid

});

export default {
  icon: 'os-icon-home',
  path: '/admin',
  exact: true,
  mainNav: true,
  breadcrumbs: [
    { name: 'Home', path: '/admin' }
  ],
  menuSettings: {
    image: 'none',
    scheme: 'color-scheme-light',
    position: 'menu-position-left',
    layout: 'menu-layout-compact',
    style: 'color-style-default'
  },
  name: 'Home',
  auth: true,
  component: connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(HomeView))
};

