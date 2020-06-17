import React from "react"
import {connect} from "react-redux"
import {reduxFalcor} from "utils/redux-falcor"
import _ from 'lodash'
import get from "lodash.get"
import styled from "styled-components"
import {sendSystemMessage} from "../../../../store/modules/messages";

const DEFAULT_ROUTE_DATA = {
    name: "",
    type: "personal",
    id: null
};

class EvacuationControl extends React.Component {
    constructor(props) {
        super(props);
        this.state =  {
            showSaveModal: false,
            route: {...DEFAULT_ROUTE_DATA}
        };
    }


    render() {


        return (
            <div>
                <button
                    id="new_route_button"
                    className="mr-2 mb-2 btn btn-primary btn-sm"
                    type="button"
                    onClick = {(e) =>{
                        this.props.layer.layer.evacuationRoutesLayer.toggleCreationMode("markers")
                    }}
                >Add New Route</button>
                <div>
                    {this.props.layer.layer.evacuationRoutesLayer.showInfoBox(true)}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    user: state.user,
    graph: state.graph
});
const mapDispatchToProps = {
    sendSystemMessage
};
export default connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(EvacuationControl))

