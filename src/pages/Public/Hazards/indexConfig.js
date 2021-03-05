import React from 'react';
import _ from 'lodash'
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import config from "pages/auth/Plan/config/hazards-config";
import ElementFactory, {RenderConfig} from 'pages/Public/theme/ElementFactory'
import {authGeoid, setActiveCousubid} from 'store/modules/user'
import SideMenu from 'pages/Public/theme/SideMenu'

import {
    ContentContainer,
    HeaderImageContainer,
    PageContainer,
    PageHeader,
    SectionHeader,
    StatementText
} from 'pages/Public/theme/components'
import get from "lodash.get";
import {getColorScale} from "../../../utils/sheldusUtils";
import HazardSideMenu from "./new_components/HazardSideMenu";
import hazardConfig from "./hazard-config";
import HazardHeroStats from "./new_components/HazardHeroStats";
import Hazard from "./new_components/Hazard";
import functions from "../../auth/Plan/functions";

const COLS = ['body'];
const emptyBody = ['<p></p>', '']

class Hazards extends React.Component {

    constructor(props) {
        super(props);
        authGeoid(this.props.user);
        this.state = {
            imageReq: 'hazard-image',
            geoLevel: this.setGeoLevel(this.props.activeGeoid.length),
            dataType: 'severeWeather',
            colorScale: getColorScale([1, 2]),
            hazards: [],
            hazard: undefined,
            firstLoad: true
        }
        this.getCurrentKey = this.getCurrentKey.bind(this)
        this.changeHazard = this.changeHazard.bind(this)
    }

    getCurrentKey = (requirement, county = false) =>
        this.props.scope === 'global' ?
            requirement :
            requirement + '-' + this.props.user.activePlan + '-' + `${county ? this.props.user.activeGeoid : this.props.user.activeCousubid}`

    changeHazard(e, a) {
        this.setState({hazard:e.target.value, firstLoad: false})
    }

    setGeoLevel(geoid_len) {
        return geoid_len === 2 ? 'state'
            : geoid_len === 5 ? 'counties'
                : geoid_len === 7 ? 'villages'
                    : geoid_len === 10 ? 'cousubs'
                        : geoid_len === 11 ? 'tracts'
                            : geoid_len === 12 ? 'blockgroup' : ''
    }

    getGeoidName() {
        try {
            return this.props.geoGraph[this.props.geoid].name;
        } catch (e) {
            return "Loading...";
        }
    }

    async fetchFalcorDeps(geoLevel, dataType,geoid) {
        if (!this.props.activeCousubid || this.props.activeCousubid === 'undefined' || !this.props.user.activePlan) return Promise.resolve();
        if (!geoid) geoid = this.props.geoid;
        if (!dataType) dataType = this.state.dataType;

        let allRequirements = [];

        // get reqs to filter by jurisdictions
        let formType = 'filterRequirements',
            formAttributes = ['municipality', 'hiddenRequirements']

        let response = await this.props.falcor.get(['forms', formType, 'byPlanId', this.props.activePlan, 'length'])
        let length = get(response, ['json', 'forms', formType, 'byPlanId', this.props.activePlan, 'length'], 0);
        if (length > 0) {
            await this.props.falcor.get(['forms', formType, 'byPlanId', this.props.activePlan, 'byIndex', [{
                from: 0,
                to: length - 1
            }], ...formAttributes])
        }

        Object.keys(config)
            .filter(section => config[section].filter(item => !item.onlyAdmin).length > 0)
            .map(section => config[section]
                .filter(item => !item.onlyAdmin)
                .map(requirement => allRequirements.push(['content', 'byId', this.getCurrentKey(requirement.requirement), COLS])))

        return this.props.falcor.get(
            ['geo', parseInt(this.props.activeCousubid), 'name'],
            ['riskIndex', 'hazards'],
            ...allRequirements
        ).then(response => {

            let hazards = response.json.riskIndex.hazards
            let contentIds = []
            hazards.map(req => {
                contentIds.push(`req-B1-${req}-${this.props.planId}-${this.props.geoid}`, `req-B1-${req}-image-${this.props.planId}-${this.props.geoid}`)
            })

            return this.props.falcor.get(
                ['riskIndex', 'meta', hazards, ['id', 'name']],
                ['content', 'byId', contentIds, ['body']],
                [dataType, geoid, hazards, 'allTime', 'total_damage']
            ).then(response => {
                let data = response.json[dataType][geoid]
                let hazards = Object.keys(data)
                    .filter(k => k !== '$__path')
                    .filter(k => data[k].allTime.total_damage > 0)
                    .sort((a,b) => data[b].allTime.total_damage - data[a].allTime.total_damage)

                if(!this.state.hazard){
                    this.setState({
                        hazards,
                        hazard : '',//hazards[0]
                    })
                }else{
                    this.setState({hazards})
                }

            })
        })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.geoid !== this.props.geoid || !_.isEqual(prevProps.geoGraph, this.props.geoGraph)) {
            this.setState(
                {
                    geoLevel: this.setGeoLevel(this.props.geoid.length)
                });
            this.fetchFalcorDeps(this.props.geoLevel, this.props.dataType, this.props.geoid)
        }
    }

    getReqsToFilter() {
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
                                .filter(tr => tr === this.props.activeCousubid && tmpReqs[tr])
                                .forEach(tr => a.push(...tmpReqs[tr].slice(2, -2).split(',').filter(r => r !== "")))
                            return a
                        }, [])
            }
        }
        return reqToFilter
    }

    render() {
        let emptyBody = ['<p></p>', ''];
        let reqToFilter = this.getReqsToFilter();
        let updatedConfig =
            Object.keys(config)
                .reduce((aS, section) => {
                    aS[section] = config[section]
                        .filter(requirement => {
                           return requirement.filterByHaz && this.state.hazard !== '' ?
                                requirement.requirement.includes(`${this.state.hazard}`) :
                                requirement.filterByHaz && this.state.hazard === '' ?
                                    ['req-B1--image', 'req-B1-', 'req-B1--local-impact', 'hazard-charts'].includes(requirement.requirement) :
                                    !requirement.filterByHaz
                        })
                        .reduce((aR, requirement) => {
                            let tmpBody =
                                get(this.props.contentGraph,
                                    [this.getCurrentKey(requirement.requirement), 'body', 'value'],
                                    null)
                            let shouldHide =
                                reqToFilter.includes(requirement.requirement) ||
                                (this.props.activeCousubid.length > 5 && requirement.showOnlyOnCounty ? requirement.showOnlyOnCounty :
                                    requirement.hideIfNull ? !(tmpBody && !emptyBody.includes(tmpBody.trim())) : false)
                            aR.push(
                                {...requirement,
                                    onlyAdmin: requirement.onlyAdmin || shouldHide})
                            return aR
                        }, [])
                    return aS
                }, {})
        return (
            <PageContainer>
                <div style={{position: 'fixed', left: 0, top: 0, paddingTop: 20,width: '230px', height: '100%'}}>

                    <HazardSideMenu
                        config={hazardConfig}
                        geoid={this.props.activeGeoid}
                        changeHazard={this.changeHazard}
                        {...this.state}
                    />
                </div>
                <div>
                    <ContentContainer style={{maxWidth:900}}>
                        <section>
                            {this.state.hazard}
                        </section>
                        <section>
                            <SectionHeader>
                                {get(this.props.geoGraph, [this.props.activeGeoid, 'name'])} Hazards of Concern</SectionHeader>
                            {
                                Object.keys(updatedConfig)
                                    .filter(section => updatedConfig[section].filter(item => !item.onlyAdmin).length > 0)
                                    .map(section => {
                                        return (
                                            updatedConfig[section]
                                                .filter(item => !item.onlyAdmin)
                                                .map(requirement => {
                                                    return (
                                                        <ElementFactory
                                                            element={
                                                                Object.assign(
                                                                    requirement,
                                                                    {title: requirement.title
                                                                            .replace('::activeGeo', functions.formatName(get(this.props.geoGraph, [this.props.activeCousubid, 'name']), this.props.activeCousubid))
                                                                            .replace('::haz', get(this.props.graph, `riskIndex.meta[${this.state.hazard}].name`, 'All Hazards'))})
                                                            }
                                                            user={this.props.user}
                                                            autoLoad={true}
                                                            showCMSFlagNotesPublic={true}
                                                            {...this.state}
                                                            geoid={this.props.activeGeoid}
                                                            geoidPrime={this.props.activeCousubid}
                                                            changeHazard={this.changeHazard}
                                                            showTitle={requirement.showTitle}
                                                        />
                                                    )
                                                })
                                        )
                                    })
                            }
                        </section>

                    </ContentContainer>
                </div>
            </PageContainer>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        geoGraph: state.graph.geo,
        router: state.router,
        activePlan: state.user.activePlan,
        activeGeoid: state.user.activeGeoid,
        activeCousubid: state.user.activeCousubid,
        graph: state.graph,
        contentGraph: get(state.graph, `content.byId`, {}),
        formData: get(state.graph, [`forms`, 'filterRequirements'], null),
        planId: state.user.activePlan,
        geoid: ownProps.computedMatch.params.geoid ?
            ownProps.computedMatch.params.geoid
            : state.user.activeCousubid && state.user.activeCousubid !== 'undefined' ?
                state.user.activeCousubid :
                state.user.activeGeoid ?
                    state.user.activeGeoid :
                    localStorage.getItem('geoId'),
        riskIndexMeta: get(state.graph, `riskIndex.meta`, {})

    };
};

const mapDispatchToProps = {setActiveCousubid};
export default [{
    icon: 'os-icon-pencil-2',
    path: '/hazards',
    exact: true,
    name: 'Hazards',
    auth: false,
    mainNav: true,
    breadcrumbs: [
        {name: 'Hazards', path: '/hazards'}],
    menuSettings: {
        image: 'none',
        scheme: 'color-scheme-dark',
        position: 'menu-position-top',
        layout: 'menu-layout-full',
        style: 'color-style-default'
    },
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Hazards))
}, {
    icon: 'os-icon-pencil-2',
    path: '/hazards/:geoid',
    exact: true,
    name: 'Hazards 2',
    auth: false,
    mainNav: false,

    menuSettings: {
        image: 'none',
        scheme: 'color-scheme-dark',
        position: 'menu-position-top',
        layout: 'menu-layout-full',
        style: 'color-style-default'
    },
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Hazards))
}];

