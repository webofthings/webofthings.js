var restApp = require('./servers/http'),
  wsServer = require('./servers/websockets'),
  resources = require('./resources/model'),
  fs = require('fs');


var createServer = function (port, secure) {
  if (process.env.PORT) port = process.env.PORT;
  else if (port === undefined) port = resources.customFields.port;
  if (secure === undefined) secure = resources.customFields.secure;

  initPlugins(); //#A

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
        console.log('Secure WoT server started on port %s', port);
    })
  } else {
    var http = require('http');
    return server = http.createServer(restApp)
      .listen(process.env.PORT | port, function () {
        wsServer.listen(server);
        console.log('Insecure WoT server started on port %s', port);
    })
  }
};

function initPlugins() {
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

//#A Start the internal hardware plugins
//#B If in secure mode, import the HTTPS module
//#C The actual certificate file of the server
//#D The private key of the server generated earlier
//#E The password of the private key
//#F Create an HTTPS server using the config object
//#G By passing it the server you create, the WebSocket library will automatically detect and enable TLS support