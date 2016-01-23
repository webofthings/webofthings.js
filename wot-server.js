var restApp = require('./servers/http'),
  wsServer = require('./servers/websockets'),
  resources = require('./resources/model'),
  http = require('http'),
  https = require('https'), //#A
  fs = require('fs');

var key_file = './resources/change_me_privateKey.pem'; //#B
var cert_file = './resources/change_me_caCert.pem'; //#C
var passphrase = 'webofthings'; //#D

var config = {
  key: fs.readFileSync(key_file),
  cert: fs.readFileSync(cert_file),
  passphrase: passphrase
};

var createServer = function (port, secure) {
  if (port === undefined) {
    port = resources.customFields.port;
  }

  if (secure === undefined) {
    secure = resources.customFields.secure;
  }

  if(secure) {
    // HTTPs server
    return server = https.createServer(config, restApp) //#E
      .listen(port, function () {
        console.log('HTTPs server started...');

        // Websockets server
        wsServer.listen(server); //#F

        initPlugins(port);
      })
  } else {
    // HTTP server
    return server = http.createServer(restApp)
      .listen(port, function () {

        // Websockets server
        wsServer.listen(server); //#F

        console.log('HTTP server started...');
        initPlugins(port);
      })
  }
};

function initPlugins(port) {
  // Plugins
  // -- Internal Plugins
  var LedsPlugin = require('./plugins/internal/ledsPlugin').LedsPlugin;
  var PirPlugin = require('./plugins/internal/pirPlugin').PirPlugin;
  var Dht22Plugin = require('./plugins/internal/dht22Plugin').Dht22Plugin;


  var pirPlugin = new PirPlugin({'simulate': true, 'frequency': 5000});
  pirPlugin.start();

  var ledsPlugin = new LedsPlugin({'simulate': true, 'frequency': 5000});
  ledsPlugin.start();

  var dht22Plugin = new Dht22Plugin({'simulate': true, 'frequency': 5000});
  dht22Plugin.start();

  console.info('Your WoT Pi is up and running on port %s', port);
}

module.exports = createServer;

//#A We import the https module
//#B The private key of the server that we generated before
//#C The actual certificate of the server
//#D The password of the private key
//#E We create an HTTPS server and pass it the config object
//#F By passing it the server we create, the Websocket library will automatically detect and enable the TLS support
