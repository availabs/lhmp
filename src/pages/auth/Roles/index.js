import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import Element from 'components/light-admin/containers/Element'
// import {falcorGraph} from "store/falcorGraph";
import { Link } from "react-router-dom"
import {sendSystemMessage} from 'store/modules/messages';
// import {center} from "@turf/turf";
// import {setActivePlan} from 'store/modules/user'
/*
begin;
CREATE TEMPORARY TABLE t
ON commit drop
as (SELECT id, county, fips, plan_consultant, plan_expiration, plan_grant,
       plan_url, plan_status, groups
  FROM plans.county
  WHERE county = 'Sullivan County');

update t
set groups = groups || '{Sullivan County HMP General, Sullivan County HMP Admin, Sullivan County HMP Public}'
where county = 'Sullivan County'
returning *;

select * from t

rollback;

update plans.county dst
set groups = ('{AVAIL, ' || src.county || ' HMP General, ' || src.county || ' HMP Admin, ' || src.county || ' HMP Public}') :: character varying[]
FROM plans.county src
where src.county = dst.county
returning dst.groups;
*/

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

class RolesIndex extends React.Component {

    constructor(props){
        super(props)

        this.state={
            action_data: [],
            roleid: this.props.roleid
        }

        this.deleteWorksheet = this.deleteWorksheet.bind(this)
    }
    // componentDidMount(e) {
    //     this.fetchFalcorDeps();
    // }
    //
    // componentWillMount(){
    //
    //     this.fetchFalcorDeps().then(response =>{
    //         this.setState({
    //             action_data : response
    //         })
    //     })
    //
    // }

    fetchFalcorDeps() {
        let action_data =[];
        if(!this.props.activePlan) return Promise.resolve();
        return this.props.falcor.get(['roles','byPlanId', this.props.activePlan, COLS])
            .then(response => {
                console.log('res', response)
                if (response.json.roles.byPlanId[this.props.activePlan]){
                    Object.keys(response.json.roles.byPlanId).filter(d => d!== '$__path').forEach(function(action,i){
                        console.log('---',response.json.roles.byPlanId[action])
                        action_data.push({
                            'id' : response.json.roles.byPlanId[action]['id'].toString(),
                            'data': Object.values(response.json.roles.byPlanId[action])
                        })
                    })}
                return this.setState({action_data})
            })
    }

    deleteWorksheet(e){
        e.persist()
        let roleId = e.target.id
        this.props.sendSystemMessage(
            `Are you sure you with to delete this Role with id "${ roleId }"?`,
            {
                onConfirm: () => this.props.falcor.call(['roles','remove'],[roleId.toString()],[],[]).then(() => this.fetchFalcorDeps().then(response => {
                    this.setState({
                        action_data:response
                    })
                })),
                id: `delete-content-${ roleId }`,
                type: "danger",
                duration: 0
            }
        )

    }

    renderMainTable() {
        let table_data = [];
        let attributes = COLS.slice(0,4)
        console.log('final data', this.state.action_data)
        this.state.action_data.map(function (each_row) {
            console.log('each row: ',each_row)
            table_data.push([].concat(each_row.data.slice(1,5)))
        })

        return table_data.length > 0 ?(
            <table className="table table lightBorder">
                <thead>
                <tr>
                    {attributes.map(function(action,index){
                        return (
                            <th>{action}</th>
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
                                        onClick={this.deleteWorksheet}>
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

    renderRoleView() {
        let roleid = this.state.roleid,
            tableData = [];
        this.state.action_data.map(function(f) {
            console.log('f',f, typeof f.id, typeof roleid)
            if (f.id === roleid) tableData.push(...f.data.slice(1,f.data.length-1))
        });
        console.log('tableData view', tableData)
        return (
            <table className="table table lightBorder">
                <thead>
                <tr>
                    <th> ATTRIBUTE </th>
                    <th> VALUE </th>
                </tr>
                </thead>
                <tbody>
                    {tableData.map((data,data_i) =>{
                        return (
                            <tr>
                                <td>{COLS[data_i]}</td>
                                <td>{data}</td>
                            </tr>
                        )
                    })
                    }
                </tbody>
            </table>
        )
    }
    render() {
        console.log('authPLans', this.props.activePlan, this.props)
        return (
            <div className='container'>
                <Element>
                    <h4 className="element-header">Roles : {this.props.activePlan}
                        <span style={{float:'right'}}>
                        <Link
                            className="btn btn-sm btn-primary"
                            to={ `/role/new` } >
                                Add New Role
                        </Link>
                    </span>
                    </h4>
                    <div className="element-box">
                        <div className="table-responsive" >
                            { this.state.roleid ? this.renderRoleView() : this.renderMainTable() }
                        </div>
                    </div>
                </Element>
            </div>
        )

    }
}

const mapStateToProps = (state, ownProps) => {
    return ({
        roleid: ownProps.computedMatch.params.roleid,
        activePlan: state.user.activePlan,
        //roles: state.graph.roles.planId || {}
    })
};

const mapDispatchToProps = {
    sendSystemMessage,
    //setActivePlan
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
        component: connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(RolesIndex))
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
        component: connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(RolesIndex))
    }
]
