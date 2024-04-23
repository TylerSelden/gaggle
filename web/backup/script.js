var elems = {};
var sessions = [];
var credentials = {};

window.onload = function() {
  var tmp = document.querySelectorAll("[id]");
	tmp.forEach((elem) => {
		elems[elem.id] = elem;
	});
	elems.username.focus();
	load();
}

function login() {
	api.get_user(elems.username.value, elems.password.value, (res) => {
		if (res.code == 2) return alert("Invalid credentials.");
		if (res.code !== 0) return alert("Something went wrong.");
		
		credentials.username = elems.username.value;
		credentials.password = elems.password.value;

		save();

		elems.login_container.classList.add("hidden");
		elems.panel_container.classList.remove("hidden");

		// get listing
		setInterval(get_sessions, 1000);
		get_sessions();
	});
}


function get_sessions() {
	api.get_sessions(elems.username.value, elems.password.value, (res) => {
		if (res.code !== 0) return alert("Something went wrong.");
		var sessions = res.data;
		
    session_manager.update_table(sessions);
	});
}


function save() {
	var data = { credentials, dark_mode: document.body.classList.contains("dark-mode") };
	localStorage.setItem("gaggle_data", JSON.stringify(data));
}

function load() {
	var data = JSON.parse(localStorage.getItem("gaggle_data"));
	if (!data) return;

	credentials = data.credentials;
	elems.username.value = credentials.username;
	elems.password.value = credentials.password;
	elems.login.focus();

	if (data.dark_mode) document.body.classList.add("dark-mode");
}
