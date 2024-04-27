# Frontend Documentation

**Overview**

- Use the Messaging panel to communicate with other system administrators without having to leave the application.
- Use the Session Manager panel to view, create, and delete various sessions.
- Navigate to [<Your FQDN>/client](https://<Your FQDN>/client) to enter a session.

**Session Manager**

- The admin panel is available at [<Your FQDN>](https://<Your FQDN>).
- Spawned sessions are served at <Your FQDN>/client. See Client Portal below.
- Sessions have a numerical ID, a container, a username/password, and an uptime value (how long it's been running). The uptime does not refresh after a server crash or halt.
- You can access a session through the link under the ID column. Password authentication is required.
- Stop a session using the STOP button.
- When a session is stopped, that slot will become available. The next session that is created will fill that slot.

**Creating a Session**

- Create a new session using the NEW row.
- The dropdown gives you a selection of containers. See the Containers section below for more info.
- A red background indicates a container that is still in development. These should not be used unless you are testing the container.
- An orange background indicates a container that is experimental. Development is complete, but testing is not, and there may be modifications made.

**Containers**

- A container is a specific type of session. For example, Firefox is limited strictly to a Firefox browser, but a Debian container would be a full OS.
- Containers take some time to develop and can still be launched from the Session Manager during development.
- Developmental containers should not be deployed unless it's for testing.
- Experimental containers should be used in moderation, and only when strictly necessary. They may contain memory leaks or otherwise cause harm to the server.

**Messaging Panel**

- Enter a message into the textbox and press enter or SEND to send it.
- Hover over a message to see how long ago it was sent.
- Click the CLEAR button to erase all messages (this can't be undone).
- When a new message comes through, if you're already scrolled to the bottom, it will snap to the bottom. Otherwise, it will not auto-scroll to the bottom.

**Client Portal**

- The Client Portal is available at [<Your FQDN>/client](https://<Your FQDN>/client).
- To join a session, enter the numerical ID of the session (e.g., "1:firefox" = "1") and the password. You will be put into the session as soon as you hit enter.
- You can no longer access a session directly through the port it's hosted on; it must be accessed through the Client Portal.
