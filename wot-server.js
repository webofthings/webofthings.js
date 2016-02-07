var restApp = require('./servers/http'),
  wsServer = require('./servers/websockets'),
  resources = require('./resources/model'),
  fs = require('fs');


var createServer = function (port, secure, simulate) {
  if (!port) port = resources.customFields.port;
  if (!secure) secure = resources.customFields.secure;

  initPlugins(port); //#A

  if(secure) {
    var https = require('https'); //#B
    var certFile = './resources/change_me_caCert.pem'; //#C
    var keyFile = './resources/change_me_privateKey.pem'; //#D
    var passphrase = 'webofthings'; //#E

    var config = {
      cert: fs.readFileSync(certFile),
      key: fs.readFileSync(keyFile),
      passphrase: passphrase
    };

    return server = https.createServer(config, restApp) //#F
      .listen(port, function () {
        wsServer.listen(server); //#G
        console.log('HTTPs server started and running on port %s', port);
    })
  } else {
    var http = require('http');
    return server = http.createServer(restApp)
      .listen(port, function () {
        wsServer.listen(server);
        console.log('HTTP server started and running on port %s', port);
    })
  }
};

function initPlugins(port) {
  var LedsPlugin = require('./plugins/internal/ledsPlugin').LedsPlugin;
  var PirPlugin = require('./plugins/internal/pirPlugin').PirPlugin;
  var Dht22Plugin = require('./plugins/internal/dht22Plugin').Dht22Plugin;

  pirPlugin = new PirPlugin({'simulate': true, 'frequency': 5000});
  pirPlugin.start();

  ledsPlugin = new LedsPlugin({'simulate': true, 'frequency': 5000});
  ledsPlugin.start();

  dht22Plugin = new Dht22Plugin({'simulate': true, 'frequency': 5000});
  dht22Plugin.start();
}

module.exports = createServer;

process.on('SIGINT', function () {
  ledsPlugin.stop();
  pirPlugin.stop();
  dht22Plugin.stop();
  console.log('Bye, bye!');
  process.exit();
});

//#A We start the internal hardware plugins
//#B If in secure mode, we import the 'https' module
//#C The certificate file for this server
//#D The private key generated earlier
//#E The passphrase for the private key
//#F We create an HTTPS server using the 'config' object
//#G The WebSocket library will automatically detect and enable the TLS support