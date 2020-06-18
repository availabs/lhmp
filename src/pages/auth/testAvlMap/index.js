import React from 'react';
import AvlMap from 'avlmap-npm/AvlMap';
import TestAvlMapLayer from "./testAvlMap";


class Home extends React.Component {
    TestAvlMapLayer = TestAvlMapLayer()
    // TODO need tp solve the props style problem here in order to give styles as props while rendering AvlMap
    render() {
        console.log('check',TestAvlMapLayer())
        return (
            <div style={ { width: '100%', height: '100vh' } }>
                <AvlMap
                    layers={ [this.TestAvlMapLayer] }
                    zoom={ 13 }
                    center={ [-73.7749, 42.6583] }
                    styles={[
                        { name: "Terrain", style: "mapbox://styles/am3081/cjhi0xntt5ul52snxcbsnaeii" },
                        { name: 'Dark Streets', style: 'mapbox://styles/am3081/ck3rtxo2116rr1dmoppdnrr3g'},
                        { name: 'Light Streets', style: 'mapbox://styles/am3081/ck3t1g9a91vuy1crzp79ffuac'}
                    ]}
                    MAPBOX_TOKEN = 'pk.eyJ1IjoiYW0zMDgxIiwiYSI6IkxzS0FpU0UifQ.rYv6mHCcNd7KKMs7yhY3rw'
                />
            </div>
        )
    }

}


export default {
    path: '/test_avl_map',
    icon: 'os-icon-map',
    component: Home
}