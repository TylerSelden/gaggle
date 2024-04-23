var session_manager = {
	update_table: function(sessions) {
		var session_elems = document.getElementsByName("session");
		for (var i = session_elems.length - 1; i >= 0; i--) {
			session_elems[i].parentNode.removeChild(session_elems[i]);
		}
		for (var i in sessions) {
			var session = sessions[i];
			session_manager.create_session_elem(session);
		}
	},
	create_session_elem: function(session) {
		if (session !== null) {
			elems.template_id.innerText = `${session.id}:${session.container}`;
			elems.template_id.setAttribute("href", `https://server.benti.dev:${8081 + session.id}`);
			elems.template_username.innerText = session.username;
			elems.template_password.innerText = session.password;
			elems.template_uptime.innerText = readable_time(session.time);
			elems.session_stop_button.removeAttribute("style");
			elems.session_stop_button.setAttribute("onclick", `session_manager.delete_session(${session.id})`);
		} else {
			elems.template_id.innerText = session;
			elems.template_id.removeAttribute("href");
			elems.template_username.innerText = "";
			elems.template_password.innerText = "";
			elems.template_uptime.innerText = "";
			elems.session_stop_button.setAttribute("style", "visibility: hidden;");
		}
    
    var cpy = clone_elem(elems.table_template);
		cpy.classList.remove("hidden");
		cpy.setAttribute("name", "session");
		cpy.removeAttribute("id");
		elems.session_manager_table.insertBefore(cpy, elems.new_session);
	},
   create_session: function() {
     api.create_session(credentials.username, credentials.password, elems.new_session_username.value, elems.new_session_password.value, elems.session_select.value, elems.session_select.classList.contains("dev"), (res) => {
			if (res.code !== 0) return alert(res.data);
			get_sessions();
			elems.new_session_username.value = "";
			elems.new_session_password.value = "";
			alert("Session created.");
		});
	},
	delete_session: function(id) {
		api.delete_session(credentials.username, credentials.password, id, (res) => {
			get_sessions();
			alert(res.message);
		});
  }
}
