import React, { Component } from 'react';

import AvlMap from 'components/AvlMap';


class Home extends Component {
  render () {
   return (
     <div>
     
      <AvlMap />





     </div>
    )
  }
}

export default {
	icon: 'os-icon-home',
	path: '/',
	exact: true,
	mainNav: true,
  menuSettings: {
    image: 'none',
    display: 'none',
    scheme: 'color-scheme-dark', 
    position: 'menu-position-left',
    layout: 'menu-layout-mini',
    style: 'color-style-default'  
  },
  name: 'Home',
	auth: false,
	component: Home
}