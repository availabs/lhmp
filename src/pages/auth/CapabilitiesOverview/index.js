import React from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import get from "lodash.get";
import Element from 'components/light-admin/containers/Element'
import {sendSystemMessage} from 'store/modules/messages';
import _ from 'lodash'
import {GeoDropdown} from 'pages/auth/Plan/functions'
import fema_recommended_capabilities from './fema_recommended_capabilities'

const ATTRIBUTES = [
    'capability_name',
    'capability_type',
];

class CapabilitiesIndex extends React.Component {

    constructor(props) {
        super(props);
        this.state = {geoid: this.props.activeGeoid}
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateCapabilityList = this.updateCapabilityList.bind(this);

    }

    updateCapabilityList() {
        let uniq_categories = _.uniq(
            Object.values(get(this.props, `formMeta`, {}))
                .filter(c => c.form_type.split('capabilities-').length === 1)
                .reduce((a, c) => [...a, c.category], [])
        )

        let capabilities = Object.values(get(this.props, `capabilities`, {}))
            .map(capability =>
                Object.keys(capability.value.attributes)
                    .reduce((a, c) => {
                        a[c] =
                            typeof capability.value.attributes[c] === "string" && capability.value.attributes[c].includes('[') ?
                                capability.value.attributes[c].replace('[', '').replace(']', '').split(',') :
                                capability.value.attributes[c]
                        return a;
                    }, {}))
        fema_recommended_capabilities.forEach(capability => this.setState({[capability]: null}))
        let alreadyPresentCap =
            fema_recommended_capabilities
                .filter(capability =>
                    capabilities.filter(capabilityDB =>
                        (typeof capabilityDB.capability_type === 'string' &&
                            capabilityDB.capability_type.toLowerCase() === capability.toLowerCase() ||
                            typeof capabilityDB.capability_type === 'object' &&
                            capabilityDB.capability_type.map(cdb => cdb.toLowerCase()).includes(capability.toLowerCase()))
                        /*&&
                        (typeof capabilityDB.capability_category === 'string' &&
                            capabilityDB.capability_category.toLowerCase() === uc.toLowerCase() ||
                            typeof capabilityDB.capability_category === 'object' &&
                            capabilityDB.capability_category.map(cdb => cdb.toLowerCase()).includes(uc.toLowerCase())) */
                        &&
                        (
                            get(this.state, `geoid`, '').length === 5 ?
                                (typeof capabilityDB.county === 'string' &&
                                    capabilityDB.county === this.state.geoid ||
                                    typeof capabilityDB.county === 'object' &&
                                    capabilityDB.county.includes(this.state.geoid)) :
                                (typeof (capabilityDB.cousub || capabilityDB.municipality) === 'string' &&
                                    (capabilityDB.cousub || capabilityDB.municipality) === this.state.geoid ||
                                    typeof (capabilityDB.cousub || capabilityDB.municipality) === 'object' &&
                                    (capabilityDB.cousub || capabilityDB.municipality || []).includes(this.state.geoid))
                        )
                    ).length)
        alreadyPresentCap.forEach(capability => this.setState({[capability]: 'true'}))
        this.setState({alreadyPresentCap: alreadyPresentCap, uniq_categories: uniq_categories})
    }

    componentDidMount() {
        this.updateCapabilityList()
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.geoid !== prevState.geoid) {
            this.updateCapabilityList()
        }
    }

    fetchFalcorDeps() {
        let length = 0,
            formType = 'capabilities',
            ids = []
        return this.props.falcor.get(
            ['forms', formType, 'meta'],
            ['forms', formType, 'byPlanId', this.props.activePlan, 'length'])
            .then(response => {
                let length = response.json.forms[formType].byPlanId[this.props.activePlan].length;
                if (length > 0) {
                    this.props.falcor.get(['forms', formType, 'byPlanId', this.props.activePlan, 'byIndex', [{
                        from: 0,
                        to: length - 1
                    }], ...ATTRIBUTES])
                        .then(response => {
                            let graph = response.json.forms[formType].byPlanId[this.props.activePlan].byIndex;
                            Object.keys(graph)
                                .filter(d => {
                                        if (this.props.filterBy) {
                                            return Object.keys(this.props.filterBy)
                                                .reduce((a, c) =>
                                                    a && this.props.filterBy[c].includes(get(graph[d], `attributes.${c}`, null)), true)
                                        }
                                        return true
                                    }
                                )
                                .filter(d => d !== '$__path').forEach(id => {
                                if (graph[id]) {
                                    ids.push(graph[id].id)
                                }

                            })
                            this.setState({
                                form_ids: ids
                            })
                            this.updateCapabilityList()
                            return response
                        })
                }
            })


    }

    handleChange(e) {
        this.setState({...this.state, [e.target.id]: e.target.value});
    };

    handleSubmit(e) {
        // e.preventDefault();
        let newCapabilities =
            Object.keys(this.state)
                .filter(key => fema_recommended_capabilities.includes(key) &&
                    !this.state.alreadyPresentCap.includes(key) &&
                    this.state[key])
        return newCapabilities
            .reduce((a, c) => {
                return a.then(() => {
                    let args = []
                    args.push('capabilities',
                        this.props.activePlan,
                        {
                            capability_type:  "[" + c.toString() +"]",
                            capability_category:  "[" + Object.values(get(this.props, `formMeta`, {}))
                                .filter(meta => meta.type === c)
                                .map(meta => meta.category)
                                .pop() +"]",
                            county: "[" + this.props.activeGeoid.toString() +"]",
                            municipality: this.state.geoid.length > 5 ? "[" + this.state.geoid.toString() +"]" : null
                        });
                    return this.props.falcor.call(['forms', 'insert'], args, [], [])
                })
            }, Promise.resolve())
            .then(response => this.props.sendSystemMessage(`successfully created.`, {type: "success"}))
    }

    render() {
        let attributes = ['capability_name', 'Add'];


        return (
            <div className='container'>
                <Element>
                    <h4 className="element-header">Capabilities
                        <span style={{float: 'right'}}>
                            <GeoDropdown
                                className="form-control justify-content-sm-end"
                                id='geoid'
                                value={this.state.geoid}
                                onChange={this.handleChange}
                                pureElement={true}
                            />
                        </span>
                    </h4>
                    <div className="element-box">
                        <div className="table-responsive">
                            <table className='table table-sm table-lightborder table-hover dataTable'>
                                <thead>
                                <tr>
                                    {['Capability', 'Add'].map((capability) => {
                                        return (
                                            <th>{capability}</th>
                                        )
                                    })
                                    }
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    get(this.state, `uniq_categories`, []).map(uc =>
                                        <React.Fragment>
                                            <h6>{uc}</h6>
                                            {fema_recommended_capabilities
                                                .filter(capability =>
                                                    Object.values(get(this.props, `formMeta`, {}))
                                                        .filter(f =>
                                                            f.type.toLowerCase() === capability.toLowerCase() &&
                                                            f.category.toLowerCase() === uc.toLowerCase()).length
                                                )
                                                .map((capability, i) =>
                                                    <tr>
                                                        <td>{capability || 'None'}</td>
                                                        <td>
                                                            <input
                                                                type='checkbox'
                                                                value='true'
                                                                id={capability}
                                                                checked={
                                                                    this.state[capability] === 'true' || this.state.alreadyPresentCap.includes(capability)
                                                                }
                                                                onChange={(e) =>
                                                                    this.handleChange({
                                                                        target: {
                                                                            id: e.target.id,
                                                                            value:
                                                                                this.state.alreadyPresentCap.includes(e.target.id) ?
                                                                                    'true' :
                                                                                    e.target.checked ? 'true' : null
                                                                        }
                                                                    })}
                                                            />
                                                        </td>
                                                    </tr>
                                                )
                                            }
                                        </React.Fragment>
                                    )
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <span style={{float: 'right'}}>
                        <button className="btn btn-primary step-trigger-btn" href={'#'}
                                onClick={this.handleSubmit}> Submit</button>
                    </span>
                </Element>
            </div>
        )
    }
}

const mapStateToProps = state => (
    {
        activePlan: state.user.activePlan,
        activeGeoid: state.user.activeGeoid,
        isAuthenticated: !!state.user.authed,
        attempts: state.user.attempts,
        capabilities: get(state.graph, ['forms', 'byId'], {}),
        formMeta: get(state.graph, ['forms', 'capabilities', 'meta', 'value'], {})

    });

const mapDispatchToProps = {
    sendSystemMessage
};

export default [
    {
        path: '/capabilities_overview/',
        exact: true,
        name: 'Capabilities Overview',
        auth: true,
        mainNav: true,
        icon: 'os-icon-pencil-2',
        breadcrumbs: [
            {name: 'Capabilities Overview', path: '/capabilities_overview/'}
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(CapabilitiesIndex))
    }
]
/*

 */
