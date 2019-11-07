import React from 'react'
import { Link } from 'react-router-dom'

import { reduxFalcor } from 'utils/redux-falcor'
import Element from 'components/light-admin/containers/Element'
import {connect} from "react-redux";
import {authProjects} from "../../../store/modules/user";
import get from "lodash.get";
import styled from 'styled-components'
import AssetsPagePropTypeEditor from 'components/displayComponents/assetsPagePropTypeEditor'
import AssetsPageOwnerTypeEditor from 'components/displayComponents/assetsPageOwnerTypeEditor'
import AssetsPageCriticalTypeEditor from 'components/displayComponents/assetsPageCriticalTypeEditor'
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
      geoid: this.props.activeGeoid,
      height: '2565px'

    }

    this.handleChange = this.handleChange.bind(this);
    this.renderMenu = this.renderMenu.bind(this);
  }

  handleChange(e) {
    console.log('---',e.target.id,e.target.value)
    this.setState({...this.state,[e.target.id]: e.target.value});
  };

  fetchFalcorDeps(){
    return this.props.falcor.get(
        ['geo',this.props.activeGeoid,['name']],
        ['geo',this.props.activeGeoid,'cousubs'],
        )
        .then(response  => {
          return this.props.falcor.get(["geo",response.json.geo[this.props.activeGeoid].cousubs,["name"]])
        })


  }
  renderMenu() {
    let county = [];
    let cousubs = [];
    if(this.props.geoidData !== undefined){
      Object.keys(this.props.geoidData).forEach((item,i)=>
      {
        if (i === 0){
          county.push({
            name : this.props.geoidData[this.props.activeGeoid].name,
            value : item
          })
        }else{
          cousubs.push({
            name : this.props.geoidData[item].name,
            value : item
          })
        }

      })

    }
    return (
        <HeaderSelect
            id='geoid' onChange={this.handleChange}
            value={this.state.geoid}>
          {county.map((d,i) =>{
            return(
                <option key={i} value={d.value}>{d.name}</option>
            )
          })}

          {cousubs.map((ac,ac_i) => {
            return (
                <option key={ac_i+2} value={ac.value}>{ac.name}</option>
            )
          })}
        </HeaderSelect>
    )

  }



  render () {
    console.log('params',this.props.match)
    return (
        <div className='container'>
          <Element>
            <div>
            <ul className="nav nav-tabs upper">
              <li className="nav-item"><a aria-expanded="false" className="nav-link" data-toggle="tab"
                                          href="/assets">Overview</a></li>
              <li className="nav-item"><a aria-expanded="false" className="nav-link" data-toggle="tab"
                                          href="/assets/byType">By Type</a></li>
              <li className="nav-item"><a aria-expanded="false" className="nav-link" data-toggle="tab"
                                          href="/assets/search">Search</a></li>
            </ul>
            </div>
            <br/>
            <div>
              <h4 className="element-header">Assets For {this.renderMenu()}</h4>
              <div className="row">
              <div className="col-12">
              {this.state.geoid ?
                  <AssetsPagePropTypeEditor filter_type={'propType'} filter_value={['210', '220','283']} geoid={[this.state.geoid]}/>
                  :''
              }
              {this.state.geoid ?
                  <AssetsPageOwnerTypeEditor filter_type={'ownerType'} filter_value={['2']} geoid={[this.state.geoid]} title={'State owned Assets'}/>
                  :''
              }
              {this.state.geoid ?
                  <AssetsPageOwnerTypeEditor filter_type={'ownerType'} filter_value={['3']} geoid={[this.state.geoid]} title={'County owned Assets'}/>
                  :''
              }
              {this.state.geoid ?
                  <AssetsPageOwnerTypeEditor filter_type={'ownerType'} filter_value={['4','5','6','7']} geoid={[this.state.geoid]} title={'Municipality Owned Assets'}/>
                  :''
              }
              {this.state.geoid ?
                  <AssetsPageCriticalTypeEditor filter_type={'critical'} filter_value={['all']} geoid={[this.state.geoid]} title={'Critical Infrastructure'}/>
                  :''
              }
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
  geoidData: get(state.graph,'geo'),
  activeGeoid: state.user.activeGeoid
});

const mapDispatchToProps = ({
  //sendSystemMessage
  authProjects
});


export default [{
  icon: 'os-icon-pencil-2',
  path: '/assets',
  exact: true,
  mainNav: false,
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
}


];