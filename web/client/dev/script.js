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
//  location.href = `https://server.benti.dev/session/${elems.username.value}/index.html?path=session/${elems.username.value}`;
  elems.login_container.classList.add("hidden");
  elems.screen_container.classList.remove("hidden");

  var elem = document.createElement("script");
  elem.setAttribute("type", "module");
  elem.setAttribute("crossorigin", "anonymous");
  elem.setAttribute("src", "./module.js");

  document.body.appendChild(elem);
}

function readQueryVariable(name, defaultValue) {
    // A URL with a query parameter can look like this:
    // https://www.example.com?myqueryparam=myvalue
    //
    // Note that we use location.href instead of location.search
    // because Firefox < 53 has a bug w.r.t location.search
    const re = new RegExp('.*[?&]' + name + '=([^&#]*)'),
          match = document.location.href.match(re);

    if (match) {
        // We have to decode the URL since want the cleartext value
        return decodeURIComponent(match[1]);
    }

    return defaultValue;
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
  
  elems.username.value = readQueryVariable("id") || data.username;
  elems.password.value = readQueryVariable("password") || data.password;
  if (data.dark_mode) document.body.classList.add("dark-mode");
}
