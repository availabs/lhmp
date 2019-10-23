import React, { Component } from 'react';
import { connect } from 'react-redux';
import {sendSystemMessage} from 'store/modules/messages';

class PromptModal extends Component {
    constructor(props){
        super(props)
        this.state = {
        }

    }

    render () {
        return (
            <div>
                <button className="mr-2 mb-2 btn btn-sm btn-outline-info btn-rounded" type="button"
                        onClick={
                            (e) => document.getElementById('closeMe' + this.props.id).style.display =
                                document.getElementById('closeMe' + this.props.id).style.display === 'block' ? 'none' : 'block'
                        }
                        style={{'float': 'right'}}> ?
                </button>
                <div aria-labelledby="mySmallModalLabel" className='modal fade bd-example-modal-sm show' role="dialog"
                     id={'closeMe' + this.props.id}
                     tabIndex="1" style={{'display': 'none'}} aria-hidden="true">
                    <div className="modal-dialog modal-sm" style={{'float': 'right', marginRight:'15px', marginTop: '30px'}}>
                        <div className="modal-content">
                            <div className="modal-header"><h6 className="modal-title">Prompt</h6>
                                <button aria-label="Close" className="close" data-dismiss="modal" type="button"
                                        onClick={(e) => {
                                         e.target.closest('#closeMe' + this.props.id).style.display = 'none'
                                        }}>
                                    <span aria-hidden="true"> ×</span></button>
                            </div>
                            <div className="modal-body">
                                {this.props.prompt}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = {
    sendSystemMessage
};

const mapStateToProps = state => {
    return {
        isAuthenticated: !!state.user.authed,
        attempts: state.user.attempts // so componentWillReceiveProps will get called.
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PromptModal)