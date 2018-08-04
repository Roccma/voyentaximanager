const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 3000;

var fork = require("child_process").fork; 

var imgDir = `${__dirname}/img`;
var cssDir = `${__dirname}/css`;
var jsDir = `${__dirname}/js`;

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

app.get('/gps', (req, res) => {
	res.redirect('gps.html');
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
		    io.emit('credentials', {sessionid: sessionId, token: token});
		  }
		});
	});

	socket.on('help', (sessionId, token, name, email, telephone, latitud, longitud, fechaHora) => {
		//salas.push({"socket" : socket.id, "sessionId" : sessionId});
		console.log("help! " + email);		
		io.emit('help', {sessionid : sessionId, token : token, name : name, email : email, telephone : telephone, latitud : latitud, longitud : longitud, fechaHora : fechaHora});
	});

	socket.on('finish_help', (sessionId) => {
		console.log("finish_help");
		io.emit('finish_help', {sessionid : sessionId});
	});

	socket.on('location', (sessionId, latitud, longitud) => {
		io.emit('location', {sessionid : sessionId, latitud : latitud, longitud : longitud});
	});

	socket.on('listen_location', () => {
		console.log("listen_location");
		io.emit('listen_location', {send : 'ok'});
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
});

http.listen(port, () => {
	console.log("Servidor escuchando en el puerto " + port + "!");
});