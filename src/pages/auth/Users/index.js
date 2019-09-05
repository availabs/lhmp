import React from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import Element from 'components/light-admin/containers/Element'
import TableView from "../../../components/light-admin/tables/TableView";
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
class User extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            roles_data: [],
            rolesMeta: []
        }
    }
/*    componentDidMount (){
        if(this.props.location.data) console.log('handle submit called', this.props.location.data)
    }*/
    fetchFalcorDeps() {
        let roles_data =[];
        let email = this.props.user.email;
        return this.props.falcor.get(['roles','length'])
            .then(response => response.json.roles.length)
            .then(length => this.props.falcor.get(
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
                this.props.falcor.get(['roles','byId', ids, COLS])
                    .then(response => {
                        Object.keys(response.json.roles.byId)
                            .filter(d => d!== '$__path')
                            .forEach(function(action,i){
                                if (response.json.roles.byId[action].contact_email === email){
                                    roles_data.push({
                                        'id' : action,
                                        'data': Object.values(response.json.roles.byId[action])
                                    })
                                }
                        })
                        this.setState({'roles_data':roles_data})
                        return roles_data
                    })
            )
            .then(() => {
                // fetch rolesMeta
                this.props.falcor.get(['rolesmeta','roles', ['field']])
                    .then(rolesMeta => {
                        this.setState({'rolesMeta': rolesMeta.json.rolesmeta.roles.field});
                        return rolesMeta
                    })
            })
    }

    render() {
        let userData = {'Email': this.props.user.email, 'Groups': this.props.user.groups.join()}
        let roleData = this.state.roles_data.map(d => d.data.slice(1,d.data.length))
        roleData = roleData.map(d => {
            let tmp = {}
            d.map((d1,d1_i) => {
                //tmp[COLS[d1_i+1]]=d1 //without id
                // COLS[d1_i] === 'id' ? tmp[COLS[d1_i]]=d1[2] :
                    COLS[d1_i] === 'contact_title_role'
                    ? tmp[COLS[d1_i]] = this.state.rolesMeta.filter(f => f.value === d1).length > 0 ?
                        this.state.rolesMeta.filter(f => f.value === d1)[0].name : d1
                    : tmp[COLS[d1_i]]=d1;
                return tmp
            })
            return tmp
        })
        console.log('roleData', this.state.roles_data)
        return (
            <div className='container'>
                <Element>
                    <div className='user-profile'>
                        <div className='up-head-w' style={{
                            'min-height': '400px',
                            'background-color': '#047bf8'
                        }}>
                            <div className='up-main-info'>
                                <div className="user-avatar-w">
                                    <div className="user-avatar" style={{
                                        'background-color': '#3df829'
                                    }}>
                                        {/* <img alt="" src="img/avatar1.jpg" />*/}
                                    </div>
                                </div>
                                <h1 className="up-header">{roleData.length > 0 ? roleData[0].contact_name : 'Loading'}</h1>
                                <h5 className="up-sub-header">{roleData.length > 0 ? roleData[0].contact_title_role : 'Loading'}</h5>
                            </div>
                            <svg className="decor" width="842px" height="219px" viewBox="0 0 842 219"
                                 preserveAspectRatio="xMaxYMax meet" version="1.1" xmlns="http://www.w3.org/2000/svg"
                            >
                                <g transform="translate(-381.000000, -362.000000)" fill="#FFFFFF">
                                    <path className="decor-path"
                                          d="M1223,362 L1223,581 L381,581 C868.912802,575.666667 1149.57947,502.666667 1223,362 Z"></path>
                                </g>
                            </svg>
                        </div>
                        <div className='up-contents'>
                            <h5 className="element-header">User Statistics</h5>
                            <TableView data={userData}/>

                            <h5 className="element-header">Role Statistics</h5>
                            {roleData.map(rd => <TableView data={rd} edit={true}/>)}
                        </div>
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
        path: '/user',
        exact: true,
        name: 'User',
        auth: true,
        mainNav: false,
        icon: 'os-icon-pencil-2',
        /*        breadcrumbs: [
                    { name: 'Roles', path: '/roles/' },
                    { param: 'roleid', path: '/roles/' }

                ],*/
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(User))
    }
]