import React, {Component} from 'react';
import {Link} from 'react-router-dom'

class Logo extends Component {
    render() {
        let title = this.props.title || 'Mitigation Planner'
        return (
            this.props.miniLayout ? title.slice(0,1) : title
        )
    }
}

class AvatarUser extends Component {
    render() {
        let activePlan = this.props.user.activePlan || 'xxx'
        let authedPlans = this.props.user.authedPlans || []
        //console.log('TopMenu', this.props.user)
        return (
            <div className="logged-user-w avatar-inline">
                <div className="logged-user-i">
                    <div className="avatar-w" style={{border: 'none'}}><i
                        className='pre-icon os-icon os-icon-user-male-circle'/></div>
                    <div className="logged-user-info-w">
                        <div className="logged-user-name">
                            {
                            this.props.user.email ?
                            this.props.user.email.length > 18 ?
                                this.props.user.email.slice(0,15) + '...'
                                : this.props.user.email
                            : ''}</div>
                        <div className="logged-user-role"
                             style={{color: '#cdcdcd'}}>{this.props.user.activeGroup ?
                            this.props.user.activeGroup.length > 18 ?
                                this.props.user.activeGroup.slice(0,15) + '...' :
                                this.props.user.activeGroup
                            : ''}</div>
                    </div>
                    <div className="logged-user-toggler-arrow">
                        <div className="os-icon os-icon-chevron-down"/>
                    </div>
                    <div className="logged-user-menu">
                        <div className="logged-user-avatar-info">
                            <div className="avatar-w"><i className='pre-icon os-icon os-icon-user-male-circle'
                                                                                                 style={{'verticalAlign': 'middle',
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
                                (this.props.user.authLevel >= 1 && 
                                authedPlans.includes(activePlan) || this.props.user.authLevel >= 5) ?
                                    <li>
                                        <Link to='/plans'>
                                            <i className="pre-icon os-icon os-icon-pencil-2"></i> <span> Plans </span>
                                        </Link>
                                    </li>
                                 : null
                            }

                            {this.props.user.authLevel >= 5 ?
                                    <React.Fragment>
                                        <li>
                                            <Link to='/user/admin'>
                                                <i className="pre-icon os-icon os-icon-pencil-2"></i> <span> User Admin </span>
                                            </Link>
                                        </li>
                                        <li style={{width: 'max-content'}}>
                                            <Link to='/plan_review'>
                                                <i className="pre-icon os-icon os-icon-pencil-2"></i> <span> Review Tools </span>
                                            </Link>
                                        </li>
                                    </React.Fragment>
                                 : null
                            }
                            {(this.props.user.authLevel >= 1 && 
                              authedPlans.includes(activePlan) || this.props.user.authLevel >= 5) ? // check for current plan and not in general
                                <li>
                                    <Link to='/admin'>
                                        <i className="pre-icon os-icon os-icon-pencil-2"></i> <span> Admin </span>
                                    </Link>
                                </li>
                                : null
                            }
                            {this.props.user.authLevel === 10 ?
                                <li>
                                    <Link to='/guidance'>
                                        <i className="pre-icon os-icon os-icon-pencil-2"></i> <span> Guidance </span>
                                    </Link>
                                </li>
                                : null
                            }
                        </ul>
                        <ul>
                            <li><Link to="/logout"><i className="os-icon os-icon-signs-11"/><span>Logout</span></Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}
class AvatarUserMobile extends Component {
    render() {
        //console.log('TopMenu', this.props.user)
        let activePlan = this.props.user.activePlan || 'xxx'
        let authedPlans = this.props.user.authedPlans || []

        return (
            <li className='has-sub-menu'>

                <a onClick={(event) => {
                    if (!event.target.closest('.has-sub-menu')) return;
                    if (event.target.closest('.has-sub-menu').classList.value.indexOf('active') === -1) {
                        event.target.closest('.has-sub-menu').classList.add('active');
                    }else{
                        event.target.closest('.has-sub-menu').classList.remove('active');
                    }
                }}>
                    <div className="icon-w">
                        <div className="pre-icon os-icon os-icon-user-male-circle"></div>
                    </div>
                    <span>
                        <div className="logged-user-info-w">
                            <div className="logged-user-name">
                                {
                                    this.props.user.email ?
                                        this.props.user.email.length > 18 ?
                                            this.props.user.email.slice(0,15) + '...'
                                            : this.props.user.email
                                        : ''}</div>
                            <div className="logged-user-role"
                                 style={{color: '#cdcdcd'}}>{this.props.user.activeGroup ?
                                this.props.user.activeGroup.length > 18 ?
                                    this.props.user.activeGroup.slice(0,15) + '...' :
                                    this.props.user.activeGroup
                                : ''}</div>
                        </div>
                    </span>
                </a>
                <div className='sub-menu-w'>
                    <div className='sub-menu-i'>
                        <ul className='sub-menu'>
                            <li>
                                <Link to={'/user/'}>
                                    <div className="logged-user-info-w">
                                        <div className="logged-user-name">{this.props.user.email ? this.props.user.email : ''}</div>
                                    </div>
                                </Link>
                            </li>
                            {
                                (this.props.user.authedPlans && this.props.user.authedPlans.length > 1) ||
                                (this.props.user.authed && this.props.user.authedPlans.indexOf(this.props.activePlan) === -1)?
                                    <li>
                                        <Link to='/plans'>
                                            Plans
                                        </Link>
                                    </li>
                                    : null
                            }

                            {this.props.user.authLevel >= 5 ?
                                <React.Fragment>
                                    <li>
                                        <Link to='/user/admin'>
                                            User Admin
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to='/plan_review'>
                                            Review Tools
                                        </Link>
                                    </li>
                                </React.Fragment>
                                : null
                            }
                            {(this.props.user.authLevel >= 1 && 
                              authedPlans.includes(activePlan) || this.props.user.authLevel >= 5) ? // check for current plan and not in general
                                <li>
                                    <Link to='/admin'>
                                        Admin
                                    </Link>
                                </li>
                                : null
                            }
                            {this.props.user.authLevel === 10 ?
                                <li>
                                    <Link to='/guidance'>
                                        Guidance
                                    </Link>
                                </li>
                                : null
                            }
                            <li>
                                <Link to="/logout">Logout</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </li>
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

class LoginMenuMobile extends Component {
    render() {
        return (
            <li>
                <Link to={'/login'} style={{color:'#fff'}}>
                    <div className="icon-w">
                        <div className='pre-icon os-icon os-icon-user-male-circle'/>
                    </div>
                    <span>LOGIN </span>
                </Link>
            </li>
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
        <AvatarUser/>
        <LoginMenu/>
      </span>
        )
    }
}

export default TopNav
export {
    Logo,
    TopSearch,
    LoginMenu,
    LoginMenuMobile,
    AvatarUser,
    AvatarUserMobile
}
