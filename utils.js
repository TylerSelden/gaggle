const fs = require('fs');

var sessions = [];
var messages = [];

function session(container, username, password, id, dev) {
  // username must be only letters
  // password must be alphanumeric, with !@#$%^&*()_-+= allowed
  // id must be a number

	var path = "containers";
	if (dev) path = "dev";
	if (container == undefined || !fs.existsSync(`/root/node/gaggle/docker/${path}/${container}`)) {
		throw "Invalid container";
	}
	if (username == undefined || !/^[a-zA-Z]+$/.test(username) || username.length > 20 || username.length < 3) {
		throw "Invalid username";
	}
	if (password == undefined || !/^[ A-Za-z0-9_@./#&+-]*$/.test(password) || password.length > 20 || password.length < 6) {
		throw "Invalid password";
	}
	if (id == undefined || !/^[0-9]+$/.test(id)) {
		throw "Invalid id";
	}
 
	this.container = container;
	this.username = username;
	this.password = password;
	this.id = id;
	this.time = Date.now();
}

function message(username, msg) {
  if (typeof(username) !== "string") throw "Invalid username";
  if (typeof(msg) !== "string" || msg.length < 1) throw "Invalid message";


  this.msg = msg;
  this.username = username;
  this.time = Date.now();
}


function start_session(id) {
	var session = sessions[id];

	var container = session.container;
	var username = session.username;
	var password = session.password;
	var id = session.id;

	var exec = require('child_process').exec;
  var command = `/bin/bash /root/node/gaggle/docker/start.sh "${container}" "${username}" "${password}" ${id}`;
	exec(command, (error, stdout, stderr) => {
		if (error) throw `Exec error: ${error}`;
	});
}

function stop_session(id) {
	if (sessions[id] == undefined) throw "Session not found";
	var exec = require('child_process').exec;
  var command = `/bin/bash /root/node/gaggle/docker/stop.sh ${id}`;
	exec(command, (error, stdout, stderr) => {
		if (error) throw `Exec error: ${error}`;
	});
}

module.exports = { sessions, messages, session, message, start_session, stop_session };
