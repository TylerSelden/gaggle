var elems = {};

window.onload = function() {
  var tmp = document.querySelectorAll("[id]");
	tmp.forEach((elem) => {
		elems[elem.id] = elem;
	});
	elems.username.focus();
	load();
}

function login() {
  save();
  location.href = `https://server.benti.dev/session/${elems.username.value}/index.html?path=session/${elems.username.value}`;
}




function save() {
  var data = {
    username: elems.username.value,
    password: elems.password.value,
    dark_mode: document.body.classList.contains("dark-mode")
  }
  localStorage.setItem("gaggle_session_data", JSON.stringify(data));
}

function load() {
  var data = JSON.parse(localStorage.getItem("gaggle_session_data"));
  if (!data) return;
  elems.username.value = data.username;
  elems.password.value = data.password;
  if (data.dark_mode) document.body.classList.add("dark-mode");
}
