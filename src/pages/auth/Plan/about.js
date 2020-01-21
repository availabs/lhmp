import React from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import {falcorGraph} from "store/falcorGraph";
import config from './config/about-config'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import functions from './functions'
import {setActiveCousubid} from 'store/modules/user'
import get from "lodash.get";
class AdminAbout extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            geoData: []
        }
    }

    fetchFalcorDeps() {
        if (!this.props.activeGeoid) return Promise.resolve();
        return this.props.falcor.get(
            //['geo', this.props.activeGeoid, 'cousubs'],
            ["geo", this.props.activeGeoid, 'counties', 'municipalities']
        )
            .then(response => {
                return this.props.falcor.get(
                    ['geo', [this.props.activeGeoid, ...falcorGraph.getCache().geo[this.props.activeGeoid].counties.municipalities.value], ['name']],
                )
            })
    }

    render() {
        let geoInfo = get(falcorGraph.getCache(), `geo`, null);
        let allowedGeos = [this.props.activeGeoid, ...get(geoInfo,`${this.props.activeGeoid}.counties.municipalities.value`, [])];

        return functions.render(config,
            this.props.user,
            geoInfo,
            this.props.setActiveCousubid,
            this.props.activeCousubid,
            allowedGeos)
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        geoGraph: state.graph.geo,
        router: state.router,
        activeGeoid: state.user.activeGeoid,
        activeCousubid: state.user.activeCousubid,
    };
};

const mapDispatchToProps = {setActiveCousubid};
export default [{
    icon: 'os-icon-pencil-2',
    path: '/plan/about',
    exact: true,
    name: 'AdminAbout',
    auth: true,
    authLevel: 1,
    mainNav: false,
    menuSettings: {
        image: 'none',
        scheme: 'color-scheme-light',
        position: 'menu-position-left',
        layout: 'menu-layout-mini',
        style: 'color-style-default'
    },
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(AdminAbout))
}];

