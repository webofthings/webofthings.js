var CorePlugin = require('./../corePlugin').CorePlugin,
  resources = require('./../../resources/model'),
  util = require('util'),
  utils = require('./../../utils/utils.js');

var actuator;
var model;

var Dht22Plugin = exports.Dht22Plugin = function (params) {
  //CorePlugin.call(this, params, 'temperature', stop, simulate, null, null);
  //CorePlugin.call(this, params, 'humidity', stop, simulate, null, null);
  model = this.model;

  // init
  addData(false);
};

Dht22Plugin.prototype.connectHardware = function () {
  var Gpio = require('onoff').Gpio;
  actuator = new Gpio(self.model.values['1'].customFields.gpio, 'out');
  console.info('Hardware %s actuator started!', self.model.name);
};

function stop() {
  actuator.unexport();
};

function simulate() {
  //addData(false);
};

function addData(value) {
  // TODO: support several values model.data.push({"1" : value, "2" : false, "timestamp" : utils.isoTimestamp()});
  model.data = [{"1" : value, "2" : value, "timestamp" : utils.isoTimestamp(), "status" : "completed"}];
};

function switchOnOff(changes) {
  +model.value;
  model.value = (model.value + 1) % 2;
  actuator.write(model.value, function () {
    console.info('Changed value to %i', model.value);
  });
};

util.inherits(Dht22Plugin, CorePlugin);

