import React from 'react';
import {Link, Redirect} from 'react-router-dom'
import {connect} from 'react-redux';
import Wizard from 'components/light-admin/wizard'
import {reduxFalcor} from 'utils/redux-falcor'

import {signup} from 'store/modules/user';


import './Login.css'

const COLS = [
    "contact_name",
    "contact_email",
    "contact_phone",
    "contact_address",
    "contact_title_role",
    "contact_department",
    "contact_agency",
    "contact_municipality",
    "contact_county",
    "associated_plan"
];

class Signup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            contact_email: '',
            contact_county: '',
            contact_municipality: '',
            contact_agency: '',
            contact_department: '',
            contact_title_role: '',
            contact_name: '',
            contact_phone: '',
            contact_address: '',
            associated_plan: 0,
            email_verify: '',
            countyList: [],
            cousubList: [],
            roleList: [],
            group: null,
            nextButtonActiveStep1: false,
            nextButtonActiveStep2: false,
            nextButtonActiveStep3: false,
            redirectToReferrer: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.listCousubDropdown = this.listCousubDropdown.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    validateForm() {
        return this.state.contact_email.length > 0 && this.state.contact_email === this.state.email_verify;
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.contact_county !== this.state.contact_county){
            let tmpGroup = this.state.countyList.filter(f => f.id === this.state.contact_county)[0].name + ' HMP Public';
            this.setState({'group': tmpGroup})
        }
    }

    fetchFalcorDeps() {
        return this.props.falcor.get(
            ['geo', 36, 'counties']
        )
            .then(countyList => {
                this.props.falcor.get(
                    ['geo', countyList.json.geo[36].counties, ['name']]
                )
                    .then(countyNames => {
                        let geoList =
                            Object.keys(countyNames.json.geo)
                                .filter(f => f !== '$__path')
                                .map(geoid => {
                                    let tmpObj = {};
                                    tmpObj['id'] = geoid;
                                    tmpObj['name'] = countyNames.json.geo[geoid].name;
                                    return tmpObj;
                                });
                        this.setState({'countyList': geoList});
                        return countyNames.json.geo
                    })
                    .then(d => {
                        return this.props.falcor.get(
                            ['rolesmeta', 'roles', ['field']]
                        )
                            .then(d => {
                                let roleList = [];
                                Object.keys(d.json.rolesmeta.roles)
                                    .filter(f => f !== '$__path')
                                    .map(roleKey => {
                                            let roles = d.json.rolesmeta.roles[roleKey];
                                            roleList = roles.map(role => {
                                                let tmpObj = {};
                                                tmpObj['id'] = role.value;
                                                tmpObj['name'] = role.name;
                                                return tmpObj;
                                            })
                                        }
                                    );
                                this.setState({'roleList': roleList});
                                return d;
                            })
                    })

            })
    }

    handleChange = event => {
        let error_class_name = 'form-group has-error has-danger';
        let normal_class_name = 'form-group';

        // if required field is blank
        if (event.target.required && event.target.value.length === 0
            && !document.getElementById(event.target.id + 'RequiredFeild')
        ) {
            event.target.parentElement.className = error_class_name;
            let div = document.createElement('div');
            div.id = event.target.id + 'RequiredFeild';
            div.innerText = 'Required field.';
            event.target.nextSibling.appendChild(div)
        }

        // if required field is filled up
        if (event.target.required && event.target.value.length !== 0 && event.target.parentElement.className === error_class_name
            && document.getElementById(event.target.id + 'RequiredFeild')) {
            event.target.parentElement.className = normal_class_name;
            event.target.nextSibling.removeChild(document.getElementById(event.target.id + 'RequiredFeild'))
        }

        // if emails do not match
        if (event.target.id === 'email_verify') {
            if (event.target.value !== document.getElementById('contact_email').value
                && !document.getElementById(event.target.id + 'PasswordsMatch')) {
                let div = document.createElement('div');
                div.id = event.target.id + 'PasswordsMatch';
                div.innerText = 'Passwords do not match!';
                event.target.nextSibling.appendChild(div)
            } else if (event.target.value === document.getElementById('contact_email').value
                && document.getElementById(event.target.id + 'PasswordsMatch')) {
                event.target.nextSibling.removeChild(document.getElementById(event.target.id + 'PasswordsMatch'))
            }
        }

        // if county then municipality
        if (event.target.id === 'contact_county') {
            if (event.target.value.length !== 0) {
                document.getElementById('contact_municipality').parentNode.style.display = 'block'
            } else {
                document.getElementById('contact_municipality').parentNode.style.display = 'none'
            }
        }
        //step 1 continue validation
        // have to be nested ifs otherwise all the previous 'next's and 'submit's will be disabled other than current step
        if (document.getElementById('contact_email') &&
            document.getElementById('email_verify')
        ) {
            if (document.getElementById('contact_email').value.length > 0 &&
                document.getElementById('email_verify').value.length > 0 &&
                document.getElementById('contact_email').value === document.getElementById('email_verify').value) {
                this.setState({'nextButtonActiveStep1': true})
            } else {
                this.setState({'nextButtonActiveStep1': false})
            }
        }

        //step 2 continue validation
        if (document.getElementById('contact_county') &&
            document.getElementById('contact_title_role')) {
            if (document.getElementById('contact_county').value.length > 0 &&
                document.getElementById('contact_title_role').value.length > 0) {
                this.setState({'nextButtonActiveStep2': true})
            } else {
                this.setState({'nextButtonActiveStep2': false})
            }
        }

        //step 3 continue validation
        if (document.getElementById('contact_name')) {
            if (document.getElementById('contact_name').value.length > 0) {
                this.setState({'nextButtonActiveStep3': true})
            } else {
                this.setState({'nextButtonActiveStep3': false})
            }
        }

        this.setState({
            [event.target.id]: event.target.value
        });
    };

    listCousubDropdown(event) {
        let county = event.target.value;
        if (county !== 'None') {
            return this.props.falcor.get(['geo', [county], 'cousubs'])
                .then(response => response.json.geo[county].cousubs)
                .then(cousubs => this.props.falcor.get(['geo', cousubs, ['name']]))
                .then(cousubs => {
                    let geoList =
                        Object.keys(cousubs.json.geo)
                            .filter(f => f !== '$__path')
                            .map(geoid => {
                                let tmpObj = {};
                                tmpObj['id'] = geoid;
                                tmpObj['name'] = cousubs.json.geo[geoid].name;
                                return tmpObj;
                            });
                    this.setState({'cousubList': geoList});
                    return cousubs.json.geo
                })
        } else {
            return null
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({isLoading: true});
        // get planId here so it calls falcor only once for it

        return this.props.falcor.get(['plans', 'county', 'byGeoid', [this.state.contact_county], 'id']).then(
            d => {
                let plan_id = d.json.plans.county.byGeoid[this.state.contact_county].id;
                if (plan_id) this.setState({'associated_plan': plan_id});
                let args = COLS.map(key => this.state[key]);
                return this.props.signup({email:this.state.contact_email, group:this.state.group})
                    .then(res => {
                        console.log('inserted user, inserting in roles', res);
                        // avail_auth call
                        this.props.falcor.call(['roles', 'insert'], args, [], [])
                            .then(res => console.log('all done'))
                    })
            })

    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.isAuthenticated) {
            this.setState({redirectToReferrer: true});
        } else {
            this.setState({isLoading: false});
        }
    }

    renderWizard() {
        const wizardSteps = [
            {
                title: (
                    <span>
                    <span style={{fontSize: '0.7em'}}>Step 1</span>
                    <br/><span style={{fontSize: '0.9em'}}>Email</span>
            </span>
                ),
                content: (
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="form-group">
                                <label htmlFor={'contact_email'}> Email</label>
                                <input
                                    className="form-control"
                                    autoFocus
                                    id='contact_email'
                                    required
                                    data-error="Your email address is invalid"
                                    type="email"
                                    onChange={this.handleChange}
                                    //onfocusin={this.handleChange}
                                    placeholder="Email"
                                    value={this.state.contact_email}
                                />
                                <div className="help-block form-text with-errors form-control-feedback"></div>
                            </div>
                        </div>
                        <div className="col-sm-12">
                            <div className="form-group">
                                <label htmlFor={'email_verify'}> Confirm Email</label>
                                <input
                                    className="form-control"
                                    id='email_verify'
                                    required="required"
                                    data-error="Your email address is invalid"
                                    type="email"
                                    onChange={this.handleChange}
                                    placeholder="Confirm Email"
                                    value={this.state.email_verify}/>
                                <div className="help-block form-text with-errors form-control-feedback"></div>
                            </div>
                        </div>
                    </div>
                ),
                nextButtonActive: this.state.nextButtonActiveStep1
            },
            {
                title: (
                    <span>
                    <span style={{fontSize: '0.7em'}}>Step 2</span>
                    <br/><span style={{fontSize: '0.9em'}}>Role Details</span>
            </span>
                ),
                content: (
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="form-group"><label htmlFor={'contact_county'}> County</label>
                                <select
                                    className="form-control"
                                    id='contact_county'
                                    required="required"
                                    data-error="Please select county"
                                    onChange={this.handleChange}
                                    onClick={this.listCousubDropdown}
                                    placeholder="County"
                                    value={this.state.contact_county}>
                                    <option default value={''}>--Select County--</option>
                                    {this.state.countyList.map((county, county_i) => {
                                        return (<option className="form-control" key={county_i + 1}
                                                        value={county.id}> {county.name} </option>)
                                    })}
                                </select>
                                <div className="help-block form-text with-errors form-control-feedback"></div>
                            </div>
                        </div>

                        <div className="col-sm-12">
                            <div className="form-group"
                                 style={{display: "none"}}
                            ><label htmlFor={'contact_municipality'}> Municipality <small>(optional)</small></label>
                                <select
                                    id='contact_municipality'
                                    onChange={this.handleChange}
                                    className="form-control"
                                    placeholder="Municipality"
                                    value={this.state.contact_municipality}>
                                    <option default value={''}>--Select Municipality--</option>
                                    {this.state.cousubList.map((cousub, cousub_i) => {
                                        return (<option className="form-control" key={cousub_i + 1}
                                                        value={cousub.id}> {cousub.name} </option>)
                                    })}
                                </select>
                            </div>
                        </div>

                        <div className="col-sm-12">
                            <div className="form-group"><label
                                htmlFor={'contact_agency'}> Agency <small>(optional)</small></label>
                                <input id='contact_agency' onChange={this.handleChange} className="form-control"
                                       placeholder="Agency" type="text" value={this.state.contact_agency}/></div>
                        </div>
                        <div className="col-sm-12">
                            <div className="form-group"><label
                                htmlFor={'contact_department'}> Department <small>(optional)</small></label>
                                <input id='contact_department' onChange={this.handleChange} className="form-control"
                                       placeholder="Department" type="text" value={this.state.contact_department}/>
                            </div>
                        </div>
                        <div className="col-sm-12">
                            <div className="form-group"><label htmlFor={'contact_title_role'}> Role</label>
                                <select
                                    id='contact_title_role'
                                    required="required"
                                    onChange={this.handleChange}
                                    className="form-control"
                                    placeholder="Role"
                                    value={this.state.contact_title_role}>
                                    <option default value={''}>--Select Role--</option>
                                    {this.state.roleList.map((role, role_i) => {
                                        return (<option className="form-control" key={role_i + 1}
                                                        value={role.id}> {role.name} </option>)
                                    })}
                                </select>
                                <div className="help-block form-text with-errors form-control-feedback"></div>

                            </div>
                        </div>
                    </div>
                ),
                nextButtonActive: this.state.nextButtonActiveStep2
            },
            {
                title: (
                    <span>
                    <span style={{fontSize: '0.7em'}}>Step 3</span>
                    <br/><span style={{fontSize: '0.9em'}}>Personal Details</span>
            </span>
                ),
                content: (
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="form-group"><label htmlFor={'contact_name'}> Name</label>
                                <input id='contact_name' required="required" onChange={this.handleChange}
                                       className="form-control" placeholder="Name" type="text"
                                       value={this.state.contact_name}/>
                                <div className="help-block form-text with-errors form-control-feedback"></div>

                            </div>
                        </div>
                        <div className="col-sm-12">
                            <div className="form-group"><label
                                htmlFor={'contact_phone'}> Phone <small>(optional)</small></label>
                                <input id='contact_phone' onChange={this.handleChange} className="form-control"
                                       placeholder="Phone" type="text" value={this.state.contact_phone}/></div>
                        </div>
                        <div className="col-sm-12">
                            <div className="form-group"><label
                                htmlFor={'contact_address'}> Address <small>(optional)</small></label>
                                <input id='contact_address' onChange={this.handleChange} className="form-control"
                                       placeholder="Address" type="text" value={this.state.contact_address}/></div>
                        </div>
                    </div>
                ),
                nextButtonActive: this.state.nextButtonActiveStep3
            }
        ];

        return (
            <Wizard steps={wizardSteps} submit={this.handleSubmit}/>
        )
    }

    render() {
        const {from} = this.props.location.state || {from: {pathname: "/"}};
        const {redirectToReferrer} = this.state;

        if (redirectToReferrer) {
            return <Redirect to={from}/>;
        }

        return (

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
                        {!this.props.signupComplete ? this.renderWizard()
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

const mapDispatchToProps = {signup};

const mapStateToProps = state => {
    return {
        isAuthenticated: !!state.user.authed,
        attempts: state.user.attempts, // so componentWillReceiveProps will get called.
        signupComplete: state.user.signupComplete
    };
};

export default {
    path: '/signup',
    mainNav: false,
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Signup)),
    menuSettings: {hide: true}
}

  