import React from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import Element from 'components/light-admin/containers/Element'
import TableView from "../../../components/light-admin/tables/TableView";
import {sendSystemMessage} from "../../../store/modules/messages";
import { AUTH_HOST, AUTH_PROJECT_NAME } from 'config';
class Admin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userList: []
        }
    }
    fetchFalcorDeps(){
        return fetch(`${AUTH_HOST}/users/bygroup`, {
            method: 'POST',
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token:this.props.user.token, groups:['Sullivan County HMP Admin', 'Sullivan County HMP General', 'Sullivan County HMP Public']})
        })
            .then(res => res.json())
            .then(res => {
                res = Object.keys(res.users).map(f => res.users[f].user_email)
                this.setState({'userList': res})
            });
    }
    render() {
        console.log('useerList', this.state.userList)
        return (
            <div className='container'>
                <Element>
                    <h4 className="element-header">Admin Panel</h4>
                    <div className="element-box">
                        <table className="table table lightBorder">
                            <thead>
                            <tr>
                                <th>
                                    Email
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.userList.length > 0 ? (
                                this.state.userList.map(f =>
                                    <td>
                                        {f}
                                    </td>
                                )
                            ) : null
                            }

                            </tbody>
                        </table>
                    </div>
                </Element>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return ({
        isAuthenticated: !!state.user.authed,
        attempts: state.user.attempts, // so componentWillReceiveProps will get called.
        geoGraph: state.graph,
    })
};

const mapDispatchToProps = {};

export default [
    {
        path: '/user/admin',
        exact: true,
        name: 'Admin',
        auth: true,
        authLevel: 5,
        mainNav: false,
        icon: 'os-icon-pencil-2',
        breadcrumbs: [
            { name: 'Admin', path: '/user/admin/' },
            //{ param: 'roleid', path: '/roles/' }

        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Admin))
    }
]