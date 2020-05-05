import React from "react"
import {connect} from "react-redux"
import {reduxFalcor} from "utils/redux-falcor"
import _ from 'lodash'
import get from "lodash.get"
import styled from "styled-components"
import AvlFormsListTable from './ListTable'
import config from './config'
import {Button} from "../../../../components/common/styled-components";
import ViewConfig from "../../EvacuationRoutes/components/view_config";

class CommentMapInfoBox extends React.Component {
    state = {

    };

    /*componentDidMount() {

    }

    componentDidUpdate(oldProps, oldState) {

    }*/

    render() {
        return (
            <div>
                <AvlFormsListTable
                    json = {config}
                    deleteButton = {false}
                    viewButton={false}
                    layer ={this.props.layer}
                />
            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    user: state.user,
    graph: state.graph
});
export default connect(mapStateToProps)(reduxFalcor(CommentMapInfoBox))