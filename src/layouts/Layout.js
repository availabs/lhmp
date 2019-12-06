import React from 'react';
import {Redirect, Route} from "react-router-dom";
// Layout Components
import Menu from 'components/light-admin/menu'
import BreadcrumbBar from 'components/light-admin/breadcrumb-bar'
import ContentContainer from 'components/light-admin/containers/ContentContainer'
import LoadingPage from "components/loading/loadingPage"
import CSS_CONFIG from 'pages/auth/css-config'


const DefaultLayout = ({component: Component, ...rest}) => {
    if (rest.isAuthenticating) {
        return (
            <Route {...rest} render={matchProps => (
                <div className="all-wrapper solid-bg-all">
                    <div className="layout-w">
                        <ContentContainer>
                            <LoadingPage message={`Loading ${rest.name}...`}/>
                        </ContentContainer>
                    </div>
                </div>
            )}/>
        )
    }

    //console.log('rest', rest);
    let contentStyle = {width: '100%'};
    if (rest.menuSettings.position === 'menu-position-side' || rest.menuSettings.position === 'menu-position-left') {
        contentStyle.marginLeft = CSS_CONFIG.mainMenuWidth;
        if (rest.menuSettings.layout === 'menu-layout-compact') {
            contentStyle.marginLeft = CSS_CONFIG.mainMenuWidth
        } else if (rest.menuSettings.layout === 'menu-layout-mini') {
            contentStyle.marginLeft = 60
        }
    }
    //console.log('rest: contentStyle', contentStyle)
    return checkAuth(rest) ?
        (
            <Redirect
                to={{
                    pathname: "/login", // if not authed
                    state: {from: rest.router.location}
                }}
            />
        )
        : (
            checkAuthPlan(rest) ?
                (
                    <Redirect
                        to={{
                            pathname: "/" , //default pages
                            state: {from: rest.router.location}
                        }}
                    />
                )
                : (
                    checkAuthPage(rest) ?
                        (
                            <Redirect
                                to={{
                                    pathname: rest.userAuthLevel === 0  ? "/" : "/admin", //default pages
                                    state: {from: rest.router.location}
                                }}
                            />
                        ) : (   // if authed
                            <Route {...rest} render={matchProps => (
                                <div className="layout-w" style={{minHeight: '100vh'}}>
                                    <Menu {...rest} />
                                    <div style={contentStyle}>
                                        <BreadcrumbBar layout={rest.breadcrumbs} match={rest.computedMatch}/>
                                        <ContentContainer>
                                            <Component {...matchProps} {...rest}/>
                                        </ContentContainer>
                                    </div>
                                </div>
                            )}/>)
                )
        )

};

function checkAuth(props) {
    //console.log('checkAuth', (props.auth && !props.authed), props)

    return (props.auth && !props.authed)
}

function checkAuthPage(props) {
    let authlevel = props.authLevel !== undefined ? props.authLevel : 1;
    //console.log('checkAuthPage', (props.auth && !(props.authed && props.userAuthLevel >= authlevel)), props)
    return (props.auth && !(props.authed && props.userAuthLevel >= authlevel))

}

function checkAuthPlan(props) {
    //console.log('checkAuthPlan', props.auth , props.user.activePlan , props);
    return ['Plans', 'Home'].includes(props.name) ? false :
    (props.auth && props.user.activePlan && !(props.user.activePlan && props.user.authedPlans.includes(props.user.activePlan.toString())))
}

export default DefaultLayout