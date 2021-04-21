import React from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import get from "lodash.get";
import {sendSystemMessage} from 'store/modules/messages';
import GraphFactory from 'components/AvlForms/displayComponents/graphFactory.js'
import AvlMap from "../../AvlMap";
import ShowZoneLayer from "components/AvlForms/displayComponents/ShowZoneLayer";

var _ = require('lodash')

const counties = ["36", "36101", "36003", "36091", "36075", "36111", "36097", "36089", "36031", "36103", "36041", "36027", "36077",
    "36109", "36001", "36011", "36039", "36043", "36113", "36045", "36019", "36059", "36053", "36115", "36119", "36049", "36069",
    "36023", "36085", "36029", "36079", "36057", "36105", "36073", "36065", "36009", "36123", "36107", "36055", "36095", "36007",
    "36083", "36099", "36081", "36037", "36117", "36063", "36047", "36015", "36121", "36061", "36021", "36013", "36033", "36017",
    "36067", "36035", "36087", "36051", "36025", "36071", "36093", "36005"];

let county = '';
let cousub = '';

class AvlFormsViewDataZones extends React.Component {
    constructor(props) {
        super(props);
    }

    fetchFalcorDeps() {
        return this.props.falcor.get(['forms', 'byId', this.props.id])
            .then(response => {
                let graph = response.json.forms.byId[this.props.id].attributes;
                Object.keys(graph).filter(d => d !== '$__path').forEach(item => {
                    let value = typeof JSON.parse(graph[item]) === "object" ? JSON.parse(graph[item]) : [graph[item]];

                    if (value && counties.includes(value)) {
                        county = value
                    }
                    if (value && value.reduce((a,c) => a && Object.keys(this.props.allGeo || {}).includes(c) ,true)) {
                        cousub = value
                    }

                })
                if (county.length !== 0) {
                    this.props.falcor.get(['geo', county, ['name']])
                        .then(response => {
                            return response
                        })
                }
                if (cousub.length !== 0) {
                    this.props.falcor.get(['geo', cousub, ['name']])
                        .then(response => {
                            return response
                        })
                }
                return response
            })
    }

    loadMap() {
        return (
            <div style={{width: '100%', height: '50vh'}}>
                <AvlMap
                    zoom={18}
                    mapactions={false}
                    scrollZoom={false}
                    center={[-73.7749, 42.6583]}
                    styles={[
                        {name: "Terrain", style: "mapbox://styles/am3081/cjhi0xntt5ul52snxcbsnaeii"},
                        {name: 'Dark Streets', style: 'mapbox://styles/am3081/ck3rtxo2116rr1dmoppdnrr3g'},
                        {name: 'Light Streets', style: 'mapbox://styles/am3081/ck3t1g9a91vuy1crzp79ffuac'}
                    ]}
                    sidebar={false}
                    layers={[ShowZoneLayer]}
                    layerProps={{
                        [ShowZoneLayer.name]: {
                            zoneId: this.props.id,
                        }
                    }}
                />
            </div>
        )

    }

    formsViewData() {
        let graph = this.props.formsViewData[this.props.id];
        let geoData = this.props.geoData;
        let data = [];
        let config_attributes = this.props.config.map(d => Object.keys(d.attributes));
        let config = this.props.config.map(d => d.attributes);
        if (graph) {
            Object.keys(graph).filter(d => d !== '$type').forEach(item => {
                Object.keys(graph[item].attributes).forEach((d, i) => {
                    if (config_attributes[0].includes(d)) {
                        let section = get(config[0][d], `section`, null),
                            label = get(config[0][d], `label`, null),
                            displayType = get(config[0][d], `display_type`, null),
                            formType = get(config[0][d], `form_type`, null),
                            parentConfig = get(config[0][d], `parentConfig`, null);
                        let value = get(graph, `[${item}].attributes[${d}]`, null)
                        value = value ? value.toString() : value;
                        value = value && value.includes('[') ?
                            value.replace('[', '').replace(']', '') : value;

                        if (value === county || value === cousub) {
                            data.push({
                                attribute: d,
                                value: geoData[value] ? geoData[value].name : 'None',
                                section,
                                label,
                                displayType,
                                formType,
                                parentConfig
                            })
                        } else {
                            if (!config[0][d].hidden || config[0][d].hidden !== 'true') {

                                data.push({
                                    attribute: d,
                                    value: value ? value.toString() || 'None' : '',
                                    section,
                                    label,
                                    displayType,
                                    formType,
                                    parentConfig: parentConfig
                                })
                            }

                        }
                    }/* else {
                        config_attributes[0].filter(item => item !== d).forEach(ca => {
                            if (!config[0][ca].hidden || config[0][ca].hidden !== 'true') {
                                let section = get(config[0][ca], `section`, null),
                                    label = get(config[0][ca], `label`, null),
                                    displayType = get(config[0][ca], `display_type`, null),
                                    formType = get(config[0][ca], `form_type`, null),
                                    parentConfig = get(config[0][d], `parentConfig`, null);

                                console.log('check', graph[item].attributes[ca])
                                data.push({
                                    attribute: ca,
                                    value: graph[item].attributes[ca] ?
                                        ca === 'zone_type' ?
                                            graph[item].attributes[ca].includes('[') ?
                                                graph[item].attributes[ca].toString().slice(1, -1) :
                                                graph[item].attributes[ca].toString() || 'None' :
                                            '' :
                                        '',
                                    section,
                                    label,
                                    displayType,
                                    formType,
                                    parentConfig
                                })
                            }

                        })
                    }*/
                })
            })

        }

        return _.uniqBy(data, 'attribute')

    }

    render() {
        let data = this.formsViewData();
        return (
            <div className="col-md-6 col-xxxl-16">
                <div className='element-wrapper'>
                    <div className='element-box'>
                        {this.loadMap()}
                        <GraphFactory
                            graph={{type: 'text'}}
                            data={data}
                            config={this.props.config}
                            isVisible={true}
                            showHeader={this.props.showHeader}
                        >
                        </GraphFactory>
                    </div>
                </div>
            </div>

        )
    }
}

AvlFormsViewDataZones.defaultProps = {
    showHeader: true
}
const mapStateToProps = (state, ownProps) => {
    return {
        activePlan: state.user.activePlan,
        activeGeoid: state.user.activeGeoid,
        config: ownProps.json,
        formsViewData: get(state.graph, ['forms', 'byId'], {}),
        geoData: get(state.graph, ['geo'], {}),
        allGeo: state.geo.allGeo,
        id: ownProps.id
    }
};

const mapDispatchToProps = {
    sendSystemMessage
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(AvlFormsViewDataZones))