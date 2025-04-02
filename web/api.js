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
	base_url: "https://server.benti.dev:3000/api",
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
	create_session: function(username, password, session_username, session_password, container, dev, callback) {
		this.call(
			"POST",
			`${this.base_url}/create_session`,
			{
				username, password,
				session: {
					username: session_username,
					password: session_password,
					container: container,
					dev: dev
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
  },
  create_message: function(username, password, msg, callback) {
    this.call(
      "POST",
      `${this.base_url}/create_message`,
      { username, password, msg },
      callback
    );
  },
  get_messages: function(username, password, callback) {
    this.call(
      "POST",
      `${this.base_url}/get_messages`,
      { username, password },
      callback
    );
  },
  delete_messages: function(username, password, callback) {
    this.call(
      "POST",
      `${this.base_url}/delete_messages`,
      { username, password },
      callback
    );
  }
}
