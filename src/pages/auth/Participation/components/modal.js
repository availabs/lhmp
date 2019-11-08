import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import Element from 'components/light-admin/containers/Element'
import {sendSystemMessage} from 'store/modules/messages';
// import {falcorGraph} from "store/falcorGraph";
import { Link } from "react-router-dom"
//import {sendSystemMessage} from 'store/modules/messages';
import {falcorGraph} from "store/falcorGraph";
import get from "lodash.get"
import pick from "lodash.pick";


const COLS = [
    "id",
    "contact_name",
    "contact_email",
    "contact_phone",
    "contact_address",
    "contact_title_role",
    "contact_department",
    "contact_agency",
    "contact_municipality",
    "contact_county",
    "associated_plan"
]

const COLS_TO_DISPLAY = [
    "id",
    "contact_name",
    "contact_title_role",
    "contact_department",
    "contact_agency",
    "contact_municipality",

]

const RoleAttributes = [
        'contact_name',
        'check_in',
        'role_id', 
       // 'participation_id', 
        'status'

]




class Modal extends React.Component {

    constructor(props){
        super(props)

        this.state={
            role_data: [],
           // roleid: this.props.roleid
        }

    
        this.onInvite = this.onInvite.bind(this)
        this.renderMainTable = this.renderMainTable.bind(this)
    }


    fetchFalcorDeps() {
       
        let role_data =[];
        if(!this.props.activePlan) return Promise.resolve();
        return this.props.falcor.get(['roles','length'])
            .then(response => response.json.roles.length)
            .then(length => this.props.falcor.get(
                ['roles','byIndex', { from: 0, to: length -1 }, 'id']
                )
                    .then(response => {
                        console.log('role_response',response)
                        const ids = [];
                        for (let i = 0; i < length; ++i) {
                            const graph = response.json.roles.byIndex[i]
                            if (graph) {
                                ids.push(graph.id);
                            }
                        }
                        return ids;
                    })
            )
            .then(ids =>
                this.props.falcor.get(['roles','byId', ids, COLS])
                    .then(response => {
                        Object.keys(response.json.roles.byId)
                            .filter(d => d!== '$__path'
                                && response.json.roles.byId[d].associated_plan === parseInt(this.props.activePlan))
                            .forEach(function(role,i){
                                console.log('each role',response.json.roles.byId)
                            role_data.push({
                                'id' : role,
                                'data': Object.values(response.json.roles.byId[role])
                            })
                        })
                            console.log('role_data',role_data)
                        this.setState({role_data: role_data})
                        return role_data
                    })
            )
            .then (test => {

                 return  this.props.falcor.get(['participation','byId', [this.props.participationId], 'roles','length'])

                  .then(response =>{

                         const length = get(response, ['json', 'participation', 'byId', this.props.participationId,'roles','length'], 0)
                          console.log('length-------------', length)   
                         return length  
                         

                             })
                 
                    .then(length => {
                      return  this.props.falcor.get(['participation','byId', [this.props.participationId], 'roles',{from: 0, to: length-1}, RoleAttributes])
                      .then(response => {
                        console.log('participation byId response new', response);
                        let participationRoleData = []

                        if (response.json.participation.byId[this.props.participationId].roles) 
                          {
                              Object.values(
                                response.json.participation.byId[this.props.participationId].roles
                                ).forEach(participation => {
                              participationRoleData.push(Object.values(pick(participation,...RoleAttributes)))
                            })
                          
                           console.log('participation byId test_new', participationRoleData);

                          } 
                          return response

                      })
                    })


            })

          

    }



    onInvite(e){

        //console.log('onclick event',e ,  e.target.value)

        const roleAttributes = {
            'role_id':e.target.value,
            'participation_id':this.props.participationId,
            'status': 'invited',
            'check_in': null
        }

        console.log('roleAttributes', roleAttributes)


        let args = [];
       // if(!this.props.match.params.participationId){
            
        Object.values(roleAttributes).forEach(function(step_content){
            args.push(step_content)
        });

        console.log('args', args)

        return this.props.falcor.call(['participation', 'byId', [roleAttributes.participation_id], 'invite', [roleAttributes.role_id]], args )
        .then(response => {

            this.props.sendSystemMessage(` Role ID: ${roleAttributes.role_id} was successfully invited.`, {type: "success"});
        })
    } 

      

    


renderMainTable() {
        let table_data = [];
        let attributes = COLS_TO_DISPLAY
          //console.log('final data', this.state.role_data)
        let modal_data = Object.values(this.props.participationRoleData)
        console.log('modal_data', modal_data)
        let invitedIds = modal_data.map(modal => {
           console.log("modal", modal)
            if (modal.status &&  modal.status === 'invited' ) {
                return modal.role_id
            }
        })

        let length = invitedIds.length
        let InvitedIds = invitedIds.slice(0,length-1)
        // let InvitedIds = invitedIds.pop
          console.log('InvitedIds', InvitedIds)
          //console.log( 'this.state.role_data', this.state.role_data)
        this.state.role_data
        .filter(row => !InvitedIds.includes(parseInt(row.id)))
        .map(function (each_row) {
              //console.log('each_row-----', each_row)

                  table_data.push([].concat(attributes.map(f => {
                return each_row.data[ COLS.indexOf(f) + 1 ]} )))
          
        })
        console.log('table_data-----', table_data)

        return table_data.length > 0 ?(
            <table className="table table lightBorder">
                <thead>
                <tr>
                    {attributes.map(function(role,index){
                        return (
                            <th>{role === 'contact_municipality' ? 'Jurisdiction' : role}</th>
                        )
                    })
                    }
                </tr>
                </thead>
                <tbody>

           
                {table_data.map((data) =>{             
                    //console.log('what is modaldata', data)
                    return (
                        <tr>
                            {data.map((d) => {
                                return (
                                    <td>{d}</td>
                                )
                            })
                            }                     
                            <td>                               
                                <button className="btn btn-primary step-trigger-btn"  href ={'#'} onClick={this.onInvite} value={data[0]} > Invite</button>     
                            </td>
                          
                        </tr>
                    )
                })
                }
                </tbody>
            </table>
        ) : <div> No Roles found.</div>
    }


  render () {


    
    return (

      <div 
        className="onboarding-modal modal fade animated show" 
        id="onboardingWideFormModal" role="dialog" tabIndex={-1} 
        style={{paddingRight: '15px', display: this.props.display ? 'block' : 'none' }}
        >
        <div className="modal-dialog modal-lg modal-centered" role="document">
          <div className="modal-content text-left">
            
            <button aria-label="Close" className="close" data-dismiss="modal" type="button" onClick={this.props.close}><span className="close-label">Close</span><span className="os-icon os-icon-close" /></button>

            <div className="onboarding-side-by-side">
              <div className="onboarding-media"><img alt="" src="img/bigicon5.png" width="200px" /></div>
              <div className="onboarding-content with-gradient">
                  
                <div className='container'>
                    <Element>
                       <h4 className="element-header">
                            Invite Modal
                        </h4>
                        <div className="element-box">
                               Plan Id : {this.props.activePlan}
                               <br/>
                            <div className="table-responsive" >
                             {  this.renderMainTable() }
                            </div>

                       


                        </div>
                    </Element>
                </div>               




              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }


}


const mapDispatchToProps = {
    sendSystemMessage
};


const mapStateToProps = (state, ownProps) => {
       const participationId = ownProps.participationId
    return ({
      //  roleid: ownProps.computedMatch.params.roleid,
        activePlan: state.user.activePlan,
        //roles: state.graph.roles || {}
       // participationViewData : get(state.graph,['participation','byId'],{})
        participationRoleData : get(state.graph,['participation','byId',participationId,'roles'],{})  
    })
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Modal))







//export default Modal;