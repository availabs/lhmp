import React from "react"
import {connect} from "react-redux"
import {reduxFalcor} from "utils/redux-falcor"
import _ from 'lodash'
import get from "lodash.get"
import styled from "styled-components"
import {sendSystemMessage} from "../../../../store/modules/messages";
import {ControlBase} from '../layers/evacuationLayer'

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

    componentDidUpdate(prevProps, prevState) {
        if(!_.isEqual( prevProps.layer.layer.evacuationRoutesLayer.mode,  this.props.layer.layer.evacuationRoutesLayer.mode)){
            this.forceUpdate()
        }
    }

    render() {
        let layer = this.props.layer.layer.evacuationRoutesLayer
        return (
            <div>
                {
                    this.props.layer.layer.evacuationRoutesLayer.mode === "markers" ?
                        <button
                            id="new_route_button"
                            className="mr-2 mb-2 btn btn-primary btn-sm"
                            type="button"
                            onClick = {(e) =>{
                                this.props.layer.layer.evacuationRoutesLayer.toggleCreationMode("")
                                this.props.layer.layer.evacuationRoutesLayer.forceUpdate()
                                this.forceUpdate()
                            }}
                        >Cancel Editing</button> :
                        <button
                            id="new_route_button"
                            className="mr-2 mb-2 btn btn-primary btn-sm"
                            type="button"
                            onClick = {(e) =>{
                                this.props.layer.layer.evacuationRoutesLayer.toggleCreationMode("markers")
                                this.props.layer.layer.evacuationRoutesLayer.forceUpdate()
                                this.forceUpdate()
                            }}
                        >Add New Route</button>
                }

                {/*<div>
                    <ControlBase layer={layer}
                                 userRoute={layer.filters.userRoutes.value}
                                 nameArray={layer.nameArray}
                                 data={layer.data}
                                 geom={layer.geom}
                                 paintRoute={layer.receiveRoute.bind(layer)}
                                 viewOnly={layer.viewOnly} />
                </div>*/}
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

