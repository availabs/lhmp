import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { createMatchSelector } from 'react-router-redux';
class TableView extends Component {
    constructor(props) {
        super(props)
        this.state = {
        };

    }

    fetchFal
    render(){
        console.log('table', this.props)
        return (
            <table className="table table lightBorder">
                <thead>
                <tr>
                    <th>
                        ATTRIBUTE
                    </th>
                    <th>
                        VALUE
                    </th>
                    {this.props.edit ? (<th>
                        <a className="btn btn-sm btn-outline-primary" href="/roles/edit/7">Edit</a>
                    </th>) : ''}
                </tr>
                </thead>
                <tbody>
                {Object.keys(this.props.data).map(d =>
                <tr>
                    <td>{d}</td>
                    {this.props.edit ?
                        <td colSpan={2}>{this.props.data[d]}</td>
                        :  <td >{this.props.data[d]}</td>
                    }

                </tr>
                )}
                </tbody>
            </table>
        )
    }
}

const mapDispatchToProps = {};

const mapStateToProps = state => {
    return {
        isAuthenticated: !!state.user.authed,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableView)
