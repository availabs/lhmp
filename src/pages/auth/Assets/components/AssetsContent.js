import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import pick from "lodash.pick"
import Element from 'components/light-admin/containers/Element'
import {falcorGraph} from "../../../../store/falcorGraph";
import TableBox from 'components/light-admin/tables/TableBox'
import {Link} from "react-router-dom";

class AssetsContent extends React.Component{
    constructor(props){
        super(props)
    }
    render(){

        return(
            <div className='container'>
                <Element>
                    <form>
                        <h4>Asset ID : {this.props.match.params.assetId}</h4>
                    </form>
                </Element>
            </div>
        )
    }
}

const mapStateToProps = (state,ownProps) => {
    return {
        geoid : ownProps.geoid,
        cousubs: get(state.graph, 'geo',{}),
        buildingData : get(state.graph,'building.byId',{})
    }
};

const mapDispatchToProps =  {
//sendSystemMessage,
};
export default [
    {
        path: '/assets/:assetId',
        exact: true,
        name: 'Assets',
        auth: true,
        mainNav: false,
        breadcrumbs: [
            { name: 'Assets', path: '/assets/' },
            { param: 'assetId', path: '' }
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps,mapDispatchToProps)(AssetsContent)
    }
]