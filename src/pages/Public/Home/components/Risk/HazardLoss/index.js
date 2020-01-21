import React, {Component} from 'react';
import AvlMap from 'components/AvlMap'

import { reduxFalcor } from 'utils/redux-falcor'
import {connect} from "react-redux";
import get from "lodash.get";

import TractsLayer from './layers/TractsLayer'
import HazardTotalGraph from './components/HazardTotalGraph'


import {
    VerticalAlign,
    ContentHeader,
    PageContainer,
    HeaderContainer,
    backgroundColor
} from 'pages/Public/theme/components'


TractsLayer.backgroundColor = backgroundColor;

const PlaceComponent = (props) => (
    <div>
        <div style={{padding: 20, position: 'relative'}}>
            <ContentHeader> Hazard Risk <span style={{fontSize: '14px'}}> Annual Average Loss by Hazard Type (1996-2017)</span>
            </ContentHeader>
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
                value: 'riverine'
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
            <PageContainer >
                <HeaderContainer>
                    <div className='row'>
                        <div className='col-12' style={{textAlign:'center'}}>
                            <ContentHeader>
                                {get(this.props.graph, `geo[${parseInt(this.props.activeCousubid)}].name`, '')} Hazard Loss
                            </ContentHeader>
                        </div>
                    </div>
                <div className='row'>
                    <div className='col-lg-6'>
                        <VerticalAlign>
                            
                                <PlaceComponent setHazard={this.setHazard}/>
                           
                        </VerticalAlign>
                       
                    </div>
                    <div className='col-lg-6' >
                        
                        <div style={{height: '80vh', width: '100%'}}>
                            <AvlMap
                                sidebar={false}
                                mapactions={false}
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
                                layerProps={ {
                                    [TractsLayer.name]: {
                                        hazard: this.state.update.value
                                    }
                                } }
                            />
                        </div>

                    </div>
                </div>
                </HeaderContainer>
            </PageContainer >
        )
    }
}

const mapStateToProps = (state,ownProps) => {
    return {
        activePlan: state.user.activePlan || null,
        activeCousubid: state.user.activeCousubid || null,
        router: state.router,
        graph: state.graph
    };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Analysis))