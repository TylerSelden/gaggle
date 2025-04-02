// RFB holds the API to connect and communicate with a VNC server
import RFB from './core/rfb.js';

let rfb;
let desktopName;

// When this function is called we have
// successfully connected to a server
function connectedToServer(e) {
status(`Logged in as "${desktopName}"`);
}

// This function is called when we are disconnected
function disconnectedFromServer(e) {
    if (e.detail.clean) {
        status("Disconnected");
    } else {
        status("Something went wrong, connection is closed");
    }
}

// When this function is called, the server requires
// credentials to authenticate
function credentialsAreRequired(e) {
    const password = prompt("Password Required:");
    rfb.sendCredentials({ password: password });
}

// When this function is called we have received
// a desktop name from the server
function updateDesktopName(e) {
    desktopName = e.detail.name;
}

// Since most operating systems will catch Ctrl+Alt+Del
// before they get a chance to be intercepted by the browser,
// we provide a way to emulate this key sequence.
function sendCtrlAltDel() {
    rfb.sendCtrlAltDel();
    return false;
}

// Show a status text in the top bar
function status(text) {
//    document.getElementById('status').textContent = text;
  alert(text);
}

// This function extracts the value of one variable from the
// query string. If the variable isn't defined in the URL
// it returns the default value instead.
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


// Read parameters specified in the URL query string
// By default, use the host and port of server that served this file


//const host = readQueryVariable('host', window.location.hostname);
//let port = readQueryVariable('port', window.location.port);
//const password = readQueryVariable('password');
//const path = readQueryVariable('path', 'websockify');

const host = window.location.hostname;
var port = parseInt(elems.username.value) + 3001;
var password = elems.password.value;
//var path = `session/${parseInt(elems.username.value) + 3001}`;
var path = `server.benti.dev:${parseInt(elems.username.value) + 3001}/websockify`;

// | | |         | | |
// | | | Connect | | |
// v v v         v v v

status("Connecting");

// Build the websocket URL used to connect
let url;
if (window.location.protocol === "https:") {
    url = 'wss';
} else {
    url = 'ws';
}
url += '://' + host;
if(port) {
    url += ':' + port;
}
url += '/' + path;

// Creating a new RFB object will start a new connection
rfb = new RFB(document.getElementById('screen'), url,
              { credentials: { password: password } });

// Add listeners to important events from the RFB module
rfb.addEventListener("connect",  connectedToServer);
rfb.addEventListener("disconnect", disconnectedFromServer);
rfb.addEventListener("credentialsrequired", credentialsAreRequired);
rfb.addEventListener("desktopname", updateDesktopName);
rfb.addEventListener("clipboard", (event) => {
  const clipboardText = event.detail.text;
  // Copy the received text to the client's clipboard
  navigator.clipboard.writeText(clipboardText)

  oldClipboard = clipboardText;
});

// Set parameters that can be changed on an active connection
rfb.viewOnly = readQueryVariable('view_only', false);
rfb.scaleViewport = readQueryVariable('scale', true);

var oldClipboard = "";

setInterval(() => {
  rfb.resizeSession = true;
  rfb.qualityLevel = 9;

  navigator.clipboard.readText()
    .then((clipboardText) => {
      if (clipboardText !== oldClipboard) rfb.clipboardPasteFrom(clipboardText);
      oldClipboard = clipboardText;
    })
}, 1000);

