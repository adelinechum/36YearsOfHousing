mapboxgl.accessToken = 'pk.eyJ1IjoiYWRhbXZvc2J1cmdoIiwiYSI6ImNrOGE5MDhudzAzcHozbW82cTRnY201ZWEifQ.SyIq-l5sw9Ew6mGRLgfp1w';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/adamvosburgh/ckeddanot0pr31aoc1sjs9juv',
    zoom: 13,
    center: [-73.9612, 40.8083]
});
map.addControl(new mapboxgl.FullscreenControl());