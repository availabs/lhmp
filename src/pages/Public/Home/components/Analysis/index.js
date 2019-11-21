import React, {Component} from 'react';
// import { Link } from 'react-router-dom'
import AvlMap from 'components/AvlMap'

import TractsLayer from './layers/TractsLayer'
import HazardTotalGraph from './components/HazardTotalGraph'
import Element from 'components/light-admin/containers/Element'
// import { connect } from 'react-redux';

// const Section = styled.div

let backgroundCss = {
    //backgroundColor: '#fafafa',
    backgroundSize: '100vw 100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems:'center',
    position: 'relative',
    //marginTop: '100vh',
    //paddingTop: '50px',
    zIndex: '4'
};

const PlaceComponent = (props) => (
    <div>
        <div style={{padding: 20, position: 'relative'}}>
            <h5> Hazard Risk <span style={{fontSize: '14px'}}> Annual Average Loss by Hazard Type (1996-2017)</span>
            </h5>
            <HazardTotalGraph setHazard={props.setHazard}/>
        </div>
    </div>
);


class Analysis extends Component {
    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            update: {
                layer: 'Tracts Layer',
                filter: 'hazard',
                value: 'huricane'
            }
        };
        this.setHazard = this.setHazard.bind(this);
    }

    setHazard(hazard) {
        if (this.state.update.value !== hazard) {
            let update = Object.assign({}, this.state.update);    //creating copy of object
            update.value = hazard;  //updating value
            this.setState({update})
        }


    }

    render() {
        return (
            <div style={backgroundCss}>
                <div className='col-sm-6' style={{float: 'left'}}>
                    <div className="element-wrapper">
                        <div className="element-box">
                            <div style={{height: '100vh', width: '100%'}}>
                                <PlaceComponent setHazard={this.setHazard}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-sm-6' style={{float: 'right'}}>
                    <div className="element-wrapper">
                        <div className="element-box">
                            <div style={{height: '100vh', width: '100%'}}>
                                <AvlMap
                                    id='unique-id-1'
                                    sidebar={false}
                                    scrollZoom={false}
                                    zoom={6}
                                    update={[this.state.update]}
                                    style='Clear'
                                    styles={[{ name: "Clear",
                                        style: "mapbox://styles/am3081/cjvih8vrm0bgu1cmey0vem4ia" }]}
                                    fitBounds={[
                                        [
                                            -79.8046875,
                                            40.538851525354666
                                        ],
                                        [
                                            -71.7626953125,
                                            45.042478050891546
                                        ]]}
                                    layers={[TractsLayer]}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Analysis