import mapboxgl from 'mapbox-gl/dist/mapbox-gl'
import Tooltip from  '../components/tooltip/Tooltip'
import { renderToString } from 'react-dom/server'
import React from 'react';

export const addLayers = (mapLayer, map, beneath)  =>  {
  beneath = beneath || 'waterway-label'
  
  console.log('test', beneath, mapLayer.name)
  Object.keys(mapLayer.mapBoxSources).forEach(source => {
  	map.addSource(source, mapLayer.mapBoxSources[source])
  })

  mapLayer.mapBoxLayers.forEach(layer => {
  		map.addLayer(layer, beneath);
  })
  console.log('test', beneath, mapLayer.name)
  

}


export const removeLayers = (mapLayer, map) => {
	mapLayer.mapBoxLayers.forEach(layer => {
  		map.removeLayer(layer.id)
  	})
}


export const addPopUp =  (map, layer, options) => {
    var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });



    map.on('mouseenter', layer, function(e) {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';

        var coordinates = e.features[0].geometry.coordinates.slice();
        var description = e.features[0].properties.Vehicles;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        let tooltiphtml = renderToString(<Tooltip rows={options.rows} feature={e.features[0]} />)

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(coordinates)
            .setHTML(tooltiphtml)
            .addTo(map);
    });

    map.on('mouseleave', layer, function() {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });
}