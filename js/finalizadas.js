let table;

var map = L.map('mapDatos').setView([51.505, -0.09], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var markerGroup = L.layerGroup().addTo(map);

let socket = io();

$.ajax({
	url : "https://voyentaxiws.herokuapp.com/usuarios.php/VideollamadasFinalizadas",
	type : 'GET',
	dataType : 'json'
})
.done(function(data){
    for (var i=0;i<data.length;i++){ 
    	console.log(i);
    	let fechaHorai = data[i]['fecha_hora_inicial'];
    	let fhSplit = fechaHorai.split(" ");
    	let horai = fhSplit[1];
    	let fechai = fhSplit[0].replace(/-/g, '/');
    	fechai = fechai.split("/");
		fechai = fechai[2]+"/"+fechai[1]+"/"+fechai[0];
    	let fechaHoraf = data[i]['fecha_hora_final'];
    	fhSplit = fechaHoraf.split(" ");
    	let horaf = fhSplit[1];
    	let fechaf = fhSplit[0].replace(/-/g, '/');
    	fechaf = fechaf.split("/");
		fechaf = fechaf[2]+"/"+fechaf[1]+"/"+fechaf[0];
    	let newRow =
    	"<tr id = '" + data[i]['id'] + "''>" + 
    		"<td>" + data[i]['nombre'] + "</td>" +
    		"<td>" + data[i]['email'] + "</td>" +
    		"<td>" + data[i]['telefono'] + "</td>" +
    		"<td>" + fechai + "</td>" +
    		"<td>" + horai + "</td>" +
    		"<td><i class = 'fa fa-arrow-right verLlamadaFinalizada' onclick='verLlamada(" + data[i]['id'] + ");'></i></td>" +
      	"</tr>";
      	$('#body').html(newRow + $('#body').html());
    }
    createDataTable();
});

socket.on('finish_help', function(data){
	$.ajax({
	 	url : "https://voyentaxiws.herokuapp.com/usuarios.php/DatosLlamadaTabla?id=" + data['id'],
	 	type : 'GET',
	 	dataType : 'json'
	})
	.done(function(response){
	  	table.destroy();
	    let fechaHorai = response['fecha_hora_inicial'];
        let fhSplit = fechaHorai.split(" ");
        let horai = fhSplit[1];
        let fechai = fhSplit[0].replace(/-/g, '/');
        fechai = fechai.split("/");
		fechai = fechai[2]+"/"+fechai[1]+"/"+fechai[0];

		let newRow =
			"<tr id = '" + response['id'] + "'>" + 
				"<td>" + response['nombre'] + "</td>" +
				"<td>" + response['email'] + "</td>" +
				"<td>" + response['telefono'] + "</td>" +
				"<td>" + fechai + "</td>" + 
				"<td>" + horai + "</td>" + 
				"<td><i class = 'fa fa-arrow-right verLlamadaFinalizada' onclick='verLlamada(" + response['id'] + ");'></i></td>" +
			"</tr>";
		$('#body').html(newRow + $('#body').html());
		createDataTable();
    });
});

socket.on('help', function(data){		
	new Audio('/audio/voyentaxi_nueva_llamada.mp3').play();	        
});

socket.on('finish_help_from_app', function(data){
   	$.ajax({
    	url : "https://voyentaxiws.herokuapp.com/usuarios.php/DatosLlamadaTabla?id=" + data['id'],
    	type : 'GET',
    	dataType : 'json'
    })
	.done(function(response){
		table.destroy();

	    let fechaHorai = response['fecha_hora_inicial'];
        let fhSplit = fechaHorai.split(" ");
        let horai = fhSplit[1];
        let fechai = fhSplit[0].replace(/-/g, '/');
        fechai = fechai.split("/");
		fechai = fechai[2]+"/"+fechai[1]+"/"+fechai[0];

		let newRow =
			"<tr id = '" + response['id'] + "'>" + 
				"<td>" + response['nombre'] + "</td>" +
				"<td>" + response['email'] + "</td>" +
				"<td>" + response['telefono'] + "</td>" +
				"<td>" + fechai + "</td>" + 
				"<td>" + horai + "</td>" + 
				"<td><i class = 'fa fa-arrow-right verLlamadaFinalizada' onclick='verLlamada(" + response['id'] + ");'></i></td>" +
			"</tr>";
		$('#body').html(newRow + $('#body').html());
		createDataTable();
    });
});

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
    	$('#otApiKey').val(response['api_key']);
    	$('#otSecretKey').val(response['secret_key']);
    })
    .fail(function(error, err, e){
    	console.log(e);
    });
});

$('#btnAceptarOpenTok').on('click', function(){
	var campoVacio = false;

  	if($('#otApiKey').val() == "" || $('#otSecretKey').val() == "")
  		campoVacio = true;

   	if($('#otApiKey').val() == ""){
   		$('#divApiKey').addClass('has-error');
   	}
   	else{
   		$('#divApiKey').removeClass('has-error');
   	}

  	if($('#otSecretKey').val() == ""){
  		$('#divSecretKey').addClass('has-error');
  	}
  	else{
  		$('#divSecretKey').removeClass('has-error');
  	}

   	if(campoVacio){
   		$('#alertOpenTok').addClass('alert-danger').removeClass('alert-success');
   		$('#alertOpenTok').html("<center><strong>ERROR:</strong> No se han completado campos</center>");
   		$('#alertOpenTok').fadeIn();

  		return;
   	}

   	$('#alertOpenTok').fadeOut();

   	$.ajax({
   		url : 'https://voyentaxiws.herokuapp.com/usuarios.php/ClavesTokBox?apiKey=' + $('#otApiKey').val() + "&projectKey=" + $('#otSecretKey').val(),
   		type : 'GET',
   		dataType : 'json'
   	})
   	.done(function(response){
   		if(response['result']){
   			$('#alertOpenTok').removeClass('alert-danger').addClass('alert-success');
   			$('#alertOpenTok').html("<center><strong>ÉXITO:</strong> Credenciales actualizadas</center>");
   			$('#divApiKey').removeClass('has-error');
   			$('#divSecretKey').removeClass('has-error');
   			$('#alertOpenTok').fadeIn();
   		}
   	})
});

function createDataTable(){		
	table = $('.table').DataTable({
		"language": { 
	        "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json" 
		},
	    "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "Todos"]],
	 	"aoColumns": [
			{"bSortable": true},
			{"bSortable": true},
			{"bSortable": true},
			{"sType": "date"},					
			{"bSortable": true},
			{"bSortable": false}],
			"order": [[ 3, "desc" ]]
	});
}

function verLlamada(id){
	$('#modalVerLlamadaFinalizada').modal('show');

   	jQuery.ajax({
		url : 'https://voyentaxiws.herokuapp.com/usuarios.php/DatosLlamadaPorId',
		type : 'GET',
		dataType : 'json',
		data : {'id' : id}
	})
	.done(function(response){
		console.log(response);
		document.getElementById('tablaDatosTaxista').innerHTML = 
			"<tr>" + 
				"<td class = 'col1Datos'><b>Nombre</b></td>" + 
				"<td class = 'col2Datos'>" + response['nombre'] + "</td>" + 
				"<td class = 'col3Datos'><b>Apellido</b></td>" + 
				"<td class = 'col4Datos'>" + response['apellido'] + "</td>" +
			"</tr>" + 
			"<tr>" +
				"<td class = 'col1Datos'><b>Cédula de Identidad</b></td>" +
				"<td class = 'col2Datos'>" + response['cedula'].toString().substring(0, 7) + "-" + response['cedula'].toString().substring(7) + "</td>" +
				"<td class = 'col3Datos'><b>Correo electrónico</b></td>" +
				"<td class = 'col4Datos'>" + response['email'] + "</td>" +
			"</tr>" +
			"<tr>" +
				"<td class = 'col1Datos'><b>Celular</b></td>" +
				"<td class = 'col2Datos'>" + response['telefono'] + "</td>" +
				"<td class = 'col3Datos'><b>Empresa</b></td>" +
				"<td class = 'col4Datos'>" + response['empresa'] + "</td>" +
			"</tr>";

		document.getElementById('tablaDatosTaxista1024').innerHTML = 
			"<tr>" + 
				"<td class = 'col1Datos1024'><b>Nombre</b></td>" + 
				"<td class = 'col2Datos1024'>" + response['nombre'] + "</td>" + 
				"<td class = 'col3Datos1024'><b>Apellido</b></td>" + 
				"<td class = 'col4Datos1024'>" + response['apellido'] + "</td>" +
				"<td class = 'col5Datos1024'><b>Cédula de Identidad</b></td>" +
				"<td class = 'col6Datos1024'>" + response['cedula'].toString().substring(0, 7) + "-" + response['cedula'].toString().substring(7) + "</td>" +
			"</tr>" +
			"<tr>" +
				"<td class = 'col1Datos1024'><b>Correo electrónico</b></td>" +
				"<td class = 'col2Datos1024'>" + response['email'] + "</td>" +			
				"<td class = 'col3Datos1024'><b>Celular</b></td>" +
				"<td class = 'col4Datos1024'>" + response['telefono'] + "</td>" +
				"<td class = 'col5Datos1024'><b>Empresa</b></td>" +
				"<td class = 'col6Datos1024'>" + response['empresa'] + "</td>" +
			"</tr>";

		let fechaHorai = response['fecha_hora_inicial'];
        let fhSplit = fechaHorai.split(" ");
        let horai = fhSplit[1];
        let fechai = fhSplit[0].replace(/-/g, '/');
        fechai = fechai.split("/");
		fechai = fechai[2]+"/"+fechai[1]+"/"+fechai[0];
        let fechaHoraf = response['fecha_hora_final'];
        fhSplit = fechaHoraf.split(" ");
        let horaf = fhSplit[1];
        let fechaf = fhSplit[0].replace(/-/g, '/');
        fechaf = fechaf.split("/");
		fechaf = fechaf[2]+"/"+fechaf[1]+"/"+fechaf[0];

		let lat = parseFloat(response['latitud_inicial']);
		let lon = parseFloat(response['longitud_inicial']);

		let latf = parseFloat(response['latitud_final']);
		let lonf = parseFloat(response['longitud_final']);

		let longitud = L.GeometryUtil.length([L.latLng(lat, lon), L.latLng(latf, lonf)]);
		let dist = parseFloat((longitud/1000)).toFixed(2);

		document.getElementById('tablaDatosLlamada').innerHTML = 
			"<tr>" + 
				"<td class = 'col1Datos'><b>Inicio</b></td>" + 
				"<td class = 'col2Datos'>" + fechai + " " + horai + "</td>" + 
				"<td class = 'col3Datos'><b>Última vez</b></td>" + 
				"<td class = 'col4Datos'>" + fechaf + " " + horaf + "</td>" +
			"</tr>" + 
			"<tr>" +
				"<td class = 'col1Datos'><b>Duración</b></td>" +
				"<td class = 'col2Datos'>" + response['duracion'] + "</td>" +
				"<td class = 'col3Datos'><b>Distancia recorrida</b></td>" +
				"<td class = 'col4Datos'>" + dist + " Km</td>" +
			"</tr>";

		document.getElementById('tablaDatosLlamada1024').innerHTML = 
			"<tr>" + 
				"<td class = 'col1Datos'><b>Inicio</b></td>" + 
				"<td class = 'col2Datos'>" + fechai + " " + horai + "</td>" + 
			"</tr>" + 
			"<tr>" +
				"<td class = 'col1Datos'><b>Última vez</b></td>" + 
				"<td class = 'col2Datos'>" + fechaf + " " + horaf + "</td>" +
			"</tr>" + 
			"<tr>" +
				"<td class = 'col1Datos'><b>Duración</b></td>" +
				"<td class = 'col2Datos'>" + response['duracion'] + "</td>" +
			"</tr>" + 
			"<tr>" +
				"<td class = 'col1Datos'><b>Distancia recorrida</b></td>" +
				"<td class = 'col2Datos'>" + dist + " Km</td>" +
			"</tr>";				

		markerGroup.clearLayers();

		L.AwesomeMarkers.Icon.prototype.options.prefix = 'ion';

		var locationMarker = L.AwesomeMarkers.icon({
		    icon: 'ion-model-s',
		    markerColor: 'red'
		});

		var initMarker = L.AwesomeMarkers.icon({
		    icon: 'ion-flag',
		    markerColor: 'green'
		});

		var marker = L.marker([lat, lon], {draggable: false});
		marker.bindPopup("<center>Posición inicial</center>");
		marker.on('mouseover', function (e) {
		    this.openPopup();
		});
		marker.on('mouseout', function (e) {
		    this.closePopup();
		});
		marker.setIcon(initMarker);
		marker.addTo(markerGroup);

		var markerf = L.marker([latf, lonf], {draggable: false});
		markerf.bindPopup("<center>Última posición</center>");
		markerf.on('mouseover', function (e) {
		    this.openPopup();
		});
		markerf.on('mouseout', function (e) {
		    this.closePopup();
		});
		markerf.setIcon(locationMarker);
		markerf.addTo(markerGroup);

		latc = (lat + latf) / 2;
		lonc = (lon + lonf) / 2;

		if(dist < 0.85)
			map.setView([latc, lonc], 16);
		else if (dist >= 0.85 && dist < 1.15)
			map.setView([latc, lonc], 15);
		else
			map.setView([latc, lonc], 14);
				
		if(response['url_video'] != null){
			document.getElementById('divEvidencias').innerHTML = 
			'<span style = "text-align: justify;">Presionando sobre el siguiente botón se podrán obtener las grabaciones del caso.</span>' +
			'<button class = "btn btn-default" id = "btnDescargar"><i class = "fa fa-download"></i>&nbsp;&nbsp;Descargar</button>';
			$('#hdnDescargar').val(response['url_video'].replace("Grabaciones/", "Grabaciones%2F"));
		}
		else{
			document.getElementById('divEvidencias').innerHTML = 
			'<span style = "text-align: justify;">Esta llamada aún no ha subido las grabaciones para poder descargarlos. Vuelva a intentar luego.</span>';
		}
	});

	$('#modalVerLlamadaFinalizada').on('shown.bs.modal', function(){
		setTimeout(function() {
		    map.invalidateSize();
		}, 1);
	})
}

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

$('body').on('click', '#btnDescargar', function(){
	let a = document.createElement('a');
	a.href = $('#hdnDescargar').val();
	a.target = "_blank";
	a.click();
});