//var apiKey = "46127092";
//var sessionId = "2_MX40NjEyNzA5Mn5-MTUyNzUxMzMyNDUzOX5aY2JDRGJadlN6OXRoSWxmNUVhcTlvZnN-fg";
//var token = "T1==cGFydG5lcl9pZD00NjEyNzA5MiZzaWc9NDNjNWJkZWI3NzhlMjMyZGJlZTJhYmZhZjJkNmYwN2RhNmY3Mzc1ZDpzZXNzaW9uX2lkPTJfTVg0ME5qRXlOekE1TW41LU1UVXlOelV4TXpNeU5EVXpPWDVhWTJKRFJHSmFkbE42T1hSb1NXeG1OVVZoY1RsdlpuTi1mZyZjcmVhdGVfdGltZT0xNTI3NTEzNDA5Jm5vbmNlPTAuMjY5NjQ2NDcxNjMzNTY4OSZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNTMwMTA1NDEwJmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9";

//1_MX40NjEyNzA5Mn5-MTUyODE3MDQ4Njc0MX5wV0IxNUs3OGtsMlVpbVMyUUlOWEVCSVF-fg
//T1==cGFydG5lcl9pZD00NjEyNzA5MiZzaWc9NTc3MGRjMDdlOTkyOTE0NDM4NDY0MGZjODBlNWQ1ODkzYzVlNTQ1YzpzZXNzaW9uX2lkPTFfTVg0ME5qRXlOekE1TW41LU1UVXlPREUzTURRNE5qYzBNWDV3VjBJeE5VczNPR3RzTWxWcGJWTXlVVWxPV0VWQ1NWRi1mZyZjcmVhdGVfdGltZT0xNTI4MTcwNTM1Jm5vbmNlPTAuODU0MzkyNjgzNDg0NDE1NSZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNTMwNzYyNTM1JmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9

//2_MX40NjEyNzA5Mn5-MTUyODE3MDU5MjAyNX5SdFQ0VVZiYXJjbUkydWkyamNZbVp5bnV-fg
//T1==cGFydG5lcl9pZD00NjEyNzA5MiZzaWc9MmY3M2ZkMGE0ZjY0YjkwNzdhMDRkNjhkZTJiOTI2YTlmN2M0NGQyZDpzZXNzaW9uX2lkPTJfTVg0ME5qRXlOekE1TW41LU1UVXlPREUzTURVNU1qQXlOWDVTZEZRMFZWWmlZWEpqYlVreWRXa3lhbU5aYlZwNWJuVi1mZyZjcmVhdGVfdGltZT0xNTI4MTcwNjE2Jm5vbmNlPTAuNjAwNjc0NDc4NTM3ODcyNiZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNTMwNzYyNjE3JmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9



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
var marker;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
 	    center: {lat: latitud, lng: longitud},
        zoom: 17
    });

    markerStart = new google.maps.Marker({
	    position: {lat: latitud, lng: longitud},
	    map: map,
	    title: 'Ubicación'
	});

	marker = markerStart;	
}

let socket = io();
socket.emit("listen_location");
socket.on('location', function(data){

	console.log("info");
	if(data['sessionid'] == sessionId){
		marker.setMap(null);
		var newMarker = new google.maps.Marker({
		    position: {lat: parseFloat(data['latitud']), lng: parseFloat(data['longitud'])},
		    map: map,
		    title: 'Ubicación'
		});

		var center = new google.maps.LatLng(parseFloat(data['latitud']), parseFloat(data['longitud']));
		map.panTo(center);
		marker = newMarker;
	}
});

//initializeSession("46127092", "2_MX40NjEyNzA5Mn5-MTUyNzUxMzMyNDUzOX5aY2JDRGJadlN6OXRoSWxmNUVhcTlvZnN-fg", "T1==cGFydG5lcl9pZD00NjEyNzA5MiZzaWc9NDNjNWJkZWI3NzhlMjMyZGJlZTJhYmZhZjJkNmYwN2RhNmY3Mzc1ZDpzZXNzaW9uX2lkPTJfTVg0ME5qRXlOekE1TW41LU1UVXlOelV4TXpNeU5EVXpPWDVhWTJKRFJHSmFkbE42T1hSb1NXeG1OVVZoY1RsdlpuTi1mZyZjcmVhdGVfdGltZT0xNTI3NTEzNDA5Jm5vbmNlPTAuMjY5NjQ2NDcxNjMzNTY4OSZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNTMwMTA1NDEwJmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9");
//initializeSession("46127092", "1_MX40NjEyNzA5Mn5-MTUyODE3MDQ4Njc0MX5wV0IxNUs3OGtsMlVpbVMyUUlOWEVCSVF-fg", "T1==cGFydG5lcl9pZD00NjEyNzA5MiZzaWc9NTc3MGRjMDdlOTkyOTE0NDM4NDY0MGZjODBlNWQ1ODkzYzVlNTQ1YzpzZXNzaW9uX2lkPTFfTVg0ME5qRXlOekE1TW41LU1UVXlPREUzTURRNE5qYzBNWDV3VjBJeE5VczNPR3RzTWxWcGJWTXlVVWxPV0VWQ1NWRi1mZyZjcmVhdGVfdGltZT0xNTI4MTcwNTM1Jm5vbmNlPTAuODU0MzkyNjgzNDg0NDE1NSZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNTMwNzYyNTM1JmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9");
//initializeSession("46127092", "2_MX40NjEyNzA5Mn5-MTUyODE3MDU5MjAyNX5SdFQ0VVZiYXJjbUkydWkyamNZbVp5bnV-fg", "T1==cGFydG5lcl9pZD00NjEyNzA5MiZzaWc9MmY3M2ZkMGE0ZjY0YjkwNzdhMDRkNjhkZTJiOTI2YTlmN2M0NGQyZDpzZXNzaW9uX2lkPTJfTVg0ME5qRXlOekE1TW41LU1UVXlPREUzTURVNU1qQXlOWDVTZEZRMFZWWmlZWEpqYlVreWRXa3lhbU5aYlZwNWJuVi1mZyZjcmVhdGVfdGltZT0xNTI4MTcwNjE2Jm5vbmNlPTAuNjAwNjc0NDc4NTM3ODcyNiZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNTMwNzYyNjE3JmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9");
//initializeSession("46127092", "1_MX40NjEyNzA5Mn5-MTUyODYwMTI1ODU5OH5haElFQ3ZFZ2VYQ0hPaTExYTR1NVJpL0d-fg", "T1==cGFydG5lcl9pZD00NjEyNzA5MiZzaWc9ZDE4ODk5YzBjNGUyNDI4NmYzOGVhMzkyZWY3MDdmY2Q3YTM5OTc2YTpzZXNzaW9uX2lkPTFfTVg0ME5qRXlOekE1TW41LU1UVXlPRFl3TVRJMU9EVTVPSDVoYUVsRlEzWkZaMlZZUTBoUGFURXhZVFIxTlZKcEwwZC1mZyZjcmVhdGVfdGltZT0xNTI4NjAxMzE5Jm5vbmNlPTAuMTYwMjQ2MjA5NDk3NjQyMjMmcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTUzMTE5MzMyMSZpbml0aWFsX2xheW91dF9jbGFzc19saXN0PQ==");
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
