const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 3000;

io.on('connection', (socket) => {
	console.log("Aca mauro 2");
});

http.listen(port, () => {
	console.log("Servidor escuchando en el puerto " + port + "!");
});