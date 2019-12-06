import React, {Component} from 'react'
import MainMenu from './MainMenu'
import {falcorGraph} from "store/falcorGraph";
import geoDropdown from 'pages/auth/Plan/functions'
import {AvatarUser, LoginMenu, Logo} from './TopMenu'
import {connect} from "react-redux";
import { reduxFalcor } from 'utils/redux-falcor'
import {setActiveCousubid} from 'store/modules/user'
import get from 'lodash.get'
import styled from "styled-components";
// import './menu.css'

class Menu extends Component {
    fetchFalcorDeps() {
        if (!this.props.activeGeoid) return Promise.resolve();
        return this.props.falcor.get(
            ['geo', this.props.activeGeoid, 'cousubs']
        )
            .then(response => {
                return this.props.falcor.get(
                    ['geo', [this.props.activeGeoid, ...falcorGraph.getCache().geo[this.props.activeGeoid].cousubs.value], ['name']],
                )
            })
    }
    render() {
        if (this.props.menuSettings.hide) return null;
        let geoInfo = get(falcorGraph.getCache(), `geo`, null)
        let allowedGeos = [this.props.activeGeoid, ...get(geoInfo,`${this.props.activeGeoid}.cousubs.value`, [])];
        let currentPath = this.props.menus.filter(p => p.path === this.props.path)[0];


        // let title = currentPath[0] ? currentPath[0].name : ''
        let defaultOptions = {
            'location': 'menu-w',
            'color': 'selected-menu-color-light',
            'click': 'menu-activated-on-click',
            'selected': 'menu-has-selected-link',
            'image': this.props.menuSettings.image ? this.props.menuSettings.image : 'menu-with-image',
            'scheme': this.props.menuSettings.scheme ? this.props.menuSettings.scheme : 'color-scheme-dark',
            'style': this.props.menuSettings.style ? this.props.menuSettings.style : 'color-style-transparent',
            'submenucolor': 'sub-menu-color-light',
            'position': this.props.menuSettings.position ? this.props.menuSettings.position : 'menu-position-top',
            'layout': this.props.menuSettings.layout ? this.props.menuSettings.layout : 'menu-layout-full',
            'subemenustyle': 'sub-menu-style-inside'
        };
        /*
         menu-activated-on-click sub-menu-style-inside
         menu-activated-on-hover sub-menu-style-flyout
        * */
        let displayOptions = Object.values(defaultOptions).join(' ');

        defaultOptions.position === 'menu-position-left'
            ? document.body.classList.add('menu-position-side')
            : document.body.classList.remove('menu-position-side');

        let dynamicStyle = {
            marginBottom: currentPath.subMenus ? 50 : 0,
            position: 'fixed',
            zIndex: 100
        };

        defaultOptions.position === 'menu-position-top' ?
            dynamicStyle['width'] = '100vw' : dynamicStyle['height'] = '100vh';

        const DROPDOWN = defaultOptions.scheme === 'color-scheme-dark' ? styled.div`
                        div > select {
                        color: #ccc;
                        border: none;
                        }
                    ` : styled.div``;
            // console.log('menuProps', currentPath, dynamicStyle)
        let userMenu = this.props.user && !!this.props.user.authed
            ? <AvatarUser user={this.props.user}/>
            : <LoginMenu/>;

        return (

            <div className={displayOptions} style={dynamicStyle}>
                <Logo/>
				{userMenu}
				<h1 className="menu-page-header">{this.props.title}</h1>
                <MainMenu {...this.props} />
                {!this.props.auth ?
                    <DROPDOWN>
                        {geoDropdown.geoDropdown(this.props.geoGraph,this.props.setActiveCousubid, this.props.activeCousubid,allowedGeos)}
                    </DROPDOWN>
                : ''}
            </div>

        )
    }
}
const mapStateToProps = (state,ownProps) => {
    return {
        geoGraph: state.graph.geo,
        router: state.router,
        activeGeoid: state.user.activeGeoid,
        activeCousubid: state.user.activeCousubid,
    };
};

const mapDispatchToProps = {setActiveCousubid};
export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Menu))