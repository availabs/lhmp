import React from 'react'
import AvlMap from 'components/AvlMap';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import EvacuationRoutesFactory from "../../pages/auth/EvacuationRoutes/layers/evacuationRoutesLayer";

class EvacuationRoutesViewer extends React.Component {
    evacuationRoutesLayer = EvacuationRoutesFactory({ active: true, viewOnly: true});
    render() {
        return (
            <div style={{width: '75vw', height: '70vh'}}>
                <AvlMap
                    layers={[this.evacuationRoutesLayer
                    ]}
                    zoom={13}
                    center={[-73.7749, 42.6583]}
                    styles={[
                        {name: 'Dark Streets', style: 'mapbox://styles/am3081/ck3rtxo2116rr1dmoppdnrr3g'},
                        {name: 'Light Streets', style: 'mapbox://styles/am3081/ck3t1g9a91vuy1crzp79ffuac'}
                    ]}
                    sidebar={false}
                />
            </div>
        )
    }

}

export default (reduxFalcor(EvacuationRoutesViewer))