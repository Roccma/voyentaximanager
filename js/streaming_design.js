$(document).on('ready', function(){

	let socket = io();

	//$('#imgCargando').css('display', 'none');
	socket.on('help', function(data){		
		new Audio('/audio/voyentaxi_nueva_llamada.mp3').play();	        
	});
	let url = location.href;
	let urlSplit = url.split("?");
	let credentialsParts = urlSplit[1].split('&');
	let sessionId = credentialsParts[0].replace("sessionid=", "");

	jQuery.ajax({
		url : 'https://voyentaxiws.herokuapp.com/usuarios.php/DatosTaxista',
		type : 'GET',
		dataType : 'json',
		data : {'sessionId' : sessionId}
	})
	.done(function(response){
		document.getElementById('tablaDatos').innerHTML = 
			"<tr>" +
				"<td><b>Nombre:</b><br> " + response['nombre'] + "</td>" +
				"<td><b>Cédula de Identidad:</b><br> " + response['cedula'].toString().substring(0, 7) + "-" + response['cedula'].toString().substring(7) + "</td>" +						
				"<td><b>Celular:</b><br> " + response['telefono'] + "</td>" +
			"</tr>" +
			"<tr>" +
				"<td><b>Apellido:</b><br> " + response['apellido'] + "</td>" +
				"<td><b>Correo electrónico:</b><br> " + response['email'] + "</td>" +						
				"<td><b>Empresa:</b><br> " + response['empresa'] + "</td>" +
			"</tr>";
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
    }); });

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
});