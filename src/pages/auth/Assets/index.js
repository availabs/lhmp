import React from 'react'
import { Link } from 'react-router-dom'

import { reduxFalcor } from 'utils/redux-falcor'
import Element from 'components/light-admin/containers/Element'
import AssetsTable from 'pages/auth/Assets/components/AssetsTable'
import {connect} from "react-redux";
import {authProjects} from "../../../store/modules/user";
import get from "lodash.get";
import styled from 'styled-components'
import AssetsPieChart from 'pages/auth/Assets/components/AssetsPieChart'
import BuildingByOwnerTypeTable from 'pages/auth/Assets/components/BuildingByOwnerTypeTable'
import BuildingByLandUseConfig from 'pages/auth/Assets/components/BuildingByLandUseConfig.js'
import MultiSelectFilter from 'components/filters/multi-select-filter.js'
import BuildingByLandUsePieChart from 'pages/auth/Assets/components/BuildingByLandUsePieChart'
import BuildingByLandUseTable from 'pages/auth/Assets/components/BuildingByLandUseTable'
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
}`
let countyValue = [];
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

class AssetsIndex extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      page: '',
      geoid: null,
      ownerType: null,
      buildingByLandUse: null,
      filter: {
        domain: BuildingByLandUseConfig.filter((config) => parseInt(config.value) % 100 === 0 ? config : ''),
        value: []
      }

    }

    this.handleChange = this.handleChange.bind(this);
    this.renderMenu = this.renderMenu.bind(this);
    this.renderOwnerTypeMenu = this.renderOwnerTypeMenu.bind(this);
    this.renderLandUseMenu = this.renderLandUseMenu.bind(this)
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

  componentDidUpdate(prevProps,oldState){
    if(this.props.activePlan && !this.state.geoid){
      return this.props.falcor.get(['plans','county','byId',[this.props.activePlan],'fips'])
        .then(response => {
          return response.json.plans.county.byId[this.props.activePlan].fips
        }).then(fips => {
            return this.props.falcor.get(['geo',[fips],'cousubs'],['geo',[fips],['name']])
                .then(response => response.json.geo[fips].cousubs)
                .then(cousubs => this.props.falcor.get(['geo',cousubs,['name']]))
                .then(res => {
                  this.setState({
                    geoid : fips
                  })
                  return res
                })
          })
    }

  }

  renderMenu() {
    let arrayCosubs = [];
    let countyName = '';
    let cousubsName = [];
    if(this.props.data !== undefined){
      Object.keys(this.props.data).forEach((item)=>
      {
        if(item.length === 5){
          countyName = this.props.data[item].name;
          countyValue.indexOf(item) === -1 ? countyValue.push(item) : console.log("This item already exists");
          this.props.data[item].cousubs.value.forEach(cousub => arrayCosubs.push(cousub))
        }
        else{
          cousubsName.push(this.props.data[item].name)
        }

      });
    }

    return (
        <HeaderSelect
                id='geoid' onChange={this.handleChange}
                value={this.state.geoid}>
          {countyValue.map((county,i) =>{
            return(
                <option key={i} value={county}>{countyName}</option>
            )
          })}

          {arrayCosubs.map((ac,ac_i) => {
            return (
                <option key={ac_i+2} value={ac}>{cousubsName[ac_i]}</option>
            )
          })}
        </HeaderSelect>
    )

  }

  renderOwnerTypeMenu(){
    return(
        <div>
          <select id='owner' onChange={this.handleChange} value={this.state.ownerType}>
          <option default>--Select Owner Type--</option>
          {
            buildingOwnerType.map((owner) =>{
                return(
                    <option key={owner.id} value={owner.value}>{owner.value}</option>
                )
            })
          }
          </select>
        </div>
    )

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

  render () {
    return (
      <div className='container'>
            <Element>
              <div className='content-i'>
                <div className='content-box'>
                  <h4 className="element-header">Assets For {this.renderMenu()}</h4>
                  <div className="os-tabs-w mx-4">
                    <div className="os-tabs-controls">
                      <ul className="nav nav-tabs upper">
                        <li className="nav-item">
                          <a aria-expanded="false" className="nav-link" data-toggle="tab" href="#">ALL</a>
                        </li>
                        <li className="nav-item">
                          <a aria-expanded="false" className="nav-link" data-toggle="tab" href="#">Critical Infrastructure</a>
                        </li>
                        <li className="nav-item">
                          <a aria-expanded="false" className="nav-link" data-toggle="tab" href="#">Municipal</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 col-xxxl-8">
                      <div className='element-wrapper'>
                        <div className='element-box'>
                      {this.state.geoid}
                          {this.state.geoid //filters={[this.props.filter]}
                              ? <AssetsTable geoid={[this.state.geoid]}/>
                              : ''
                          }
                        </div>
                      </div>
                    </div>
                    <div className='col-sm-6 d-xxl-16'>
                      <div className='element-wrapper'>
                        <div className='element-box'>
                        <h4>Buildings By Owner Type</h4>
                        {this.renderOwnerTypeMenu()}
                          {this.state.geoid ?
                            <AssetsPieChart geoid={[this.state.geoid]} replacement_value={true}/>
                            :''
                          }
                          {this.state.geoid ?
                            <BuildingByOwnerTypeTable geoid={[this.state.geoid]} buildingType={true}/>
                            : ''
                          }
                      </div>
                      </div>
                      <div className='element-wrapper'>
                        <div className='element-box'>
                          <h4>Buildings By Land Use</h4>
                          {this.renderLandUseMenu()}
                          {
                            this.state.geoid ?
                            <BuildingByLandUsePieChart geoid={[this.state.geoid]}/>
                            : ''
                          }
                          {
                            this.state.geoid ?
                            <BuildingByLandUseTable geoid={[this.state.geoid]} filters={this.state.filter.value}/>
                            : ''
                          }
                        </div>
                      </div>
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
  data: get(state.graph,'geo')
});

const mapDispatchToProps = ({
  //sendSystemMessage
  authProjects
});


export default [{
  icon: 'os-icon-pencil-2',
  path: '/assets/',
  exact: true,
  mainNav: true,
  menuSettings: {
    image: 'none',
    scheme: 'color-scheme-light',
    position: 'menu-position-left',
    layout: 'menu-layout-compact',
    style: 'color-style-default'
  },
  name: 'Assets',
  auth: true,
  component: connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(AssetsIndex))
}];

