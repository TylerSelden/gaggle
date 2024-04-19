// initial setup
const fs = require('fs');
const express = require('express');
const https = require('https');
const cors = require('cors');
const md5 = require('md5');

const app = express();
var config = JSON.parse(fs.readFileSync('./secrets/config.json', 'utf8'));
var { sessions, session, start_session, stop_session } = require('./utils.js');

var ssl = {
	key: fs.readFileSync(config.key, 'utf8'),
	cert: fs.readFileSync(config.cert, 'utf8')
}

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use((err, req, res, next) => {
	if (err.status == 400) return res.sendStatus(err.status);
	next(err);
});




var statusCodes = {
	0: "Success",
	1: "Generic Error",
	2: "Invalid Credentials"
}

function send(res, code, data) {
	if (res == null) return;
	var message = statusCodes[code];
	if (message == undefined) {
		code = 1;
		message = "Generic Error";
	}
	if (data == undefined) data = {};
	res.json({ code: code, message: message, data: data });
}

function auth(req) {
	var username = req.body.username;
	var password = req.body.password;

	if (username == undefined || password == undefined) return false;
	if (config.users[username] == undefined || config.users[username] !== md5(password)) return false;
	return true;
}


// API
// get:
//  [X] user (authentication check for client)
//  [X] sessions list

// create:
//  [-] user
//  [X] session

// delete:
//  [-] user
//  [X] session


/*
Request format:
{
	"username": "username",
	"password": "password",
	"session": {
		"username": "username",
		"password": "password",
		"id": "id"
	}
}
*/

app.post('/api/get_user', (req, res) => {
	try {
		if (!auth(req)) return send(res, 2);
		
		send(res, 0, "Authenticated");
	} catch (e) {
		send(res, 1, e);
	}
});

app.post('/api/get_sessions', (req, res) => {
	try {
		if (!auth(req)) return send(res, 2);

		send(res, 0, sessions);
	} catch (e) {
		send(res, 1, e);
	}
});

app.post('/api/create_session', (req, res) => {
	try {
		if (!auth(req)) return send(res, 2);

		var username = req.body.session.username;
		var password = req.body.session.password;
		var container = req.body.session.container;
		var id = sessions.indexOf(null);
		if (id < 0) id = sessions.length;

		var new_session = new session(container, username, password, id);
		sessions[id] = new_session;
		start_session(id);

		send(res, 0, new_session);
	} catch (e) {
		send(res, 1, e);
	}
});

app.post('/api/delete_session', (req, res) => {
	try {
		if (!auth(req)) return send(res, 2);

		var id = req.body.session.id;
		
		stop_session(id);
		sessions[id] = null;
		// delete available spaces
		while (sessions[sessions.length - 1] == null) {
			sessions.pop();
			if (sessions.length == 0) break;
		}
		send(res, 0, "Session deleted");
	} catch (e) {
		send(res, 1, e);
	}
});


app.post('/api/test', (req, res) => {
	send(res, 0, "Hi!");
});




load_sessions();
https.createServer({
	key: ssl.key,
	cert: ssl.cert
}, app).listen(config.port);

console.log(`REST API running on port ${config.port}.`);

// SIGINT handler

function load_sessions() {
	try {
		var tmp = JSON.parse(fs.readFileSync(config.save_file, "utf-8"))
		for (var i in tmp) {
			sessions[i] = tmp[i];
			start_session(i);
		}
		console.log(`Restored ${sessions.length} sessions from ${config.save_file}`);
		setInterval(refresh, config.refresh_rate);
	} catch(e) {
		console.log(`Could not load sessions: ${e.toString()}`);
	}
}

function refresh() {
	try {
		fs.writeFileSync(config.save_file, JSON.stringify(sessions, null, 2));
		config = JSON.parse(fs.readFileSync('./secrets/config.json', 'utf8'));
	} catch (e) {
		console.log("Error in refresh function.");
	}
}

process.on('SIGINT', () => {
	console.log(`\nSIGINT received, killing all ${sessions.length} sessions...`);
	fs.writeFileSync(config.save_file, JSON.stringify(sessions, null, 2));
	console.log("Saved sessions.");
	for (var i in sessions) {
		stop_session(i);
	}

	console.log("All sessions stopped, exiting.");
	process.exit();
});
