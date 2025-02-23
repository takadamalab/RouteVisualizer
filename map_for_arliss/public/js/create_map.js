// Japan map
let japanMap = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/ort/{z}/{x}/{y}.jpg', {
    attribution: "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>",
    maxZoom: 30,
    maxNativeZoom: 18,

});
// World map
let worldMap = L.tileLayer('http://{s}.tile.stamen.com/{variant}/{z}/{x}/{y}.png', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>',
    variant: 'toner-lite',
    maxZoom: 30,
    maxNativeZoom: 20
});

function makeMap(){
    //20201210_01.json
    //20201212.json
    $.getJSON('./json/e2e_1023_carryber.json', (log) => {
        let targetPoints, idealPath, realPath, realPoints, arrows;
        targetPoints = updateTargetPoints(log);
        idealPath = updateIdealPath(log);
        realPoints = updateRealPoints(log);
        realPath = updateRealPath(log);
        arrows = updateArrows(log);

        let baseMaps = {
            "Japan": japanMap,
            "World": worldMap
        }
        let overlayMaps = {
            "Target points": targetPoints,
            "Ideal path": idealPath,
            "Real points": realPoints,
            "Real path": realPath,
            "Direction": arrows,
        }

        let map = L.map('mapid', {
            center: L.latLng(log.setting.start.latitude, log.setting.start.longitude),
            zoom: 20,
            layers: [
                worldMap,
                targetPoints,
                idealPath,
                realPoints,
                realPath,
                arrows
            ]
        });
        //スケールコントロールを最大幅200px、右下、m単位で地図に追加
        L.control.scale({ maxWidth: 200, position: 'bottomright', imperial: false }).addTo(map);
        L.control.layers(baseMaps, overlayMaps).addTo(map);
    });
}

function updateTargetPoints(data){
    let start = L.circle(L.latLng(data.setting.start.latitude, data.setting.start.longitude), {color: 'blue', radius: 2.0});
    let sample01 = L.circle(L.latLng(data.setting.sub_goal.latitude[0], data.setting.sub_goal.longitude[0]), {color: 'blue', radius: 2.0});
    // let sample02 = L.circle(L.latLng(data.setting.sub_goal.latitude[1], data.setting.sub_goal.longitude[1]), {color: 'green', radius: 0.1});
    let goal = L.circle(L.latLng(data.setting.goal.latitude, data.setting.goal.longitude), {color: "blue", radius: 2.0});
    return L.layerGroup([start, sample01, goal]);
}

function updateIdealPath(data){
    let start = L.latLng(data.setting.start.latitude, data.setting.start.longitude);
    let sub01 = L.latLng(data.setting.sub_goal.latitude[0], data.setting.sub_goal.longitude[0]);
    // let sub02 = L.latLng(data.setting.sub_goal.latitude[1], data.setting.sub_goal.longitude[1]);
    let goal = L.latLng(data.setting.goal.latitude, data.setting.goal.longitude);
    // if(start.distanceTo(sub02) < start.distanceTo(sub01)){
    //     let temp = sub01;
    //     sub01 = sub02;
    //     sub02 = temp;
    // }
    let path_to_sub = L.polyline([
        start,
        sub01,
    ],{
        "color": "blue",
        "weight": 3,
        "opacity": 1,
        "dashArray": '5, 10'
    });

    let path_to_main = L.polyline([
        start,
        goal
    ],{
        "color": "blue",
        "weight": 3,
        "opacity": 1,
        "dashArray": '5, 10'
    });
    return L.layerGroup([path_to_sub, path_to_main]);
}

function updateRealPoints(data){
    let sub01 = L.circle(L.latLng(data.log.sub_goal.latitude[0], data.log.sub_goal.longitude[0]), {color: 'red', radius: 0.1});
    // let sub02 = L.circle(L.latLng(data.log.sub_goal.latitude[1], data.log.sub_goal.longitude[1]), {color: '#66cdaa', radius: 0.1});
    let goal = L.circle(L.latLng(data.log.goal.latitude, data.log.goal.longitude), {color: 'red', radius: 0.1});
    return L.layerGroup([sub01, goal]);
}

function updateRealPath(data){
    let i;
    let coordinates = [];
    for(i = 0; i < data.log.gps.latitude.length; i++){
        coordinates.push(L.latLng(data.log.gps.latitude[i], data.log.gps.longitude[i]));
    }
    let path = L.polyline(
        coordinates,
        {
            "color": "red",
            "weight": 2,
            "opacity": 1,
            // "dashArray": '5, 10'
        }
    );
    return L.layerGroup([path]);
}

function updateArrows(data){
    let i;
    let interval = 500;
    let arrowLength = 0.00002;
    let arrows = [];
    let coord = [];
    let times = [];
    for(i = 0; i < data.log.azimuth.length; i += interval){
        let coordinates = L.latLng(data.log.gps.latitude[i], data.log.gps.longitude[i]);
        let rotatedCoordinates = L.latLng(
            data.log.gps.latitude[i] + arrowLength * Math.cos(Math.PI / 180 * (data.log.azimuth[i])),
            data.log.gps.longitude[i] + arrowLength * Math.sin(Math.PI / 180 * (data.log.azimuth[i]))
        );
        let arrow = L.polyline(
            [coordinates, rotatedCoordinates],
            {
                color: "red"
            }
        );
        let root = L.circle(coordinates, {color: "red", radius: 0.1});
        arrows.push(arrow);
        arrows.push(root);
        coord.push(coordinates);
        times.push(data.log.time[i]);
    }
    return L.layerGroup(arrows); 
}

function rotateArrows(arrows, data){
    let i;
    let azimuth = data.features[0].geometry.azimuth;
    for(i = 0; i < Object.keys(arrows._layers).length; i++){
        let arrow = document.getElementsByClassName('arrow-icon-' + i);
        let translated3d = arrow[0].style.transform;
        let angle = azimuth[i] + 180;
        arrow[0].style.transform = translated3d + " rotate("+ angle +"deg)";
        arrow[0].style.transformOrigin = "50% 50%";
    }
}