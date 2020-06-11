import React from 'react'
import AvatarEditor from './AvatarEditor'
import {URL} from 'store/falcorGraph'
// import Loading from 'components/util/Loading'
const host = URL()

class ImageEditor extends React.Component {
    constructor() {
        super()
        this.state = {
            zoom: 1,
            saving: false,
            error: null
        }
        this._zoom = this._zoom.bind(this)
        this._handleSave = this._handleSave.bind(this)
    }

    _zoom(e) {
        this.setState({
            zoom: e.target.value
        })
    }

    _handleSave() {
        var rect = this.refs.avatar.getCroppingRect()
        // console.log('save',rect,  rect.oWidth, rect.oHeight, rect.width * rect.oWidth, rect.height * rect.oHeight, Math.round(rect.x * rect.oWidth) , Math.round(rect.y * rect.oHeight))
        let args = 'type=' + this.props.type +
            '&typeId=' + this.props.typeId +
            '&image=' + encodeURI(this.props.image) +
            '&width=' + Math.round(rect.width * rect.oWidth) +
            '&height=' + Math.round(rect.height * rect.oHeight) +
            '&x=' + Math.round(rect.x * rect.oWidth) +
            '&y=' + Math.round(rect.y * rect.oHeight)
        // console.log('args', host + 'img/process/?' + args)
        this.setState({
            saving: true
        })
        fetch(host + 'img/process/?' + args)
            .then(response => response.json())
            .then(json => {
                // console.log('saved?', json)
                if (json.errorMessage) {
                    this.setState({
                        saving: false,
                        error: json.errorMessage
                    })
                } else {
                    if (this.props.onSave) {
                        this.props.onSave(json)
                    }
                    this.setState({
                        saving: false,
                        error: null
                    })
                }
            })
    }

    render() {
        return (
            <div>
                <div style={{textAlign: 'center'}}>
                    {this.state.error}
                    <AvatarEditor
                        ref='avatar'
                        image={this.props.image}
                        width={this.props.width || 250}
                        height={this.props.height || 250}
                        border={this.props.border || 1}
                        color={[0, 0, 0, 0.6]} // RGBA
                        scale={+this.state.zoom}
                    />
                </div>
                <div className='row' style={{marginTop: '10px'}}>
                    <div className='col-12' style={{textAlign: 'center'}}>
                        <div className='element-box el-tablo'>
                            <label>
                                Scale: {this.state.zoom}
                            </label>
                            <div className='value' style={{paddingLeft: '10px'}}>
                                <input name='scale' type='range' min='1' max='2' step='0.01' value={this.state.zoom}
                                       onChange={this._zoom}/>
                            </div>
                            {this.state.saving ? <div/> :
                                <button className='btn btn-default' onClick={this._handleSave}> Save </button>}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

// ImageEditor.propTypes = {
//   image: React.PropTypes.string,
//   type: React.PropTypes.string,
//   typeId: React.PropTypes.number,
//   onSave: React.PropTypes.func
// }
export default ImageEditor