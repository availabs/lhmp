import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import Element from 'components/light-admin/containers/Element'
import {falcorGraph} from "store/falcorGraph";
import { Link } from "react-router-dom"
import {sendSystemMessage} from 'store/modules/messages';

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
    componentDidMount(e) {
        this.fetchFalcorDeps();
    }

    componentWillMount(){

        this.fetchFalcorDeps().then(response =>{
            this.setState({
                action_data : response
            })
        })

    }

    fetchFalcorDeps() {
        let action_data =[];
        return falcorGraph.get(['roles','length'])
            .then(response => response.json.roles.length)
            .then(length => falcorGraph.get(
                ['roles', 'byIndex', { from: 0, to: length -1 }, 'id']
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
                falcorGraph.get(['roles','byId', ids, COLS])
                    .then(response => {
                        //ids.forEach(id =>{
                        Object.keys(response.json.roles.byId).filter(d => d!== '$__path').forEach(function(action,i){
                            action_data.push({
                                'id' : action,
                                'data': Object.values(response.json.roles.byId[action])
                            })
                        })
                        return action_data
                    })
            )


    }

    deleteWorksheet(e){
        e.persist()
        let roleId = e.target.id
        this.props.sendSystemMessage(
            `Are you sure you with to delete this Worksheet with id "${ roleId }"?`,
            {
                onConfirm: () => falcorGraph.call(['roles','remove'],[roleId.toString()],[],[]).then(() => this.fetchFalcorDeps().then(response => {
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
        this.state.action_data.map(function (each_row) {
            console.log('each row', each_row)
            table_data.push([each_row.id].concat(each_row.data.slice(1,4)))
        })

        return (
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
                                      to={ `/roles/edit/${data[0]}` } >
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
        )
    }

    renderRoleView() {
        let roleid = this.state.roleid,
            tableData = [roleid]
            ;
        this.state.action_data.map(function(f) {
            if (f.id === roleid) tableData.push(...f.data.slice(1,f.data.length-1))
        });
        console.log('data', tableData)
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
        return (
            <div className='container'>
                <Element>
                    <h6 className="element-header">Roles
                        <span style={{float:'right'}}>
                        <Link
                            className="btn btn-sm btn-primary"
                            to={ `/roles/new` } >
                                Add New Role
                        </Link>
                    </span>
                    </h6>
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
    console.log('ownProps roles', ownProps)

    return ({
        isAuthenticated: !!state.user.authed,
        attempts: state.user.attempts, // so componentWillReceiveProps will get called.
        roleid: ownProps.computedMatch.params.roleid
    })
};

const mapDispatchToProps = {
    sendSystemMessage
};

export default [
    {
        path: '/roles/',
        exact: true,
        name: 'Roles',
        auth: true,
        mainNav: true,
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
        component: connect(mapStateToProps,mapDispatchToProps)(RolesIndex)
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
        component: connect(mapStateToProps,mapDispatchToProps)(RolesIndex)
    }
]
