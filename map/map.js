mapboxgl.accessToken = 'pk.eyJ1IjoiYWRhbXZvc2J1cmdoIiwiYSI6ImNrOGE5MDhudzAzcHozbW82cTRnY201ZWEifQ.SyIq-l5sw9Ew6mGRLgfp1w';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/adamvosburgh/ckeddanot0pr31aoc1sjs9juv',
    zoom: 9.5,
    maxZoom:14,
    minZoom:9,
    center: [-73.9612, 40.8083]
});

map.on('load', function() {

  map.addSource('projects', {
    'type': 'geojson',
    'data': 'MapData_DataVizFinal.geojson',
    'generateId': true // This ensures that all features have unique IDs
  });
  map.addSource('columbia', {
    'type': 'geojson',
    'data': {
        'type': 'FeatureCollection',
        'features': [
            {
            // feature for Mapbox DC
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [
                -73.961107,
                40.808329
                ]
                },
                'properties': {
                'title': 'Columbia GSAPP'
                }
                },
        ]
        }
    });

  map.addLayer({
    'id': 'columbia-border',
    'type': 'circle',
    'source': 'columbia',
      'paint': {
      'circle-radius': 5,
      'circle-color': '#296d98',
      }
  });

  map.addLayer({
    'id': 'projects-centroids',
    'type': 'circle',
    'source': 'projects',
    'paint': {
      'circle-stroke-color': '#000',
      'circle-radius':[
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        10,
        5
        ],
    'circle-stroke-width': 1,
    'circle-color': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      '#ffd300',
      '#000'
      ]
    }
  });

  

  // Create a popup, but don't add it to the map yet.
var popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false
  });
   
  var projectID = null;

  map.on('mouseenter', 'projects-centroids', function (e) {
  // Change the cursor style as a UI indicator.
  map.getCanvas().style.cursor = 'pointer';
   
  var coordinates = e.features[0].geometry.coordinates.slice();
  var year = e.features[0].properties.Year;
  var coordinator = e.features[0].properties.Coordinator;
  var professor = e.features[0].properties.Prof;
  var student = e.features[0].properties.StudentName;
  //var img = e.features[0].properites.DocLink;
   
  // Ensure that if the map is zoomed out such that multiple
  // copies of the feature are visible, the popup appears
  // over the copy being pointed to.
  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
  coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  }
   
  // Populate the popup and set its coordinates
  // based on the feature found.
  popup.setLngLat(coordinates).setHTML('<h2>' + year +  '</h2>' + 
  '<h4>Coordinator: ' + coordinator + '<br>' + ' Professor: ' + professor + '</h4>'
  + '<p> Students: ' + student + '</p>').addTo(map);
  
   // Check whether features exist
   if (e.features.length > 0) {

     // If quakeID for the hovered feature is not null,
    // use removeFeatureState to reset to the default behavior
    if (projectID) {
      map.removeFeatureState({
        source: "projects",
        id: projectID
      });
    }

    projectID = e.features[0].id;

    // When the mouse moves over the projects layer, update the
    // feature state for the feature under the mouse
    map.setFeatureState({
      source: 'projects',
      id: projectID,
    }, {
      hover: true
    });

  }

});
   
  map.on('mouseleave', 'projects-centroids', function () {
  map.getCanvas().style.cursor = '';
  popup.remove();
  if (projectID) {
    map.setFeatureState({
      source: 'projects',
      id: projectID
  }, {
    hover: false
  });
  }

  projectID = null;
  // Remove the information from the previously hovered feature from the sidebar
  map.getCanvas().style.cursor = '';
  });


});  
