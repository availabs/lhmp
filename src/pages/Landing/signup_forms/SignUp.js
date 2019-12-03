import {connect} from "react-redux";
import { reduxFalcor } from 'utils/redux-falcor'
import {sendSystemMessage} from 'store/modules/messages';
import Element from 'components/light-admin/containers/Element'
import React from 'react';
import AvlFormsSignUpWizard from 'components/AvlForms/editComponents/signUpWizard.js'
import get from "lodash.get";
import {Link} from "react-router-dom";
import {signup} from 'store/modules/user';
import config from 'pages/Landing/signup_forms/config.js'


class SignUpForms extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div style={{
                height: '100vh',
                overflow: 'scroll',
                backgroundImage: 'linear-gradient(142deg, rgba(255,255,255,1) 0%, rgba(238,240,245,1) 85%, rgba(4,123,248,.2) 100%)'
            }}
            >

                <div style={{
                    height: '100%',
                    display: 'block',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start'
                }}>
                    <div className="auth-box-w" style={{
                        width: '100%',
                        minWidth: '350px',
                        maxWidth: '650px'
                    }}>
                        {/* <button onClick={() => this.props.signup('ssangdod@albany.edu')}>signup trigger</button>*/}
                        <h4 className="auth-header" style={{paddingTop: 20}}>Hazard Mitigation Planner
                            <br/><span style={{fontSize: '0.8em', fontWeight: 100, color: '#047bf8'}}>Signup</span></h4>
                        {!this.props.signupComplete ? (
                                <AvlFormsSignUpWizard
                                    json = {config}

                                />
                            )
                            : (
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div style={{'min-height': '300px'}}>
                                            <div className='form-desc' align={'center'}>
                                                Signup Successful. You should receive an email shortly with instructions for
                                                login.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        <div style={{padding: 15, float: 'right'}}>
                            <Link to={'/login'}>Login?</Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = {
    sendSystemMessage,
    signup
};

const mapStateToProps = state => {
    return {
        activePlan: state.user.activePlan,
        isAuthenticated: !!state.user.authed,
        attempts: state.user.attempts, // so componentWillReceiveProps will get called.
        signupComplete: state.user.signupComplete

    };
};

export default [
    {
        path: '/signup',
        mainNav: false,
        name: 'SignUp',
        component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(SignUpForms)),
        menuSettings: {hide: true}
    }

]