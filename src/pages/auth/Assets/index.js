import React from 'react'
import { Link } from 'react-router-dom'

import { reduxFalcor } from 'utils/redux-falcor'
import Element from 'components/light-admin/containers/Element'
import AssetsTable from 'pages/auth/Assets/components/AssetsTable'
import {connect} from "react-redux";
import {authProjects} from "../../../store/modules/user";
import get from "lodash.get";
import styled from 'styled-components'

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

class AssetsIndex extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      page: '',
      geoid: null,
    }
    this.handleChange = this.handleChange.bind(this)
    this.renderMenu = this.renderMenu.bind(this)
  }

  handleChange(e) {
    console.log('---',e.target.id,e.target.value)
    this.setState({...this.state,[e.target.id]: e.target.value});
  };

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
    let countyValue = [];

    if(this.props.data !== undefined){
      Object.keys(this.props.data).forEach((item)=>
      {
        if(item.length === 5){
          countyName = this.props.data[item].name;
          countyValue.push(item);
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
                <option key={ac_i+1} value={ac}>{cousubsName[ac_i]}</option>
            )
          })}
        </HeaderSelect>
    )

  }

  render () {
    return (
      <div className='container'>
        <Element>

          <div className='content-i'>
            <div className='content-box'>
              <h4 className="element-header">Assets For {this.renderMenu()}</h4>
                      <div className="row">
                        <div className="col-md-8">
                        {this.state.geoid}
                        {this.state.geoid
                            ? <AssetsTable geoid={[this.state.geoid]}/>
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

//send the county to assets table so that the data is displayed in the table initially


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
  path: '/assets',
  exact: true,
  mainNav: true,
  breadcrumbs: [
    { name: 'Home', path: '/' },
    { name: 'Assets', path: '/assets/' }
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
  component: connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(AssetsIndex))
}];

//{this.state.geoid}
//
