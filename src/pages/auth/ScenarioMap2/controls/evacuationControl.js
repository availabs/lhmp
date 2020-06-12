import React from "react"
import {connect} from "react-redux"
import {reduxFalcor} from "utils/redux-falcor"
import _ from 'lodash'
import get from "lodash.get"
import styled from "styled-components"
import AvlFormsListTable from '../components/EvacuationListTable'

import {Button} from "components/common/styled-components"
import SaveRoute from "../components/saveRoute";
import {sendSystemMessage} from "../../../../store/modules/messages";
import config from "../components/config";

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


    /*componentDidMount() {
        this.setState({
            route: {
                ...this.state.route,
                owner: this.state.route.owner === "group" ? this.props.user.groups[0] : this.props.user.id
            },
        })
    }


    componentDidUpdate(oldProps, oldState) {
        if (oldProps.layer.layer.evacuationRoutesLayer.userRoute !== this.props.layer.layer.evacuationRoutesLayer.userRoute || !_.isEqual(oldProps.layer.layer.evacuationRoutesLayer.data, this.props.layer.layer.evacuationRoutesLayer.data)) {
            if (this.props.layer.layer.evacuationRoutesLayer.userRoute === null) {
                this.setState({
                    route: {
                        ...DEFAULT_ROUTE_DATA,
                        owner: this.props.user.id
                    },
                });
            } else {
                this.setState({
                    route: {
                        name: this.props.layer.layer.evacuationRoutesLayer.userRoute.name,
                        type: this.props.layer.layer.evacuationRoutesLayer.userRoute.type,
                        owner: this.props.layer.layer.evacuationRoutesLayer.userRoute.owner,
                        id: this.props.layer.layer.evacuationRoutesLayer.userRoute.id
                    },
                })
            }
        }
    }*/

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

