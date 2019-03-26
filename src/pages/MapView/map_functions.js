import mapboxgl from 'mapbox-gl/dist/mapbox-gl'
import get from 'lodash.get'
let d3scale = require('d3-scale')

let colorsList = ['#2266b2', '#479acf', '#9bd0ea', '#f4ae8c', '#dc6147', '#b11021']
let mbtColorsList = [ "hsl(340, 57%, 37%)",  "hsl(180, 56%, 33%)", "hsl(25, 100%, 66%)", "hsl(0, 100%, 70%)","hsl(0, 67%, 50%)"]
  

function calculateColors (tmcList, tmcData, getString) {
  
  getString = getString ? getString : 'pm3.2017.freeflowtt' 

  let dataDomain = tmcList.reduce((output, tmc) => {
    let speedlimit = +get(tmcData.tmc[tmc], 'attributes.avg_speedlimit', false)
    let ff = +get(tmcData.tmc[tmc], getString, false)
    console.log(tmc, speedlimit, ff, speedlimit - ff)
    if(speedlimit && ff) { 
      
      output.push(speedlimit - ff)
    }
    return output
  },[])

  let colorScale = d3scale.scaleQuantile()
    .domain(dataDomain)
    .range(mbtColorsList)

  
  let colors = tmcList.reduce((final, curr) => {
    let speedlimit = +get(tmcData.tmc[curr], 'attributes.avg_speedlimit', 0)
    let ff = +get(tmcData.tmc[curr], getString, 0)
    final[curr] = colorScale(speedlimit - ff)
    return final
  },{})
  return colors;
}

function generateDomain(tmcList,tmcData,epoch, compare, sub) {
  

  return tmcList.reduce((output, tmc) => {
    
    let avgSpeed = +get(tmcData.tmc[tmc], compare, false)
    let currentSpeed = +get(tmcData.tmc[tmc], sub, false)
    if(avgSpeed && currentSpeed) {  
      output.push(avgSpeed - currentSpeed)
    }
    return output
  },[]).sort((a,b) => a - b)

}


function AvgMinusCurrentSpeed (tmcList, tmcData, epoch, date, domain, range) {
  let year = date.split('-')[0]
  let avgSpeedGet = `pm3.${year}.freeflowtt` //`year.2017.avgtt[${epoch}]`
  let currentSpeedGet = `day.${date}.tt[${epoch}]`
  if(!domain || !range) {
    domain = generateDomain(tmcList, tmcData, epoch,avgSpeedGet, currentSpeedGet)
    range = colorsList
  }
 
  let colorScale = d3scale.scaleThreshold()
    .domain(domain)
    .range(range)
 
  return tmcList.reduce((final, curr) => {
    if(!get(tmcData.tmc[curr], currentSpeedGet, false)){
      final[curr] = '#343a41' //if no data for day & epoch make segment background color
    } else {
      let length = +get(tmcData.tmc[curr], 'attributes.length',0)
      let avgSpeed = ((length / +get(tmcData.tmc[curr], avgSpeedGet, 0)) * 3600).toFixed(1)
      let currentSpeed = ((length / +get(tmcData.tmc[curr], currentSpeedGet, 0)) * 3600).toFixed(1)
      final[curr] = colorScale( avgSpeed - currentSpeed)
    }
    return final
  },{})
   
}

export function setEpoch (map, activeTMCS, tmcData, epoch, date, domain, range) {
  if(map.getLayer('interstate-symbology')){
    //console.time('repaint')
    let colors = AvgMinusCurrentSpeed(activeTMCS, tmcData, epoch, date,  domain, range)
    map.setPaintProperty('interstate-symbology', 'line-color', ["get", ["to-string", ["get", "tmc"]], ["literal", colors]]);
    map.setPaintProperty('primary-symbology', 'line-color', ["get", ["to-string", ["get", "tmc"]], ["literal", colors]]);
    //console.timeEnd('repaint')
  }


}


export function setActiveTMCS(map, activeTMCS, tmcData, epoch, date, domain, range) {
    if(map.getLayer('interstate-symbology')){
      map.removeLayer('interstate-symbology')
      map.removeLayer('primary-symbology')
    }

    
    let colors = AvgMinusCurrentSpeed(activeTMCS, tmcData, epoch, date, domain, range)
    let interstateLayer = {
      "id": "interstate-symbology",
      "type": "line",
      "source": "npmrds",
      "source-layer": "npmrds",
      "layout": {
          "line-join": "round",
          "line-cap": "round"
      },
      "paint": {
        "line-color": ["get", ["to-string", ["get", "tmc"]], ["literal", colors]],
        "line-width": {
          "base": 1.5,
          "stops": [
            [3, 1],
            [13, 5],
            [18, 8]
          ]
        },
        "line-offset": {
          "base": 1.5,
          "stops": [
            [5, 0],
            [9, 1],
            [15, 3],
            [18, 7]
          ]
        }
      },
      "filter":  [
        "all",
        ["in", "tmc", ...activeTMCS],
        ["in", "f_system", 1, 2]
      ]
    }

    let primaryLayer = {
      "id": "primary-symbology",
      "type": "line",
      "source": "npmrds",
      "source-layer": "npmrds",
      "layout": {
          "line-join": "round",
          "line-cap": "round"
      },
      "paint": {
        "line-color": ["get", ["to-string", ["get", "tmc"]], ["literal", colors]],
        "line-width":{
          "base": 1.5,
          "stops": [[5, 1], [18, 7]]
        },
        "line-offset": {
          "base": 1.5,
          "stops": [
            [10, 0.5],
            [18, 10]
          ]
        }
      },
      "filter":  [
        "all",
        ["in", "tmc", ...activeTMCS],
        ["!in", "f_system", 1, 2]
      ]
    }

    map.addLayer(primaryLayer, 'waterway-label')
    map.addLayer(interstateLayer, 'waterway-label')
    map.setFilter("npmrds_interstate_selected", ['in','tmc','']);
    map.setFilter("npmrds_primary_selected", ['in','tmc','']);
    



    //console.log('the features', features[0].id, features)
}

export function setHover(map, setInspectTmc) {
   var popup = new mapboxgl.Popup({
    closeButton: false
   });

  // map.setPaintProperty() 
  map.on('mousemove', function(e) {
    var features = map.queryRenderedFeatures(e.point, { layers: ['npmrds_interstate', 'npmrds_primary'] });
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';

    if (!features.length) {
        popup.remove();
        return;
    }

    var feature = features[0];

    popup.setLngLat(e.lngLat)
        .setText(feature.properties.tmc)
        .addTo(map);
  });

  map.on('click', function(e) {
    var features = map.queryRenderedFeatures(e.point, { layers: ['npmrds_interstate', 'npmrds_primary'] });
    // Change the cursor style as a UI indicator.
    var feature = features[0];
    if(feature && feature.properties) {
      setInspectTmc(feature.properties.tmc)
    }
  });


}

export function select(map, selectTMCS) {
    // Disable default box zooming.
    map.boxZoom.disable();

    // Create a popup, but don't add it to the map yet.
   
    map.on('load', function() {
      var canvas = map.getCanvasContainer();

      // Variable to hold the starting xy coordinates
      // when `mousedown` occured.
      var start;

      // Variable to hold the current xy coordinates
      // when `mousemove` or `mouseup` occurs.
      var current;

      // Variable for the draw box element.
      var box;

     

      // Set `true` to dispatch the event before other functions
      // call it. This is necessary for disabling the default map
      // dragging behaviour.
      canvas.addEventListener('mousedown', mouseDown, true);
      map.setFilter("npmrds_interstate_selected", ['in','tmc','']);
      map.setFilter("npmrds_primary_selected", ['in','tmc','']);

      // Return the xy coordinates of the mouse position
      function mousePos(e) {
          var rect = canvas.getBoundingClientRect();
          return new mapboxgl.Point(
              e.clientX - rect.left - canvas.clientLeft,
              e.clientY - rect.top - canvas.clientTop
          );
      }

      function mouseDown(e) {
          // Continue the rest of the function if the shiftkey is pressed.
          if (!(e.shiftKey && e.button === 0)) return;

          // Disable default drag zooming when the shift key is held down.
          map.dragPan.disable();

          // Call functions for the following events
          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);
          document.addEventListener('keydown', onKeyDown);

          // Capture the first xy coordinates
          start = mousePos(e);
      }

      function onMouseMove(e) {
          // Capture the ongoing xy coordinates
          current = mousePos(e);

          // Append the box element if it doesnt exist
          if (!box) {
              box = document.createElement('div');
              box.classList.add('boxdraw');
              canvas.appendChild(box);
          }

          var minX = Math.min(start.x, current.x),
              maxX = Math.max(start.x, current.x),
              minY = Math.min(start.y, current.y),
              maxY = Math.max(start.y, current.y);

          // Adjust width and xy position of the box element ongoing
          var pos = 'translate(' + minX + 'px,' + minY + 'px)';
          box.style.transform = pos;
          box.style.WebkitTransform = pos;
          box.style.width = maxX - minX + 'px';
          box.style.height = maxY - minY + 'px';
      }

      function onMouseUp(e) {
          // Capture xy coordinates
          finish([start, mousePos(e)]);
      }

      function onKeyDown(e) {
          // If the ESC key is pressed
          if (e.keyCode === 27) finish();
      }

      function finish(bbox) {
          // Remove these events now that finish has been called.
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('keydown', onKeyDown);
          document.removeEventListener('mouseup', onMouseUp);

          if (box) {
              box.parentNode.removeChild(box);
              box = null;
          }

          // If bbox exists. use this value as the argument for `queryRenderedFeatures`
          if (bbox) {
              var features = map.queryRenderedFeatures(bbox, { layers: ['npmrds_interstate', 'npmrds_primary'] });

              if (features.length >= 5000) {
                  return window.alert('Select a smaller number of features');
              }

              // Run through the selected features and set a filter
              // to match features with unique FIPS codes to activate
              // the `counties-highlighted` layer.
              var filter = features.reduce(function(memo, feature) {
                  memo.push(feature.properties.tmc);
                  return memo;
              }, ['in', 'tmc']);

              let tmcs = features.map(d => d.properties.tmc)
              selectTMCS(tmcs)


              //map.setFilter("npmrds_primary_selected", filter);
              map.setFilter("npmrds_interstate_selected", 
                ["all",["all",["in", "f_system", 1, 2]],filter]
              );
              map.setFilter("npmrds_primary_selected", 
                ["all",["all",["!in", "f_system", 1, 2]],filter]
              );
             
          }

          map.dragPan.enable();
      }

      
    });
  }

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
