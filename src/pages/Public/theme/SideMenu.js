import React, { Component } from 'react';
import { Link, Element , Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
import {Link as Link2} from "react-router-dom";



import {
    sidebarScheme,
    sidebarStyle,
    sidebarColor,
    sidebarLayout
} 
from 'pages/Public/theme/components'

import get from 'lodash.get'
import styled from "styled-components"


class SideMenu extends React.Component {
   
    render(){
        console.log('this.props', this.props)
        let counter = 1;
        let baseURL = this.props.linkPath ? this.props.linkPath : '';
        return(
         <div style={{height: '100%', paddingTop: 20}} 
            className={`menu-w 
                color-scheme-${sidebarScheme} 
                color-style-${sidebarStyle} 
                menu-position-side 
                menu-side-left 
                menu-layout-${sidebarLayout} 
                sub-menu-style-inside
            `}>

            <ul className="main-menu">
                {
                    Object.keys(this.props.config)
                        .filter(section => this.props.config[section].filter(item => this.props.filterAdmin ? !item.onlyAdmin : true).length > 0)
                        .map((section,i) => {
                        return (
                            <React.Fragment key={i}>
                                <li className="sub-header"><span>{section}</span></li>
                                {
                                    this.props.config[section]
                                        .filter(f => this.props.filterAdmin ? !f.onlyAdmin : true )
                                        .map(item=>{
                                        counter += 1;
                                        return (
                                            <li key={item.title}>
                                                {this.props.linkToReq ?
                                                    <Link2 class={item.requirement === this.props.currReq ? 'selected' : ''} to={
                                                        this.props.linkToReq ? baseURL + item.requirement : baseURL + item.title
                                                    } spy={true} offset={-50} >
                                                        {item.icon ? (
                                                            <div className="icon-w">
                                                                <div className={`os-icon ${item.icon}`}></div>
                                                            </div>
                                                        ) : ''}
                                                        <span>{item.title}</span>
                                                    </Link2>
                                                :
                                                    <Link activeClass='selected' to={baseURL + item.title} spy={true} offset={-50} >
                                                        {item.icon ? (
                                                            <div className="icon-w">
                                                                <div className={`os-icon ${item.icon}`}></div>
                                                            </div>
                                                        ) : ''}
                                                        <span>{item.title}</span>
                                                    </Link>}
                                            </li>
                                        )
                                    })
                                }
                            </React.Fragment>
                
                        )
                    })
                } 
            </ul>

        </div>
        )

    }

}

export default SideMenu
