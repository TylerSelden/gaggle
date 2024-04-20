var tier = [
	null,
	null,
	{
		update_table: function(sessions) {
			var session_elems = document.getElementsByName("tier_2_session");
			for (var i = session_elems.length - 1; i >= 0; i--) {
				session_elems[i].parentNode.removeChild(session_elems[i]);
			}
			for (var i in sessions) {
				var session = sessions[i];
				tier[2].create_session_elem(session);
			}
		},
		create_session_elem: function(session) {
			if (session !== null) {
				elems.template_id.innerText = session.id;
				elems.template_id.setAttribute("href", `https://server.benti.dev:${8081 + session.id}`);
				elems.template_username.innerText = session.username;
				elems.template_password.innerText = session.password;
				elems.template_uptime.innerText = readable_time(session.time);
				elems.tier_2_stop_button.removeAttribute("style");
				elems.tier_2_stop_button.setAttribute("onclick", `tier[2].delete_session(${session.id})`);
			} else {
				elems.template_id.innerText = session;
				elems.template_id.removeAttribute("href");
				elems.template_username.innerText = "";
				elems.template_password.innerText = "";
				elems.template_uptime.innerText = "";
				elems.tier_2_stop_button.setAttribute("style", "visibility: hidden;");
			}

			var cpy = clone_elem(elems.table_template);
			cpy.classList.remove("hidden");
			cpy.setAttribute("name", "tier_2_session");
			cpy.removeAttribute("id");
			elems.tier_2_table.insertBefore(cpy, elems.tier_2_new);
		},
		create_session: function() {
			api.create_session(credentials.username, credentials.password, elems.tier_2_username.value, elems.tier_2_password.value, (res) => {
				if (res.code !== 0) return alert(res.data);
				get_sessions();
				elems.tier_2_username.value = "";
				elems.tier_2_password.value = "";
				alert("Session created.");
			});
		},
		delete_session: function(id) {
			api.delete_session(credentials.username, credentials.password, id, (res) => {
				get_sessions();
				alert(res.message);
			});
		}
	},
	null
]
