import React from "react"
import {connect} from "react-redux"
import {reduxFalcor} from "utils/redux-falcor"
import _ from 'lodash'
import get from "lodash.get"
import styled from "styled-components"
import AvlFormsListTable from 'components/AvlForms/displayComponents/listTable.js'
import ViewConfig from './view_config.js'
import {Button} from "components/common/styled-components"
import SaveRoute from "./saveRoute";

const DEFAULT_ROUTE_DATA = {
    name: "",
    type: "personal",
    id: null
};

const saveModalForm = (geom, setState) => {
    return (
        <div aria-labelledby="mySmallModalLabel" className="modal fade bd-example-modal-lg show" role="dialog"
             tabIndex="-1" aria-modal="true" style={{paddingRight: '15px', display: 'block'}}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header"><h5 className="modal-title" id="exampleModalLabel">Save Route</h5>
                        <button aria-label="Close" className="close" data-dismiss="modal" type="button"
                                onClick={() => setState({ showSaveModal: false })}
                        >
                            <span aria-hidden="true"> ×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <SaveRoute
                            geom={geom}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
};

class RouteInfoBox extends React.Component {
    state = {
        showSaveModal: false,
        route: {...DEFAULT_ROUTE_DATA}
    };

    componentDidMount() {
        this.setState({
            route: {
                ...this.state.route,
                owner: this.state.route.owner === "group" ? this.props.user.groups[0] : this.props.user.id
            }
        })
    }

    componentDidUpdate(oldProps, oldState) {
        if (oldProps.userRoute !== this.props.userRoute || !_.isEqual(oldProps.data, this.props.data)) {
            if (this.props.userRoute === null) {
                this.setState({
                    route: {
                        ...DEFAULT_ROUTE_DATA,
                        owner: this.props.user.id
                    }
                });
            } else {
                this.setState({
                    route: {
                        name: this.props.userRoute.name,
                        type: this.props.userRoute.type,
                        owner: this.props.userRoute.owner,
                        id: this.props.userRoute.id
                    }
                })
            }
        }
    }

    okToSave(saveType) {
        const {
            name, type, owner
        } = this.state.route;

        let nameChanged = true;
        if ((saveType === "new") && this.props.userRoute) {
            nameChanged = this.state.route.name !== this.props.userRoute.name;
        }
        return name.length && type && owner && nameChanged;
    }

    updateRoute(key, value) {
        const route = {
            ...this.state.route,
            [key]: value
        };
        if (key === "type" && value !== this.state.route.type) {
            route.owner = value === "group" ? this.props.user.groups[0] : this.props.user.id;
        }
        this.setState({route})
    }

    saveRoute(id = null) {
        const {layer, nameArray} = this.props,
            DATA = {
                ...this.state.route,
                id,
                nameArray,
                points: layer.mode === "markers" ? layer.markers.map(m => m.getLngLat()) : [],
                conflationArray: layer.mode === "markers" ? layer.data.markers : []
            };
        return this.props.falcor.call(["routes", "save"], [DATA])
            .then(res =>
                layer.loadUserRoutes()
                    .then(() => layer.selectUserRoute(res.json.routes.recentlySaved))
            );
    }
    render() {
        const {layer, nameArray} = this.props;
        let somethingToRemove = false;
        if ((layer.mode === "markers") && (layer.markers.length)) {
            somethingToRemove = true;
        } else if ((layer.mode === "click") && (layer.data.click.length)) {
            somethingToRemove = true;
        }

        let routes = get(this.props.data, `routes`, []).pop(),
            geom = get(routes, `geometry`, {coordinates: [], type: "LineString"});
        return (
            <div>
                {!layer.filters.userRoutes.value ? null :
                    <div style={{fontSize: "18px", paddingTop: "5px"}}>
                        Year Created: {new Date(layer.filters.userRoutes.value.updatedAt).getFullYear()}
                    </div>
                }

                <div style={{position: "relative", paddingTop: "10px", display: 'flex', justifyContent: 'space-between'}}>
                    <Button style={{width: "calc(33% - 5px)"}}
                            onClick={e => layer.removeLast()}
                            disabled={!somethingToRemove}
                            secondary>
                        Remove Last
                    </Button>
                    <Button style={{width: "calc(33% - 5px)"}}
                            onClick={e => layer.clearRoute()}
                            disabled={!somethingToRemove}
                            secondary>
                        Clear Route
                    </Button>
                    <Button style={{width: "calc(33% - 5px)"}}
                            disabled={!nameArray.length}
                            onClick={e => this.setState({showSaveModal: true})}
                            primary>
                        Save Route
                    </Button>
                </div>

                <div style={{position: "relative", paddingTop: "10px"}}>

                </div>
                {this.state.showSaveModal ? saveModalForm(this.props.geom, this.setState.bind(this)) : null}

                <AvlFormsListTable
                    json = {ViewConfig.view}
                    deleteButton = {true}
                    viewButton={true}
                    onViewClick={(e) => this.props.paintRoute(
                        {
                            mode: 'markers',
                            data: {
                                routes: [{geometry: e}]
                            }
                        }
                    )}
                />
            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    user: state.user,
    graph: state.graph
});
export default connect(mapStateToProps)(reduxFalcor(RouteInfoBox))

const ScrollingDiv = styled.div`
  ${props => props.theme.scrollBar};
  padding: 0px 10px;
  max-height: 300px;
  overflow: auto;
`;
const Row = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin-top: 5px;
  :first-child {
    margin-top: 0px;
  }
`;
const ModalContent = styled.div`
  display: flex;
  align-items: center;
  width: 500px;
  flex-direction: column;

  > ${Row} > label {
    width: 25%;
    padding-right: 10px;
    text-align: right;
    font-size: 15px;
  }
  > ${Row} > div {
    width: 75%;
  }
`;
