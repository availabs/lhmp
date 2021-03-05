import React, {Fragment} from 'react'
import { Link } from 'react-router-dom'

import { reduxFalcor } from 'utils/redux-falcor'
import Element from 'components/light-admin/containers/Element'
import ElementBox from 'components/light-admin/containers/ElementBox'
import {connect} from "react-redux";
import {authProjects} from "../../../store/modules/user";
import get from "lodash.get";
import {GeoDropdown} from 'pages/auth/Plan/functions'

import styled from 'styled-components'
import {asyncContainer, Typeahead} from 'react-bootstrap-typeahead';
//import 'react-bootstrap-typeahead/css/Typeahead.css';
import AssetsTable from 'pages/auth/Assets/components/AssetsTable'
import BuildingByLandUseConfig from 'pages/auth/Assets/components/BuildingByLandUseConfig.js'
import MultiSelectFilter from 'components/filters/multi-select-filter.js'
import {header} from "./components/header";

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

    constructor (props) {
        super(props)
        this.state = {
            page: '',
            geoid: this.props.activeGeoid,
            owner_type:'no_owner',
            land_use_category: 'no_prop',
            filter: {
                domain: {},
                value: []
            },
            risk:'no_risk',
            height: '2565px'

        }

        this.handleChange = this.handleChange.bind(this);
        this.renderFilterMenu = this.renderFilterMenu.bind(this);
        this.renderLandUseTypeMenu = this.renderLandUseTypeMenu.bind(this)
        this.handleMultiSelectFilterChange = this.handleMultiSelectFilterChange.bind(this)

    }

    handleChange(e) {
        console.log('---',e.target.id,e.target.value)
        this.setState({...this.state,[e.target.id]: e.target.value});
    };

    handleMultiSelectFilterChange(e){
        let newFilter = this.state.filter
        newFilter.value = e;
        this.setState({filter:newFilter})
    }

    fetchFalcorDeps(){
        return this.props.falcor.get(["geo", this.props.activeGeoid, 'municipalities'])
            .then(response  => {
                return this.props.falcor.get(
                    ['geo', [this.props.activeGeoid, ...get(this.props.falcor.getCache() ,`geo.${this.props.activeGeoid}.municipalities.value`, [])], ['name']],
                )
            })
    }

    renderLandUseTypeMenu(event){
        let land_use_category = event.target.value
        if(land_use_category !== "None"){
            this.setState({
                filter : {
                    value : [],
                    domain : BuildingByLandUseConfig.filter((config) => config.value.slice(0,1) === land_use_category.slice(0,1) && config.value % 100 !== 0? config : '')
                }
            })

        }

    }

    renderFilterMenu() {
        let county = [];
        let cousubs = [];

        return (
            <div>
                <div>
                    <h6>Geography</h6>
                    <GeoDropdown
                        className="form-control justify-content-sm-end"
                        id='geoid'
                        value={this.state.geoid}
                        onChange={this.handleChange}
                        pureElement={true}
                    />
                </div>
                <br/>
                <div>
                    <h6>Owner Type</h6>
                    <select className="form-control justify-content-sm-end" id='owner_type' onChange={this.handleChange} value={this.state.owner_type}>
                        <option className="form-control" key={0} value="no_owner">No Owner selected</option>
                        {
                            buildingOwnerType.map((owner) =>{
                                return(
                                    <option className="form-control" key={owner.id} value={owner.id}>{owner.value}</option>
                                )
                            })
                        }
                    </select>
                </div>
                <br/>
                <div>
                    <h6>Land Use Category</h6>
                    <select className="form-control justify-content-sm-end" id='land_use_category' onChange={this.handleChange}
                            value={this.state.land_use_category} onClick={this.renderLandUseTypeMenu}>
                        <option className="form-control" key={0} value="no_prop">No Land Use Category selected</option>
                        {
                            BuildingByLandUseConfig.map((config) => {
                                if(parseInt(config.value) % 100 === 0){
                                    return (
                                        <option className="form-control" key={config.value} value={config.value}>{config.name}</option>
                                    )
                                }
                            })
                        }
                    </select>
                    <br/>
                    {
                        this.state.filter.domain.length ?
                        <div>
                        <h6>Land Use Type</h6>
                            {JSON.stringify(this.state.filter.value)}
                            <MultiSelectFilter
                            filter = {this.state.filter}
                            setFilter = {this.handleMultiSelectFilterChange}
                            />
                        </div>
                       :
                       null
                    }
                </div>
                <br/>
                <div>
                    <h6>Risk</h6>
                    <select className="form-control justify-content-sm-end" id='risk' onChange={this.handleChange}
                            value={this.state.risk}>
                        <option className="form-control" key={0} value="no_risk">No Risk selected</option>
                        <option className="form-control" key={1} value="flood_100">100-year Flood Zone</option>
                        <option className="form-control" key={2} value="flood_500">500-year Flood Zone</option>
                        <option className="form-control" key={3} value="loss">Expected Annual Flood Loss</option>
                    </select>
                </div>
            </div>


        )

    }

    render () {
        return (
            <Element>
                <div className='container'>
                    <div className={'row'}>
                        <div className={'col-12'}>
                            {header('search')}
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className={'col-3'}>
                            <ElementBox
                                title = {'Filters'}
                                desc = {this.renderFilterMenu()}
                            />
                        </div>
                        <div className={'col-9'}>
                            <AssetsTable geoid={[this.state.geoid]}
                                         owner_type={[this.state.owner_type]}
                                         land_use_category={[this.state.land_use_category]}
                                         filters={[this.state.filter.value]}
                                         risk={[this.state.risk]}
                                         num_results = {[10]}
                                         showControls={false}
                            />
                        </div>
                    </div>
                </div>
            </Element>

        )

    }

}


const mapStateToProps = state => ({

    isAuthenticated: !!state.user.authed,
    activePlan: state.user.activePlan, // so componentWillReceiveProps will get called.
    geoidData: get(state.graph,'geo'),
    activeGeoid: state.user.activeGeoid
});

const mapDispatchToProps = ({
    //sendSystemMessage
    authProjects
});


export default [{
    icon: 'os-icon-pencil-2',
    path: '/assets/search',
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