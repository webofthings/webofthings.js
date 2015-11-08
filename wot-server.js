var restApp = require('./servers/http'),
  wsServer = require('./servers/websockets'),
  resources = require('./resources/model'),
  http = require('http');

var createServer = function (port) {
  if (port === undefined) {
    port = resources.customFields.port;
  }
  ;

  // HTTP server
  return server = http.createServer(restApp)
    .listen(port, function () {
      console.log('HTTP server started on port: %d', port);

      // Websockets server
      wsServer.listen(server);

      // Plugins
      // -- Internal Plugins
      var LedsPlugin = require('./plugins/internal/ledsPlugin').LedsPlugin;
      var PirPlugin = require('./plugins/internal/pirPlugin').PirPlugin;
      var Dht22Plugin = require('./plugins/internal/dht22Plugin').Dht22Plugin;

      var pirPlugin = new PirPlugin({'simulate': true, 'frequency': 30000});
      pirPlugin.start();

      var ledsPlugin = new LedsPlugin({'simulate': true, 'frequency': 30000});
      ledsPlugin.start();

      var dht22Plugin = new Dht22Plugin({'simulate': true, 'frequency': 2000});
      dht22Plugin.start();

      console.info('Your WoT Pi is up and running on port %s', port);
    })
};

module.exports = createServer;


