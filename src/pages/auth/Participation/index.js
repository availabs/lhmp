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
       'id',
       'type', 
       'plan_id', 
       'owner_id', 
       'start_date', 
       'end_date', 
       'hours'
]

//const attributes = ATTRIBUTES_PROJECT.slice(0,3)




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
                                //console.log('response_2', response.json.participation.byPlan[this.props.activePlan].byIndex);

                                let test = []
/*
                                Object.values(response.json.participation.byPlan[this.props.activePlan].byIndex).forEach(participation => {
                                  test.push(Object.values(pick(participation,...ATTRIBUTES_PROJECT)))
                                })
*/
                            if (response.json.participation.byPlan[this.props.activePlan].byIndex) 
                              {
                                  Object.values(response.json.participation.byPlan[this.props.activePlan].byIndex).forEach(participation => {
                                  test.push(Object.values(pick(participation,...ATTRIBUTES)))
                                })
                              } 
/*
                              get(response, ['json', 'participation', 'byPlan', this.props.activePlan, 'byIndex'], [{}]).forEach(participation => {
                                  test.push(Object.values(pick(participation,...ATTRIBUTES_PROJECT)))
                                })
                              */

                        //console.log('get(response)', get(response, ['json', 'participation', 'byPlan', this.props.activePlan, 'byIndex'], [{}]))
                              //  console.log('response_3', test )

                              return response
                          })

            }




    participationTableData(){


      // if (this.props.planParticipation.byIndex !== undefined){
            
      //      let nulldata = null

/*
          console.log('this.props.planParticipation',this.props.planParticipation)
           console.log('this.props.planParticipation.byIndex',this.props.planParticipation.byIndex )
           console.log('this.props.planParticipationData',this.props.planParticipationData)*/

/*
              get(this.props.planParticipation).forEach(participation => {
                  test.push(Object.values(pick(participation,...attributes)))
                })*/

/*
                       const byIndex = this.props.planParticipationData;
                      // get(byIndex, [byId])
                       const indexValues = byIndex && Object.values(this.props.planParticipationData)
                       console.log('indexlen', byIndex)*/


                                               /*         if (indexValues) {
                                                          for (let i = 0; i < indexValues.length; ++i) {
                                                            const participation = indexValues[i]                              
                                                            if (participation) {
                                                              const attributes = Object.values(pick(participation,...attributes),
                                                              data.push(attributes)
                                                            }
                                                          }
                                                        }*/

      //    } else {



// if (this.props.planParticipation.byIndex !== undefined){

            let data = []
            let attributes = ATTRIBUTES.slice(0,3)

        /*
            Object.values(this.props.planParticipationData).forEach(participation =>{
                data.push(Object.values(pick(participation,...attributes)))

                console.log('data', data)
            });
        */

             const databyId = this.props.planParticipationData;
             //const databyId1= this.props.planParticipationData[this.props.match.params.Id];
             console.log('databyId', databyId)

             const dataValue = Object.values(databyId);
             console.log('dataValue', dataValue)
             

             //console.log('dataValueType', dataValueType)

             //console.log ('GetdatabyId', get(databyId,[2],[] ))
                //  console.log ('databyId1', databyId1)

           //  console.log(Object.keys(databyId))
           // [this.props.match.params.Id]


            // get(databyId,['id'], []).forEach(participation =>{
            //     data.push(Object.values(pick(participation,...attributes)))
            // });


 

              return (
                        <div className='container'>
                            <Element>
                                <h4 className="element-header">Participation
                                    <span style={{float:'right'}}>
                                <Link
                                    className="btn btn-sm btn-primary"
                                    to={ `/participation/new` } >
                                        Create New Participation
                                </Link>
                                    </span>
                                </h4>
                                <div className="element-box">

                                  user ID: {this.props.userId}
                                    
                                    <br />

                                 {/*  length: {this.props.planParticipation.length}*/}


                                 <div className="table-responsive" >
                                                <table className="table table lightBorder">
                                                    <thead>   
                                                    <tr>
                                                    {attributes.map(function(participation,index){
                                                        return (
                                                            <th>{participation}</th>
                                                        )
                                                    })
                                                    }
                                                </tr>
                                                    </thead>
                                                    <tbody>
                                                      {
                                                        Object.values(this.props.planParticipationData).map((item) =>{
                                                          return (
                                                              <tr>
                                                                  
                                                                  <td>{item.id}</td>
                                                                  <td>{item.type}</td>
                                                                  <td>{item.plan_id}</td>
                                                                 <td>
                                                                    <Link className="btn btn-sm btn-outline-primary"
                                                                          to={ `/participation/edit/${item.id}` } >
                                                                        Edit
                                                                    </Link>
                                                                </td>
                                                                <td>

                                                                 { item.type === 'meeting' || item.type === 'Meeting' ? 
                                                                        <Link className="btn btn-sm btn-outline-primary"
                                                                              to={ `/meeting/view/${item.id}` }>
                                                                            View
                                                                        </Link>
                                                                                      
                                                                : 
                                                                        <Link className="btn btn-sm btn-outline-primary"
                                                                              to={ `/participation/view/${item.id}` }>
                                                                            View
                                                                        </Link>
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
               // }
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
    planParticipationData: get(state.graph, `participation.byId`, {}), // state.graph.participation.byId || {}

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
        mainNav: false,
        icon: 'os-icon-tasks-checked',
        breadcrumbs: [
            { name: 'Participation', path: '/participation/' },
             { param: 'Id', path: '/participation/view/' }
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