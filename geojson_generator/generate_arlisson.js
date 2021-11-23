const fs = require('fs');
let date = '2021/11/19';
let team = 'Carryber';
let experimentalName = 'e2e_1023_carryber';
let startLat = 35.64310167;
let startLng = 139.52329000;
let subGoalLat = 35.64313073; 
let subGoalLng = 139.52337503;
let goalLat = 35.64325030;
let goalLng = 139.52337503;
let subGoalNumber = 1;

let folderName = './log/' + experimentalName;
let gpsLog = fs.readFileSync(folderName + '/gps.csv', 'utf-8');
let nineaxisLog = fs.readFileSync(folderName + '/nineaxis.csv', 'utf-8');
let gpsLine = gpsLog.split('\n');
let nineaxisLine = nineaxisLog.split('\n');
let arlisson = '';
let i;
let startIdx = 1;

// Add contents
arlisson += '{\n';
arlisson += '\t"date": "' + date + '",\n';
arlisson += '\t"team": "' + team + '",\n';
arlisson += '\t"experimental_name": "' + experimentalName + '",\n';
arlisson += '\t"setting": {\n';
arlisson += '\t\t"start": {\n';
arlisson += '\t\t\t"latitude": ' + startLat + ',\n';
arlisson += '\t\t\t"longitude": ' + startLng + '\n';
arlisson += '\t\t},\n';
arlisson += '\t\t"sub_goal": {\n';
arlisson += '\t\t\t"latitude": [\n';
for(i = 0; i < subGoalNumber; i++){
    arlisson += '\t\t\t\t' + subGoalLat;
    if(i != subGoalNumber - 1){
        arlisson += ',\n';
    }else{
        arlisson += '\n';
    }
}
arlisson += '\t\t\t],\n';
arlisson += '\t\t\t"longitude": [\n';
for(i = 0; i < subGoalNumber; i++){
    arlisson += '\t\t\t\t' + subGoalLng;
    if(i != subGoalNumber - 1){
        arlisson += subGoalLng + ',\n';
    }else{
        arlisson += '\n';
    }
}
arlisson += '\t\t\t]\n';
arlisson += '\t\t},\n';
arlisson += '\t\t"goal": {\n';
arlisson += '\t\t\t"latitude": ' + goalLat + ',\n';
arlisson += '\t\t\t"longitude": ' + goalLng + '\n';
arlisson += '\t\t}\n';
arlisson += '\t},\n';
arlisson += '\t"log": {\n';
arlisson += '\t\t"sub_goal": {\n';
arlisson += '\t\t\t"latitude": [\n';
for(i = 0; i < subGoalNumber; i++){
    arlisson += '\t\t\t\t' + subGoalLat;
    if(i != subGoalNumber - 1){
        arlisson += ',\n';
    }else{
        arlisson += '\n';
    }
}
arlisson += '\t\t\t],\n';
arlisson += '\t\t\t"longitude": [\n';
for(i = 0; i < subGoalNumber; i++){
    arlisson += '\t\t\t\t' + subGoalLng;
    if(i != subGoalNumber - 1){
        arlisson += ',\n';
    }else{
        arlisson += '\n';
    }
}
arlisson += '\t\t\t]\n';
arlisson += '\t\t},\n';
arlisson += '\t\t"goal": {\n';
arlisson += '\t\t\t"latitude": ' + goalLat + ',\n';
arlisson += '\t\t\t"longitude": ' + goalLng + '\n';
arlisson += '\t\t},\n';
arlisson += '\t\t"time": [\n';
for(i = 1; i < gpsLine.length - 1; i++){
    let contents = gpsLine[i].split(',');
    contents.splice(contents.indexOf('', 1));
    if(contents[2] == 'nan' || contents[3] == 'nan'){
        startIdx++;
    }else{
        arlisson += '\t\t\t"' + contents[0] + '"';
        if(i != gpsLine.length - 2){
            arlisson += ',\n';
        }else{
            arlisson += '\n';
        }
    }
}
arlisson += '\t\t],\n';
arlisson += '\t\t"gps": {\n';
arlisson += '\t\t\t"latitude": [\n';
for(i = startIdx; i < gpsLine.length - 1; i++){
    let contents = gpsLine[i].split(',');
    arlisson += '\t\t\t\t' + contents[2];
    if(i != gpsLine.length - 2){
        arlisson += ',\n';
    }else{
        arlisson += '\n';
    }
}
arlisson += '\t\t\t],\n';
arlisson += '\t\t\t"longitude": [\n';
for(i = startIdx; i < gpsLine.length - 1; i++){
    let contents = gpsLine[i].split(',');
    arlisson += '\t\t\t\t' + contents[3];
    if(i != gpsLine.length - 2){
        arlisson += ',\n';
    }else{
        arlisson += '\n';
    }
}
arlisson += '\t\t\t]\n';
arlisson += '\t\t},\n';
arlisson += '\t\t"azimuth": [\n';
for(i = startIdx; i < nineaxisLine.length - 1; i++){
    let contents = nineaxisLine[i].split(',');
    arlisson += '\t\t\t' + contents[18];
    if(i != nineaxisLine.length - 2){
        arlisson += ',\n';
    }else{
        arlisson += '\n';
    }
}
arlisson += '\t\t]\n';
arlisson += '\t}\n';
arlisson += '}';

output_folder = "../map_for_arliss/public/json/" + experimentalName + ".json"
fs.writeFile(output_folder, arlisson, "utf8", (err) => {
    if(err) console.log(err);
});