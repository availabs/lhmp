import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import {falcorGraph} from "store/falcorGraph";
import config from './config/guidance-config'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import functions from "./functions";
import {setActiveCousubid} from 'store/modules/user'
import get from "lodash.get";
import {RenderConfig} from 'pages/Public/theme/ElementFactory'
import Element from "../../../components/light-admin/containers/Element";
import ElementBox from "../../../components/light-admin/containers/ElementBox";

class AdminLanding extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            geoData: []
        }
    }


    render() {
        return (
            <div className='container'>
                <Element>
                    <h4 className="element-header">Guidance for {this.props.match.params.reqId.split('-')[1]}</h4>
                    <ElementBox>
                        <RenderConfig
                            config={{[this.props.match.params.reqId]:config[this.props.match.params.reqId.split('-')[1]]}}
                            user={this.props.user}
                            showTitle={false}
                            showHeader={false}
                            pureElement={true}
                        />
                    </ElementBox>
                </Element>
            </div>
        )
    }
}

const mapStateToProps = (state,ownProps) => {
    return {
        geoGraph: state.graph.geo,
        router: state.router,
        activeGeoid: state.user.activeGeoid,
        activeCousubid: state.user.activeCousubid,
        user: get(state, 'user', null)
    };
};

const mapDispatchToProps = {setActiveCousubid};
export default [
    {
        icon: 'os-icon-pencil-2',
        path: '/guidance/:reqId/view',
        exact: true,
        name: 'Landing Page CMS',
        auth: true,
        authLevel: 1,
        breadcrumbs: [
            {name: 'Guidance', path: '/guidance/:reqId/view'}
        ],
        mainNav: false,
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(AdminLanding))
    }];

