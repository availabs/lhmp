import React from 'react';
import {Redirect, Route} from "react-router-dom";
// Layout Components
import Menu from 'components/light-admin/menu'
import BreadcrumbBar from 'components/light-admin/breadcrumb-bar'
import ContentContainer from 'components/light-admin/containers/ContentContainer'
import LoadingPage from "components/loading/loadingPage"
import CSS_CONFIG from 'pages/auth/css-config'
import get from 'lodash.get'


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
    // console.log('rest', rest);
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
    // console.log('rest: contentStyle', contentStyle)
    return (
            checkAuth(rest) ?
                (   // if authed
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
                    )}/>
                ) :
                (
                    <Redirect
                        to={{
                            pathname: rest.userAuthLevel === 0  ? "/" : "/admin", //default pages
                            state: {from: rest.router.location}
                        }}
                    />
                )
                
    )

};


function checkAuth(props) {
    if(!props.auth && !props.authLevel) {
        return true // page doesn't require auth
    }
    // the page is authed to default authLevel to 1
    let authLevel = props.authLevel !== undefined ? props.authLevel : 1;
    
    if(authLevel <= props.userAuthLevel && props.userAuthLevel > 5 ){
        return true // user has auth and is admin so don't check plan
    }
    let activePlan = get(props, 'user.activePlan','xxx')
    let authedPlans = get(props, 'user.authedPlans',[])
    if(authedPlans.includes(activePlan.toString())) {
        // if user is authed for this plan
        if(authLevel <= props.userAuthLevel){
            // the user auth is <= authLevel (which defaults to 1)
            return true
        }
    }
    return false

}


export default DefaultLayout