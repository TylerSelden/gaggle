var api = {
	call: function(method, url, data, callback) {
		var xhr = new XMLHttpRequest();
		xhr.open(method, url, true);
		xhr.setRequestHeader("Content-Type", "application/json");

		xhr.onreadystatechange = () => {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					try {
						callback(JSON.parse(xhr.responseText));
					} catch (e) {
						console.error(e);
						callback(xhr.responseText);
					}
				} else {
					alert("Something went wrong, please try again.");
				}
			}
		}
		xhr.send(JSON.stringify(data));
	},
	base_url: "https://server.benti.dev:8080/api",
	get_user: function(username, password, callback) {
		this.call(
			"POST",
			`${this.base_url}/get_user`,
			{ username, password },
			callback
		);
	},
	get_sessions: function(username, password, callback) {
		this.call(
			"POST",
			`${this.base_url}/get_sessions`,
			{ username, password },
			callback
		);
	},
	create_session: function(username, password, session_username, session_password, callback) {
		this.call(
			"POST",
			`${this.base_url}/create_session`,
			{
				username, password,
				session: {
					username: session_username,
					password: session_password
				}
			},
			callback
		);
	},
	delete_session: function(username, password, id, callback) {
		this.call(
			"POST",
			`${this.base_url}/delete_session`,
			{
				username, password,
				session: { id }
			},
			callback
		);
	}
}
