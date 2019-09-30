import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import Element from 'components/light-admin/containers/Element'
// import {falcorGraph} from "store/falcorGraph";
import { Link } from "react-router-dom"
//import {sendSystemMessage} from 'store/modules/messages';


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
    "contact_title_role",
    "contact_department",
    "contact_agency",
    "contact_municipality",
    "contact_county",
]


class Modal extends React.Component {

  constructor(props){
        super(props)

        this.state={
            role_data: [],
           // roleid: this.props.roleid
        }

        //this.deleteRole = this.deleteRole.bind(this)
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
                        this.setState({role_data: role_data})
                        return role_data
                    })
            )
    }


renderMainTable() {
        let table_data = [];
        let attributes = COLS
        console.log('final data', this.state.role_data)
        this.state.role_data.map(function (each_row) {
            console.log('each row: ',each_row)
            table_data.push([].concat(attributes.map(f => {
                return each_row.data[ COLS.indexOf(f) + 1 ]} )))
        })

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
                    return (
                        <tr>
                            {data.map((d) => {
                                return (
                                    <td>{d}</td>
                                )
                            })
                            }
                            <td>
                                <Link className="btn btn-sm btn-outline-primary"
                                      to={ `/role/edit/${data[0]}` } >
                                    Edit
                                </Link>
                            </td>
                            <td>
                                <Link className="btn btn-sm btn-outline-primary"
                                      to={ `/roles/${data[0]}` }>
                                    View
                                </Link>
                            </td>
                            <td>
                                <button id= {data[0]} className="btn btn-sm btn-outline-danger"
                                        onClick={this.deleteRole}>
                                    Delete
                                </button>
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
          <div className="modal-content text-center">
            
            <button aria-label="Close" className="close" data-dismiss="modal" type="button" onClick={this.props.close}><span className="close-label">Skip Intro</span><span className="os-icon os-icon-close" /></button>

            <div className="onboarding-side-by-side">
              <div className="onboarding-media"><img alt="" src="img/bigicon5.png" width="200px" /></div>
              <div className="onboarding-content with-gradient">
                  
                <div className='container'>
                    <Element>
                        <h4 className="element-header">Roles : {this.props.activePlan}
                            
                        </h4>
                        <div className="element-box">
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



const mapStateToProps = (state, ownProps) => {
    return ({
      //  roleid: ownProps.computedMatch.params.roleid,
        activePlan: state.user.activePlan,
        //roles: state.graph.roles || {}
       // participationViewData : get(state.graph,['participation','byId'],{})
    })
};

export default [
    {
        path: '/roles/',
        exact: true,
        name: 'Roles',
        auth: true,
        mainNav: false,
        icon: 'os-icon-pencil-2',
        breadcrumbs: [
            { name: 'Roles', path: '/roles/' },
            { param: 'roleid', path: '/roles/' }

        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps)(reduxFalcor(Modal))
    },
    {
        path: '/roles/:roleid',
        exact: true,
        name: 'Roles',
        auth: true,
        mainNav: false,
        icon: 'os-icon-pencil-2',
        breadcrumbs: [
            { name: 'Roles', path: '/roles' },
            { param: 'roleid', path: '/roles/' }

        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps)(reduxFalcor(Modal))
    }
]





//export default Modal;