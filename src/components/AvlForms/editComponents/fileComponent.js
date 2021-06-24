import React from 'react'
import {URL} from "../../../store/falcorGraph";
import ReactS3Uploader from "react-s3-uploader";

class FileComponent extends React.PureComponent{
    constructor(props){
        super(props);
        this.state = {currentFile : props.state[props.title]}

        this._onProgress = this._onProgress.bind(this)
        this._onFinish = this._onFinish.bind(this)
        this._onError = this._onError.bind(this)
    }
    _onProgress(prog) {
        if(prog < 5 || prog === 100){
            this.props.handleChange({target: {id: 'loading', value: prog !== 100}})
        }
        this.setState({
            progress: prog
        })
    }

    _onError(error) {
        console.log('Error: ', error)
        this.setState({
            error: error
        })
    }

    _onFinish(data) {
        this.props.handleChange({target: {id: this.props.title, value: data.publicUrl}})

        this.setState({
            currentFile: data.publicUrl,
            progress: null
        })
    }
    render() {
        if(this.props.display_condition !== '' && this.props.display_condition){
            return (
                <div className="col-sm-12">
                    <div className="form-group" style={{display:this.props.display_condition.check.includes(this.props.state[this.props.display_condition.attribute]) ? 'block' : 'none'}}>
                        <label htmlFor={this.props.label}>{this.props.label}
                            <span style={{color: 'red'}}>{this.props.required ? ' *' : null}</span>
                        </label><span style={{'float': 'right'}}>{this.props.prompt !== '' ? this.props.prompt(this.props.title) : ''}</span>
                        <ReactS3Uploader
                            signingUrl='img/upload/'
                            // accept='image/*'
                            onProgress={this._onProgress}
                            onError={this._onError}
                            onFinish={this._onFinish}
                            disabled={this.props.disable_condition ? this.props.state[this.props.disable_condition.attribute] !== this.props.disable_condition.check : null}
                            uploadRequestHeaders={{'x-amz-acl': 'public-read'}}
                            contentDisposition='auto'
                            server={URL()}/>                    </div>
                    <br/>
                </div>

            )
        }else{
            return (
                <div className="col-sm-12">
                    <div className="form-group"><label htmlFor={this.props.label}>{this.props.label}
                        <span style={{color: 'red'}}>{this.props.required ? ' *' : null}</span>
                    </label><span style={{'float': 'right'}}>{this.props.prompt !== '' ? this.props.prompt(this.props.title) : ''}</span>
                        <div className='form-control'>
                            <ReactS3Uploader
                                signingUrl='img/upload/'
                                // accept='image/*'
                                onProgress={this._onProgress}
                                onError={this._onError}
                                onFinish={this._onFinish}
                                disabled={this.props.disable_condition ? this.props.state[this.props.disable_condition.attribute] !== this.props.disable_condition.check : null}
                                uploadRequestHeaders={{'x-amz-acl': 'public-read'}}
                                contentDisposition='auto'
                                server={URL()}/>
                        </div>
                    </div>
                    <br/>
                </div>
            )
        }

    }

}

export default FileComponent;