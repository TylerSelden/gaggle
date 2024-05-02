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
//			elems.template_id.setAttribute("href", `https://server.benti.dev:${8081 + session.id}`);
      elems.template_id.setAttribute("href", `https://server.benti.dev/client?id=${btoa(session.id)}&password=${btoa(session.assword)}`);
      elems.template_username.innerText = session.username;
      elems.template_password.innerText = session.started_by;
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
    var message = null;
    if (elems.session_select.classList.contains("dev")) message = "Warning: This container is in development! Use is heavily discouraged.";
    if (elems.session_select.classList.contains("exp")) message = "Warning: This container is experimental. Stability and performance may be affected.";

    var dev = false;
    if (message !== null) {
      if (!confirm(message)) return;
      dev = true;
    }


    api.create_session(credentials.username, credentials.password, elems.new_session_username.value, elems.new_session_password.value, elems.session_select.value, dev, (res) => {
			if (res.code !== 0) return alert(res.data);
			get_data();
			elems.new_session_username.value = "";
			elems.new_session_password.value = "";
			alert("Session created.");
		});
	},
	delete_session: function(id) {
		api.delete_session(credentials.username, credentials.password, id, (res) => {
			get_data();
			alert(res.message);
		});
  }
}



var message_manager = {
  update_display: function(messages) {
    var at_bottom = (Math.ceil(elems.messages_panel.scrollTop) >= elems.messages_panel.scrollHeight - elems.messages_panel.offsetHeight - 1);

    elems.messages_display.innerText = "";
    for (var i in messages) {
      message_manager.create_message_elem(messages[i]);
    }
    if (at_bottom) elems.messages_panel.scrollTop = elems.messages_panel.scrollHeight;
  },
  create_message_elem: function(message) {
    var elem = document.createElement("pre");
    elem.innerText = `${message.username}: ${message.msg}\n`
    elem.title = `${readable_time(message.time)} ago`;
    elem.classList.add("message");

    elems.messages_display.appendChild(elem);
  },
  create_message: function() {
    var msg = elems.msg_input.value;
    if (msg.length < 1) return alert("Your message cannot be empty.");
    api.create_message(credentials.username, credentials.password, msg, (res) => {
      if (res.code !== 0) return alert(res.data);
      get_data();
      elems.msg_input.value = "";
    });
  },
  delete_messages: function() {
    if (!confirm("Are you sure you want to clear all messages? This can't be undone.")) return;
    api.delete_messages(credentials.username, credentials.password, (res) => {
      if (res.code !== 0) return alert(res.data);
      alert("Messages cleared.");
    });
  }
}
