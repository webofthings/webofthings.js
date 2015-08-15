var restApp = require('./servers/http'),
  wsServer = require('./servers/websockets'),
  resources = require('./resources/model'),
  https = require('https'),
  fs = require('fs');

var key_file = './resources/change_me_privateKey.pem'; //#A
var cert_file = './resources/change_me_caCert.pem'; //#B
var passphrase = 'webofthings'; //#C

var config = {
  key: fs.readFileSync(key_file),
  cert: fs.readFileSync(cert_file),
  passphrase: passphrase
};


var createServer = function (port) {
  if (port === undefined) {
    port = resources.customFields.port;
  }

  // HTTP server
  return server = https.createServer(config, restApp) //#D
    .listen(port, function () {
      console.log('HTTPs server started...');

      // Websockets server
      wsServer.listen(server);

      // Plugins
      // -- Internal Plugins
      var LedsPlugin = require('./plugins/internal/ledsPlugin').LedsPlugin;
      var PirPlugin = require('./plugins/internal/pirPlugin').PirPlugin;
      var Dht22Plugin = require('./plugins/internal/dht22Plugin').Dht22Plugin;

      var pirPlugin = new PirPlugin({'simulate': true, 'frequency': 2000});
      pirPlugin.start();

      var ledsPlugin = new LedsPlugin({'simulate': true, 'frequency': 2000});
      ledsPlugin.start();

      console.info('Your WoT Pi is up and running on port %s', port);
    })
};

module.exports = createServer;

//#A This is the private key of the server that we generated before
//#B This is the actual certificate of the server
//#C This is the password of the private key

