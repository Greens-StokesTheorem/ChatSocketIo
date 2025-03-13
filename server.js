const express = require('express');
const app = express();
const { Server } = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = new Server(server);
const port = 8080;
const fs = require("fs");
const session = require('express-session');



let numofmessages = 0;
let numofusers = 0;
let userslog = {};
let messageslog = {};


//		Json management code
if (fs.existsSync("data.json")) {

    messageslog = JSON.parse(fs.readFileSync("data.json", "utf8"));
    console.log("readfile")
	numofmessages = Object.keys(messageslog).length;

}
if (fs.existsSync("users.json")) {
	
    userslog = JSON.parse(fs.readFileSync("users.json", "utf8"));
    console.log("readfile")

}
//	===============================

const requireAuth = (req, res, next) => {
    if (req.session.userId) {
		console.log(req.session);
        next(); // User is authenticated, continue to next middleware
    } else {
		console.log(req.session);
        res.redirect('/login'); // User is not authenticated, redirect to login page
    };
};

const isAdmin = (req, res, nextx) => {

	if (req.session.sessioninfo) {

    	if (req.session.sessioninfo.role == "Admin") {
			// console.log("passed");
			next(); // User is authenticated, continue to next middleware
		} else {

			res.redirect('/loggedin'); // User is not authenticated, redirect to login page

		}

    } else {

        res.redirect('/login'); // User is not authenticated, redirect to login page
    };
};

app.set('view engine', 'ejs');

app.use(session({
    secret: 'secretkeys',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));


app.use(express.static("public"));
app.use(express.json());

app.get('/', (req, res) => {

    res.sendFile("./index.html");
	// console.log(req.session);
	
});

app.get("/loggedin", requireAuth, (req, res) => {

	res.render("dashboard");

});

app.get("/admin", isAdmin, (req, res) => {

	res.render("admin");

});


//	Register user
app.post("/api/data", (req,res) => {

	const data = req.body;


	//	If exists already

	// console.log(userslog);

	if (checkduplicate(userslog, data.name) != -1) {

		res.send({message: "This username already exists", status: 0})
		// console.log(userslog);

	} else {

		userslog[`${data.name}`] = {password: data.password, usertype: "user"};
		res.send({message: "Registered", status: 1})
		fs.writeFileSync("users.json", JSON.stringify(userslog, null, 4));


	}

});

//	Login user
app.post("/api/login", (req, res) => {

	const logindata = req.body;

	// console.log(logindata)

	//	Match
	if (checkduplicate(userslog, logindata.name) != -1) {

		//	Login matched
		if (userslog[logindata.name].password === logindata.password) {

			//	This branch is the login branch
			// console.log("Login matched!")
			res.send({message: "Username and Password matched, login success", status: 1});
			req.session.sessioninfo = {userId: logindata.name, role: userslog[logindata.name].usertype};
			// req.session.userId = logindata.name;
			// req.session.role = userslog[logindata.name].usertype;
			// console.log(req.session)
			req.session.save();


		} else {

			res.send({message: "Username or Password is incorrect", status: 0});
		}

	} else {

		res.send({message: "Username or Password is incorrect", status: 0});

	}


})


app.post("/api/session", (req, res) => {

	// console.log("Get login");
	// console.log(req.session);

	if (req.session.sessioninfo) {

		res.send({message: req.session.sessioninfo, status: 1});

	} else {

		res.send({message: req.session, status: 0});

	}

});



app.post("/api/admin", (req, res) => {

	const command = req.body;
	console.log(command.command);

	const exe = eval(`${command.command}`);
	// console.log(`The output is ${exe}`)
	res.send({message: exe});

})




io.on("connection", (socket) => {

	// console.log(`Player: ${socket.id} has joined`)







	socket.emit("initmessages", messageslog);


	socket.on("sentmessage", ({id: PlayerId, message: message}) => {

		let messageinfo = {id: PlayerId, message: message};
		socket.broadcast.emit("sentmessage", {id: PlayerId, message: message});

		messageslog[numofmessages] = messageinfo;
		numofmessages++;
		console.log(messageslog);

		fs.writeFileSync("data.json", JSON.stringify(messageslog, null, 4));


	})



	socket.on("getusers", (id) => {

		// console.log(id);
		// console.log(userslog);
		io.to(id).emit("getusers", userslog);

	});


	socket.on("test", (id) => {
		// console.log(id)
	})


});







server.listen(port, () => {
    console.log(`Server is listening at the port: ${port}`);
});


function checkduplicate(obj, name) {

	let keyarray2 = Object.keys(obj);
	let n = keyarray2.length;
	let attributearray = [];

	//	If empty don't have to check
	// if (n == 0) return false;

	for (let i = 0; i < n; i++) {
		
		// console.log(keyarray2[i]);
		let attri = keyarray2[i].toLowerCase()
		attributearray.push(attri);

	}

	// console.log(attributearray);


	return attributearray.indexOf(name.toLowerCase());


}
