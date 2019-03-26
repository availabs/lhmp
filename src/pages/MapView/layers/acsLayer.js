import { HOST } from './layerHost'
import { addLayers, removeLayers } from './utils'

const npmrdsLayer = {
	name: 'Census ACS',
	loading: false,
	mapBoxSources: {
    nymtc_areas: {
    		type: 'vector',
    		url: 'mapbox://am3081.32hog1ls'
    },
  	},
  	type: 'Road Lines',
	mapBoxLayers: [
	   {
            'id': 'counties',
            'source': 'nymtc_areas',
            'source-layer': 'counties',
            'maxzoom': 10,
            'type': 'fill',
            'paint': {
                'fill-color': 'rgba(0,0,196,0.25)',
            }
        },
        {
            'id': 'census_tracts',
            'source': 'nymtc_areas',
            'source-layer': 'census_tracts',
            'minzoom': 10,
            'maxzoom': 18,
            'type': 'fill',
            'paint': {
                'fill-color': 'rgba(0,0,196,0.25)',
            }
        }
    ],
	filters: {
	},
	onAdd: addLayers,
	onRemove: removeLayers,
	active: false
}

function fetchData ( layer ) {
	
}

function recieveData ( layer, map) {

} 

export default npmrdsLayer;
