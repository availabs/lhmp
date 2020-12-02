import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import { Link } from "react-router-dom"

import Table from 'components/light-admin/tables/tableSelector'
import {match} from "fuzzy";
import functions from "../../pages/auth/Plan/functions";
import {HeaderContainer, PageContainer, VerticalAlign} from "../../pages/Public/theme/components";
import ElementFactory from "../../pages/Public/theme/ElementFactory";

var _ = require('lodash')



class FormTableViewer extends React.Component{

    render(){
        return (
            <PageContainer>
                <HeaderContainer>
                    <div className='row'>
                        <div className='col-12'>
                            <VerticalAlign>
                                <div>
                                    <ElementFactory
                                        element={
                                            this.props.config
                                        }
                                        geoId={this.props.activeCousubid}
                                        autoLoad={true}
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

const mapStateToProps = (state,ownProps) => {
    return {
        activePlan: state.user.activePlan,
        activeGeoid: ownProps.geoId ? ownProps.geoId : state.user.activeGeoid,
        activeCousubid: ownProps.geoId ? ownProps.geoId : state.user.activeCousubid,
        tableList : get(state.graph,`forms.${ownProps.config.type}.byPlanId.${state.user.activePlan}.byIndex`,{}),
        formData : get(state.graph,`forms.byId`,{}),
        geoData: get(state.graph, ['geo'], {}),
        graph : state.graph

    }
};

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(FormTableViewer))




