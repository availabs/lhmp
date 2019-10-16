import React from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import Element from 'components/light-admin/containers/Element'
import {falcorGraph} from "store/falcorGraph";
import {Link} from "react-router-dom"
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
];

const COLS_TO_DISPLAY = [
    "id",
    "contact_title_role",
    "contact_department",
    "contact_agency",
    "contact_municipality",
    "contact_county",
];

class RolesIndex extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            role_data: [],
            roleid: this.props.roleid
        };

        this.deleteRole = this.deleteRole.bind(this)
    }

    fetchFalcorDeps() {
        let role_data = [];
        if (!this.props.activePlan) return Promise.resolve();
        return this.props.falcor.get(['roles', 'length'])
            .then(response => response.json.roles.length)
            .then(length => this.props.falcor.get(
                ['roles', 'byIndex', {from: 0, to: length - 1}, 'id']
                )
                    .then(response => {
                        const ids = [];
                        for (let i = 0; i < length; ++i) {
                            const graph = response.json.roles.byIndex[i];
                            if (graph) {
                                ids.push(graph.id);
                            }
                        }
                        return ids;
                    })
            )
            .then(ids =>
                this.props.falcor.get(['geo', 36, 'counties'])
                    .then(countyList => {
                        return this.props.falcor.get(
                            ['geo', countyList.json.geo[36].counties, 'cousubs']
                        ).then(allIds => {
                            let cosubIds = [];
                            Object.values(allIds.json.geo).map(val => {
                                console.log(val, val.cousubs);
                                if (val.cousubs) {
                                    cosubIds.push(...val.cousubs)
                                }
                            });
                            return [...falcorGraph.getCache().geo[36].counties.value, ...cosubIds]
                        })
                    }).then(countyList => {
                    this.props.falcor.get(
                        ['geo', countyList, ['name']],
                        ['roles', 'byId', ids, COLS],
                        ['rolesmeta', 'roles', ['field']]
                    )
                        .then(response => {
                            console.log('res geo', response);
                            Object.keys(response.json.roles.byId)
                                .filter(d => d !== '$__path'
                                    && response.json.roles.byId[d].associated_plan === parseInt(this.props.activePlan))
                                .forEach(function (role, i) {
                                    console.log('each role', response.json.roles.byId);
                                    response.json.roles.byId['contact_title_role'] = falcorGraph.getCache().rolesmeta.roles;

                                    // meta for role title
                                    response.json.roles.byId[role]['contact_title_role'] =
                                        falcorGraph.getCache().rolesmeta.roles.field.value
                                            .filter(f => f.value === response.json.roles.byId[role]['contact_title_role'])[0] ?
                                            falcorGraph.getCache().rolesmeta.roles.field.value
                                                .filter(f => f.value === response.json.roles.byId[role]['contact_title_role'])[0].name : null;

                                    // meta for role county and municipality(jurisdiction)
                                    response.json.roles.byId[role]['contact_county'] =
                                        falcorGraph.getCache().geo[response.json.roles.byId[role]['contact_county']] ?
                                            falcorGraph.getCache().geo[response.json.roles.byId[role]['contact_county']].name : null;

                                    response.json.roles.byId[role]['contact_municipality'] =
                                        falcorGraph.getCache().geo[response.json.roles.byId[role]['contact_municipality']] ?
                                            falcorGraph.getCache().geo[response.json.roles.byId[role]['contact_municipality']].name :
                                            response.json.roles.byId[role]['contact_municipality'];
                                    role_data.push({
                                        'id': role,
                                        'data': Object.values(response.json.roles.byId[role])
                                    })
                                });
                            this.setState({role_data: role_data});
                            return role_data
                        })

                })
            )

    }

    deleteRole(e) {
        e.persist();
        let roleId = e.target.id;
        this.props.sendSystemMessage(
            `Are you sure you with to delete this Role with id "${roleId}"?`,
            {
                onConfirm: () => this.props.falcor.call(['roles', 'remove'], [roleId.toString()], [], []).then(() => this.fetchFalcorDeps().then(response => {
                    console.log('after delete res', response);
                    this.setState({
                        role_data: response
                    })
                })),
                id: `delete-content-${roleId}`,
                type: "danger",
                duration: 0
            }
        )

    }

    renderMainTable() {
        let table_data = [];
        let attributes = COLS_TO_DISPLAY;
        console.log('final data', this.state.role_data);
        this.state.role_data.map(function (each_row) {
            console.log('each row: ', each_row);
            table_data.push([].concat(attributes.map(f => {
                    if (f !== 'contact_county') {
                        if (f === 'contact_municipality')
                            return each_row.data[COLS.indexOf(f) + 1] ?
                                each_row.data[COLS.indexOf(f) + 1] + ',' + each_row.data[COLS.indexOf('contact_county') + 1] :
                                each_row.data[COLS.indexOf('contact_county') + 1];
                        else
                            return each_row.data[COLS.indexOf(f) + 1];

                    }
                })))
        });

        return table_data.length > 0 ? (
            <table className="table table lightBorder">
                <thead>
                <tr>
                    {attributes.map(function (role, index) {
                        return role !== 'contact_county' ? (
                            <th>{role === 'contact_municipality' ? 'Jurisdiction' : role}</th>
                        ) : null
                    })
                    }
                </tr>
                </thead>
                <tbody>
                {table_data.map((data) => {
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
                                      to={`/role/edit/${data[0]}`}>
                                    Edit
                                </Link>
                            </td>
                            <td>
                                <Link className="btn btn-sm btn-outline-primary"
                                      to={`/roles/${data[0]}`}>
                                    View
                                </Link>
                            </td>
                            <td>
                                <button id={data[0]} className="btn btn-sm btn-outline-danger"
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

    renderRoleView() {
        let roleid = this.state.roleid,
            tableData = [];
        this.state.role_data.map(function (f) {
            console.log('f', f, typeof f.id, typeof roleid);
            if (f.id === roleid) tableData.push(...f.data.slice(1, f.data.length - 1))
        });
        console.log('tableData view', tableData);
        return (
            <table className="table table lightBorder">
                <thead>
                <tr>
                    <th> ATTRIBUTE</th>
                    <th> VALUE</th>
                </tr>
                </thead>
                <tbody>
                {tableData.map((data, data_i) => {
                    return (
                        <tr>
                            <td>{COLS[data_i] === 'contact_municipality' ? 'Jurisdiction' : COLS[data_i]}</td>
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
        console.log('authPLans', this.props.activePlan, this.props);
        return (
            <div className='container'>
                <Element>
                    <h4 className="element-header">Roles : {this.props.activePlan}
                        <span style={{float: 'right'}}>
                        <Link
                            className="btn btn-sm btn-primary"
                            to={`/role/new`}>
                                Add New Role
                        </Link>
                    </span>
                    </h4>
                    <div className="element-box">
                        <div className="table-responsive">
                            {this.state.roleid ? this.renderRoleView() : this.renderMainTable()}
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
        //roles: state.graph.roles || {}
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
            {name: 'Roles', path: '/roles/'},
            {param: 'roleid', path: '/roles/'}

        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(RolesIndex))
    },
    {
        path: '/roles/:roleid',
        exact: true,
        name: 'Roles',
        auth: true,
        mainNav: false,
        icon: 'os-icon-pencil-2',
        breadcrumbs: [
            {name: 'Roles', path: '/roles'},
            {param: 'roleid', path: '/roles/'}

        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(RolesIndex))
    }
]
