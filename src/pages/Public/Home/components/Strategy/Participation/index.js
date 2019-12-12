import React, {Component, Fragment} from 'react';
// import { Link } from 'react-router-dom'
import {reduxFalcor} from 'utils/redux-falcor'
import {falcorGraph} from "store/falcorGraph";
import {connect} from "react-redux";
import get from "lodash.get"
import styled from "styled-components";

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
                    <PageHeader>Participation</PageHeader>
                </HeaderContainer>
                <VerticalAlign>
                    <div className = 'd-flex justify-content-center'>
                            <Feature className={`col-sm-6 no-gutters`} highlight={true}>
                                
                        
                                <FeatureDescription>
                                     <FeatureName>Hazard Mitigation Plan Participation</FeatureName>
                                        <div className='table-responsive'>
                                        {this.renderMainTable()}
                                    </div>
                            </FeatureDescription>
                            </Feature>
                    </div>
                </VerticalAlign>
                
            </PageContainer>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        activePlan: get(state, `user.activePlan`, null),
        activeCousubid: get(state, `user.activeCousubid`, null),
        roles: get(state, `graph.roles.byId`, {}),
        rolesMeta: get(state, `graph.rolesMeta`, {}),
        graph: state.graph,
        router: state.router
    };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(PlanningTeam))