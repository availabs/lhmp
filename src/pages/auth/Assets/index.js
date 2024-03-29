import React from 'react'

import {reduxFalcor} from 'utils/redux-falcor'
import Element from 'components/light-admin/containers/Element'
import {connect} from "react-redux";
import {setActiveCousubid} from 'store/modules/user'
import {authProjects} from "../../../store/modules/user";
import get from "lodash.get";
import styled from 'styled-components'
import {header} from "./components/header"
import BuildingByLandUseConfig from 'pages/auth/Assets/components/BuildingByLandUseConfig.js'
import CriticalMeta from 'pages/auth/Assets/components/criticalFacilityMeta'
import BuildingByHazardRiskPieChart from "./components/BuildingByHazardRiskPieChart";
import BuildingByHazardRiskTable from "./components/BuildingByHazardRiskTable";
import AssetsFilteredTable from "./components/AssetsFilteredTable";
import MultiSelectFilter from 'components/filters/multi-select-filter.js'
import {RenderConfig} from 'pages/Public/theme/ElementFactory'
import config from 'pages/auth/Plan/config/guidance-config'

const HeaderSelect = styled.select`
{
    display: inline-block;
    padding: 0.375rem 0.75rem;
    padding-left: 0px;
    line-height: 1.5;
    background-color: transparent;
    background-clip: padding-box;
    border: none;
    color: #334152;
    border-radius: 2px;
    font-weight: 500;
    font-size: 1em;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}`;

//http://albany.localhost:3000/assets/list/:type/:typeIds/hazard/:hazardIds

class AssetsByTypeIndex extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            page: '',
            geoid: this.props.activeCousubid !== "undefined" ? this.props.activeCousubid : this.props.activeGeoid,
            ownerType: null,
            buildingByLandUse: null,
            filter: {
                domain: BuildingByLandUseConfig.filter((config) => parseInt(config.value) % 100 === 0 ? config : ''),
                value: []
            },
            criticalFilter: {
                domain: Object.keys(CriticalMeta).filter((config) => parseInt(config) % 100 === 0 ).map(config => ({value: config, name: CriticalMeta[config]})),
                value: []
            },
            height: '2565px'

        };

        this.handleChange = this.handleChange.bind(this);
        this.renderMenu = this.renderMenu.bind(this);
        this.handleMultiSelectFilterChange = this.handleMultiSelectFilterChange.bind(this)
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.activeCousubid !== prevProps.activeCousubid) {
            this.setState({geoid: this.props.activeCousubid !== "undefined" ? this.props.activeCousubid : this.props.activeGeoid})
        }
    }

    handleChange(e) {
        this.setState({...this.state, [e.target.id]: e.target.value});
    };

    handleMultiSelectFilterChange(type, value) {
        let newFilter = this.state[type];
        newFilter.value = value;
        this.setState({[type]: newFilter})
    }

    fetchFalcorDeps() {
        return this.props.falcor.get(
            ['geo', this.props.activeGeoid, ['name']],
            //['geo',this.props.activeGeoid,'cousubs'],
            ["geo", this.props.activeGeoid, 'counties', 'municipalities'],
            ['plan',[this.props.activePlan],'scenarios']
        )
            .then(response => {
                let scenarioIds = get(response, `json.plan.${this.props.activePlan}.scenarios`, null)

                if (scenarioIds){
                    this.setState({scenarioIds:
                            scenarioIds
                                .filter(f => f.name.includes('DFIRM'))
                                .map(f => f.id)})
                }else if(this.props.activeGeoid.length === 2){
                    this.setState({scenarioIds:
                            [   '3','4','9','10','38','12','14','15','16','40','18','19','41','43','22','44',
                                '23','24','25','26','46','28','29','47','30','49','31','52','20','27','17','33','34','13','32',
                                '42','36','35','53','54','55','56']
                    })
                }

                return this.props.falcor.get(
                    ['geo',
                        [this.props.activeGeoid, ...get(this.props.geoGraph, `${this.props.activeGeoid}.municipalities.value`, [])],
                        ['name']],                )
            })
    }

    renderMenu(caller) {
        let allowedGeos = [this.props.activeGeoid, ...get(this.props.geoGraph, `${this.props.activeGeoid}.municipalities.value`, [])];
        return header(caller, this.props.geoGraph, this.props.setActiveCousubid, this.props.activeCousubid, allowedGeos)
    }

    renderLandUseMenu(){
        return (
            <div>
                {JSON.stringify(this.state.filter.value)}
                <MultiSelectFilter
                    filter = {this.state.filter}
                    setFilter = {this.handleMultiSelectFilterChange.bind(this,'filter')}
                />
            </div>
        )
    }

    renderCriticalMenu(){
        return (
            <div>
                <MultiSelectFilter
                    filter = {this.state.criticalFilter}
                    setFilter = {this.handleMultiSelectFilterChange.bind(this, 'criticalFilter')}
                />
            </div>
        )
    }
    render() {
        return (
            <div className='container'>
                <Element>
                    {this.renderMenu('assets')}
                    <br/>
                    <div className="row">
                        <div className="col-12">
                            <div className='element-wrapper'>
                                <div className='element-box'>
                                    <h4>Buildings By Owner Type</h4>
                                    {this.state.geoid ?
                                        <AssetsFilteredTable
                                            geoid={[this.state.geoid]}
                                            groupBy={'ownerType'}
                                            groupByFilter={[]}
                                            scenarioId={this.state.scenarioIds}
                                            height={'fit-content'}
                                            width={'100%'}
                                            tableClass={`table table-sm table-lightborder table-hover`}
                                        />
                                        : ''
                                    }
                                </div>
                            </div>
                            <div className='element-wrapper'>
                                <div className='element-box'>
                                    {this.renderLandUseMenu()}
                                    <h4>Buildings By Land Use</h4>
                                    {
                                        this.state.geoid ?
                                            <AssetsFilteredTable
                                                geoid={[this.state.geoid]}
                                                groupBy={'propType'}
                                                groupByFilter={this.state.filter.value}
                                                scenarioId={this.state.scenarioIds}
                                                height={'fit-content'}
                                                width={'100%'}
                                                tableClass={`table table-sm table-lightborder table-hover`}
                                            />
                                            : ''
                                    }
                                </div>
                            </div>

                            <div className='element-wrapper'>
                                <div className='element-box'>
                                    {this.renderCriticalMenu()}
                                    <h4>Critical Infrastructure</h4>
                                    {
                                        this.state.geoid ?
                                            <AssetsFilteredTable
                                                geoid={[this.state.geoid]}
                                                groupBy={'critical'}
                                                groupByFilter={this.state.criticalFilter.value}
                                                scenarioId={this.state.scenarioIds}
                                                height={'fit-content'}
                                                width={'100%'}
                                                tableClass={`table table-sm table-lightborder table-hover`}
                                            />
                                            : ''
                                    }
                                </div>
                            </div>
                           
                        </div>
                    </div>
                </Element>
            </div>

        )

    }

}


const mapStateToProps = state => ({

    isAuthenticated: !!state.user.authed,
    activePlan: state.user.activePlan, // so componentWillReceiveProps will get called.
    geoGraph: get(state.graph, 'geo'),
    planGraph: get(state.graph, 'plan'),
    activeGeoid: state.user.activeGeoid,
    activeCousubid: state.user.activeCousubid,
});

const mapDispatchToProps = ({
    //sendSystemMessage
    authProjects,
    setActiveCousubid
});


export default [{
    icon: 'os-icon-pencil-2',
    path: '/assets/',
    exact: true,
    mainNav: true,
    breadcrumbs: [
        {name: 'Home', path: '/admin'},
        {name: 'Assets', path: '/assets'}
    ],
    menuSettings: {
        image: 'none',
        scheme: 'color-scheme-light',
        position: 'menu-position-left',
        layout: 'menu-layout-compact',
        style: 'color-style-default'
    },
    name: 'Assets',
    auth: true,
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(AssetsByTypeIndex))
}];