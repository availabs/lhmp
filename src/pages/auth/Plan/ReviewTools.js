import React from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import _ from 'lodash'
import get from "lodash.get";
import config from "./config/review-config";
import styled from "styled-components";
import functions from "./functions";
import Element from "../../../components/light-admin/containers/Element";
import ElementBox from "../../../components/light-admin/containers/ElementBox";
import megaConfig from "./config/megaConfig";

const DIV = styled.div`
${(props) => props.theme.scrollBar};
overflow: auto;
width: 100%;
height: 65vh;
th {
  background: #fff;
  position: sticky;
  top: 0;
  box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4);
}
`

class PlanReview extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            geoData: []
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (!_.isEqual(this.state.contentData, prevState.contentData)) {
            this.forceUpdate()
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
            .then(() => {
                let allGeos =
                    [this.props.activeGeoid,
                        ...get(this.props.geoGraph, `${this.props.activeGeoid}.municipalities.value`, [])];
                let allReq = [];
                config.elements.forEach(element =>
                    allReq.push(...element.requirements_from_software.split(',')
                        .filter(r => r.length)
                        .map(r => r.trim())))
                let contentIds = []
                allGeos.map(geo => allReq.map(req => contentIds.push(req + '-' + this.props.activePlan + '-' + geo)));
                return this.props.falcor.get(
                    ['content', 'byId', contentIds, ['content_id', 'attributes']]
                ).then(r => this.setState({
                    contentData:
                        Object.keys(r.json.content.byId)
                            .filter(k => r.json.content.byId[k] && k !== '$__path')
                            .reduce((a, c) => {
                                a[c] = r.json.content.byId[c];
                                return a;
                            }, {})
                }))
            })
    }

    processTable(allowedGeos) {
        return (
            <DIV>
                <table className='table table-bordered table-sm table-striped'>
                    <thead>
                    <tr>
                        <th style={{position: 'sticky'}}>Jurisdiction</th>
                        {
                            config.elements.map(element => <th>{element.element}</th>)
                        }
                    </tr>
                    </thead>
                    <tbody>
                    {
                        allowedGeos.map(geo =>
                            <tr>
                                <td style={{width: 'max-content'}}>{functions.formatName(get(this.props.geoGraph, `${geo}.name`, 'N/A'), geo)}</td>
                                {
                                    config.elements.map(element => {
                                            let allStatus =
                                                element.requirements_from_software.split(',')
                                                    .map(r => r.trim())
                                                    .filter(r => r.length)
                                                    .filter(r => get(megaConfig.filter(mc => {
                                                            return mc.requirement === r
                                                        }),
                                                        `[0].type`, null) === 'content')
                                                    .map(r => get(this.state.contentData, `${r}-${this.props.activePlan}-${geo}.attributes.status`, '')
                                                    )
                                            return <td
                                                style={{
                                                    backgroundColor:
                                                        allStatus.includes('Started') ? '#daebcf' :
                                                            allStatus.length && allStatus.filter(s => s !== "Ready for review").length === 0 ? '#f3f3d1' : 'grey'
                                                }}
                                                onClick={() => window.location.href = `/review_requirement/${element.element}/${geo}`}></td>
                                        }
                                    )
                                }
                            </tr>
                        )
                    }
                    </tbody>
                </table>
            </DIV>
        )
    }

    render() {
        let allowedGeos = [this.props.activeGeoid, ...get(this.props.geoGraph, `${this.props.activeGeoid}.municipalities.value`, [])];

        return (
            <div className='container'>
                <Element>
                    <h4 className='element-header'>Review Tools</h4>
                    <ElementBox>
                        <h6>Jurisdictional Review Table. <small className='text-muted'>Click on the box to review the
                            requirement.</small></h6>
                        {this.processTable(allowedGeos)}
                    </ElementBox>
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
        activePlan: state.user.activePlan,
    };
};

const mapDispatchToProps = {};
export default [{
    icon: 'os-icon-pencil-2',
    path: '/plan_review/',
    exact: true,
    name: 'Plan Review',
    auth: true,
    authLevel: 5,
    mainNav: false,
    breadcrumbs: [
        {name: 'Review Tools', path: '/plan_review'}
    ],
    menuSettings: {
        image: 'none',
        scheme: 'color-scheme-light',
        position: 'menu-position-left',
        layout: 'menu-layout-compact',
        style: 'color-style-default'
    },
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(PlanReview))
}];
