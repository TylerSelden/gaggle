# Gaggle

## WARNING: *Gaggle is deprecated, buggy and contains several very SERIOUS security vulnerabilities. DO NOT use Gaggle, especially if your implementation is public-internet-facing. It is vulnerable to brute-force, DoS, and (authenticated) RCE attacks.* A newer, sleeker replacement is currently in the works.

Gaggle is a free, open-source remote desktop application powered by Docker. It uses a combination of Docker, Nginx, and Express.js to run. Gaggle is designed to be a simple, easy-to-use application that can be accessed from any device with a browser.

## Important details

**Special thanks to:** Linux, Docker, Debian, Nginx, Express.js, Node.js, TigerVNC, Websockify, Fluxbox, XFCE4, and all the other open-source projects that made this possible.

**License:** Gaggle is licensed under the MIT License. See `LICENSE` for more information.

**Author:** Gaggle was created by [TylerSelden](https://github.com/TylerSelden).

**Version:** Gaggle is currently in version 1.40.0.

**Status:** Gaggle is currently in its beta version, and may not be ready for production use. Please use at your own risk.

During installation, some commands may need to be run as root. This is because Gaggle uses Docker, which requires root access to run, and you need to access root-only files. It is recommended to run Gaggle as a non-root user, but some commands may need to be run as root.


## Installation

As of now, Gaggle is only available on Linux. This is because of the way Docker works, and the way Gaggle is set up. It may be possible to run Gaggle on Windows or MacOS using something like WSL or another virtualization tool, but it has not been tested.

**Dependencies:** Gaggle requires `node.js`, `npm`, `docker`, and `nginx` to run. The REST API requires `fs`, `express`, `https`, `cors`, and `md5` to function properly (installed through `npm`).

**Other requirements:** Gaggle requires a valid SSL certificate and private key to run. These should be stored in `./secrets/ssl/` as `cert.pem` and `privkey.pem`, respectively. It is recommended to have a FQDN to run Gaggle on, but could technically be used with a self-signed certificate.

**Setup:**

Run these commands to begin the installation process:

```bash
# Clone the repository
git clone https://github.com/TylerSelden/gaggle.git
cd gaggle

# Install the dependencies (tested only on Debian-based distros)
sudo apt install nodejs npm docker.io nginx -y
npm install

# Create ./secrets
mkdir ./secrets
mkdir ./secrets/ssl
```

**Configuration:**

Now, you need to populate `./secrets/`. An example `config.json` is provided below:

```json
{
  "port": 8080,
  "cert": "./secrets/ssl/cert.pem",
  "key": "./secrets/ssl/privkey.pem",
  "save_file": "./secrets/save.json",
  "refresh_rate": 60000,
  "kill_sessions_on_stop": false,
  "messages": {
    "max_length": 1000,
    "max_stored": 500
  },
  "users": {
    "admin": "5f4dcc3b5aa765d61d8327deb882cf99"
  }
}
```

This will set you up with a user named "admin" with the password "password". You can change this to whatever you want, but make sure to hash it with MD5 before putting it in the `config.json`.

Make sure you also have a valid SSL certificate and private key in `./secrets/ssl/`. A non-HTTPS version will be coming soon.

**Nginx setup:**

You need to set up Nginx to serve the static files and proxy the connections. Run the following command to get started:

`cd /etc/nginx/sites-available`

Now, create a file in this directory with the name of your FQDN (e.g. `./example.com`). Below is an example configuration file:

```nginx
server {
	listen 80;
	server_name <Your FQDN>;

	# Redirect HTTP to HTTPS
	return 301 https://$host$request_uri;
}


server {
	listen 443 ssl;
	server_name <Your FQDN>;

  ssl_certificate </path/To/fullchain.pem>;
	ssl_certificate_key </path/to/privkey.pem>;

  disable_symlinks off;

  root </path/to/gaggle>/web;
  index index.html index.htm;

  error_page 404 /err/404.html;
  error_page 403 /err/403.html;

  location / {
    try_files $uri $uri/ =404;
  }
}
```

Now, run the following commands to restart Nginx with the new configuration:

```bash
# Remove the default config file
unlink /etc/nginx/sites-enabled/default

# Create a symlink to the new config file
ln -s /etc/nginx/sites-available/<Your FQDN> /etc/nginx/sites-enabled/

# Test your configuration
nginx -t
```

**Warning:** If the above command failed, you may have a syntax error in your Nginx configuration file. Make sure to check for any typos or missing information. (Remember to replace things like `<Your FQDN>` with your actual FQDN.)

If the above command succeeded, run `systemctl restart nginx` to restart Nginx with the new configuration.

**Building Docker images:**

Run `cd ./docker/` to enter the Docker directory. Here, you can build Docker images for use with Gaggle. Use the `./build.sh` file to build the desired containers. For example, to build the Firefox container, run `./build.sh firefox`. To build an experimental container, run `./build.sh firefox dev`.

**Running Gaggle:**

To run Gaggle, you need to start the REST API and the Nginx server. It is *strongly* recommended to run Gaggle inside a `screen` or `tmux` session, so that you can detach from the session and leave it running in the background.

Gaggle is intended to be run as root, and has not been tested as a non-root user.

To start Gaggle, run the following command as root (from the `gaggle` directory):

`node main.js`

If all goes well, Gaggle should now be fully up and running!

**Accessing Gaggle:**

To access Gaggle, navigate to your FQDN in a web browser. You will be presented with a login screen for the Admin Panel. Enter a username / password pair that you set up in the `config.json` file, and you will be taken to the Admin Panel. From here, you can create new sessions, view existing sessions, and delete sessions. Documentation for the Admin Panel can be found in `PANEL_DOCS.md`.

## How it works

The way Gaggle works is actually quite simple.

There are two main parts, **Frontend** and **Backend**, which can then be broken down into seven sub-parts:

**Frontend:**
- Client Portal
- Admin Portal

**Backend:**
- Nginx
- Bash Scripts
- REST API
- Disk
- Docker

The **Frontend** of Gaggle is extremely simple, just static files being served for users and for administrators. All of these static web files are stored in `./web/`.

The **Backend** is a bit more complicated.

### Nginx:

Nginx is used for two things:
1. Serving static web files
2. ~~Proxying connections to individual sessions~~ (Removed in version 1.51.0)

The Nginx configuration file is not included in this repository, but it's pretty straightforward. It just serves all paths as static files within `./web/`.

### Bash scripts:

The bash scripts are stored at `./docker/`, and there are three of them:
1. `build.sh`
2. `start.sh`
3. `stop.sh`

**Important:** For these scripts to run properly, they must be run from the directory they are inside of.

The first, `build.sh` is used to build a Docker image for use within Gaggle. The syntax is as follows:

`./build.sh <container> [dev]`

`<container>` Is used to specify what name the image you're trying to build has. Images should be stored at `./docker/containers/` (or `./docker/dev/`, for developmental and experimental containers). For example, if you wanted to build *Firefox*, you would first make sure it exists in the correct location: `./docker/containers/firefox`. Then, run `./build.sh firefox`. If you have a container that is experimental or in development, call `./build.sh firefox dev`, and make sure it exists at `./docker/dev/firefox`.

### REST API:

The REST API is based on `express.js`, and written in `node.js`. It supports the following methods (in the format `METHOD: path/to/call {input} --> {output}`):

- `POST: /api/get_user {username, password} --> { code, message, data }`
- `POST: /api/get_sessions {username, password} --> { code, message, data }`
- `POST: /api/create_session {username, password, session: { username, password, container, dev } } --> { code, message, data }`
- `POST: /api/create_message {username, password, msg} --> { code, message, data }`
- `POST: /api/get_messages {username, password} --> { code, message, data }`
- `POST: /api/delete_messages {username, password} --> { code, message, data }`
- `POST: /api/delete_session {username, password, session: { username, password } } --> { code, message, data }`
- `POST: /api/test { } --> { code, message, data }`

These methods can all be used to interact with the backend systems of Gaggle.

### Disk:

Gaggle stores several confidential files in `./secrets/` (not included in this repository). These files are:

- `config.json`
- `save.json`
- `ssl/cert.pem`
- `ssl/privkey.pem`

`config.json` stores the configuration for Gaggle, including the port it runs on, the refresh rate of configuration files & saving data, and the location of other important files.

Below is an example `config.json`:

```json
{
  "port": 8080,
  "cert": "./secrets/ssl/cert.pem",
  "key": "./secrets/ssl/privkey.pem",
  "save_file": "./secrets/save.json",
  "refresh_rate": 60000,
  "kill_sessions_on_stop": false,
  "messages": {
    "max_length": 1000,
    "max_stored": 500
  },
  "users": {
    "admin": "5f4dcc3b5aa765d61d8327deb882cf99"
  }
}
```

All administrator passwords are stored as MD5 hashes.

`save.json` stores the current state of Gaggle, including all sessions and messages. The `ssl` directory contains the SSL certificate and private key for the Nginx server, as well as the docker containers.

### Docker:

The docker side of things is really quite simple, since most docker operations are handled by the bash scripts. Below is a general outline of how the containers function:

1. The container is built using the `Dockerfile` in the container's directory, including all `apt` packages and the `app` directory for each image.
2. The container is started using the `start.sh` script, which mounts the `app` directory and starts the container.
3. The docker container runs `/root/app/entrypoint.sh`, which is the entrypoint for the container. This script is responsible for starting up the container.
4. The container is stopped using the `stop.sh` script, which stops the container and removes it.

The containers run either on Fluxbox (for single-app sessions) or XFCE4 (for full OS sessions). A TigerVNC server is started inside the container, and then Websockify is used to stream that through the Nginx proxy to the Client Portal. The containers are all based on `debian:bullseye`, and are built using the `./docker/build.sh` script.





## Block Diagram
```
┌──────────────────────────────────┐                                                                                                                                                                                      
│                                  │                                       ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                  │                                       │                                                                                                                                             │
│            Frontend              │                                       │              Backend                                                                     ┌───────────────────────────────────────────────┐  │
│                                  │                                       │                           ┌─────────────────────────────────────────────────────────┐    │                                               │  │
│ ┌──────────────────────────────┐ │                                       │                           │                                                         │    │                                               │  │
│ │                              │ │                                       │  ┌────────────────────────┴────────┐                                                │    │                      Docker                   │  │
│ │                              │ │                                       │  │                                 │                                                │    │                                               │  │
│ │                              │ │                                       │  │                                 │                                                │    │  ┌─────────────────────────────────────────┐  │  │
│ │                              ├─┼───────────────────────────────────────┼──┤                                 │          ┌─────────────────────────────────────┼────┼──┤                                         │  │  │
│ │        Client Portal         │ │                                       │  │                                 │          │                                     │    │  │                                         │  │  │
│ │                              │ │                                       │  │             Nginx               │          │     ┌─────────────────────────┐     │    │  │                                         │  │  │
│ │                              │ │               ┌───────────────────────┼──┤                                 │          │     │                         │     │    │  │                                         │  │  │
│ │                              │ │               │                       │  │                                 │          │     │ ┌─────────────────────┐ │     │    │  │                                         │  │  │
│ │                              │ │               │                       │  │     (Proxy + Web hosting)       │          │     │ │                     │ │     │    │  │               Docker Images             │  │  │
│ │                              │ │               │                       │  │                                 ├──────────┼─────┼─┤      Web Files      │ │     │    │  │                                         │  │  │
│ └──────────────────────────────┘ │               │                       │  │                                 │          │     │ │                     │ │     │    │  │                                         │  │  │
│                                  │               │                       │  │                                 │          │     │ │      + Config       │ │     │    │  │                                         │  │  │
│ ┌──────────────────────────────┐ │               │                       │  └─────────────────────────────────┘          │     │ │                     │ │     │    │  │                                         │  │  │
│ │                              │ │               │                       │                                               │     │ └─────────────────────┘ │     │    │  └─────────────────────────────────────────┘  │  │
│ │                              │ │               │                       │  ┌─────────────────────────────────┐          │     │                         │     │    │                                               │  │
│ │                              ├─┼───────────────┘                       │  │                                 │          │     │ ┌─────────────────────┐ │     │    │  ┌───────────┐  ┌───────────┐  ┌───────────┐  │  │
│ │                              │ │                                       │  │                                 ├──────────┘     │ │                     │ │     │    │  │           │  │           │  │           │  │  │
│ │         Admin Portal         │ │                                       │  │                                 │                │ │       Docker        │ │     │    │  │           │  │           │  │           │  │  │
│ │                              ├─┼─────────────────────────┐             │  │          Bash Scripts           ├────────────────┼─┤                     │ │     ├────┼──┤ Container ├──┤ Container ├──┤ Container │  │  │
│ │                              │ │                         │             │  │                                 │                │ │    Build Paths      │ │     │    │  │           │  │           │  │           │  │  │
│ │                              │ │                         │             │  │       (build, start, stop)      │                │ │                     │ │     │    │  │           │  │           │  │           │  │  │
│ │                              │ │                         │             │  │                                 │                │ └─────────────────────┘ │     │    │  │           │  │           │  │           │  │  │
│ │                              │ │                         │             │  └───────────────┬─────────────────┘                │                         │     │    │  └───────────┘  └───────────┘  └───────────┘  │  │
│ └──────────────────────────────┘ │                         │             │                  │                                  │ ┌─────────────────────┐ │     │    │                                               │  │
│                                  │                         │             │  ┌───────────────┴─────────────────┐                │ │                     │ │     │    │  ┌───────────┐  ┌───────────┐  ┌───────────┐  │  │
└──────────────────────────────────┘                         │             │  │                                 │                │ │                     │ │     │    │  │           │  │           │  │           │  │  │
                                                             │             │  │                                 │                │ │      JSON Data      │ │     │    │  │           │  │           │  │           │  │  │
                                                             │             │  │                                 │                │ │                     │ │     ├────┼──┤ Container ├──┤ Container ├──┤ Container │  │  │
                                                             │             │  │                                 │                │ │                     │ │     │    │  │           │  │           │  │           │  │  │
                                                             │             │  │                                 │                │ └──────────┬──────────┘ │     │    │  │           │  │           │  │           │  │  │
                                                             └─────────────┼──┤      Express.js REST API        │                │            │            │     │    │  │           │  │           │  │           │  │  │
                                                                           │  │                                 │                └────────────┼────────────┘     │    │  └───────────┘  └───────────┘  └───────────┘  │  │
                                                                           │  │           (Node.js)             │                             │                  │    │                                               │  │
                                                                           │  │                                 ├─────────────────────────────┘                  │    │  ┌───────────┐  ┌───────────┐  ┌───────────┐  │  │
                                                                           │  │                                 │                                                │    │  │           │  │           │  │           │  │  │
                                                                           │  │                                 │                                                │    │  │           │  │           │  │           │  │  │
                                                                           │  │                                 │                                                └────┼──┤ Container ├──┤ Container ├──┤ Container │  │  │
                                                                           │  │                                 │                                                     │  │           │  │           │  │           │  │  │
                                                                           │  └─────────────────────────────────┘                                                     └──┴───────────┴──┴───────────┴──┴───────────┴──┘  │
                                                                           │                                                                                                                                             │
                                                                           └─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## To-Do

- [X] Write an actual README
- [X] GET params should be encoded in base64 for /client
- [ ] Implement clipboard transfer
- [ ] Client should have better streaming quality
- [ ] Add file transfer
- [ ] Add a toolbar of some sort
- [ ] Potentially implement audio streaming somehow


Made with ❤️ by [TylerSelden](https://github.com/TylerSelden).
