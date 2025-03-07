const express = require('express');
const app = express();
const { Server } = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = new Server(server);
const port = 8080;
const fs = require("fs");
// const { Socket } = require('dgram');




app.use(express.static("public"));

app.get('/', (req, res) => {

    res.sendFile("./index.html");
});



io.on("connection", (socket) => {

	console.log(`Player: ${socket.id} has joined`)

	socket.on("sentmessage", ({id: PlayerId, message: message}) => {
		// console.log(message);
		socket.broadcast.emit("sentmessage", {id: PlayerId, message: message});
	})


});







server.listen(port, () => {
    console.log(`Server is listening at the port: ${port}`);
});