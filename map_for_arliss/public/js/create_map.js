// ########################ここから任意の設定########################
// Ideal Coordinate
let startCoordinate = [35.6433167, 139.5236433];
let samplingCoordinate1 = [35.6432850, 139.5235217];
let samplingCoordinate2 = [35.6431950, 139.5235183];
let goalCoordinate = [35.6431617, 139.5233283];

// Estimated Coordinate
let estimatedSamplingCoordinate1 = [35.6432717, 139.5235500];
let estimatedSamplingCoordinate2 = [35.6432017, 139.5235450];
let estimatedGoalCoordinate = [35.6431467, 139.5233483];
// ########################ここまで任意の設定########################

// Map container
let mymap;

// Japan map
let japanMap = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/ort/{z}/{x}/{y}.jpg', {
    attribution: "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>",
    maxZoom: 30,
    maxNativeZoom: 18
});

let worldMap = L.tileLayer('http://{s}.tile.stamen.com/{variant}/{z}/{x}/{y}.png', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>',
    variant: 'toner-lite',
    maxZoom: 30,
    maxNativeZoom: 20
})

// Target points (start, sample01, sample02, goal)
let targetPoints; repaintTargetPoints();
let idealPath; repaintIdealPath();
let realPath; repaintRealPath();
let arrowMarkers;

mymap = L.map('mapid', {
    center: [35.658137599999996, 139.5392512],
    zoom: 8,
    layers: [worldMap, targetPoints, idealPath]
});

let baseMaps = {
    "Japan": japanMap,
    "World": worldMap
}
let overlayMaps = {
    "Target points": targetPoints,
    "Ideal path": idealPath,
}

L.control.layers(baseMaps, overlayMaps).addTo(mymap);

// Process in events
mymap.on('zoomstart', function(e){
    rotateArrow();
});
mymap.on('zoomend', function(e){
    rotateArrow();
});
mymap.on('zoom', function(e){
    rotateArrow();
});

// Estimated Coordinate
var samplingPoint1Estimate = L.circle(estimatedSamplingCoordinate1, {color: 'orange', radius: 0.1}).addTo(mymap);
var samplingPoint2Estimate = L.circle(estimatedSamplingCoordinate2, {color: '#66cdaa', radius: 0.1}).addTo(mymap);
var goalPointEstimate = L.circle(estimatedGoalCoordinate, {color: '#ffffff', radius: 0.1}).addTo(mymap);

var azimuths = [];
$.getJSON("./geojson/arrow_point_azimuth.geojson", function(data) {
    let i;
    var azimuth = data.features[0].geometry.azimuth;
    for(i = 0; i < azimuth.length; i++){
        azimuths.push(azimuth[i]);
    }
});

var markers = [];
$.getJSON("./geojson/arrow_point.geojson", function(data) {
    let i;
    var points = data.features[0].geometry.coordinates;
    for(i = 0; i < points.length; i++){
        let arrowIcon = L.icon({
            iconUrl: './figure/arrow01.png',
            iconAnchor: [12, 50],
            className: 'arrow-icon-' + i
        });
        let marker = L.marker([points[i][1], points[i][0]], {
            icon: arrowIcon
        });
        markers.push(marker);
        marker.addTo(mymap);
    }
});

function rotateArrow(){
    let i;
    for(i = 0; i < markers.length; i++){
        var icon = document.getElementsByClassName('arrow-icon-' + i);
        var translated3d = icon[0].style.transform;
        var angle = azimuths[i] + 180;
        icon[0].style.transform = translated3d + " rotate("+ angle +"deg)";
        icon[0].style.transformOrigin = "50% 50%";
    }
}

function updateCoordinates(){
    startCoordinate = [document.getElementById("start-latitude").value, document.getElementById("start-longtitude").value];
    samplingCoordinate1 = [document.getElementById("sampling-latitude-01").value, document.getElementById("sampling-longtitude-01").value];
    samplingCoordinate2 = [document.getElementById("sampling-latitude-02").value, document.getElementById("sampling-longtitude-02").value];
    goalCoordinate = [document.getElementById("goal-latitude").value, document.getElementById("goal-longtitude").value];
    repaintTargetPoints();
}

function repaintTargetPoints(){
    let start = L.circle(startCoordinate, {color: 'blue', radius: 0.1});
    let sample01 = L.circle(samplingCoordinate1, {color: 'yellow', radius: 0.1});
    let sample02 = L.circle(samplingCoordinate2, {color: 'green', radius: 0.1});
    let goal = L.circle(goalCoordinate, {color: 'red', radius: 0.1});
    targetPoints = L.layerGroup([start, sample01, sample02, goal]);
}

function repaintIdealPath(){
    let path = L.polyline([
        startCoordinate,
        samplingCoordinate1,
        samplingCoordinate2,
        goalCoordinate
    ],{
        "color": "#0000FF",
        "weight": 1,
        "opacity": 1
    });
    idealPath = L.layerGroup([path]);
}

function repaintRealPath(){ 
    $.getJSON("./geojson/real_path.geojson", function (data) {
        let path = L.geoJson(data,{
            style: function(feature){
                return {color: "#FF0000"};
            }
        }).addTo(mymap);
    });
}