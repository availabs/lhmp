import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import Element from 'components/light-admin/containers/Element'
import {falcorGraph} from "store/falcorGraph";
import {EditorState} from "draft-js";
import {Link} from "react-router-dom";

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

class rolesTableViewer extends Component {
    constructor(props) {
        super(props);
        this.state={
            role_data: []
        }
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

    renderMainTable() {
        let table_data = [];
        let attributes = COLS_TO_DISPLAY
        this.state.role_data.map(function (each_row) {
            console.log('each row: ', each_row);
            table_data.push([].concat(attributes.map(f => {
                if (f !== 'contact_county') {
                    if (f === 'contact_municipality')
                        return each_row.data[COLS.indexOf(f) + 1] + ',' +each_row.data[COLS.indexOf('contact_county') + 1];
                    else
                        return each_row.data[COLS.indexOf(f) + 1];

                }
            })))
        });

        return table_data.length > 0 ?(
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
                {table_data.map((data) =>{
                    return (
                        <tr>
                            {data.map((d) => {
                                return (
                                    <td>{d}</td>
                                )
                            })
                            }
                        </tr>
                    )
                })
                }
                </tbody>
            </table>
        ) : <div> No Roles found.</div>
    }

    render() {
        return (
            <div className='container'>
                <Element>
                    <h6 className="element-header">Roles : {this.props.activePlan}</h6>
                    <div className="element-box" style={{'overflow': 'scroll', 'maxHeight': '80vh'}}>
                        <div className="table-responsive" >
                            {this.renderMainTable()}
                        </div>
                    </div>
                </Element>
            </div>
        )

    }

}

const mapStateToProps = (state, ownProps) => {
    return ({
        activePlan: state.user.activePlan,
    })
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(rolesTableViewer))
