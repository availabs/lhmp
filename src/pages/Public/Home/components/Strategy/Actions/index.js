import React, {Component, Fragment} from 'react';
// import { Link } from 'react-router-dom'
import {reduxFalcor} from 'utils/redux-falcor'
import {falcorGraph} from "store/falcorGraph";
import {connect} from "react-redux";
import get from "lodash.get"
import styled from "styled-components";
import HMGPTable from "./HMGPTable";
// const Section = styled.div

import {
    VerticalAlign,
    ContentHeader,
    PageContainer,
    HeaderContainer,
    backgroundColor,
    Feature,
    FeatureDescription,
    FeatureHeader,
    FeatureName,
    PageHeader
} from 'pages/Public/theme/components'
import NfipLossesTable from "../../Risk/Assets/components/CriticalInrfastructureTable";




class PlanningTeam extends Component {
    constructor(props) {
        super(props);
        // Don't call this.setState() here!
       
    }

    // fetchFalcorDeps() {
    //     if (!this.props.activeCousubid || this.props.activeCousubid === 'undefined') return Promise.resolve();
        
    //     return this.props.falcor.get(
    //         ['geo', parseInt(this.props.activeCousubid), 'name']
    //     )
        

    // }

    renderMainTable() {
        //let roles = Object.values(this.props.roles)
        //console.log('renderMainTable', this.props.rolesMeta)
        return  (
            <table className="table">
                <tbody style={{fontSize: '1.5em'}}>
                </tbody>
            </table>
        )
    }

    render() {
        return (
            <PageContainer style={{height: '80vh'}}>
                <HeaderContainer>
                    <PageHeader>Actions</PageHeader>
                    <div className='row'>
                        <div className='col-12'>
                            <VerticalAlign>
                                <div>
                                    <HMGPTable
                                        geoid={
                                            !this.props.activeCousubid || this.props.activeCousubid === "undefined" ? this.props.activeGeoid
                                                : this.props.activeCousubid
                                        }
                                        hazard={'all'}
                                        pageSize={100}
                                        defaultSortCol={this.props.defaultSortCol}
                                        defaultSortOrder={this.props.defaultSortOrder}
                                        colOrder={this.props.colOrder}
                                        minHeight={this.props.minHeight}
                                    />
                                </div>
                            </VerticalAlign>
                        </div>
                    </div>
                </HeaderContainer>
            </PageContainer>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        activePlan: get(state, `user.activePlan`, null),
        activeCousubid: get(state, `user.activeCousubid`, null),
        activeGeoid: get(state, `user.activeGeoid`, null),
        roles: get(state, `graph.roles.byId`, {}),
        rolesMeta: get(state, `graph.rolesMeta`, {}),
        graph: state.graph,
        router: state.router
    };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(PlanningTeam))