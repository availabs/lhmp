import React, {Component} from 'react';
import AvlMap from 'components/AvlMap'
import Element from 'components/light-admin/containers/Element'
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import {connect} from "react-redux";
import styled from "styled-components";
import NfipLossesTable from "./components/NfipLossesTable";
import {falcorGraph} from "../../../../../store/falcorGraph";
import NfipLossesLayer from './components/NfipLossesLayer';

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
class NFIP extends Component {
    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
        };
    }

    fetchFalcorDeps(){
        if (!this.props.activeCousubid || this.props.activeCousubid === 'undefined') return Promise.resolve();
        return this.props.falcor.get(
            ['nfip', 'losses', 'byGeoid', parseInt(this.props.activeCousubid), 'allTime', ['total_payments', 'total_losses']],
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
                                    <div className="col-sm-6">
                                                <BOX>
                                                    <LABEL>Total
                                                        {this.props.activeCousubid.length === 2 ? ' State ' : ' County '}
                                                        NFIP # of losses</LABEL>
                                                    <LABEL style={{fontWeight:'100'}}>
                                                        {get(falcorGraph.getCache(),
                                                            `nfip.losses.byGeoid.${parseInt(this.props.activeCousubid)}.allTime.total_losses`, 0)}
                                                    </LABEL>
                                                </BOX>
                                    </div><div className="col-sm-6">
                                                <BOX>
                                                    <LABEL>Total
                                                        {this.props.activeCousubid.length === 2 ? ' State ' : ' County '}
                                                        $ Payment</LABEL>
                                                    <LABEL style={{fontWeight:'100'}}>
                                                        {get(falcorGraph.getCache(),
                                                            `nfip.losses.byGeoid.${parseInt(this.props.activeCousubid)}.allTime.total_payments`, 0)}
                                                    </LABEL>
                                                </BOX>
                                    </div>

                                </div>
                                <div className='row'>
                                    <NfipLossesTable
                                        title={ "NFIP Losses by Municipality" }
                                    />
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
                                    sidebar={false}
                                    mapactions={false}
                                    scrollZoom={false}
                                    zoom={6}
                                    style='Clear'
                                    styles={[{
                                        name: "Clear",
                                        style: "mapbox://styles/am3081/cjvih8vrm0bgu1cmey0vem4ia"
                                    }]}
                                    fitBounds={[
                                        [
                                            -79.8046875,
                                            40.538851525354666
                                        ],
                                        [
                                            -71.7626953125,
                                            45.042478050891546
                                        ]]}
                                    layers={[NfipLossesLayer]}
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

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(NFIP))