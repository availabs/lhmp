import React from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import capability_config from "pages/Public/Home/components/Strategy/Capabilities/tempConfig.js"
import get from "lodash.get";
import Table from 'components/light-admin/tables/Table'
import {HeaderContainer, PageContainer, PageHeader, VerticalAlign} from 'pages/Public/theme/components'

var _ = require('lodash')


const counties = ["36101", "36003", "36091", "36075", "36111", "36097", "36089", "36031", "36103", "36041", "36027", "36077",
    "36109", "36001", "36011", "36039", "36043", "36113", "36045", "36019", "36059", "36053", "36115", "36119", "36049", "36069",
    "36023", "36085", "36029", "36079", "36057", "36105", "36073", "36065", "36009", "36123", "36107", "36055", "36095", "36007",
    "36083", "36099", "36081", "36037", "36117", "36063", "36047", "36015", "36121", "36061", "36021", "36013", "36033", "36017",
    "36067", "36035", "36087", "36051", "36025", "36071", "36093", "36005"];

class CapabilityStrategy extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            form_ids: [],
            required_capabilities: {}
        }
    }


    fetchFalcorDeps() {
        let ids = []

        if (!this.props.activePlan) return Promise.resolve({});
        return this.props.falcor.get(['forms', ['capabilities'], 'byPlanId', this.props.activePlan, 'length'])
            .then(response => {
                let length = response.json.forms['capabilities'].byPlanId[this.props.activePlan].length;
                if (length > 0) {
                    this.props.falcor.get(['forms', ['capabilities'], 'byPlanId', this.props.activePlan, 'byIndex', [{
                        from: 0,
                        to: length - 1
                    }], ['capability_category', 'capability_type', 'capability_name', 'county', 'municipality']])
                        .then(response => {
                            let graph = response.json.forms['capabilities'].byPlanId[this.props.activePlan].byIndex;
                            Object.keys(graph).filter(d => d !== '$__path').forEach(id => {
                                if (graph[id]) {
                                    ids.push(graph[id].id)
                                }

                            })
                            this.setState({
                                form_ids: ids
                            })
                            return response
                        })
                }
            })
    }

    componentDidMount() {
        let result = {}
        capability_config.forEach(capability => {
            if (capability['required'] === 'yes') {
                result[capability['capability_category']] = (result[capability['capability_category']] || 0) + 1
            }

        });
        this.setState({
            required_capabilities: result
        })
        return this.props.falcor.get(['geo', counties, 'cousubs'],
            ['geo', counties, ['name']])
            .then(response => {
                let graph = response.json.geo;
                let cousubs = []
                Object.keys(graph).filter(d => d !== '$__path').forEach(item => {
                    cousubs.push(graph[item].cousubs)
                })
                this.props.falcor.get(['geo', cousubs.flat(1), ['name']])
                    .then(response => {
                        return response
                    })
            })
    }

    isMatch(matchee, matcher) {
        matchee = matchee && typeof matchee === "string" && matchee.includes('[') ?
            matchee.replace('[', '').replace(']', '').split(',') : matchee;

        return (!matchee || !matcher) ? false :
            typeof matchee === 'string' ?
                matchee.toString().toLowerCase() === matcher.toString().toLowerCase() :
                matchee.map(m => m.toString().toLowerCase()).includes(matcher.toString().toLowerCase())
    }

    jsonbToArray(matchee) {
        return matchee && typeof matchee === "string" && matchee.includes('[') ?
            matchee.replace('[', '').replace(']', '').split(',') :
            typeof matchee === "string" ? [matchee] : matchee;
    }

    processData() {

        if (!(this.props.capabilityData && this.props.geoData)) {
            return null
        }

        let data = [];
        let required = 0;
        let result = {
            // geoid: {# of capability types}
        }
        Object.keys(this.props.capabilityData).forEach((item, i) => {
            if (this.state.form_ids.includes(item)) {
                capability_config.forEach(capability => {
                    let tmpCat = this.jsonbToArray(this.props.capabilityData[item].value.attributes['capability_category']);
                    if (tmpCat){
                        tmpCat.forEach(cat => {
                            if (this.isMatch(cat, capability['capability_category'])) {
                                cat = capability['capability_category']; //to avoid letter case mismatch

                                if (this.isMatch(this.props.capabilityData[item].value.attributes['capability_type'], capability['capability_type'])) {
                                    if (capability['required'] === 'yes') {
                                        let tmpGeo = this.jsonbToArray(this.props.capabilityData[item].value.attributes['cousub'] ||
                                            this.props.capabilityData[item].value.attributes['municipality']);

                                        let tmpCounty = this.jsonbToArray(this.props.capabilityData[item].value.attributes['county'])
                                        if (tmpCounty && tmpCounty.length){
                                            tmpGeo = tmpGeo ? [...tmpGeo, tmpCounty] : tmpCounty
                                        }
                                        if (tmpGeo) {
                                            let tmpCatType = this.jsonbToArray(this.props.capabilityData[item].value.attributes['capability_type']);
                                            if (tmpCatType){
                                                tmpCatType.forEach(catType => {
                                                    catType = capability['capability_type']; //to avoid letter case mismatch

                                                    tmpGeo.forEach(geo => {
                                                        if (get(result, [geo, cat, catType], null)) {
                                                            result[geo][cat][catType] = result[geo][cat][catType] + 0 // to avoid duplicate count
                                                        } else {
                                                            result[geo] = {
                                                                ...result[geo],
                                                                [cat]: {
                                                                    ...get(result, [geo, cat], {}),
                                                                    [catType] : 1
                                                                }
                                                            }
                                                        }
                                                    })
                                                })
                                            }

                                        }
                                    }

                                }
                            }
                        })
                    }
                })
            }
        });
        Object.keys(result).forEach(geo => {
            data.push({
                'Capability Region': get(this.props.geoData, [geo, 'name'], geo),
                ...['Education and outreach', 'Planning and Regulatory', 'Financial', 'Administrative and Technical'].reduce((a, c) => {

                    a[c] = result[geo][c]  ? (Object.values(result[geo][c]).reduce((a,c) => a + (c || 0), 0) / this.state.required_capabilities[c] * 100).toFixed(0) + '%' : 0 + '%';
                    return a
                }, {})
            })
        });
        return {
            data: data,
            columns: [
                {
                    Header: 'Capability Region',
                    accessor: 'Capability Region',
                    align: 'left',
                    width: 400
                },
                {
                    Header: 'Education and outreach',
                    accessor: 'Education and outreach',
                    align: 'left',
                    width: 400
                },
                {
                    Header: 'Planning/Regulatory',
                    accessor: 'Planning and Regulatory',
                    align: 'center',
                    width: 200
                },
                {
                    Header: 'Financial',
                    accessor: 'Financial',
                    align: 'center',
                    width: 200
                },
                {
                    Header: 'Administrative and Technical',
                    accessor: 'Administrative and Technical',
                    align: 'center',
                    width: 200
                },
            ]
        }

    }


    render() {

        return (
            <PageContainer style={{Height: '80vh'}}>
                {this.props.showHeader ?
                    <HeaderContainer>
                        <PageHeader>Capabilities</PageHeader>
                    </HeaderContainer> : null}
                <VerticalAlign>
                    <div className='d-flex justify-content-center' style={{fontSize: '1.5em'}}>
                        {this.processData() ?
                            (<Table {...this.processData()} />)
                            : (<h4>Loading Capability Data ...</h4>)
                        }

                    </div>
                </VerticalAlign>
            </PageContainer>

        )


    }
}

CapabilityStrategy.defaultProps = {
    geoid: '36',
    geoLevel: 'cousubs',
    title: "Capability Strategy",
    showHeader: true
}

const mapStateToProps = state => {
    return {
        router: state.router,
        geoGraph: state.graph.geo,
        activePlan: state.user.activePlan,
        geoData: get(state.graph, ['geo']),
        allData: state.graph,
        capabilityData: get(state.graph, `forms.byId`, {})
    }
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(CapabilityStrategy));