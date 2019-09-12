import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import Element from 'components/light-admin/containers/Element'
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
        let attributes = COLS_TO_DISPLAY
        this.state.role_data.map(function (each_row) {
            table_data.push([].concat(attributes.map(f => {
                return each_row.data[ COLS.indexOf(f) + 1 ]} )))
        })

        return table_data.length > 0 ?(
            <table className="table table lightBorder">
                <thead>
                <tr>
                    {attributes.map(function(role,index){
                        return (
                            <th>{role}</th>
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
                    <div className="element-box" style={{'overflow': 'scroll', 'height': '80vh'}}>
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
