import get from "lodash.get";
import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import Submenus from './forms-submenus'
import Element from 'components/light-admin/containers/Element'

class Forms extends React.Component {

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
                    <div>
                        {Submenus[0].map(submenu => {
                            console.log(submenu)
                            return (
                                <a href={submenu.path}>
                                    <div className="element-box">
                                        {submenu.name}
                                    </div>
                                </a>
                            )
                        })}
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
        icon: 'os-icon-pencil-2',
        path: '/forms/',
        exact: true,
        name: 'Forms',
        auth: true,
        authLevel: 1,
        mainNav: true,
        subMenus: Submenus,
        breadcrumbs: [
            {name: 'Forms', path: '/forms/' }
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default',
        },
        component: connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(Forms))
    }
]