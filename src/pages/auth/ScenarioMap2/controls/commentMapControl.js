import React from 'react';
import AvlFormsViewData from 'components/AvlForms/displayComponents/viewData';
import config from "../components/config.js"
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import {sendSystemMessage} from 'store/modules/messages';
import { fnum } from "utils/sheldusUtils"
import AvlFormsListTable from "../components/ListTable";

class CommentMapControl extends React.Component{
    constructor(props){
        super(props);
    }


    render(){
        return (
            <div>
                <button
                    id="new_comment_map_button"
                    className="mr-2 mb-2 btn btn-primary btn-sm"
                    type="button"
                    onClick = {(e) =>{
                        this.props.layer.layer.commentMapLayer.toggleCreationMode("markers")
                    }}
                >Add New Comment</button>
                <AvlFormsListTable
                    json = {config}
                    deleteButton = {false}
                    viewButton={false}
                    layer ={this.props.layer.layer.commentMapLayer}
                    bbox = {this.props.bbox}
                />
            </div>
        )
    }
}

const mapStateToProps = state => (
    {
        activePlan : state.user.activePlan,
        activeGeoid:state.user.activeGeoid,
        isAuthenticated: !!state.user.authed,
        attempts: state.user.attempts,
        assetsData : get(state.graph,['building','byGeoid'],{})
    });

const mapDispatchToProps = {
    sendSystemMessage
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(CommentMapControl))