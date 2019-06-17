import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import './Nav.css'

class Nav extends React.Component {

  isActiveNav (name) {
    return name === this.props.page ? 'active' : ''
  }

  render () {
    // var navClasses = 'navbar navbar-dark navbar-fixed-top scrolling-navbar'

    var navStyle = { backgroundColor: 'transparent', maxWidth: '100vw', paddingTop: 25 }

    // var navLogo = '/icons/freeflow-logo-grey.png'

    return (
      <div  style={{position: 'absolute', top: '0', left: '0', width: '100%'}}>
        <div className='container'>
          <nav className='navbar navbar-expand-lg custom-nav' style={navStyle}>
            <a className='navbar-brand cb' href='/landing'>
              NPMRDS
            </a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            

            <div className='collapse navbar-collapse' id='navbarSupportedContent'>
              <ul className='navbar-nav ml-auto'>
                <li className={'nav-item ' + this.isActiveNav('home')}>
                  <Link className='nav-link' to='/landing'>Home</Link>
                </li>
                
                <li className={'nav-item ' + this.isActiveNav('login')}>
                  <Link className='nav-link login' to='login'>Sign In</Link>
                </li>
              </ul>
            </div>
          </nav>


        </div>
      </div>

    )
  }
}

Nav.propTypes = {
  // logout: PropTypes.func.isRequired,
  page: PropTypes.string
}

export default Nav

