import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { createMatchSelector } from 'react-router-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import Element from 'components/light-admin/containers/Element'
import {sendSystemMessage} from 'store/modules/messages';




const COLS = [
    "id",
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

class FormEditOrNew extends Component {
    constructor(props) {
        super(props)

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
            countyList: [],
            cousubList: [],
            roleList: [],
            buttonActive: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.listCousubDropdown = this.listCousubDropdown.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)
        this.displayMunicipality = this.displayMunicipality.bind(this)
    }

    componentDidMount() {
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
                    .then(d => {
                        if (this.props.match.params.roleid) {
                            console.log('query', ['roles','byId',[this.props.match.params.roleid],COLS])
                            return this.props.falcor.get(
                                ['roles','byId',[this.props.match.params.roleid],COLS]
                            )
                                .then(curentData => {
                                    this.setState(curentData.json.roles.byId[this.props.match.params.roleid]);
                                    console.log('cd',curentData.json.roles.byId[this.props.match.params.roleid]);
                                    return curentData;
                                })
                        }else{
                            return d
                        }
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

       /* // if county then municipality
        if (event.target.id === 'contact_county') {
            if (event.target.value.length !== 0) {
                document.getElementById('contact_municipality').parentNode.style.display = 'block'
            } else {
                document.getElementById('contact_municipality').parentNode.style.display = 'none'
            }
        }*/

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

    static validateForm () {
        /* let cond1 =  (document.getElementById('contact_email'))
             && (document.getElementById('contact_email').value.length > 0);*/

         let cond2 = (document.getElementById('contact_county') &&
             document.getElementById('contact_title_role'))
             && (document.getElementById('contact_county').value.length > 0 &&
             document.getElementById('contact_title_role').value.length > 0);

         let cond3 = (document.getElementById('contact_name')) && (document.getElementById('contact_name').value.length > 0)

        return cond2 && cond3
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({isLoading: true});
        // get planId here so it calls falcor only once for it
        return this.props.falcor.get(['plans', 'county', 'byGeoid', [this.state.contact_county], 'id']).then(
            d => {
                let plan_id = d.json.plans.county.byGeoid[this.state.contact_county].id;
                if (plan_id) this.setState({'associated_plan': parseInt(plan_id)});
                let args = {};

                this.props.match.params.roleid ?
                    COLS
                        .filter(f => f !== 'id')
                        .map(key => { args[key] = this.state[key];})
                    : args = COLS
                        .filter(f => f !== 'id')
                        .map(key => this.state[key]);
                console.log(args)
                return this.props.match.params.roleid ?
                    (this.props.falcor.set({
                        paths: [
                            ['roles','byId',[this.props.match.params.roleid],COLS]
                        ],
                        jsonGraph: {
                            roles: {
                                byId: {
                                    [this.props.match.params.roleid]: args
                                }
                            }
                        }
                    })
                    .then(response => {
                        response.error ?
                        this.props.sendSystemMessage(`Error occurred during editing. Please try again later.`, {type: "danger"}) :
                        this.props.sendSystemMessage(`Role successfully edited.`, {type: "success"});
                    })
                    )
                 : (this.props.falcor.call(['roles', 'insert'], args, [], [])
                    /*.then(res => {
                        console.log('inserted role, waiting for avail_auth', res);
                        // avail_auth call
                        this.props.signup(this.state.contact_email)
                            .then(res => console.log('all done'))
                    })*/
                    .then(response => {
                        response.error ?
                            this.props.sendSystemMessage(`Error occurred. Please try again later.`, {type: "danger"}) :
                            this.props.sendSystemMessage(`Role successfully added.`, {type: "success"});
                    })
                    )
            });

    };

    displayMunicipality(){
       /* console.log('display?', document.getElementById('contact_county'),
            document.getElementById('contact_county').value,
            document.getElementById('contact_county').value.length !== 0)*/
        return (document.getElementById('contact_county') &&
            document.getElementById('contact_county').value &&
            document.getElementById('contact_county').value.length !== 0) ? 'block' : 'none'
    }

    render(){
        return (
            <Element>
                <h6 className="element-header">{this.props.match.params.roleid ? 'Edit Role' : 'Add Role'}</h6>
                <form onSubmit={this.handleSubmit}>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="form-group">
                                <label htmlFor={'contact_email'}> Email <small>(optional)</small></label>
                                <input
                                    className="form-control"
                                    autoFocus
                                    id='contact_email'
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
                    </div>

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
                                 style={{display: this.displayMunicipality()}}
                            ><label htmlFor={'contact_municipality'}> Jurisdiction <small>(optional)</small></label>
                                <select
                                    id='contact_municipality'
                                    onChange={this.handleChange}
                                    className="form-control"
                                    placeholder="Municipality"
                                    value={this.state.contact_municipality}>
                                    <option default value={''} key={ 0 }>--Select Municipality--</option>
                                    <option value={'county'} key={ 1 }> County </option>
                                    <option value={'state'} key={ 2 }> State </option>
                                    <option value={'federal'} key={ 3 }> Federal </option>
                                    {this.state.cousubList.map((cousub, cousub_i) => {
                                        return (<option className="form-control" key={cousub_i + 4}
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

                    <button className="btn btn-primary step-trigger-btn" href={'#'} disabled={!FormEditOrNew.validateForm()}> Submit</button>
                </form>
            </Element>
        )
    }
}


const mapDispatchToProps = {FormEditOrNew,sendSystemMessage};

const mapStateToProps = state => {
    return {
        isAuthenticated: !!state.user.authed,
    };
};

export default [
    {
        path: '/role/new',
        exact: true,
        name: 'FormEditOrNew',
        auth: true,
        mainNav: false,
        icon: 'os-icon-pencil-2',
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(FormEditOrNew))
    },
    {
        path: '/role/edit/:roleid',
        exact: true,
        name: 'FormEditOrNew',
        auth: true,
        mainNav: false,
        icon: 'os-icon-pencil-2',
        breadcrumbs: [
            { name: 'edit', path: '/form/edit/' },
            { param: 'roleid', path: '/form/edit/' }

        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(FormEditOrNew))
    }
]
