var CorePlugin = require('./../corePlugin').CorePlugin,
  resources = require('./../../resources/model'),
  util = require('util'),
  utils = require('./../../utils/utils.js');

var sensor, model;

var PirPlugin = exports.PirPlugin = function (params) {
  CorePlugin.call(this, params, 'pir', stop, simulate);
  model = this.model;
  this.addValue(true);
};
util.inherits(PirPlugin, CorePlugin);

function stop() {
  sensor.unexport();
};

function simulate() {
  this.addValue(false);
};

PirPlugin.prototype.createValue = function (data){
  return {"presence": data, "timestamp": utils.isoTimestamp()};
};

PirPlugin.prototype.connectHardware = function () {
  var Gpio = require('onoff').Gpio;
  var self = this;
  sensor = new Gpio(self.model.values.presence.customFields.gpio, 'in', 'both');
  sensor.watch(function (err, value) {
    if (err) exit(err);
    self.showValue();
    self.addValue(!!value);
  });
  console.info('Hardware %s sensor started!', self.model.name);
};






