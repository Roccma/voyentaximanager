let socket = io();

socket.on('help', function(data){		
	new Audio('/audio/voyentaxi_nueva_llamada.mp3').play();	        
});

var chartanios,chartmeses,charthora;
function orderup(tipo){
	var temp;							
  	if (tipo == 0){
		var dataArray = chartanios.data.labels;
  		var dataso = chartanios.data.datasets[0].data;	
	}
	if (tipo==1){
		var dataArray = chartmeses.data.labels;
  		var dataso = chartmeses.data.datasets[0].data;
  		dataArray.forEach(function (element, index, array){
  			if (element.includes("Enero"))
  				array[index] = element.replace(" Enero","-01");
  			if (element.includes("Febrero"))
  				array[index] = element.replace(" Febrero","-02");
  			if (element.includes("Marzo"))
  				array[index] = element.replace(" Marzo","-03");
  			if (element.includes("Abril"))
  				array[index] = element.replace(" Abril","-04");
  			if (element.includes("Mayo"))
  				array[index] = element.replace(" Mayo","-05");
  			if (element.includes("Junio"))
  				array[index] = element.replace(" Junio","-06");
  			if (element.includes("Julio"))
  				array[index] = element.replace(" Julio","-07");
  			if (element.includes("Agosto"))
  				array[index] = element.replace(" Agosto","-08");
  			if (element.includes("Septiembre"))
  				array[index] = element.replace(" Septiembre","-09");
  			if (element.includes("Octubre"))
  				array[index] = element.replace(" Octubre","-10");
  			if (element.includes("Noviembre"))
  				array[index] = element.replace(" Noviembre","-11");
  			if (element.includes("Diciembre"))
  				array[index] = element.replace(" Diciembre","-12");
  		});
	}
	if (tipo==2){
		var dataArray = charthora.data.labels;
  		var dataso = charthora.data.datasets[0].data;
	}
  	var sorted = false
  	while (!sorted){
  		sorted = true;
  		dataArray.forEach(function (element, index, array){
  			if (element > array[index+1]) {
  				array[index] = array[index+1];
  				array[index+1] = element;
  				temp = dataso[index];
	  			dataso[index] = dataso[index+1];
	  			dataso[index+1] = temp;
  				sorted = false;
  			}
  		});
  	}
  	if (tipo==0){
  		chartanios.data.labels = dataArray;
  		chartanios.data.datasets[0].data = dataso;
  		chartanios.update();	
  	}
  	if (tipo==1){
  		dataArray.forEach(function (element, index, array){
  			if (element.includes("01"))
  				array[index] = element.replace("-01"," Enero");
  			if (element.includes("02"))
  				array[index] = element.replace("-02"," Febrero");
  			if (element.includes("03"))
  				array[index] = element.replace("-03"," Marzo");
  			if (element.includes("04"))
  				array[index] = element.replace("-04"," Abril");
  			if (element.includes("05"))
  				array[index] = element.replace("-05"," Mayo");
  			if (element.includes("06"))
  				array[index] = element.replace("-06"," Junio");
  			if (element.includes("07"))
  				array[index] = element.replace("-07"," Julio");
  			if (element.includes("08"))
  				array[index] = element.replace("-08"," Agosto");
  			if (element.includes("09"))
  				array[index] = element.replace("-09"," Septiembre");
  			if (element.includes("10"))
  				array[index] = element.replace("-10"," Octubre");
  			if (element.includes("11"))
  				array[index] = element.replace("-11"," Noviembre");
  			if (element.includes("12"))
  				array[index] = element.replace("-12"," Diciembre");
  		});
  		chartmeses.data.labels = dataArray;
  		chartmeses.data.datasets[0].data = dataso;
  		chartmeses.update();	
  	}
  	if (tipo==2){
  		charthora.data.labels = dataArray;
  		charthora.data.datasets[0].data = dataso;
  		charthora.update();	
  	}
}

function orderdown(tipo){
	if (tipo == 0){
		var dataArray = chartanios.data.labels;
  		var dataso = chartanios.data.datasets[0].data;	
	}
	if (tipo==1){
		var dataArray = chartmeses.data.labels;
  		var dataso = chartmeses.data.datasets[0].data;
  		dataArray.forEach(function (element, index, array){
  			if (element.includes("Enero"))
  				array[index] = element.replace(" Enero","-01");
  			if (element.includes("Febrero"))
  				array[index] = element.replace(" Febrero","-02");
  			if (element.includes("Marzo"))
  				array[index] = element.replace(" Marzo","-03");
  			if (element.includes("Abril"))
  				array[index] = element.replace(" Abril","-04");
  			if (element.includes("Mayo"))
  				array[index] = element.replace(" Mayo","-05");
  			if (element.includes("Junio"))
  				array[index] = element.replace(" Junio","-06");
  			if (element.includes("Julio"))
  				array[index] = element.replace(" Julio","-07");
  			if (element.includes("Agosto"))
  				array[index] = element.replace(" Agosto","-08");
  			if (element.includes("Septiembre"))
  				array[index] = element.replace(" Septiembre","-09");
  			if (element.includes("Octubre"))
  				array[index] = element.replace(" Octubre","-10");
  			if (element.includes("Noviembre"))
  				array[index] = element.replace(" Noviembre","-11");
  			if (element.includes("Diciembre"))
  				array[index] = element.replace(" Diciembre","-12");
  		});
  		//console.log(dataArray);
	}
	if (tipo==2){
		var dataArray = charthora.data.labels;
  		var dataso = charthora.data.datasets[0].data;
	}
	var temp;							
  	var sorted = false
  	while (!sorted){
  		sorted = true;
  		dataArray.forEach(function (element, index, array){
  			if (element < array[index+1]) {
  				array[index] = array[index+1];
  				array[index+1] = element;
  				temp = dataso[index];
	  			dataso[index] = dataso[index+1];
	  			dataso[index+1] = temp;
  				sorted = false;
  			}
  		});
  	}
  	if (tipo==0){
  		chartanios.data.labels = dataArray;
  		chartanios.data.datasets[0].data = dataso;
  		chartanios.update();	
  	}
  	if (tipo==1){
  		dataArray.forEach(function (element, index, array){
  			if (element.includes("01"))
  				array[index] = element.replace("-01"," Enero");
  			if (element.includes("02"))
  				array[index] = element.replace("-02"," Febrero");
  			if (element.includes("03"))
  				array[index] = element.replace("-03"," Marzo");
  			if (element.includes("04"))
  				array[index] = element.replace("-04"," Abril");
  			if (element.includes("05"))
  				array[index] = element.replace("-05"," Mayo");
  			if (element.includes("06"))
  				array[index] = element.replace("-06"," Junio");
  			if (element.includes("07"))
  				array[index] = element.replace("-07"," Julio");
  			if (element.includes("08"))
  				array[index] = element.replace("-08"," Agosto");
  			if (element.includes("09"))
  				array[index] = element.replace("-09"," Septiembre");
  			if (element.includes("10"))
  				array[index] = element.replace("-10"," Octubre");
  			if (element.includes("11"))
  				array[index] = element.replace("-11"," Noviembre");
  			if (element.includes("12"))
  				array[index] = element.replace("-12"," Diciembre");
  		});
  		chartmeses.data.labels = dataArray;
  		chartmeses.data.datasets[0].data = dataso;
  		chartmeses.update();	
  	}
  	if (tipo==2){
  		charthora.data.labels = dataArray;
  		charthora.data.datasets[0].data = dataso;
  		charthora.update();	
  	}
}
$(document).on('ready', function(){
	var array1 = [], array2 = [], array3 = [], array4 = [];
	$.ajax({
		url : "https://voyentaxiws.herokuapp.com/usuarios.php/Stats",
		type : 'GET',
		dataType : 'json'
	})
	.done(function(data){
		console.log(data);
		$('#tablaEstadisticas').html("<tr>" + 
										"<td class = 'tdEstadistica'>Cantidad total de llamadas: <span class = 'spanDato'>" + data['cantidad'] + "</span></td>" + 
										"<td class = 'tdEstadistica'>Promedio de llamadas por día: <span class = 'spanDato'>" + data['promedioPorDia'] + " llamadas</span></td>" + 
										"<td class = 'tdEstadistica'>Duración promedio de llamada: <span class = 'spanDato'>" + data['promedioDuracion'] + "</span></td>" + 
									"</tr>");
		for (var key in data.anios) {
			if (data.anios.hasOwnProperty(key)) {
				array1.push(key);
				array2.push(data.anios[key]);
				array3.push('rgba(255, 228, 72, 0.5)');
				array4.push('rgba(255, 228, 72, 1)');				
			}
		}
		
		var ctx1 = document.getElementById("chartanios");
		chartanios = new Chart(ctx1, {
			type: 'bar',
			data: {
				labels: array1,
				datasets: [{
					label: 'Cantidad',
					data: array2,
					backgroundColor: array3,
					borderColor: array4,
					borderWidth: 2
				}]
			},
			options: {
				responsive: true,
				legend: {
					display : false,
					position: 'bottom',
				},
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero:true
						}
					}]
				}
			}
		});
				

		array1 = [], array2 = [], array3 = [], array4 = [];
		for (var key in data.meses) {
			if (data.meses.hasOwnProperty(key)) {
				array1.push(key);
				array2.push(data.meses[key]);
				array3.push('rgba(255, 228, 72, 0.5)');
				array4.push('rgba(255, 228, 72, 1)');
			}
		}
		var ctx2 = document.getElementById("chartmeses");
		chartmeses = new Chart(ctx2, {
			type: 'bar',
			data: {
				labels: array1,
				datasets: [{
					label: 'Cantidad',
					data: array2,
					backgroundColor: array3,
					borderColor: array4,
					borderWidth: 2
				}]
			},
			options: {
				responsive: true,
				legend: {
					display : false,
					position: 'bottom',
				},
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero:true
						}
					}]
				}
			}
		});
		array1 = [], array2 = [], array3 = [], array4 = [];
		for (var key in data.horas) {
			if (data.horas.hasOwnProperty(key)) {
				array1.push(key);
				array2.push(data.horas[key]);
				array3.push('rgba(255, 228, 72, 0.5)');
				array4.push('rgba(255, 228, 72, 1)');
			}
		}
		var ctx3 = document.getElementById("charthora");
		charthora = new Chart(ctx3, {
			type: 'bar',
			data: {
				labels: array1,
				datasets: [{
					label: 'Cantidad',
					data: array2,
					backgroundColor: array3,
					borderColor: array4,
					borderWidth: 2
				}]
			},
			options: {
				responsive: true,
				legend: {
					display : false,
					position: 'bottom',
				},
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero:true
						}
					}]
				}
			}
		});
		orderup(0);
		orderup(1);
		orderup(2);
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
});