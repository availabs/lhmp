import get from "lodash.get";
import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import Element from 'components/light-admin/containers/Element'




class Plan extends React.Component {

    constructor(props){
        super(props)
        this.state={
        }

    }

    render() {
        return (
            <div className='container'>
                <Element>
                    <h6 className="element-header">Plan page</h6>
                    <div className="element-box">
                    </div>
                </Element>
            </div>
        )
    }
}
const mapStateToProps = state => ({

});

const mapDispatchToProps = {

};

export default [
    {
        path: '/plan/',
        exact: true,
        name: 'Plan',
        auth: true,
        authLevel: 1,
        mainNav: true,
        breadcrumbs: [
            {name: 'Plan', path: '/plan/' }
        ],
        menuSettings: {
            image: 'os-icon-pencil-2',
            scheme: 'color-scheme-dark',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps,mapDispatchToProps)(Plan)
    }
]