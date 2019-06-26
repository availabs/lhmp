import React from 'react';
import { Route, Redirect } from "react-router-dom";

// Layout Components
import Menu from 'components/light-admin/menu'
import BreadcrumbBar from 'components/light-admin/breadcrumb-bar'
import ContentContainer from 'components/light-admin/containers/ContentContainer'
import LoadingPage from "components/loading/loadingPage"

const DefaultLayout = ({component: Component, ...rest}) => {
  
  if ( rest.isAuthenticating ) { 
    return (
      <Route {...rest} render={matchProps => (
        <div className="all-wrapper solid-bg-all">
          <div className="layout-w">
            <ContentContainer>
              <LoadingPage message={'Loading Plans...'}/>
            </ContentContainer>
          </div>
        </div>
      )} />
    )
  }

  console.log('rest', rest)
  let contentStyle = {width: '100%'}
  if (rest.menuSettings.position === 'menu-position-side') {
    contentStyle.marginLeft = 260
    if(rest.menuSettings.layout === 'menu-layout-compact') {
      contentStyle.marginLeft = 160
    } else if(rest.menuSettings.layout === 'menu-layout-mini') {
      contentStyle.marginLeft = 60
    }
  } 
  
  return checkAuth(rest) ?
  (
    <Redirect
      to={{
        pathname: "/login",
        state: { from: rest.router.location }
      }}
    />
  ) : (
    <Route {...rest} render={matchProps => (
      <div className="layout-w" style={{ minHeight: '100vh' }}>
        <Menu {...rest} />
        <div style={contentStyle}>
          <BreadcrumbBar layout={rest.breadcrumbs} match={rest.computedMatch}/>
          <ContentContainer>
            <Component {...matchProps} {...rest}/>
          </ContentContainer>
        </div>
      </div>  
    )} />
  )
}

function checkAuth (props) {
  console.log('checkAuth', props.auth, props.authed, props.auth && !props.authed,  props)
  return (props.auth && !props.authed)
}

export default DefaultLayout