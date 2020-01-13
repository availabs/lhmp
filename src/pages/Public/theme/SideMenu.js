import React, { Component } from 'react';
import { Link, Element , Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'



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
            {/*
            <div className="element-search autosuggest-search-activator">
                <input placeholder="Start typing to search..." type="text" />
            </div>
            */}
            <ul className="main-menu">
                {
                    Object.keys(this.props.config).map((section,i) => {
                        return (
                            <React.Fragment key={i}>
                                <li className="sub-header"><span>{section}</span></li>
                                {
                                    this.props.config[section].map(item=>{
                                        return (
                                            <li key={item.title}>
                                                <Link activeClass='selected' to={item.title} spy={true} offset={-50} >
                                                    {item.icon ? (
                                                        <div className="icon-w">
                                                            <div className={`os-icon ${item.icon}`}></div>
                                                        </div>
                                                    ) : ''}
                                                    <span>{item.title}</span>
                                                </Link>
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
