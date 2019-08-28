import React, {Component} from 'react';
import {Link} from 'react-router-dom'

class Logo extends Component {
    render() {
        return (
            <div className="logo-w">
                <Link className="logo" to="/">

                    <div className="logo-label">Mitigation Planner</div>
                </Link>
            </div>
        )
    }
}

class AvatarUser extends Component {
    render() {
        //console.log('TopMenu', this.props.user)
        return (
            <div className="logged-user-w avatar-inline">
                <div className="logged-user-i">
                    <div className="avatar-w" style={{border: 'none'}}><i
                        className='pre-icon os-icon os-icon-user-male-circle'/></div>
                    <div className="logged-user-info-w">
                        <div className="logged-user-name">{this.props.user.email ? this.props.user.email : ''}</div>
                        <div className="logged-user-role"
                             style={{color: '#cdcdcd'}}>{this.props.user.activeGroup ? this.props.user.activeGroup : ''}</div>
                    </div>
                    <div className="logged-user-toggler-arrow">
                        <div className="os-icon os-icon-chevron-down"/>
                    </div>
                    <div className="logged-user-menu">
                        <ul>
                            <li><Link to="/logout"><i className="os-icon os-icon-signs-11"/><span>Logout</span></Link>
                            </li>
                        </ul>
                        <div className="logged-user-avatar-info">
                            <div className="avatar-w"><i className='pre-icon os-icon os-icon-user-male-circle'
                                                                                                 style={{'vertical-align': 'middle',
                                                                                                 'color': 'white'}}/></div>
                            <Link to={'/user/'}>
                                <div className="logged-user-info-w">
                                    <div
                                        className="logged-user-name">{this.props.user.email ? this.props.user.email : ''}</div>
                                    <div
                                        className="logged-user-role">{this.props.user.activeGroup ? this.props.user.activeGroup : ''}</div>
                                </div>
                            </Link>

                        </div>
                        <ul>
                            {
                                (this.props.user.authedPlans && this.props.user.authedPlans.length > 1) ||
                                (this.props.user.authed && this.props.user.authedPlans.indexOf(this.props.activePlan) === -1)?
                                    <li>
                                        <a href='/plans'>
                                            <i className="pre-icon os-icon os-icon-pencil-2"></i> <span> Plans </span>
                                        </a>
                                    </li>
                                 : null
                            }

                            {this.props.user.authLevel >= 5 ?
                                    <li>
                                        <a href='/user/admin'>
                                            <i className="pre-icon os-icon os-icon-pencil-2"></i> <span> Admin </span>
                                        </a>
                                    </li>
                                 : null
                            }
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

class LoginMenu extends Component {
    render() {
        return (
            <div className="menu-actions">
                <Link to={'/login'}>
                    <div className="top-icon top-settings os-dropdown-trigger os-dropdown-position-right">
                        <span className='loginMenu'>LOGIN </span>
                        <i className='pre-icon os-icon os-icon-user-male-circle'/>
                    </div>
                </Link>
            </div>
        )
    }
}

class TopSearch extends Component {
    render() {
        return (
            <div className="element-search autosuggest-search-activator">
                <input placeholder="Start typing to search..." type="text"/>
            </div>
        )
    }
}

class TopNav extends Component {
    render() {
        return (
            <span style={{width: '100%'}}>
        <Logo/>
        <TopSearch/>
        <LoginMenu/>
        <AvatarUser/>
      </span>
        )
    }
}

export default TopNav
export {
    Logo,
    TopSearch,
    LoginMenu,
    AvatarUser
}