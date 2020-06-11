import React from 'react'
import { reduxFalcor } from 'utils/redux-falcor'
//import styles from './PhotoManager.scss'
// import Dropzone from 'react-dropzone';
import {URL} from 'store/falcorGraph'
// import Modal from '../../../Modal'
import ImageEditor from './ImageEditor'
import ReactS3Uploader from 'react-s3-uploader'

class PhotoManager extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showModal: false,
            currentImage: props.state[this.props.title] || null,
            progress: null,
            error: null
        }
        this._toggleModal = this._toggleModal.bind(this)
        this._onProgress = this._onProgress.bind(this)
        this._onFinish = this._onFinish.bind(this)
        this._onError = this._onError.bind(this)
        this._onSave = this._onSave.bind(this)
    }

    // fetchFalcorDeps () {
    //   if (this.props.type === 'person') {
    //     return this.props.falcor.get(
    //       ['personsById', this.props.typeId, ['name', 'profilePhoto']],
    //     )
    //   } else {
    //     return Promise.resolve(null)
    //   }
    // }
    renderLaunch() {
        return (
            <div className="flex items-center">
        <span className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
          <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
            <path
                d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"/>
          </svg>
        </span>
                <span className="ml-5 rounded-md shadow-sm">
          <button onClick={this._toggleModal} type="button"
                  className="py-2 px-3 border border-gray-300 rounded-md text-sm leading-4 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition duration-150 ease-in-out">
            Change
          </button>
        </span>
            </div>
        )
    }

    _toggleModal() {
        this.setState({showModal: !this.state.showModal})
    }

    _onProgress(prog) {
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
        this.setState({
            currentImage: data.publicUrl,
            progress: null
        })
        this.props.handleChange({target: {id: this.props.title, value: data.publicUrl}})
    }

    _onSave() {
        //console.log('invalidating')
        /*this.props.falcor.invalidate(
            ['personsById', this.props.typeId, ['name', 'profilePhoto']],
        )*/
    }

    renderUpload() {
        if (this.state.currentImage) {
            // console.log('props?', this.props)
            return (
                <div>
                    <ImageEditor
                        image={this.state.currentImage}
                        type={this.props.type}
                        typeId={this.props.typeId}
                        onSave={this._onFinish}
                        height={this.props.height}
                        width={this.props.width}
                        border={this.props.border}
                    />
                    <ReactS3Uploader
                        signingUrl='img/upload/'
                        accept='image/*'
                        onProgress={this._onProgress}
                        onError={this._onError}
                        onFinish={this._onFinish}
                        disabled={this.props.disable_condition ? this.props.state[this.props.disable_condition.attribute] !== this.props.disable_condition.check : null}
                        uploadRequestHeaders={{'x-amz-acl': 'public-read'}}
                        contentDisposition='auto'
                        server={URL()}/>
                </div>
            )
        } else if (this.state.progress) {
            return (
                <div>
                    {this.state.progress}
                </div>
            )
        } else {
            return (
                <ReactS3Uploader
                    signingUrl='img/upload/'
                    accept='image/*'
                    onProgress={this._onProgress}
                    onError={this._onError}
                    onFinish={this._onFinish}
                    disabled={this.props.disable_condition ? this.props.state[this.props.disable_condition.attribute] !== this.props.disable_condition.check : null}
                    uploadRequestHeaders={{'x-amz-acl': 'public-read'}}
                    contentDisposition='auto'
                    server={URL()}/>
            )
        }
    }

    renderModal(pictureStyle, name) {
        return (
            <div>
                {this.renderUpload()}
            </div>
        )
    }

    render() {
        // let currentUser = this.props.user.currentUser.id
        // let leftPhotoUrl = this.props.followUser.profilePic ? this.props.followUser.profilePic : '/img/profile.svg'
        // let leftThumbStyle = {
        //   height: 90,
        //   width: 90,
        //   borderRadius: 90,
        //   margin: 'auto',
        //   backgroundImage: 'url("' + leftPhotoUrl + '")',
        //   backgroundSize: this.props.followUser.profilePic ? 'cover' : 'contain',
        //   backgroundRepeat: 'no-repeat'
        // }
        // let targetUser = this.props.followUser ? this.props.followUser : {}
        // targetUser.name = targetUser.id === currentUser ? 'YOU' : targetUser.first_name + ' ' + targetUser.last_name
        // if (currentUser === targetUser.id || !this.props.graph.usersById) {
        //   return <span />
        // }
        return (
            <div>
                <div className="col-sm-12">
                    <div className="form-group"><label htmlFor={this.props.label}>{this.props.label}
                        <span style={{color: 'red'}}>{this.props.required ? ' *' : null}</span>
                    </label><span
                        style={{'float': 'right'}}>{this.props.prompt !== '' ? this.props.prompt(this.props.title) : ''}</span>
                        {this.renderModal()}
                    </div>
                    <br/>
                </div>
            </div>
        )
    }
}

// PhotoManager.propTypes = {
//   type: React.PropTypes.string,
//   typeId: React.PropTypes.number
// }
export default reduxFalcor(PhotoManager)