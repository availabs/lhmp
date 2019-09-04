import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class MainMenu extends Component {
  constructor(props) {
    super(props);
    this.menuMouseOut = this.menuMouseOut.bind(this)
    this.renderMenus = this.renderMenus.bind(this)
  }  
  
  renderMenus (menus) {
    return menus
      .filter(menu => menu.mainNav)
      .filter(menu => !menu.auth || this.props.authed)
      .map((menu, index) => {
        // console.log(menu.path.split('/'), this.props.path.split('/'))
        let topMenu = menu.path ? menu.path.split('/')[1] : ''
        let currentTop = this.props.path ? this.props.path.split('/')[1] : ' ' 
        let isActive = topMenu === currentTop
          ? 'active selected'
          : ''
        // console.log('isActive', isActive)
        if (!menu.subMenus) {
        return (
          <li
            key={'menuItem_' + index}
            id={'menuItem_' + index}
            className={`top-menu-tab ${isActive}`}
            name={menu.path} 
            onMouseOver={this.menuMouseOver}
            onMouseOut={this.menuMouseOut}
          >
            <Link to={menu.path}>
              <div className="icon-w">
                <i
                  className={
                    (menu.class ? menu.class : 'os-icon') + ' ' + menu.icon
                  }
                />
              </div>
              <span>{menu.name}</span>
            </Link>
          </li>
        );
      }
      return (
        <li
          key={'menuItem_' + index}
          className={`top-menu-tab has-sub-menu ${isActive}`} 
          id={'menuItem_' + index}
          onClick={this.menuClick}
          //onMouseOut={this.menuMouseOut}
        >
          <Link to='#'>
            <div className="icon-w">
                <div className="os-icon os-icon-layers"></div>
            </div>
            <span>{menu.name}</span>
          </Link>
          <div className="sub-menu-w">
            <div className="sub-menu-header">{menu.name}</div>
            <div className="sub-menu-icon">
              <i className="os-icon os-icon-window-content" />
            </div>
            <div
              className="sub-menu-i"
              onClick={this.menuClick}
              //onMouseOut={this.menuMouseOut}
            >
              {menu.subMenus.map((subMenu, sindex) => {
                return (
                  <ul
                    className="sub-menu"
                    key={'subMenu_' + sindex}
                    id={'subMenu_' + index}
                  >
                    {subMenu.map((item, ssindex) => {
                      return (
                        <li key={ssindex}>
                          <Link to={item.path}>{item.name}</Link>
                        </li>
                      );
                    })}
                  </ul>
                );
              })}
            </div>
          </div>
        </li>
      )
    })
  }
  
  menuClick (event) {
   if (event.target.closest('.top-menu-tab').classList.value.indexOf('active') === -1) {
     event.target.closest('.top-menu-tab').classList.add('active');
   }else{
     event.target.closest('.top-menu-tab').classList.remove('active');
   }
    // Get all submenu
    let links = document.querySelectorAll('.top-menu-tab');

    // Loop through each
    for (let i = 0; i < links.length; i++) {
      // If the link is the one clicked, skip it
      if (links[i] === event.target.closest('.top-menu-tab')) {
        continue;
      }
      // Remove the .active class
      links[i].classList.remove('active');
    }
  }

  menuMouseOver (event) {
    event.target.closest('.top-menu-tab').classList.add('active');
  }

  menuMouseOut (event) {
    if (
      (!event.relatedTarget 
      || !event.relatedTarget.closest('ul')
      || event.relatedTarget.closest('ul').id.indexOf('subMenu') === -1)
      && event.target.closest('.top-menu-tab').getAttribute('name') !== this.props.path
    ) {
      event.target.closest('.top-menu-tab').classList.remove('active');
    }
  }

  render () {
    return (
      <ul className="main-menu">
        {this.renderMenus(this.props.menus)}      
      </ul>
    )
  }
}

export default MainMenu