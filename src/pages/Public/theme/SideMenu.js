import React, { Component } from 'react';

import get from 'lodash.get'
import styled from "styled-components"


class SideMenu extends React.Component {
   
    render(){
        return(
         <div style={{height: '100%', paddingTop: 20}} 
            className="menu-w 
                selected-menu-color-light 
                menu-has-selected-link 
                menu-activated-on-click 
                color-scheme-transparent 
                color-style-transparent 
                sub-menu-color-light 
                menu-position-side 
                menu-side-left 
                menu-layout-full 
                sub-menu-style-inside">
            {/*
            <div className="element-search autosuggest-search-activator">
                <input placeholder="Start typing to search..." type="text" />
            </div>
            */}
            <ul className="main-menu">
                <li className="sub-header"><span>Planning Context</span></li>
                <li className="selected">
                    <a href="index.html">
                        <div className="icon-w">
                            <div className="os-icon os-icon-layout"></div>
                        </div><span>Introduction</span>
                    </a>
                </li>
                <li className="selected">
                    <a href="index.html">
                        <div className="icon-w">
                            <div className="os-icon os-icon-package"></div>
                        </div><span>Planning Context</span>
                    </a>
                </li>
                <li className="selected">
                    <a href="index.html">
                        <div className="icon-w">
                            <div className="os-icon os-icon-file-text"></div>
                        </div><span>Planning Team</span>
                    </a>
                </li>
                <li className="sub-header"><span>Options</span></li>
                <li className="has-sub-menu">
                    <a href="apps_bank.html">
                        <div className="icon-w">
                            <div className="os-icon os-icon-package"></div>
                        </div><span>Applications</span></a>
                    <div className="sub-menu-w">
                        <div className="sub-menu-header">Applications</div>
                        <div className="sub-menu-icon"><i className="os-icon os-icon-package"></i></div>
                        <div className="sub-menu-i">
                            <ul className="sub-menu">
                                <li><a href="apps_email.html">Email Application</a></li>
                                <li><a href="apps_support_dashboard.html">Support Dashboard</a></li>
                                <li><a href="apps_support_index.html">Tickets Index</a></li>
                                <li><a href="apps_crypto.html">Crypto Dashboard <strong className="badge badge-danger">New</strong></a></li>
                                <li><a href="apps_projects.html">Projects List</a></li>
                                <li><a href="apps_bank.html">Banking <strong className="badge badge-danger">New</strong></a></li>
                            </ul>
                            <ul className="sub-menu">
                                <li><a href="apps_full_chat.html">Chat Application</a></li>
                                <li><a href="apps_todo.html">To Do Application <strong className="badge badge-danger">New</strong></a></li>
                                <li><a href="misc_chat.html">Popup Chat</a></li>
                                <li><a href="apps_pipeline.html">CRM Pipeline</a></li>
                                <li><a href="rentals_index_grid.html">Property Listing <strong className="badge badge-danger">New</strong></a></li>
                                <li><a href="misc_calendar.html">Calendar</a></li>
                            </ul>
                        </div>
                    </div>
                </li>
                <li className="has-sub-menu">
                    <a href="#">
                        <div className="icon-w">
                            <div className="os-icon os-icon-file-text"></div>
                        </div><span>Pages</span></a>
                    <div className="sub-menu-w">
                        <div className="sub-menu-header">Pages</div>
                        <div className="sub-menu-icon"><i className="os-icon os-icon-file-text"></i></div>
                        <div className="sub-menu-i">
                            <ul className="sub-menu">
                                <li><a href="misc_invoice.html">Invoice</a></li>
                                <li><a href="rentals_index_grid.html">Property Listing <strong className="badge badge-danger">New</strong></a></li>
                                <li><a href="misc_charts.html">Charts</a></li>
                                <li><a href="auth_login.html">Login</a></li>
                                <li><a href="auth_register.html">Register</a></li>
                            </ul>
                            <ul className="sub-menu">
                                <li><a href="auth_lock.html">Lock Screen</a></li>
                                <li><a href="misc_pricing_plans.html">Pricing Plans</a></li>
                                <li><a href="misc_error_404.html">Error 404</a></li>
                                <li><a href="misc_error_500.html">Error 500</a></li>
                            </ul>
                        </div>
                    </div>
                </li>
                <li className="has-sub-menu">
                    <a href="#">
                        <div className="icon-w">
                            <div className="os-icon os-icon-life-buoy"></div>
                        </div><span>UI Kit</span></a>
                    <div className="sub-menu-w">
                        <div className="sub-menu-header">UI Kit</div>
                        <div className="sub-menu-icon"><i className="os-icon os-icon-life-buoy"></i></div>
                        <div className="sub-menu-i">
                            <ul className="sub-menu">
                                <li><a href="uikit_modals.html">Modals <strong className="badge badge-danger">New</strong></a></li>
                                <li><a href="uikit_alerts.html">Alerts</a></li>
                                <li><a href="uikit_grid.html">Grid</a></li>
                                <li><a href="uikit_progress.html">Progress</a></li>
                                <li><a href="uikit_popovers.html">Popover</a></li>
                            </ul>
                            <ul className="sub-menu">
                                <li><a href="uikit_tooltips.html">Tooltips</a></li>
                                <li><a href="uikit_buttons.html">Buttons</a></li>
                                <li><a href="uikit_dropdowns.html">Dropdowns</a></li>
                                <li><a href="uikit_typography.html">Typography</a></li>
                            </ul>
                        </div>
                    </div>
                </li>
                <li className="sub-header"><span>Elements</span></li>
                <li className="has-sub-menu">
                    <a href="#">
                        <div className="icon-w">
                            <div className="os-icon os-icon-mail"></div>
                        </div><span>Emails</span></a>
                    <div className="sub-menu-w">
                        <div className="sub-menu-header">Emails</div>
                        <div className="sub-menu-icon"><i className="os-icon os-icon-mail"></i></div>
                        <div className="sub-menu-i">
                            <ul className="sub-menu">
                                <li><a href="emails_welcome.html">Welcome Email</a></li>
                                <li><a href="emails_order.html">Order Confirmation</a></li>
                                <li><a href="emails_payment_due.html">Payment Due</a></li>
                                <li><a href="emails_forgot.html">Forgot Password</a></li>
                                <li><a href="emails_activate.html">Activate Account</a></li>
                            </ul>
                        </div>
                    </div>
                </li>
                <li className="has-sub-menu">
                    <a href="#">
                        <div className="icon-w">
                            <div className="os-icon os-icon-users"></div>
                        </div><span>Users</span></a>
                    <div className="sub-menu-w">
                        <div className="sub-menu-header">Users</div>
                        <div className="sub-menu-icon"><i className="os-icon os-icon-users"></i></div>
                        <div className="sub-menu-i">
                            <ul className="sub-menu">
                                <li><a href="users_profile_big.html">Big Profile</a></li>
                                <li><a href="users_profile_small.html">Compact Profile</a></li>
                            </ul>
                        </div>
                    </div>
                </li>
                
                
            </ul>

        </div>
        )

    }

}

export default SideMenu
