let url = location.href;

let urlSplit = url.split("?");

let credentialsParts = urlSplit[1].split('&');

let sessionId = credentialsParts[0].replace("sessionid=", "");
let token = credentialsParts[1].replace("token=", "");
let latitud = parseFloat(credentialsParts[2].replace("latitud=", ""));
let longitud = parseFloat(credentialsParts[3].replace("longitud=", ""));
let fecha = credentialsParts[4].replace("fecha=", "")
let hora = credentialsParts[5].replace("hora=", "")
let id = credentialsParts[6].replace("id=", "");
//let apiKey = credentialsParts[7].replace("apikey=", "");

console.log(sessionId + " - " + token);

let contadorDesconexion;
let avisadoReconexion = false;

var map;

var markerStart;
var marker = "no";

let socket = io();
let cantidad_desconexiones;
let desconectada;
let estado;

let llamadaFinalizada = false;

jQuery.ajax({
	url : 'https://voyentaxiws.herokuapp.com/usuarios.php/EstadoLlamada?id=' + id,
	type : 'GET',
	dataType : 'json',
	async : false
})
.done(function(response) {

	cantidad_desconexiones = response['cantidad_desconexiones'];
	desconectada = response['desconectada'];
	estado = response['estado'];
});

if(estado == "0"){
	$('.contenedorSubscriber').hide();
	$('.contenedorMapa').hide();
	$('.contenedorPublisher').hide();
	$('.contenedorBotones').hide();
	$('.contenedorDatos').hide();
	$('#modalLlamadaFinalizada').modal('show');
	llamadaFinalizada = true;
}
else if(desconectada){
	$('.contenedorSubscriber').hide();
	$('.contenedorMapa').hide();
	$('.contenedorPublisher').hide();
	$('.contenedorBotones').hide();
	$('.contenedorDatos').hide();

	if(cantidad_desconexiones < 3){
		$('#imgCargando').css('display', 'none');		
		$('.OT_subscriber').css('display', 'none');
		$('#imgDisconnected').css('display', 'none');
		$('#divDesconnectedText').css('display', 'none');
		$('#imgReconnecting').css('display', 'block');
		$('#divReconnectingText').css('display', 'block');
		//$('#modalReconectando').modal('show');
	}
	else{
		$('#imgCargando').css('display', 'none');		
		$('.OT_subscriber').css('display', 'none');
		$('#imgDisconnected').css('display', 'block');
		$('#divDesconnectedText').css('display', 'block');
		$('#imgReconnecting').css('display', 'none');
		$('#divReconnectingText').css('display', 'none');
		//$('#modalDesconexion').modal('show');
	}
}

var map = L.map('map').setView([latitud, longitud], 16);
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

jQuery('#ultimaActualizacion').html("Última actualización: " + fecha + " " + hora);

var markerLocation;

socket.emit("listen_location", sessionId);
socket.on('location', function(data){

	if(data['sessionid'] == sessionId){
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

		map.setView([data["latitud"], data["longitud"]], 16);
		latitud = data["latitud"];
		longitud = data["longitud"];

		let fechaHora = data['fechaHora'];
		let fhSplit = fechaHora.split(" ");
		let hora2 = fhSplit[1];
		let fecha2 = fhSplit[0].replace(/-/g, '/');

		jQuery('#ultimaActualizacion').html("Última actualización: " + fecha2 + " " + hora2);
		if(desconectada == false){
			window.clearTimeout(contadorDesconexion);
			contadorDesconexion = window.setTimeout(function(){
				if(!llamadaFinalizada){
					$('.contenedorSubscriber').hide();
					$('.contenedorMapa').hide();
					$('.contenedorPublisher').hide();
					$('.contenedorBotones').hide();
					$('.contenedorDatos').hide();
					cantidad_desconexiones++;
					if(cantidad_desconexiones < 3){
						$('#imgCargando').css('display', 'none');		
						$('.OT_subscriber').css('display', 'none');
						$('#imgDisconnected').css('display', 'none');
						$('#divDesconnectedText').css('display', 'none');
						$('#imgReconnecting').css('display', 'block');
						$('#divReconnectingText').css('display', 'block');
					}
					else{
						$('#imgCargando').css('display', 'none');		
						$('.OT_subscriber').css('display', 'none');
						$('#imgDisconnected').css('display', 'block');
						$('#divDesconnectedText').css('display', 'block');
						$('#imgReconnecting').css('display', 'none');
						$('#divReconnectingText').css('display', 'none');
					}				
					jQuery.ajax({
						url : 'https://voyentaxiws.herokuapp.com/usuarios.php/ActualizarEstadoLlamada?id=' + id + "&cantidad_desconexiones=" + cantidad_desconexiones + "&desconectada=1",
						type : 'GET',
						dataType : 'json'
					})
					.done(function(response) {
						desconectada = true
						avisadoReconexion = true;
					});
				}
				
			}, 25000);
		}
	}

	
	

});

socket.on('reconnected', function(data){
	//alert("reconectar");
	$('#modalReconectando').modal('hide');
	if(data['sessionId'] == sessionId){

		//llamo WS
		if(avisadoReconexion == false){
			cantidad_desconexiones++;
		}
		jQuery.ajax({
			url : 'https://voyentaxiws.herokuapp.com/usuarios.php/ActualizarEstadoLlamada?id=' + id + "&cantidad_desconexiones=" + cantidad_desconexiones + "&desconectada=0",
			type : 'GET',
			dataType : 'json'
		})
		.done(function(response) {			
			location.reload(true);
		});
		//initializeSession("46127092", sessionId, token);
	}
});

socket.on('reconnect_intent_response', function(data){
	$('#modalIntentoReconexion').modal('hide');
	if(data['sessionId'] == sessionId){
		location.reload(true);
	}
});

socket.on('finish_help', function(data){
	$('.contenedorSubscriber').hide();
	$('.contenedorMapa').hide();
	$('.contenedorPublisher').hide();
	$('.contenedorBotones').hide();
	$('.contenedorDatos').hide();
	$('#modalReconectando').modal('hide');
	$('#modalDesconexion').modal('hide');
	$('#modalIntentarReconexion').modal('hide');
	$('#modalNoReconexion').modal('hide');
	window.clearTimeout(contadorDesconexion);
	$('#modalLlamadaFinalizada').modal('show');
	llamadaFinalizada = true;

	$.ajax({
    	url : "https://voyentaxiws.herokuapp.com/usuarios.php/FinLlamada?callid="+id+"&url=&date=&latitud="+latitud+"&longitud="+longitud,
    	//userid="+data['cedula']+"&date="+fhSplit[0]+hora+"&latitud="+data['latitud']+"&longitud="+data['longitud']+"",
    	type : 'GET',
    	dataType : 'json'
    });
});

socket.on('finish_help_from_app', function(data){
	if(data['sessionId'] == sessionId){
		$('.contenedorSubscriber').hide();
		$('.contenedorMapa').hide();
		$('.contenedorPublisher').hide();
		$('.contenedorBotones').hide();
		$('.contenedorDatos').hide();
		$('#modalReconectando').modal('hide');
		$('#modalDesconexion').modal('hide');
		$('#modalIntentarReconexion').modal('hide');
		$('#modalNoReconexion').modal('hide');		
		window.clearTimeout(contadorDesconexion);
		$('#modalLlamadaFinalizada').modal('show');
		llamadaFinalizada = true;		
	}
	
});

jQuery('#intentarReconectar').on('click', function(){
	jQuery('#modalIntentarReconexion').modal('show');
	socket.emit('reconnect_intent', sessionId);
	window.setTimeout(function(){
		jQuery('#modalIntentarReconexion').modal('hide');
		jQuery('#modalNoReconexion').modal('show');
	}, 10000);
});

	
//initializeSession("46127092", sessionId, token);

initializeSession(sessionId, token);

var connected = false;

var recorderManager;
var recorder;
var player;
var recImgData;

var VIDEO_HEIGHT = 240;
var VIDEO_WIDTH = 320;

var session;

var subscribers = new Array();

function handleError(error){
	if(error){
		alert(error.message);
	}
}

function initializeSession(sessionId, token){
	
	let apiKey;
	jQuery.ajax({
		url : 'https://voyentaxiws.herokuapp.com/usuarios.php/GetClaveTokBox',
		type : 'GET',
		dataType : 'json'
	})
	.done(function(response){
		
		apiKey = response['api_key'];
		session = OT.initSession(apiKey, sessionId);

		session.on('streamCreated', function(event){
			//alert("streamCreated");
			var subscriber = session.subscribe(event.stream, 'subscriber', {
				insertMode : 'append',
				width : '75%',
				height : '100%'
			}, handleError);
			console.log(event.stream);
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
					//session.publish(publisher, handleError);
				}
			}
		});
	});	
}

function finalizarLlamada(){
	socket.emit("finish_help", sessionId, id);
}



