var CorePlugin = require('./../corePlugin').CorePlugin,
  resources = require('./../../resources/model'),
  util = require('util'),
  utils = require('./../../utils/utils.js');

var actuator;
var model;

var LedsPlugin = exports.LedsPlugin = function (params) {
  CorePlugin.call(this, params, 'leds', stop, simulate, ['ledState'], switchOnOff);
  model = this.model;

  // init
  addData(false);
};

LedsPlugin.prototype.connectHardware = function () {
  var Gpio = require('onoff').Gpio;
  actuator = new Gpio(self.model.values['1'].customFields.gpio, 'out');
  console.info('Hardware %s actuator started!', self.model.name);
};

function stop() {
  actuator.unexport();
};

function simulate() {
  addData(false);
};

function addData(value) {
  model.data.push({"1" : value, "2" : false, "timestamp" : utils.isoTimestamp()});
};

function switchOnOff(changes) {
  +model.value;
  model.value = (model.value + 1) % 2;
  actuator.write(model.value, function () {
    console.info('Changed value to %i', model.value);
  });
};

util.inherits(LedsPlugin, CorePlugin);

