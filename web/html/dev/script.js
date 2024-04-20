var elems = {};
var sessions = [];
var credentials = {};

window.onload = function() {
	var tmp = document.querySelectorAll("[id]");
	tmp.forEach((elem) => {
		elems[elem.id] = elem;
	});
}

function login() {
	api.get_user(elems.username.value, elems.password.value, (res) => {
		if (res.code == 2) return alert("Invalid credentials.");
		if (res.code !== 0) return alert("Something went wrong.");
		
		credentials.username = elems.username.value;
		credentials.password = elems.password.value;

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
		
		tier[2].update_table(sessions);
	});
}
