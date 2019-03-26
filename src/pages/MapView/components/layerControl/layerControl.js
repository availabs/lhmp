import React, {Component} from 'react';
import { connect } from 'react-redux';
import LayerHeader from './layerHeader'
import LayerFilterPanel from './layerFilterPanel'


// import deepEqual from 'deep-equal'

 class LayerControl extends Component {
 
  render() {
    const { layer, layerName, theme } = this.props
    let LayerControlStyle = {
      width: '100%',
      display: 'flex',
      marginBottom: 5,
      backgroundColor: theme.sidePanelHeaderBg
    }
    
    

    return (
      <div>
        <div className='active-layer-container' style={LayerControlStyle}>
          <LayerHeader layerName={layerName} />
        </div>
        <LayerFilterPanel layerName={layerName} />
      </div>
    );
  }
}

LayerControl.defaultProps = {
  isOpen: true
}

const mapDispatchToProps = {
}

const mapStateToProps = (state,ownProps) => {
  return {
    theme: state.map.theme,
    layer: state.map.layers[ownProps.layerName],
    update: state.map.update
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(LayerControl)