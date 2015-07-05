var CorePlugin = require('./../corePlugin').CorePlugin,
  resources = require('./../../resources/model'),
  util = require('util');

var actuator;

var LedsPlugin = exports.LedsPlugin = function (params) {
  CorePlugin.call(this, params,
    resources.pi.actuators.leds['1'], switchOnOff);
};

LedsPlugin.prototype.connectHardware = function () {
  var Gpio = require('onoff').Gpio;
  actuator = new Gpio(14, 'out');
  console.info('Hardware %s actuator started!', pluginName);
};

function switchOnOff(model) {
  +model.value;
  model.value = (model.value + 1) % 2;
  actuator.write(model.value, function () {
    console.info('Changed value to %i', model.value);
  });
};

util.inherits(LedsPlugin, CorePlugin);

