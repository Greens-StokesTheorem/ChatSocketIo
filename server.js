const express = require('express');
const app = express();
const { Server } = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = new Server(server);
const port = 8080;
const fs = require("fs");



let numofmessages = 0;
let messageslog = {};

if (fs.existsSync("data.json")) {
    messageslog = JSON.parse(fs.readFileSync("data.json", "utf8"));
    console.log("readfile")
}

numofmessages = Object.keys(messageslog).length - 1;



app.use(express.static("public"));

app.get('/', (req, res) => {

    res.sendFile("./index.html");
});



io.on("connection", (socket) => {

	console.log(`Player: ${socket.id} has joined`)
	socket.emit("initmessages", messageslog);


	socket.on("sentmessage", ({id: PlayerId, message: message}) => {

		let messageinfo = {id: PlayerId, message: message};
		socket.broadcast.emit("sentmessage", {id: PlayerId, message: message});

		messageslog[numofmessages] = messageinfo;
		numofmessages++;
		console.log(messageslog);

		fs.writeFileSync("data.json", JSON.stringify(messageslog, null, 4));


	})


});







server.listen(port, () => {
    console.log(`Server is listening at the port: ${port}`);
});