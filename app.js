const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));

io.on('connection', (socket) => {
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
});

http.listen(port, () => {
	console.log("Servidor escuchando en el puerto " + port + "!");
});