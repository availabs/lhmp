import React from 'react'
import {connect} from 'react-redux'
import {reduxFalcor} from 'utils/redux-falcor'
import get from 'lodash.get'

import Element from 'components/light-admin/containers/Element'
import {sendSystemMessage} from 'store/modules/messages';
import ReviewTools from "../Plan/ReviewTools";
import ElementBox from "../../../components/light-admin/containers/ElementBox";


class HomeView extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            heroStatBoxCategories: ['actions', 'capabilities', 'roles', 'participation', 'zones']
        }
    }

    fetchFalcorDeps() {
        return this.props.falcor.get(['forms', this.state.heroStatBoxCategories, 'byPlanId', this.props.activePlan, 'length'])
    }

    render() {
        let ReviewToolsTable = ReviewTools[0].component
        return (
            <div className='container'>
                <Element>
                    <h4 className="element-header">
                        <label>
                            Home
                        </label>
                    </h4>

                    <div className='row'>
                        {
                            get(this.state, 'heroStatBoxCategories', [])
                                .map(category =>
                                    <div className='col-sm-4'>
                                        <a className='element-box el-tablo' href={`/${category}`}>
                                            <div className='label'> {category} #</div>
                                            <div className='value'>
                                                {
                                                    get(this.props.formsData,
                                                        [category, 'byPlanId', this.props.activePlan, 'length'],
                                                        0) || 0
                                                }
                                            </div>
                                        </a>
                                    </div>
                                )
                        }
                    </div>
                    <ElementBox>
                        <h6>Jurisdictional Review Table. <small className='text-muted'>Click on the box to review the
                            requirement.</small></h6>
                        <ReviewToolsTable/>
                    </ElementBox>
                </Element>
            </div>
        )
    }
}


const mapStateToProps = state => {
    return ({
        activePlan: state.user.activePlan, // so componentWillReceiveProps will get called.
        activeGeoid: state.user.activeGeoid,
        formsData: state.graph.forms
    });
}

const mapDispatchToProps = ({sendSystemMessage});

export default {
    icon: 'os-icon-home',
    path: '/admin',
    exact: true,
    mainNav: true,
    name: 'Home',
    auth: true,
    breadcrumbs: [
        {name: 'Home', path: '/admin'}
    ],
    menuSettings: {
        image: 'none',
        scheme: 'color-scheme-light',
        position: 'menu-position-left',
        layout: 'menu-layout-compact',
        style: 'color-style-default'
    },
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(HomeView))
};

