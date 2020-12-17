mapboxgl.accessToken = 'pk.eyJ1IjoiYWRhbXZvc2J1cmdoIiwiYSI6ImNrOGE5MDhudzAzcHozbW82cTRnY201ZWEifQ.SyIq-l5sw9Ew6mGRLgfp1w';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/adamvosburgh/ckeddanot0pr31aoc1sjs9juv',
    zoom: 12,
    maxZoom:14,
    minZoom:9,
    center: [-73.9612, 40.8083]
});

map.on('load', function() {

  map.addSource('projects', {
    'type': 'geojson',
    'data': 'MapData_DataVizFinal.geojson',
    //'generateId': true // This ensures that all features have unique IDs
  });

  map.addLayer({
    'id': 'projects',
    'type': 'circle',
    'source': 'projects',
    'paint': {
      'circle-stroke-color': '#000',
    'circle-stroke-width': 1,
    'circle-color': '#000'
    }
  });

  // Create a popup, but don't add it to the map yet.
var popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false
  });
   
  map.on('mouseenter', 'projects', function (e) {
  // Change the cursor style as a UI indicator.
  map.getCanvas().style.cursor = 'pointer';
   
  var coordinates = e.features[0].geometry.coordinates.slice();
  var year = e.features[0].properties.Year;
  var coordinator = e.features[0].properties.Coordinator;
  var professor = e.features[0].properties.prof;
  var student = e.features[0].properties.StudentName;
   
  // Ensure that if the map is zoomed out such that multiple
  // copies of the feature are visible, the popup appears
  // over the copy being pointed to.
  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
  coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  }
   
  // Populate the popup and set its coordinates
  // based on the feature found.
  popup.setLngLat(coordinates).setHTML('<h4>Coordinator: ' + coordinator + ' Professor: ' + professor + '</h4>'
  + '<h2>' + year +  '</h2>'
  + '<p> Students: ' + student + '</p>').addTo(map);
  });
   
  map.on('mouseleave', 'projects', function () {
  map.getCanvas().style.cursor = '';
  popup.remove();
  });


});  
//map.addControl(new mapboxgl.FullscreenControl());
/*
var container = map.getCanvasContainer();
var svg = d3
  .select(container)
  .append("svg")
  .attr("width", "100%")
  .attr("height", "1000")
  .style("position", "absolute")
  .style("z-index", 2);

function project(d) {
    return map.project(new mapboxgl.LngLat(d[0], d[1]));
  }

  d3.dsv(",", "./TestData.csv", function(d) {
  return {
    img: d.DocLink,
    loc: d.Loc,
  };
}).then(function(data) {

 // filter out any empty images
 data = data.filter(function (e) {
  return e.img != "";
})

var locs = uniq(data.map(function (e) {
              return e.loc
            }))
            .map(function (f) {
              return {loc: f, images: [] }
            });
  

  console.log(locs);

  var frames = svg
  .selectAll("circle")
  .data(locs.loc)
  .enter()
  .append("circle")
  .attr("r", 20)
  .style("fill", "ff0000");

  console.log(frames);
/*
  var svgContainer = d3.select("body").append("svg")
                      .attr("width", 200)
                      .attr("height", 260);

  var rectangles = svgContainer.selectAll("rectangle")
                                .data(data.Loc)
                                .enter()
                                .append("rectangle");

  function render() {
    frames
      .attr("cx", function(d) {
        return project(d).x;
      })
      .attr("cy", function(d) {
        return project(d).y;
      });
  }


  map.on("viewreset", render);
map.on("move", render);
map.on("moveend", render);
render(); // Call once to render

});




// to return an array of unique values
function uniq(a) {
  var seen = {};
  return a.filter(function(item) {
      return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  });
}


  //var data = [[-73.93, 40.79], [-73.97, 40.75], [-73.95, 40.72]];

*/
