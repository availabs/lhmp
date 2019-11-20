import React, {Component} from 'react';
import AvlMap from 'components/AvlMap'
import Element from 'components/light-admin/containers/Element'
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import {connect} from "react-redux";
import styled from "styled-components";
import TractsLayer from './layers/TractsLayer'
import {falcorGraph} from "../../../../../store/falcorGraph";

let backgroundCss = {
    //background: '#fafafa',
    backgroundSize: '100vw 100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems:'center',
    position: 'relative',
    //marginTop: '50vh',
    zIndex: '8'
};
const FLEXBOX = styled.div`
    display: flex;
    justify-content: space-evenly;
    width: 25vw;
    height: 200px;
`
const BOX = styled.div`
     color: rgb(239, 239, 239); 
     background: rgba(0, 0, 0, 0.7); 
     border-radius: 4px;
     overflow: auto;
     height: fit-content;
     margin-left: 10px;
     margin-right: 10px;
     padding: 5px;
     ${props => props.theme.modalScrollBar}
`

const LABEL = styled.div`
    color: rgb(239, 239, 239);
    display: block;
    font-size: 1rem;
    font-weight: 500;
    text-transform: uppercase;
    text-align: center;
    letter-spacing: 1px;
`
class LocalContext extends Component {
    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
        };
    }

    fetchFalcorDeps(){
        if (!this.props.activeCousubid || this.props.activeCousubid === 'undefined') return Promise.resolve();
        return this.props.falcor.get(
            ['acs', parseInt(this.props.activeCousubid), ['2017'],['B19013_001E','B01003_001E','B17001_002E']]
        )
    }

    render() {
        return (
            <div style={backgroundCss}>
                <div className='col-sm-6' style={{float: 'left'}}>
                    <div className="element-wrapper">
                        <div className="element-box">
                            <div style={{height: '100vh', width: '100%'}}>
                                <h1>County</h1>
                                <div className='row'>
                                    <div className="col-sm-4">
                                                <BOX>
                                                    <LABEL>Population</LABEL>
                                                    <LABEL style={{fontWeight:'100'}}>
                                                        {get(falcorGraph.getCache(),
                                                            `acs.${parseInt(this.props.activeCousubid)}.2017.B01003_001E`, null)}
                                                    </LABEL>
                                                </BOX>
                                    </div><div className="col-sm-4">
                                                <BOX>
                                                    <LABEL>% in Poverty</LABEL>
                                                    <LABEL style={{fontWeight:'100'}}>
                                                        {
                                                            ((100 * get(falcorGraph.getCache(),
                                                                    `acs.${parseInt(this.props.activeCousubid)}.2017.B17001_002E`, null))
                                                                /
                                                                get(falcorGraph.getCache(),
                                                                    `acs.${parseInt(this.props.activeCousubid)}.2017.B01003_001E`, null)
                                                            ).toFixed(2)
                                                        }
                                                    </LABEL>
                                                </BOX>
                                    </div><div className="col-sm-4">
                                                <BOX>
                                                    <LABEL>Median Income</LABEL>
                                                    <LABEL style={{fontWeight:'100'}}>
                                                        {get(falcorGraph.getCache(),
                                                        `acs.${parseInt(this.props.activeCousubid)}.2017.B19013_001E`, null)}
                                                    </LABEL>
                                                </BOX>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-sm-6' style={{float: 'right'}}>
                    <div className="element-wrapper">
                        <div className="element-box">
                            <div style={{height: '100vh', width: '100%'}}>
                                <AvlMap
                                    id='unique-id-2'
                                    sidebar={false}
                                    scrollZoom={false}
                                    zoom={6}
                                    update={[this.state.update]}
                                    style='New'
                                    styles={[{ name: "New",
                                        style: "mapbox://styles/am3081/cjhi0xntt5ul52snxcbsnaeii" }]}
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

const mapStateToProps = (state,ownProps) => {
    return {
        activePlan: state.user.activePlan || null,
        activeCousubid: state.user.activeCousubid || null,
        router: state.router,
        graph: state.graph
    };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(LocalContext))