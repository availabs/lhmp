import React from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import _ from 'lodash'
import get from "lodash.get";
import config, {colors} from "./config/review-config";
import styled from "styled-components";
import functions from "./functions";
import Element from "../../../components/light-admin/containers/Element";
import ElementBox from "../../../components/light-admin/containers/ElementBox";
import megaConfig from "./config/megaConfig";

const COLS = ['content_id', 'attributes', 'body', 'created_at', 'updated_at'];
const DIV = styled.div`
${(props) => props.theme.scrollBar};
overflow: auto;
width: 100%;
height: 65vh;
th {
  background: #fff;
  position: sticky;
  top: 0;
  box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4);
}
`

class PlanReview extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            geoData: []
        }

        this.processTable = this.processTable.bind(this)
    }

    componentDidUpdate(prevProps, prevState) {
        if (!_.isEqual(this.state, prevState)) {
            this.forceUpdate()
        }
    }

    getReqsToFilter(geo) {
        let formType = 'filterRequirements'
        let graph = get(this.props.falcor.getCache(), [`forms`], null);
        let id = get(graph, [formType, 'byPlanId', this.props.activePlan, 'byIndex'], {});
        let reqToFilter;

        if (id) {
            id = Object.keys(id)
                .map(i => get(id[i], ['value', 2], null))
                .filter(i => i)
            let data = id.map(i => get(graph, ['byId', i], {}))
            if (data) {
                reqToFilter =
                    Object.keys(data)
                        .reduce((a, g) => {
                            let tmpReqs = get(data[g], `value.attributes`, {})
                            Object.keys(tmpReqs)
                                .filter(tr => tr === geo && tmpReqs[tr])
                                .forEach(tr => a.push(...tmpReqs[tr].slice(2, -2).split(',').filter(r => r !== "")))
                            return a
                        }, [])
            }
        }
        return reqToFilter
    }

    async fetchFalcorDeps() {
        if (!this.props.activeGeoid) return Promise.resolve();

        // get reqs to filter by jurisdictions
        let formTypeFR = 'filterRequirements',
            formAttributesFR = ['municipality', 'hiddenRequirements']

        let response = await this.props.falcor.get(['forms', formTypeFR, 'byPlanId', this.props.activePlan, 'length'])
        let length = get(response, ['json', 'forms', formTypeFR, 'byPlanId', this.props.activePlan, 'length'], 0);
        if (length > 0) {
            await this.props.falcor.get(['forms', formTypeFR, 'byPlanId', this.props.activePlan, 'byIndex', [{
                from: 0,
                to: length - 1
            }], ...formAttributesFR])
        }

        let formType = 'filterJurisdictions',
            formAttributes = ['county', 'municipality']

        return this.props.falcor.get(
            ["geo", this.props.activeGeoid, 'municipalities'],
            ['forms', formType, 'byPlanId', this.props.activePlan, 'length'])
            .then(response => {
                let length = get(response, ['json', 'forms', formType, 'byPlanId', this.props.activePlan, 'length'], 0);
                if (length > 0) {
                    return this.props.falcor.get(
                        ['forms', formType, 'byPlanId', this.props.activePlan, 'byIndex', [{
                            from: 0,
                            to: length - 1
                        }], ...formAttributes],
                        ['geo',
                            [this.props.activeGeoid, ...get(this.props.geoGraph, `${this.props.activeGeoid}.municipalities.value`, [])],
                            ['name']])
                }

                return this.props.falcor.get(
                    ['geo',
                        [this.props.activeGeoid, ...get(this.props.geoGraph, `${this.props.activeGeoid}.municipalities.value`, [])],
                        ['name']],
                )
            })
            .then(() => {
                let allGeos =
                    [this.props.activeGeoid,
                        ...get(this.props.geoGraph, `${this.props.activeGeoid}.municipalities.value`, [])];
                let allReq = [];
                let elementStatus = {}

                config.elements.forEach(element =>
                    allReq.push(...[...element.requirements_from_software.split(','), element.element]
                        .filter(r => r.length)
                        .map(r => r.trim())))
                let contentIds = []
                allGeos.map(geo => allReq.map(req => contentIds.push(req + '-' + this.props.activePlan + '-' + geo)));
                return _.chunk(contentIds, 5000)
                    .reduce((a, c) =>
                        a.then(() => this.props.falcor.get(['content', 'byId', c, ['content_id', 'attributes']])), Promise.resolve())
            })
    }

    getGeoToFilter() {
        let formType = 'filterJurisdictions'
        let graph = get(this.props.falcor.getCache(), [`forms`], null);
        let id = get(graph, [formType, 'byPlanId', this.props.activePlan, 'byIndex'], {})
        if (id) {
            id = Object.keys(id)
                .map(i => get(id[i], ['value', 2], null))
                .filter(i => i)
            let data = id.map(i => get(graph, ['byId', i], {}))
            if (data) {
                let geoToFilter =
                    Object.keys(data)
                        .reduce((a, g) => {
                            let tmpGeos = get(data[g], `value.attributes.municipality`, null)
                            tmpGeos = tmpGeos && typeof tmpGeos === "string" && tmpGeos.includes('[') ?
                                tmpGeos.slice(1, -1).split(',') : tmpGeos
                            if (tmpGeos) a.push(...tmpGeos)
                            return a;
                        }, [])
                return geoToFilter;
            }
        }

        return []
    }

    processTable(allowedGeos) {
        let cache = this.props.falcor.getCache();
        if (!get(cache, ['content', 'byId'])) return null
        let contentData = Object.keys(cache.content.byId)
            .filter(k => cache.content.byId[k] && k !== '$__path')
            .reduce((a, c) => {
                a[c] = cache.content.byId[c];
                return a;
            }, {})

        let reqToFilter =
            allowedGeos.reduce((a, c) => {
                a[c] = this.getReqsToFilter(c);
                return a;
            }, {})
        return (
            <DIV>
                <table className='table table-bordered table-sm table-striped'>
                    <thead>
                    <tr>
                        <th style={{position: 'sticky'}}>Jurisdiction</th>
                        {
                            config.elements.map(element => <th>{element.element}</th>)
                        }
                    </tr>
                    </thead>
                    <tbody>
                    {
                        allowedGeos.map(geo =>
                            <tr>
                                <td style={{width: 'max-content'}}>{functions.formatName(get(this.props.geoGraph, `${geo}.name`, 'N/A'), geo)}</td>
                                {
                                    config.elements.map(element => {
                                            let allPullCountyStatus = {
                                                total_req: 0,
                                                total_pullCounty: 0,
                                                pulledFromCounty: 0
                                            };
                                            let allStatus =
                                                element.requirements_from_software.split(',')
                                                    .map(r => r.trim())
                                                    .filter(r => r.length)
                                                    // .filter(r =>
                                                    //     get(megaConfig.filter(mc =>  mc.requirement === r),
                                                    //     `[0].type`, null) === 'content')
                                                    .map(r => {
                                                        allPullCountyStatus.total_req += 1;

                                                        // if a req is hidden for this geo, show it as ready to review
                                                        if (reqToFilter && reqToFilter[geo].includes(r)) {
                                                            return "Ready for review"
                                                        }
                                                        if (
                                                            get(megaConfig.filter(mc => mc.requirement === r),
                                                                `[0].type`, null) === 'content'
                                                        ) {
                                                            // for content, check status
                                                            let tmpPullCounty =
                                                                get(megaConfig.filter(mc => {
                                                                    return mc.requirement === r
                                                                }), [0, 'pullCounty'], false);
                                                            let tmpStatus = get(contentData, `${r}-${this.props.activePlan}-${geo}.attributes.value.status`, '');
                                                            allPullCountyStatus.total_pullCounty += tmpPullCounty ? 1 : 0;
                                                            allPullCountyStatus.pulledFromCounty += tmpPullCounty && !(tmpStatus && tmpStatus.length) ? 1 : 0;

                                                            return tmpPullCounty && !(tmpStatus && tmpStatus.length) ?
                                                                get(contentData, `${r}-${this.props.activePlan}-${this.props.activeGeoid}.attributes.value.status`, '') :
                                                                tmpStatus
                                                        } else {
                                                            // for non-content, return "Ready for review"
                                                            return "Ready for review"
                                                        }
                                                    })

                                            let elementStatus = get(contentData, `${element.element}-${this.props.activePlan}-${geo}.attributes.value.status`, '')

                                            return <td
                                                style={{
                                                    backgroundColor:
                                                        geo.length > 5 && element.municipal === 'false' ? colors["Does not Apply"] :
                                                            elementStatus === "Requirement not met" ? colors["Requirement not met"] :
                                                                elementStatus === "Requirement met" ? colors["Requirement met"] :
                                                                    allStatus.includes('Started') ? colors.Started :
                                                                        allStatus.length && allStatus.filter(s => s !== "Ready for review").length === 0 ? colors["Ready for review"] :
                                                                            // allStatus.length && allStatus.filter(s => s !== "Requirement not met").length === 0 ? colors["Requirement not met"] :
                                                                            // allStatus.length && allStatus.filter(s => s !== "Requirement met").length === 0 ? colors["Requirement met"] :
                                                                            'none',
                                                    opacity:
                                                    // allPullCountyStatus.total_req === allPullCountyStatus.total_pullCounty &&
                                                        allPullCountyStatus.total_pullCounty === allPullCountyStatus.pulledFromCounty &&
                                                        element.municipal !== 'false' ? 0.5 : 1
                                                }}
                                                onClick={() =>
                                                    geo.length > 5 && element.municipal === 'false' ?
                                                        null :
                                                        window.location.href = `/review_requirement/${element.element}/${geo}`}></td>
                                        }
                                    )
                                }
                            </tr>
                        )
                    }
                    </tbody>
                </table>
            </DIV>
        )
    }

    render() {
        let geoToFilter = this.getGeoToFilter(this.props.formData);
        let allowedGeos = [this.props.activeGeoid, ...get(this.props.geoGraph, `${this.props.activeGeoid}.municipalities.value`, [])]
            .filter(f => !geoToFilter.includes(f))

        return get(this.props, `match.path`, '') === '/plan_review/' ? (
            <div className='container'>
                <Element>
                    <h4 className='element-header'>Review Tools</h4>
                    <ElementBox>
                        <h6>Jurisdictional Review Table. <small className='text-muted'>Click on the box to review the
                            requirement.</small></h6>
                        <h6>
                            <table>
                                <tbody>
                                <tr>
                                    {Object.keys(colors).map(status =>
                                        <React.Fragment>
                                            <td
                                                style={{width: '15px', height: '15px', paddingLeft: '10px'}}>
                                                <div style={{
                                                    backgroundColor: colors[status],
                                                    width: '15px',
                                                    height: '15px',
                                                    paddingLeft: '10px'
                                                }}></div>
                                            </td>
                                            <td style={{paddingLeft: '5px', paddingRight: '10px'}}>
                                                <small className='text-muted'>{status}</small>
                                            </td>
                                        </React.Fragment>)}
                                </tr>
                                </tbody>
                            </table>
                        </h6>
                        {this.processTable(allowedGeos)}
                    </ElementBox>
                </Element>
            </div>
        ) : <React.Fragment>
            <h6>
                <table>
                    <tbody>
                    <tr>
                        {Object.keys(colors).map(status =>
                            <React.Fragment>
                                <td
                                    style={{width: '15px', height: '15px', paddingLeft: '10px'}}>
                                    <div style={{
                                        backgroundColor: colors[status],
                                        width: '15px',
                                        height: '15px',
                                        paddingLeft: '10px'
                                    }}></div>
                                </td>
                                <td style={{paddingLeft: '5px', paddingRight: '10px'}}>
                                    <small className='text-muted'>{status}</small>
                                </td>
                            </React.Fragment>)}
                    </tr>
                    </tbody>
                </table>
            </h6>
            {this.processTable(allowedGeos)}
        </React.Fragment>
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        geoGraph: state.graph.geo,
        user: state.user,
        router: state.router,
        activeGeoid: state.user.activeGeoid,
        activeCousubid: state.user.activeCousubid,
        activePlan: state.user.activePlan,
        formData: get(state.graph, [`forms`, 'filterRequirements'], null)
    };
};

const mapDispatchToProps = {};
export default [{
    icon: 'os-icon-pencil-2',
    path: '/plan_review/',
    exact: true,
    name: 'Plan Review',
    auth: true,
    authLevel: 5,
    mainNav: false,
    breadcrumbs: [
        {name: 'Review Tools', path: '/plan_review'}
    ],
    menuSettings: {
        image: 'none',
        scheme: 'color-scheme-light',
        position: 'menu-position-left',
        layout: 'menu-layout-compact',
        style: 'color-style-default'
    },
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(PlanReview))
}];

