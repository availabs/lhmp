import React from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {setActiveCousubid} from 'store/modules/user'
import get from "lodash.get";
import config from "./config/review-config";
import Element from "../../../components/light-admin/containers/Element";
import ElementBox from "../../../components/light-admin/containers/ElementBox";
import styled from "styled-components";
import functions from "./functions";

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
                                    config.elements.map(element =>
                                        <td onClick={() => window.location.href = `/review_requirement/${element.element}/${geo}`}>
                                        </td>)
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
    };
};

const mapDispatchToProps = {setActiveCousubid};
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

