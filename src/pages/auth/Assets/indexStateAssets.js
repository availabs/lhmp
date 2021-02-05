import React, {Fragment} from 'react'
import { Link } from 'react-router-dom'

import { reduxFalcor } from 'utils/redux-falcor'
import Element from 'components/light-admin/containers/Element'
import ElementBox from 'components/light-admin/containers/ElementBox'
import {connect} from "react-redux";
import {authProjects, setActiveCousubid} from "../../../store/modules/user";
import get from "lodash.get";
import {GeoDropdown} from 'pages/auth/Plan/functions'

import styled from 'styled-components'
import {asyncContainer, Typeahead} from 'react-bootstrap-typeahead';
//import 'react-bootstrap-typeahead/css/Typeahead.css';
import AssetsTable from 'pages/auth/Assets/components/AssetsTable'
import BuildingByLandUseConfig from 'pages/auth/Assets/components/BuildingByLandUseConfig.js'
import MultiSelectFilter from 'components/filters/multi-select-filter.js'
import {header} from "./components/header";
import AssetsFilteredTable from "./components/AssetsFilteredTable";

const AsyncTypeahead = asyncContainer(Typeahead);
const buildingOwnerType = [
    {
        'id':'1',
        'value':'Federal'
    },
    {
        'id':'2',
        'value':'State'
    },
    {
        'id':'3',
        'value':'County'
    },
    {
        'id':'4',
        'value':'City'
    },
    {
        'id':'5',
        'value':'Town'
    },
    {
        'id':'6',
        'value':'Village'
    },
    {
        'id':'7',
        'value':'Mixed Government'
    },
    {
        'id':'8',
        'value':'Private'
    },
    {
        'id':'9',
        'value':'Public School District or BOCES'
    },
    {
        'id':'10',
        'value':'Road Right of Way'
    },
    {
        'id':'-999',
        'value':'Unknown'
    }
];

class AssetsBySearch extends React.Component {

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

    handleMultiSelectFilterChange(e) {
        let newFilter = this.state.filter;
        newFilter.value = e;
        this.setState({filter: newFilter})
    }

    fetchFalcorDeps() {
        return this.props.falcor.get(
            ['geo', this.props.activeGeoid, ['name']],
            //['geo',this.props.activeGeoid,'cousubs'],
            ["geo", this.props.activeGeoid, 'counties', 'municipalities'],
            ['plan',[this.props.activePlan],'scenarios']
        )
            .then(response => {
                if(get(response, `json.plan.${this.props.activePlan}.scenarios`, [])){
                    this.setState({scenarioIds:
                            get(response, `json.plan.${this.props.activePlan}.scenarios`, [])
                                .filter(f => f.name.includes('DFIRM'))
                                .map(f => f.id)})
                }else if (this.props.activeGeoid.length === 2){
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
                    setFilter = {this.handleMultiSelectFilterChange}
                />
            </div>
        )
    }
    render() {
        return (
            <div className='container'>
                <Element>
                    {this.renderMenu('state')}
                    <br/>
                    <div className="row">
                        <div className="col-12">

                            <div className='element-wrapper'>
                                <div className='element-box'>
                                    <h4>State Buildings</h4>
                                    {
                                        this.state.geoid ?
                                            <AssetsFilteredTable
                                                geoid={Object.keys(get(this.props, `allGeo`, {}))
                                                    .filter(geo => this.props.activeGeoid.length === 5 && geo.length === 10 ||
                                                        this.props.activeGeoid.length === 2 && geo.length === 5)}
                                                groupBy={'state'}
                                                filterData={{'owner_type': [2]}}
                                                scenarioId={this.state.scenarioIds}
                                                height={'fit-content'}
                                                width={'100%'}
                                                tableClass={`table table-sm table-lightborder table-hover`}
                                            />
                                            : ''
                                    }
                                </div>

                                <div className='element-box'>
                                    <h4>Buildings by Agency</h4>
                                    {
                                        this.state.geoid ?
                                            <AssetsFilteredTable
                                                geoid={Object.keys(get(this.props, `allGeo`, {}))
                                                    .filter(geo => this.props.activeGeoid.length === 5 && geo.length === 10 ||
                                                        this.props.activeGeoid.length === 2 && geo.length === 5)}
                                                groupBy={'agency'}
                                                filterData={{'owner_type': [2]}}
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
    allGeo: state.geo.allGeos,
});

const mapDispatchToProps = ({
    //sendSystemMessage
    authProjects,
    setActiveCousubid
});


export default [{
    icon: 'os-icon-pencil-2',
    path: '/assets/state',
    exact: true,
    mainNav: false,
    breadcrumbs: [
        { name: 'Home', path: '/admin' },
        { name: 'Assets', path: '/assets' }
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
    component: connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(AssetsBySearch))
}];