import React from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {setActiveCousubid} from 'store/modules/user'
import get from "lodash.get";
import config from "./config/review-config";
import megaConfig from "./config/megaConfig"
import Element from "../../../components/light-admin/containers/Element";
import ElementBox from "../../../components/light-admin/containers/ElementBox";
import styled from "styled-components";
import {RenderConfig} from "../../Public/theme/ElementFactory";
import {Link} from "react-router-dom";

const DIV = styled.div`
${(props) => props.theme.scrollBar};
overflow: auto;
width: 100%;
height: 50%;
`

class ReviewRequirement extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            geoData: []
        }
    }

    fetchFalcorDeps() {
        if (!this.props.activeGeoid) return Promise.resolve();
        return this.props.falcor.get(["geo", this.props.activeGeoid, 'municipalities'])
            .then(response => {
                return this.props.falcor.get(
                    ['geo',
                        [this.props.activeGeoid, ...get(this.props.geoGraph, `${this.props.activeGeoid}.municipalities.value`, [])],
                        ['name']],
                )
            })
    }

    render() {
        let allowedGeos = [this.props.activeGeoid, ...get(this.props.geoGraph, `${this.props.activeGeoid}.municipalities.value`, [])];
        let element = config.elements.filter(element => element.element === this.props.match.params.req).pop(),
            requirements = element ? element.requirements_from_software : null;
        if (!requirements) return null;
        return (
            <div className='container'>
                <Element>
                    <h4 className='element-header'>Review Requirement</h4>
                    {requirements.split(',').map(r => {
                        r = r.trim();
                        let fullElement = megaConfig.filter(mc => {
                            return mc.requirement === r
                        })[0]
                        return (
                            <ElementBox>
                                <RenderConfig
                                    config={{
                                        [r]:
                                            [{
                                                title: r,
                                                ...fullElement,
                                                requirement: r,
                                                geoId: this.props.match.params.geo,
                                                intent: element.intent,
                                            }]
                                    }
                                    }
                                    user={{...this.props.user, activeCousubid: this.props.match.params.geo}}
                                    showTitle={true}
                                    showEdit={true}
                                    showStatusTracker={true}
                                    showHeader={false}
                                    pureElement={true}
                                />
                            </ElementBox>
                        )
                    })}
                </Element>
            </div>
        )
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
    path: '/review_requirement/:req/:geo',
    exact: true,
    name: 'Plan Review',
    auth: true,
    authLevel: 5,
    mainNav: false,
    breadcrumbs: [
        {name: 'Review Requirement', path: '/plan_review/'},
        {param: 'req', path: '/review_requirement/'},
        {param: 'geo', path: '/review_requirement/req/'},
    ],
    menuSettings: {
        image: 'none',
        scheme: 'color-scheme-light',
        position: 'menu-position-left',
        layout: 'menu-layout-mini',
        style: 'color-style-default'
    },
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(ReviewRequirement))
}];

