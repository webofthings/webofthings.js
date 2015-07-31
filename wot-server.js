var httpServer = require('./servers/http'),
  wsServer = require('./servers/websockets'),
  resources = require('./resources/model');


// HTTP Server
var createServer = function (port) {
  if(port === undefined) {
    port = resources.customFields.port;
  };

  return server = httpServer.listen(port, function () {
    console.log('HTTP server started...');

    // Websockets server
    wsServer.listen(server);

    // Plugins

    // Internal Plugins
    var LedsPlugin = require('./plugins/internal/ledsPlugin').LedsPlugin;
    var PirPlugin = require('./plugins/internal/pirPlugin').PirPlugin;
    var Dht22Plugin = require('./plugins/internal/dht22Plugin').Dht22Plugin;

    var pirPlugin = new PirPlugin({'simulate': true, 'frequency': 2000});
    pirPlugin.start();

    var ledsPlugin = new LedsPlugin({'simulate': true, 'frequency': 2000});
    ledsPlugin.start();

    //var Dht22Plugin = new Dht22Plugin({'simulate': true, 'frequency': 2000});
    //Dht22Plugin.start();

    // External Plugins
    //var coapPlugin = require('./plugins/external/coapPlugin');
    //coapPlugin.start({'simulate': false, 'frequency': 10000});

    console.info('Your WoT Pi is up and running on port %s', port);
  })
}; 

module.exports = createServer;


