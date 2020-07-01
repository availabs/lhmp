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
    FeatureName
} from 'pages/Public/theme/components'




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
];

class PlanningTeam extends Component {
    constructor(props) {
        super(props);
        // Don't call this.setState() here!
       
    }

    fetchFalcorDeps() {
        if (!this.props.activeCousubid || this.props.activeCousubid === 'undefined') return Promise.resolve();
        
        return this.props.falcor.get(
            ['roles', 'byId', [112, 111], COLS],
            ['rolesmeta', 'roles', ['field']],
            ['geo', parseInt(this.props.activeCousubid), 'name']
        )
        .then(response => {
            return response
        })

    }

    renderMainTable() {
        let roles = Object.values(this.props.roles)

         
        return roles.map((data,i) => {
            return (
                 <Feature className={`col-sm-4 no-gutters`} highlight={true} style={{margin: 20}}>
                                
                        
                                <FeatureDescription>
                                     <FeatureName>Mitigation Planner</FeatureName>
                                        <div className='table-responsive'>
                <table className="table">
                <tbody style={{fontSize: '1.5em'}}>
                <Fragment key={i}>
                    <tr>
                        <td colSpan='2'>{get(data, `contact_name.value`, 'Demo contact name')}</td>
                    </tr>
                    <tr>
                        <td>
                         {/*get(data, `contact_title_role.value`, 'Demo role title')
                            get role name from role meta
                        */}
                         Planner
                        </td>
                    </tr>
                    <tr>
                        <td>{get(data, `contact_agency.value`, 'Demo agency')}</td>
                        <td>{get(data, `contact_department.value`, 'Demo Department')}</td>
                    </tr>
                    <tr>
                        <td colSpan='2'>{get(this.props.graph, `geo[${parseInt(this.props.activeCousubid)}].name`, '')}</td>
                        
                    </tr>
                    </Fragment>
                     </tbody>
                </table>
                   </div>
                            </FeatureDescription>
                            </Feature>
            )
        })
                
           
        
    }

    render() {
        return (
            <PageContainer style={{height: '80vh'}}>
                <div className='row'>
                    <div className='col-12' style={{textAlign:'center'}}>
                        <ContentHeader>
                            {get(this.props.graph, `geo[${parseInt(this.props.activeCousubid)}].name`, '')}
                            Hazard Mitigation Representative
                        </ContentHeader>
                    </div>
                </div>
                <VerticalAlign>
                    <div className = 'd-flex justify-content-center'>
                           
                                    {this.renderMainTable()}
                                 
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