import React, { Component } from 'react';
import { Link, Element , Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'



import get from 'lodash.get'
import styled from "styled-components"


class SideMenu extends React.Component {
   
    render(){
        return(
         <div style={{height: '100%', paddingTop: 20}} 
            className="menu-w 
                selected-menu-color-dark 
                menu-has-selected-link 
                menu-activated-on-click 
                color-scheme-transparent 
                color-style-transparent 
                sub-menu-color-light 
                menu-position-side 
                menu-side-left 
                menu-layout-full 
                sub-menu-style-inside">
            {/*
            <div className="element-search autosuggest-search-activator">
                <input placeholder="Start typing to search..." type="text" />
            </div>
            */}
            <ul className="main-menu">
                {
                    this.props.config.map(section => {
                        return (
                            <React.Fragment>
                                <li className="sub-header"><span>{section.label}</span></li>
                                {
                                    section.items.map(item=>{
                                        return (
                                            <li >
                                                <Link activeClass='active' to={item.name}>
                                                    <div className="icon-w">
                                                        <div className={`os-icon ${item.icon}`}></div>
                                                    </div>
                                                    <span>{item.name}</span>
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
