let socket = io();

socket.on('help', function(data){		
	new Audio('/audio/voyentaxi_nueva_llamada.mp3').play();	        
});

var mymap = L.map('map').setView([-32.5000000, -56.0000000], 7);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);
var markerGroup = L.layerGroup().addTo(mymap);
L.AwesomeMarkers.Icon.prototype.options.prefix = 'ion';
var locationMarker = L.AwesomeMarkers.icon({
    icon: 'ion-model-s',
    markerColor: 'red'
});

function setlocation(){
	var lat = document.getElementById("lat").value;
	var lng = document.getElementById("lng").value;
	var marker;
	if (lat!="" && lng!=""){
		markerGroup.clearLayers();
		var marker = L.marker([lat, lng], {draggable: false});
		marker.bindPopup("<center>Ubicación del taxista</center>");
		marker.on('mouseover', function (e) {
		    this.openPopup();
		});
		marker.on('mouseout', function (e) {
		    this.closePopup();
		});
		marker.setIcon(locationMarker);
		marker.addTo(markerGroup);
		mymap.setView([lat, lng], 16);
	}
}
$(document).on('ready', function(){

	$('#opcionOpenTok').on('click', function(){
    	$('#alertOpenTok').css('display', 'none');
   		$('#divApiKey').removeClass('has-error');
    	$('#divSecretKey').removeClass('has-error');

       	$.ajax({
        	url : 'https://voyentaxiws.herokuapp.com/usuarios.php/GetClaveTokBox',
        	type : 'GET',
        	dataType : 'json'
        })
        .done(function(response){
        	console.log(response);
        	$('#otApiKey').val(response['api_key']);
        	$('#otSecretKey').val(response['secret_key']);
        })
        .fail(function(error, err, e){
        	console.log(e);
        });
    });

    $('#opcionServidores').on('click', function(){
       	$('#alertServidores').css('display', 'none');
       	$('#divServidorBDA').removeClass('has-error');
       	$('#divServidorVET').removeClass('has-error');
       	$('#divServidorRespaldoVET').removeClass('has-error');
       	$.ajax({
        	url : 'https://voyentaxiws.herokuapp.com/usuarios.php/GetServidores',
        	type : 'GET',
        	dataType : 'json'
        })
        .done(function(response){
        	console.log(response);
        	$('#servidorBDA').val(response['servidor_bda']);
        	$('#servidorVET').val(response['servidor_vet']);
        	$('#servidorRespaldoVET').val(response['servidor_respaldo_vet']);
        })
        .fail(function(error, err, e){
        	console.log(e);
        });
    });

	$('#btnAceptarServidores').on('click', function(){
		var campoVacio = false;

	   	if($('#servidorBDA').val() == "" || $('#servidorVET').val() == "" || $('#servidorRespaldoVET').val() == "")
	   		campoVacio = true;

	   	if($('#servidorBDA').val() == ""){
	   		$('#divServidorBDA').addClass('has-error');
	   	}
	   	else{
	   		$('#divServidorBDA').removeClass('has-error');
	   	}

	   	if($('#servidorVET').val() == ""){
	   		$('#divServidorVET').addClass('has-error');
	   	}
	   	else{
	   		$('#divServidorVET').removeClass('has-error');
	   	}

	   	if($('#servidorRespaldoVET').val() == ""){
	   		$('#divServidorRespaldoVET').addClass('has-error');
	   	}
	   	else{
	   		$('#divServidorRespaldoVET').removeClass('has-error');
	   	}

	  	if(campoVacio){
	  		$('#alertServidores').addClass('alert-danger').removeClass('alert-success');
	  		$('#alertServidores').html("<center><strong>ERROR:</strong> No se han completado campos</center>");
	  		$('#alertServidores').fadeIn();

	   		return;
	   	}
	   	else{
	   		$('#alertServidores').fadeOut();

		    $.ajax({
		    	url : 'https://voyentaxiws.herokuapp.com/usuarios.php/UpdateServidores?servidor_bda=' + $('#servidorBDA').val() + "&servidor_vet=" + $('#servidorVET').val() + "&servidor_respaldo_vet=" + $('#servidorRespaldoVET').val(),
		    	type : 'GET',
		    	dataType : 'json'
		    })
		    .done(function(response){
		    	if(response){
		    		$('#alertServidores').removeClass('alert-danger').addClass('alert-success');
		    		$('#alertServidores').html("<center><strong>ÉXITO:</strong> Direcciones de servidores actualizadas</center>");
		    		$('#divServidorBDA').removeClass('has-error');
		    		$('#divServidorVET').removeClass('has-error');
		    		$('#divServidorRespaldoVET').removeClass('has-error');
		    		$('#alertServidores').fadeIn();
		    	}
		    });
	    }
	});
});