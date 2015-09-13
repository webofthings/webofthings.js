var CorePlugin = require('./../corePlugin').CorePlugin,
  resources = require('./../../resources/model'),
  util = require('util'),
  utils = require('./../../utils/utils.js');

var sensor, model;

var PirPlugin = exports.PirPlugin = function (params) {
  CorePlugin.call(this, params, 'pir', stop, simulate);
  model = this.model;
  addData(true);
};
util.inherits(PirPlugin, CorePlugin);

PirPlugin.prototype.connectHardware = function () {
  var Gpio = require('onoff').Gpio;
  var self = this;
  sensor = new Gpio(self.model.values.presence.customFields.gpio, 'in', 'both');
  sensor.watch(function (err, value) {
    if (err) exit(err);
    this.showValue();
    addData(!!value);
  });
  console.info('Hardware %s sensor started!', self.model.name);
};

function stop() {
  sensor.unexport();
};

function simulate() {
  //addData(false);
};

function addData(value) {
  //TODO: Fix the size of the array
  model.data.push({"presence": value, "timestamp": utils.isoTimestamp()});
  //model.data = [{"presence": value, "timestamp": utils.isoTimestamp()}];
};




