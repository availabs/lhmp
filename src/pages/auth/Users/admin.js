import React from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import Element from 'components/light-admin/containers/Element'
import TableView from "../../../components/light-admin/tables/TableView";

class Admin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    render() {
        return (
            <div className='container'>
                <Element>
                    <h4 className="element-header">Admin Panel</h4>
                    <div className="element-box">
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