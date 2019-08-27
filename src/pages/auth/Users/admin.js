import React from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import Element from 'components/light-admin/containers/Element'
import {AUTH_HOST} from 'config';
const ATTRIBUTES = [
    "fips",
    "plan_consultant",
    "plan_expiration",
    "plan_grant",
    "plan_url",
    "plan_status",
    "groups",
    "id",
    "county"
]
class Admin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            publicUsers: [],
            contributorUsers: [],
            adminUsers: [],
            superUsers: [],
            publicGroup: null,
            contributorGroup: null,
            adminGroup: null,
            updated: false
        };

        this.changeGroup = this.changeGroup.bind(this)
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.updated){
            this.setState({'updated': false})
            this.fetchFalcorDeps()
        }
    }

    fetchFalcorDeps() {
        if (!this.props.activePlan) return Promise.resolve();
        console.log('active', this.props.activePlan)
        return this.props.falcor.get(['plans','county','byId',this.props.activePlan,ATTRIBUTES])
            .then(res => {
                console.log('plans... ', res.json.plans.county.byId[this.props.activePlan].groups)
                return res.json.plans.county.byId[this.props.activePlan].groups
            }).then(resGroups => {
            fetch(`${AUTH_HOST}/users/bygroup`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: this.props.user.token,
                    groups: resGroups
                })
            })
                .then(res => res.json())
                .then(res => {
                    res = (res.users).map(f => f);
                    this.setState({'publicUsers': res.filter(users => users.auth_level === 0)});
                    this.setState({'contributorUsers': res.filter(users => users.auth_level === 1)});
                    this.setState({'adminUsers': res.filter(users => users.auth_level === 5)});
                    this.setState({'publicGroup': resGroups.filter(f => f.toLowerCase().includes('public'))[0]});
                    this.setState({'contributorGroup': resGroups.filter(f => f.toLowerCase().includes('general'))[0]});
                    this.setState({'adminGroup': resGroups.filter(f => f.toLowerCase().includes('admin'))[0]});
                    if (this.props.user.authLevel === 10) this.setState({'superUsers': res.filter(users => users.auth_level === 10)});
                })
        })


    }

    changeGroup(email, currentGroup, newGroup) {
        console.log('change group', email, currentGroup, newGroup);
        fetch(`${AUTH_HOST}/user/group/remove`, {
            method: 'POST',
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: this.props.user.token,
                user_email: email,
                group_name: currentGroup
            })
        }).then(d => {
            console.log('check status', d)
            fetch(`${AUTH_HOST}/user/group/assign`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: this.props.user.token,
                    user_email: email,
                    group_name: newGroup
                })
            }).then(d =>{
                console.log('check status 2',d)
                this.setState({'updated': true})
            })
        })
    }

    render() {
        return (
            <div className='container'>
                <Element>
                    <h4 className="element-header">Admin Panel</h4>
                    {['publicUsers', 'contributorUsers', 'adminUsers', 'superUsers']
                        .filter(f => this.state[f].length > 0)
                        .map(userType =>
                            <div>
                                <div className="element-box">
                                    <h6>
                                        {userType.split('Users')[0].charAt(0).toUpperCase() + userType.split('Users')[0].slice(1)} Users
                                    </h6>
                                    {
                                        <table className="table table lightBorder">
                                            <thead>
                                            <tr>
                                                <th>
                                                    Email
                                                </th>

                                                <th>
                                                    Group
                                                </th>

                                                <th colSpan={2} className="text-center">
                                                    Actions
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                this.state[userType].map(f =>
                                                    <tr>
                                                        <td>
                                                            {f.user_email}
                                                        </td>
                                                        <td>
                                                            {f.group_name}
                                                        </td>
                                                        <td className="text-center">
                                                            {userType === 'publicUsers'
                                                                ? <a
                                                                    className="btn btn-sm btn-outline-primary"
                                                                    // href={'#'}
                                                                >Delete?</a>
                                                                : userType === 'contributorUsers'
                                                                    ? <a
                                                                        className="btn btn-sm btn-outline-primary"
                                                                        onClick={this.changeGroup.bind(this,f.user_email, f.group_name, this.state.publicGroup)}
                                                                        // href={'#'}
                                                                    >Make Public</a>
                                                                    : userType === 'adminUsers'
                                                                        ? <a
                                                                            className =
                                                                                {f.user_email === this.props.user.email
                                                                                    ? 'btn btn-sm btn-outline-primary disabled'
                                                                                    : 'btn btn-sm btn-outline-primary' }
                                                                            // href={'#'}
                                                                            onClick={this.changeGroup.bind(this,f.user_email, f.group_name, this.state.contributorGroup)}
                                                                        >Make Contributor</a>
                                                                        : userType === 'superUsers'
                                                                            ? <a
                                                                                className =
                                                                                    {f.user_email === this.props.user.email
                                                                                        ? 'btn btn-sm btn-outline-primary disabled'
                                                                                        : 'btn btn-sm btn-outline-primary' }
                                                                                // href={'#'}
                                                                                onClick={this.changeGroup.bind(this,f.user_email, f.group_name, this.state.adminGroup)}
                                                                            >Make Admin</a>
                                                                        : ''}
                                                        </td>
                                                            {userType === 'publicUsers'
                                                                ?
                                                                <td className="text-center">
                                                                    <a
                                                                    className =  'btn btn-sm btn-outline-primary'
                                                                    // href={'#'}
                                                                    onClick={this.changeGroup.bind(this,f.user_email, f.group_name, this.state.contributorGroup)}
                                                                >Make Contributor</a>
                                                                </td>
                                                                : userType === 'contributorUsers'
                                                                    ? <td className="text-center">
                                                                        <a
                                                                        className =  'btn btn-sm btn-outline-primary'
                                                                        // href={'#'}
                                                                        onClick={this.changeGroup.bind(this,f.user_email, f.group_name, this.state.adminGroup)}
                                                                    >Make Admin</a>
                                                                    </td>
                                                                    /*: userType === 'superUsers' ?
                                                                        <td colSpan={2} className="text-center">
                                                                            <a
                                                                            className =  'btn btn-sm btn-outline-primary'
                                                                            // href={'#'}
                                                                            onClick={this.changeGroup.bind(this,f.user_email, f.group_name, this.state.adminGroup)}
                                                                            >Make Admin</a>
                                                                        </td>*/
                                                                        : ''}
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    }
                                </div>
                            </div>
                        )}
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
        activePlan: state.user.activePlan
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
            {name: 'Admin', path: '/user/admin/'},
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