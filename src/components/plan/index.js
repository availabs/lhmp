import React, { Component } from 'react';
import { connect } from 'react-redux';
import Element from 'components/light-admin/containers/Element'
import styled from "styled-components";
import PlanHeader from 'components/plan/planHeader.js'
class PlanIndex extends Component{
    render(){
        return (
            <div>
                <Element>
                    <PlanHeader planId = {['1']}></PlanHeader>
                </Element>
            </div>
        )
    }
}

export default {
    path: '/planHeader/',
    exact: false,
    name: 'Plans',
    auth: true,
    mainNav: false,
    menuSettings: {
        image: 'none',
        scheme: 'color-scheme-dark',
        position: 'menu-position-left',
        layout: 'menu-layout-compact',
        style: 'color-style-default'
    },
    component: PlanIndex
}