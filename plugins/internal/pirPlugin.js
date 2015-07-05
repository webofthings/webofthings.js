var CorePlugin = require('./../corePlugin').CorePlugin,
  resources = require('./../../resources/model'),
  util = require('util');

var sensor;

var PirPlugin = exports.PirPlugin = function(params) {
  CorePlugin.call(this, params, resources.pi.sensors.pir, stop);
};

CorePlugin.prototype.connectHardware = function() {
  var Gpio = require('onoff').Gpio;
  var self = this;
  sensor = new Gpio(self.model.gpio, 'in', 'both');
  sensor.watch(function (err, value) {
    if (err) exit(err);
    this.showValue();
    self.model.value = !!value;
  });
  console.info('Hardware %s sensor started!', self.model.name);
};

function stop() {
  sensor.unexport();
};

util.inherits(PirPlugin, CorePlugin);

