const request = require('request');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 3000;

var fork = require("child_process").fork; 

var imgDir = `${__dirname}/img`;
var audioDir = `${__dirname}/audio`;
var cssDir = `${__dirname}/css`;
var jsDir = `${__dirname}/js`;

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended:false}));

app.use(express.static(__dirname + "/public"));

app.get('/', (req, res) => {
	res.redirect('index.html');
});

app.get('/index', (req, res) => {
	res.redirect('index.html');
});

app.get('/streaming', (req, res) => {
	res.redirect('streaming.html');
});

app.get('/finalizadas', (req, res) => {
	res.redirect('finalizadas.html');
});

app.get('/gps', (req, res) => {
	res.redirect('gps.html');
});

app.get('/estadisticas', (req, res) => {
	res.redirect('estadisticas.html');
});

app.get('/css/app.css', (req, res) => {
	res.sendFile(`${cssDir}/app.css`);
});

app.get('/css/dashboard.css', (req, res) => {
	res.sendFile(`${cssDir}/dashboard.css`);
});

app.get('/css/bootstrap.css', (req, res) => {
	res.sendFile(`${cssDir}/bootstrap.min.css`);
});

app.get('/css/bootstrap.min.css', (req, res) => {
	res.sendFile(`${cssDir}/bootstrap.min.css`);
});

app.get('/css/leaflet.awesome-markers.css', (req, res) => {
	res.sendFile(`${cssDir}/leaflet.awesome-markers.css`);
});

app.get('/css/images/markers-soft.png', (req, res) => {
	res.sendFile(`${cssDir}/images/markers-soft.png`);
});

app.get('/css/images/markers-shadow.png', (req, res) => {
	res.sendFile(`${cssDir}/images/markers-shadow.png`);
});
//bootstrap.min.css

app.get('/js/streaming.js', (req, res) => {
	res.sendFile(`${jsDir}/streaming.js`);
});

app.get('/js/bootstrap.js', (req, res) => {
	res.sendFile(`${jsDir}/bootstrap.js`);
});

app.get('/js/bootstrap.min.js', (req, res) => {
	res.sendFile(`${jsDir}/bootstrap.min.js`);
});

app.get('/js/leaflet.awesome-markers.js', (req, res) => {
	res.sendFile(`${jsDir}/leaflet.awesome-markers.js`);
});

app.get('/img/Logo.png', (req, res) => {
	res.sendFile(`${imgDir}/Logo.png`);
});

app.get('/img/ftax.png', (req, res) => {
	res.sendFile(`${imgDir}/ftax.png`);
});

app.get('/img/tokbox.png', (req, res) => {
	res.sendFile(`${imgDir}/tokbox.png`);
});

app.get('/img/flechas.png', (req, res) => {
	res.sendFile(`${imgDir}/flechas.png`);
});

app.get('/img/spinner.gif', (req, res) => {
	res.sendFile(`${imgDir}/spinner.gif`);
});

app.get('/img/logo_miniatura.png', (req, res) => {
	res.sendFile(`${imgDir}/logo_miniatura.png`);
});

app.get('/img/icon.png', (req, res) => {
	res.sendFile(`${imgDir}/icon.png`);
});

app.get('/audio/voyentaxi_nueva_llamada.mp3', (req, res) => {
	res.sendFile(`${audioDir}/voyentaxi_nueva_llamada.mp3`);
});

var salas = [];

io.on('connection', (socket) => {
	console.log("Nuevo usuario conectado: " + socket.id);
	socket.on('credentials', (apiKey, apiSecret) => {
		var OpenTok = require('opentok'),
		opentok = new OpenTok(apiKey, apiSecret);
		var sessionId;
		opentok.createSession({mediaMode:"routed"}, function(error, session) {
		  if (error) {
		    io.emit('credentials', {sessionid: "0", token: "0"});
		  } else {
		    sessionId = session.sessionId;
		    var token = opentok.generateToken(sessionId);
		    console.log("Credenciales: " + sessionId + " - " + token);
		    io.emit('credentials', {sessionid: sessionId, token: token});
		  }
		});
	});

	socket.on('help', (sessionId, token, cedula, name, email, telephone, latitud, longitud, fechaHora, cantidad_desconexiones, dias_persistencia) => {	
		var url = "http://127.0.0.1:8080/VoyEnTaxiWS/usuarios.php/DatosLlamada?userid="+cedula+"&date="+fechaHora+"&latitud="+latitud+"&longitud="+longitud+"&sessionid="+sessionId+"&token="+token+"&cantidad_desconexiones="+cantidad_desconexiones+"&dias_persistencia="+dias_persistencia;
		request.get(url,(error,res,body) => {
			if(error)
				console.log(error);
			var js = JSON.parse(body);
			console.log(js);
			let id = js.id;		
			io.emit('help', {sessionid : sessionId, token : token, cedula : cedula, name : name, email : email, telephone : telephone, latitud : latitud, longitud : longitud, fechaHora : fechaHora, cantidad_desconexiones : cantidad_desconexiones, id : id});
		});	
	});

	socket.on('finish_help_from_app', (sessionId, id, latitud, longitud) => {
		var url = "http://127.0.0.1:8080/VoyEnTaxiWS/usuarios.php/FinLlamada?callid="+id+"&url=&date=&latitud="+latitud+"&longitud="+longitud;
		console.log(url);
		request.get(url,(error,res,body) => {
			if(error)
				console.log(error);
			var js = JSON.parse(body);
			console.log(js);		
			io.emit('finish_help_from_app', {sessionId : sessionId, id : id});
		});
		
		//io.emit('finish_help_from_app', {sessionId : sessionId});
	});

	socket.on('update_call_data', (id, latitud_final, longitud_final, url_video) => {
		var url = "http://127.0.0.1:8080/VoyEnTaxiWS/usuarios.php/ActualizarDatosLlamada?id="+id+"&latitud_final="+ latitud_final + "&longitud_final=" + longitud_final + "&url_video=" + url_video;
		console.log(url);
		request.get(url,(error,res,body) => {
			if(error)
				console.log(error);
			/*var js = JSON.parse(body);
			console.log(js);		
			io.emit('finish_help_from_app', {sessionId : sessionId, id : id});*/
		});
		
		//io.emit('finish_help_from_app', {sessionId : sessionId});
	});

	socket.on('finish_help', (sessionId, id) => {
		console.log("finish_help " + id);
		io.emit('finish_help', {sessionid : sessionId, id : id});
	});

	socket.on('location', (sessionId, latitud, longitud, fechaHora, id) => {
		io.emit('location', {sessionid : sessionId, latitud : latitud, longitud : longitud, fechaHora : fechaHora, id : id});
	});

	socket.on('listen_location', (sessionId) => {
		console.log("listen_location");
		io.emit('listen_location', {send : 'ok', sessionId : sessionId});
	});

	socket.on('record_start', (apiKey, apiSecret, sessionId) => {
		
		console.log("RECORD_START: ");
		var OpenTok = require('opentok'),
		opentok = new OpenTok(apiKey, apiSecret);

		var startRecord = false;
		console.log("aca");
		//while(startRecord == false){
			//console.log("acaa");
			opentok.startArchive(sessionId, {name : 'Video record', outputMode : 'individual'}, (err, archive) => {
				if(err){
					io.emit('record_start', {archive: "0"});
				    console.log("Error: " + err);
				}
				else{
					console.log("Exito: " + archive.id);
					io.emit('record_start', {archive : archive.id});
				}
			});
		//}
		
	});

	socket.on('record_stop', (apiKey, apiSecret, archiveId) => {
		var OpenTok = require('opentok'),
		opentok = new OpenTok(apiKey, apiSecret);
		console.log("RECORD_STOP: " + archiveId);
		opentok.stopArchive(archiveId, (err, archive) => {
			if(err)
				io.emit('record_stop', {archive: "0"});
			else{
				opentok.getArchive(archiveId, (err, archive) =>{
					console.log(archive);
					io.emit('record_stop', {archive: "https://s3.amazonaws.com/tokbox.com.archive2/" + apiKey + "/" + archiveId + "/archive.zip"});
				})
				
			}
		});
	});

	socket.on('delete_record', (apiKey, apiSecret, archiveId) => {
		var OpenTok = require('opentok'),
		opentok = new OpenTok(apiKey, apiSecret);
		console.log("RECORD_STOP: " + archiveId);
		opentok.stopArchive(archiveId, (err, archive) => {
			if(err)
				io.emit('delete_record', {archive: "0"});
			else{
				opentok.getArchive(archiveId, (err, archive) =>{
					io.emit('delete_record', {archive: "success"});
				})
				
			}
		});
	});

	socket.on('reconnected', (sessionId) => {
		//console.log("reconectado! " + sessionId);
		io.emit('reconnected', {sessionId : sessionId});
	});

	socket.on('reconnecting', (sessionId) => {
		console.log("reconnecting! " + sessionId);
	});

	socket.on('reconnect_intent', (sessionId) => {
		console.log("reconnect_intent");
		io.emit('reconnect_intent', {sessionId : sessionId});
	});

	socket.on('reconnect_intent_response', (sessionId) => {
		console.log("reconnect_intent_response");
		io.emit('reconnect_intent_response', {sessionId : sessionId});
	});
});

http.listen(port, () => {
	console.log("Servidor escuchando en el puerto " + port + "!");
});