import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import Element from 'components/light-admin/containers/Element'
import {falcorGraph} from "store/falcorGraph";
import { Link } from "react-router-dom"
import {sendSystemMessage} from 'store/modules/messages';
import get from 'lodash.get'
import pick from 'lodash.pick'

const ATTRIBUTES = [
       'type', 
       'plan_id', 
       'owner_id', 
       'start_date', 
       'end_date', 
       'hours', 
       'users', 
       'roles', 
       'id'
]

//let attributes = ATTRIBUTES.slice(0,3);

class ParticipationIndex extends React.Component {

    constructor(props){
        super(props)
    
        this.participationTableData = this.participationTableData.bind(this);
    }

    componentWillMount(){
        this.fetchFalcorDeps()
    }
        

    fetchFalcorDeps() {
             let length = 0;
              if (!this.props.activePlan) {
                  return Promise.resolve({})
                 }
        return falcorGraph.get(['participation','byPlan', [this.props.activePlan],'length'])
            .then(response =>{

                 const length = get(response, ['json', 'participation', 'byPlan', this.props.activePlan, 'length'], 0)
                
                return length 

               /* Object.keys(response.json.participation.byPlan).filter(d => d !== '$__path').forEach(PlanId => {
                                   length = response.json.participation.byPlan[PlanId].length;
                              })
                        console.log('length', length)
                              return length  */                          
                             
                     })
                      .then(length => 
                          falcorGraph.get(
                              ['participation','byPlan',[this.props.activePlan],'byIndex',{from: 0, to: length-1},ATTRIBUTES])
                          ) 
                          .then(response => {
                                 
                                console.log('response_1', response);
                                console.log('response_2', response.json.participation.byPlan[this.props.activePlan].byIndex);

                                let test = []
                                Object.values(response.json.participation.byPlan[this.props.activePlan].byIndex).forEach(participation => {
                                  test.push(Object.values(pick(participation,...ATTRIBUTES)))
                                })
                                console.log('response_3', test )

                              return response
                          })

            }


    participationTableData(){


        if (this.props.planParticipation.byIndex !== undefined){
            //let attributes = ATTRIBUTES.slice(0,4);
            let data = []

           //let test = Object.values(this.props.planParticipation.byIndex)
          // console.log('this.props.planParticipation.byIndex_1',test)

          console.log ('this.props.planParticipation', this.props.planParticipation )

          console.log('this.props.planParticipation.byIndex',this.props.planParticipation.byIndex )
          console.log('this.props.planParticipationData',this.props.planParticipationData)

            Object.values(this.props.planParticipationData).forEach(participation =>{
                data.push(Object.values(pick(participation,...ATTRIBUTES)))
               
/*
                  Object.values( this.props.planParticipationData).forEach(participation =>{
                data.push(Object.values(pick(participation,...ATTRIBUTES)))*/

                console.log('data', data)


            });

              return (
                        <div className='container'>
                            <Element>
                                <h4 className="element-header">Participation
                                    <span style={{float:'right'}}>
                                        
                                        
                                        <button 
                                            disabled
                                            className="btn btn-sm btn-disabled"
                                            >
                                                Create New Item
                                        </button>
                                    </span>
                                </h4>
                                <div className="element-box">

                                    {this.props.userId}
                                    <br />
                                    length: {this.props.planParticipation.length}


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
                                                          {data.map((item) =>{
                                                              return (
                                                                  <tr>
                                                                      {
                                                                          item.map((d) =>{
                                                                              return(
                                                                                  <td>{d.value}</td>
                                                                              )
                                                                          })
                                                                      }
                                                                     
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
            }


              render() {
                  return (
                        <div>{this.participationTableData()}</div>
                    )
                  }
        }



    // deleteWorksheet(e){
    //     e.persist()
    //     let worksheetId = e.target.id
    //     this.props.sendSystemMessage(
    //         `Are you sure you with to delete this Worksheet with id "${ worksheetId }"?`,
    //     {
    //         onConfirm: () => falcorGraph.call(['actions','worksheet','remove'],[worksheetId.toString()],[],[]).then(() => this.fetchFalcorDeps().then(response => {
    //             this.setState({
    //                 action_data:response
    //             })
    //         })),
    //         id: `delete-content-${ worksheetId }`,
    //         type: "danger",
    //         duration: 0
    //     }
    //     )

    // }

    
  
        

      
const mapStateToProps = state => ({
    // isAuthenticated: !!state.user.authed,
    //attempts: state.user.attempts // so componentWillReceiveProps will get called.
    userId: state.user.id || 'no user',
    activePlan: state.user.activePlan,
    planParticipation: get(state.graph, ['participation', 'byPlan', state.user.activePlan], {}),
    planParticipationData: get(state.graph, ['participation', 'byId'], {}),


   //participation: get(state.graph,'participation',{})


});


const mapDispatchToProps = {
    sendSystemMessage
};

export default [
    {
        path: '/participation/',
        exact: true,
        name: 'Participation',
        auth: true,
        mainNav: true,
        icon: 'os-icon-tasks-checked',
        breadcrumbs: [
            { name: 'Participation', path: '/participation/' }
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(ParticipationIndex))
    }
]
