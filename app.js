const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));

io.on('connection', (socket) => {
	socket.on('sessionid', (apiKey, apiSecret) => {
		var OpenTok = require('opentok'),
		opentok = new OpenTok(apiKey, apiSecret);
		var sessionId;
		opentok.createSession({mediaMode:"routed"}, function(error, session) {
		  if (error) {
		    io.emit('sessionid', {response: "Error al crear session ID"});
		  } else {
		    sessionId = session.sessionId;
		    io.emit('sessionid', {response: sessionId});
		  }
		});
	},  'token', (sessionId) => {
		var token = opentok.generateToken(sessionId);
		io.emit('token', {response: token});
	});
});

http.listen(port, () => {
	console.log("Servidor escuchando en el puerto " + port + "!");
});