let table;
let socket = io();

$.ajax({
   	url : "https://voyentaxiws.herokuapp.com/usuarios.php/VideollamadasActuales",
   	type : 'GET',
   	dataType : 'json'
})
.done(function(data){
   	console.log(data);
  	for (var i=0;i<data.length;i++){ 
  		let fechaHora = data[i]['fecha_hora_inicial'];
   		let fhSplit = fechaHora.split(" ");
   		let hora = fhSplit[1];
   		let fecha = fhSplit[0].replace(/-/g, '/');
   		fecha = fecha.split("/");
     	fecha = fecha[2]+"/"+fecha[1]+"/"+fecha[0];
  		let newRow =
      		"<tr id = '" + data[i]['id'] + "'>" + 
       			"<td>" + data[i]['nombre'] + "</td>" +
       			"<td>" + data[i]['email'] + "</td>" +
       			"<td>" + data[i]['telefono'] + "</td>" +
       			"<td>" + fecha + "</td>" + 
       			"<td>" + hora + "</td>" + 
       			"<td><i class = 'fa fa-phone atenderLlamada' id = 'sessionid=" + data[i]['session_finalizar'] + "&token=" + data[i]['token'] + "&latitud=" + data[i]['latitud_inicial'] + "&longitud=" + data[i]['longitud_inicial'] + "&fecha=" + fecha + "&hora=" + hora + "&id=" + data[i]['id'] + "'></i></td>" +
					"<td onclick='verificarFinalizarLlamada(\""+ data[i]['session_finalizar'] + "\", " + data[i]['id'] + ");'><i class = 'fa fa-phone-slash finalizarLlamada'></i></td>" +
       		"</tr>";
    	$('#body').html(newRow + $('#body').html());
    }     
    createDataTable();
});

socket.on('help', function(data){
	table.destroy();
	let fechaHora = data['fechaHora'];
	let fhSplit = fechaHora.split(" ");
	let hora = fhSplit[1];
	let fecha = fhSplit[0].replace(/-/g, '/');
	let newRow =
		"<tr id = '" + data['id'] + "'>" + 
			"<td>" + data['name'] + "</td>" +
			"<td>" + data['email'] + "</td>" +
			"<td>" + data['telephone'] + "</td>" +
			"<td>" + fecha + "</td>" + 
			"<td>" + hora + "</td>" + 
			"<td><i class = 'fa fa-phone atenderLlamada' id = 'sessionid=" + data['sessionid'] + "&token=" + data['token'] + "&latitud=" + data['latitud'] + "&longitud=" + data['longitud'] + "&fecha=" + fecha + "&hora=" + hora + "&id=" + data['id'] + "'></i></td>" +
			"<td onclick='verificarFinalizarLlamada(\""+ data['sessionid'] + "\", " + data['id'] +");'><i class = 'fa fa-phone-slash finalizarLlamada'></i></td>" +
		"</tr>";
	$('#body').html(newRow + $('#body').html());
	console.log(data['url']);			
	new Audio('/audio/voyentaxi_nueva_llamada.mp3').play();
	createDataTable();       
});

socket.on('finish_help', function(data){
    table.destroy();
	
	$('#' + data['id']).remove();			
	
	createDataTable();	
});

socket.on('finish_help_from_app', function(data){			
	table.destroy();
	
	$('#' + data['id']).remove();			
	
	createDataTable();
});

$('body').on('click', '.atenderLlamada', function(){
	let a = document.createElement('a');
	a.href = "streaming.html?" + $(this).attr('id');
	a.target= "_blank";
	a.click();
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
			{"bSortable": false},
			{"bSortable": false}]
	});
}

function verificarFinalizarLlamada(sessionId, id){
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
		if(desconectada == 0){					
			$('#modalConfirmacion').modal('show');
			$('#hiddenSessionId').val(sessionId);
			$('#hiddenId').val(id);
		}
		else{
			$('#modalNoFinalizar').modal('show');
		}
	});
}

$('#btnAceptarConfirmacion').on('click', function(){
	let lat = "";
	let lon = "";
	let sessionId = $('#hiddenSessionId').val();
	let id = $('#hiddenId').val();
	$('#modalConfirmacion').modal('hide');
	$('#modalFinalizandoLlamada').modal('show');
	socket.emit("listen_location", sessionId);
	
	socket.on('location', function(data){
		if(data['sessionid'] == sessionId){
			lat = data['latitud'];
			lon = data['longitud'];
			console.log("latitud: " + lat + " - longitud: " + lon);
		}
	});


	window.setTimeout(function(){
		$('#modalFinalizandoLlamada').modal('hide');
		$.ajax({
		   	url : "https://voyentaxiws.herokuapp.com/usuarios.php/FinLlamada?callid="+id+"&url=&date=&latitud=" + lat + "&longitud=" + lon,
		   	type : 'GET',
		   	dataType : 'json',
		   	async : false
		})
		.done(function (response) {
		  	socket.emit('finish_help', sessionId, id);
		});
	}, 5000);
});	