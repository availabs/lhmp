import React from 'react'
import AvatarEditor from "../editComponents/imageComponent/AvatarEditor";

class imageViewer extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            zoom: 1
        }
    }

    render() {

        return (
            <div style={{width: 550, margin: '0 auto'}}>
                <AvatarEditor
                    ref='avatar'
                    image={this.props.image}
                    width={this.props.width || 250}
                    height={this.props.height || 250}
                    border={this.props.border || 150}
                    color={[0, 0, 0, 0]} // RGBA
                    scale={+this.state.zoom}
                />
            </div>
        )
    }
}

export default imageViewer;