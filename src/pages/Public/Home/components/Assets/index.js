import React, {Component} from 'react';
import AvlMap from 'components/AvlMap'
import Element from 'components/light-admin/containers/Element'
import { reduxFalcor } from 'utils/redux-falcor'
import get from "lodash.get";
import {connect} from "react-redux";
import styled from "styled-components";
import NfipLossesTable from "./components/NfipLossesTable";
import {falcorGraph} from "../../../../../store/falcorGraph";
import AssetsLayer from './layers/AssetsLayer'
import AssetsPageOwnerTypeEditor from 'components/displayComponents/assetsPageOwnerTypeEditor'
import AssetsPageCriticalTypeEditor from 'components/displayComponents/assetsPageCriticalTypeEditor'

let backgroundCss = {
    //background: '#fafafa',
    backgroundSize: '100vw 100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems:'center',
    position: 'relative',
    //marginTop: '50vh',
    zIndex: '10'
};
const FLEXBOX = styled.div`
    display: flex;
    justify-content: space-evenly;
    width: 25vw;
    height: 200px;
`
const BOX = styled.div`
     color: rgb(239, 239, 239); 
     background: rgba(0, 0, 0, 0); 
     border-radius: 4px;
     overflow: auto;
     height: fit-content;
     width: fit-content;
     margin-left: 10px;
     margin-right: 10px;
     padding: 5px;
     overflow: hidden;
     ${props => props.theme.modalScrollBar};
     
     a {
     background: rgba(0, 0, 0, 0.7); 
     };
     
     a > * {
     color: #ccc !important;
     };
     
     a .label {
     color: #ccc !important;
     };
`

const LABEL = styled.div`
    color: rgb(0, 0, 0);
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
/*`building.byGeoid[{keys:geoids}].critical[{keys:criticalType}][{keys:riskZones}].byIndex[{integers:indices}]`,
    flood_100, critical*/
    render() {
        return (
            <div style={backgroundCss}>
                <div className='col-sm-6' style={{float: 'left'}}>
                    <div className="element-wrapper">
                        <div className="element-box">
                            {/*<div style={{height: '100vh', width: '100%'}}>
                                    <BOX>
                                        <LABEL>
                                            County owned Assets
                                        </LABEL>
                                        <AssetsPageOwnerTypeEditor filter_type={'ownerType'} filter_value={['3']} geoid={[parseInt(this.props.activeCousubid)]} />
                                    </BOX>
                                    <BOX>
                                        <LABEL>
                                            Municipality Owned Assets
                                        </LABEL>
                                        <AssetsPageOwnerTypeEditor filter_type={'ownerType'} filter_value={['4','5','6','7']} geoid={[parseInt(this.props.activeCousubid)]} />
                                    </BOX>
                                <BOX>
                                    <LABEL>
                                        Critical Infrastructure
                                    </LABEL>
                                    <AssetsPageCriticalTypeEditor filter_type={'critical'} filter_value={['all']} geoid={[parseInt(this.props.activeCousubid)]} />
                                </BOX>
                            </div>*/}
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
                                    layers={[AssetsLayer]}
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