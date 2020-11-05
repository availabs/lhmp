import React, {Component} from 'react';
import AvlMap from "../../AvlMap";
import config from 'pages/auth/Zones/config.js'
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import _ from 'lodash'
import Element from 'components/light-admin/containers/Element'
import {sendSystemMessage} from 'store/modules/messages';
import developementZoneLayer from "./components/developementZoneLayer";



class developementZonesFilteredTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            geoid: this.props.activeGeoid,
            form_ids: []
        };
        this.fetchFalcorDeps = this.fetchFalcorDeps.bind(this)
    }

    componentDidMount() {
        this.setState({form_ids: []})
        this.fetchFalcorDeps()
    }

    fetchFalcorDeps(){
        let formType = 'zones',
            formAttributes = Object.keys(get(config, `[0].attributes`, {})),
            ids = [];

        return this.props.falcor.get(
            ['forms', formType,'byPlanId',this.props.activePlan,'length']
        ).then(response => {
            let length = response.json.forms[formType].byPlanId[this.props.activePlan].length;
            if(length > 0){
                this.props.falcor.get(['forms',formType,'byPlanId',this.props.activePlan,'byIndex',[{from:0,to:length-1}],...formAttributes])
                    .then(response =>{
                        let graph = response.json.forms[formType].byPlanId[this.props.activePlan].byIndex;
                        Object.keys(graph)
                            .filter(d => {
                                    if (this.props.filterBy){
                                        return Object.keys(this.props.filterBy)
                                            .reduce((a,c) =>
                                                a && _.intersectionBy(
                                                    this.props.filterBy[c].includes,
                                                get(graph[d], `attributes.${c}`, '').includes('[') ?
                                                get(graph[d], `attributes.${c}`, '').slice(1,-1).split(',') :
                                                [get(graph[d], `attributes.${c}`, '')]
                                                ), true)
                                    }
                                    return true
                                }
                            )
                            .filter(d => d !== '$__path').forEach(id =>{
                            if(graph[id]){
                                ids.push(graph[id].id)
                            }

                        })
                        this.setState({
                            form_ids : ids
                        })
                        return response
                    })
            }

        })
    }

    render(){
        return (
            <div style={{width: '100%', height: '50vh'}}>
                <AvlMap
                    zoom={18}
                    mapactions={false}
                    scrollZoom={false}
                    center={[-73.7749, 42.6583]}
                    styles={[
                        { name: "Terrain", style: "mapbox://styles/am3081/cjhi0xntt5ul52snxcbsnaeii" },
                        { name: 'Dark Streets', style: 'mapbox://styles/am3081/ck3rtxo2116rr1dmoppdnrr3g'},
                        { name: 'Light Streets', style: 'mapbox://styles/am3081/ck3t1g9a91vuy1crzp79ffuac'}
                    ]}
                    sidebar={false}
                    layers={[developementZoneLayer]}
                    layerProps={{
                        [developementZoneLayer.name]: {
                            zoneId: this.state.form_ids,
                        }
                    }}
                />
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        activeGeoid: state.user.activeGeoid,
        activeCousubid: ownProps.geoId ? ownProps.geoId : state.user.activeCousubid,
        graph: state.graph,
        activePlan: state.user.activePlan,
        formsListData: get(state.graph, ['forms', 'byId'], {}),
        geoData: get(state.graph, ['geo'], {}),
        user: get(state, 'user', null),
        isAuthenticated: !!state.user.authed,
        attempts: state.user.attempts,
        formsByIdData: get(state.graph,['forms']),
    }
};
const mapDispatchToProps = ({sendSystemMessage});
export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(developementZonesFilteredTable))