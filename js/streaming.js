let url = location.href;

let urlSplit = url.split("?");

let credentialsParts = urlSplit[1].split('&');

let sessionId = credentialsParts[0].replace("sessionid=", "");
let token = credentialsParts[1].replace("token=", "");
let latitud = parseFloat(credentialsParts[2].replace("latitud=", ""));
let longitud = parseFloat(credentialsParts[3].replace("longitud=", ""));
console.log(sessionId + " - " + token);

var map;

var markerStart;
var marker = "no";

let socket = io();

var map = L.map('map').setView([latitud, longitud], 18);
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
	maxZoom: 18}).addTo(map);
L.control.scale().addTo(map);

L.AwesomeMarkers.Icon.prototype.options.prefix = 'ion';

var locationMarker = L.AwesomeMarkers.icon({
    icon: 'ion-model-s',
    markerColor: 'red'
});

var initMarker = L.AwesomeMarkers.icon({
    icon: 'ion-flag',
    markerColor: 'green'
});

var marker = L.marker([latitud, longitud], {draggable: false});
marker.bindPopup("<center>Posición inicial</center>");
marker.on('mouseover', function (e) {
    this.openPopup();
});
marker.on('mouseout', function (e) {
    this.closePopup();
});
marker.setIcon(initMarker);
marker.addTo(map);

var markerLocation;

socket.emit("listen_location");
socket.on('location', function(data){

	if(markerLocation != null && markerLocation != "undefined")
		map.removeLayer(markerLocation);

	markerLocation = L.marker([data["latitud"], data["longitud"]], {draggable: false});
	markerLocation.bindPopup("<center>Posición actual</center>");
	markerLocation.on('mouseover', function (e) {
	    this.openPopup();
	});
	markerLocation.on('mouseout', function (e) {
	    this.closePopup();
	});
	markerLocation.setIcon(locationMarker);
	markerLocation.addTo(map);

	map.setView([data["latitud"], data["longitud"]], 18);
});

initializeSession("46127092", sessionId, token);

var connected = false;

var recorderManager;
var recorder;
var player;
var recImgData;

var VIDEO_HEIGHT = 240;
var VIDEO_WIDTH = 320;

function handleError(error){
	if(error){
		alert(error.message);
	}
}

function initializeSession(apiKey, sessionId, token){
	var session = OT.initSession(apiKey, sessionId);

	session.on('streamCreated', function(event){
		session.subscribe(event.stream, 'subscriber', {
			insertMode : 'append',
			width : '75%',
			height : '100%'
		}, handleError);
	});

	var publisher = OT.initPublisher('publisher', {
		insertMode : 'append',
		width : '100%',
		height : '100%'
	}, handleError);


	session.connect(token, function(error){
		if(error)
			handleError(error);
		else{
			if(connected == false){
				connected = true;
				session.publish(publisher, handleError);
			}
		}
	});
}
