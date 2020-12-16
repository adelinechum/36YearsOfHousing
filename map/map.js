mapboxgl.accessToken = 'pk.eyJ1IjoiYWRhbXZvc2J1cmdoIiwiYSI6ImNrOGE5MDhudzAzcHozbW82cTRnY201ZWEifQ.SyIq-l5sw9Ew6mGRLgfp1w';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/adamvosburgh/ckeddanot0pr31aoc1sjs9juv',
    zoom: 13,
    center: [-73.9612, 40.8083]
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
