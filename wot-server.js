var httpServer = require('./servers/http'),
  wsServer = require('./servers/websockets'),
  resources = require('./resources/model');

// Internal Plugins
//var LedsPlugin = require('./plugins/internal/ledsPlugin').LedsPlugin,
//  PirPlugin = require('./plugins/internal/pirPlugin').PirPlugin;
  //dhtPlugin = require('./plugins/internal/DHT22SensorPlugin');

//var pirPlugin = new PirPlugin({'simulate': true, 'frequency': 2000});
//pirPlugin.start();

//var ledsPlugin = new LedsPlugin({'simulate': true, 'frequency': 2000});
//ledsPlugin.start();

// External Plugins
//var coapPlugin = require('./plugins/external/coapPlugin');
//coapPlugin.start({'simulate': false, 'frequency': 10000});

// HTTP Server
var server = httpServer.listen(resources.customFields.port, function () {
  console.log('HTTP server started...');

  // Websockets server
  wsServer.listen(server);

  console.info('Your WoT Pi is up and running on port %s', resources.customFields.port);
})


