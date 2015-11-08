var CorePlugin = require('./../corePlugin').CorePlugin,
  resources = require('./../../resources/model'),
  util = require('util'),
  utils = require('./../../utils/utils.js');

var modelTemperature, modelHumidity;

var Dht22Plugin = exports.Dht22Plugin = function (params) {
  CorePlugin.call(this, params, 'temperature', stop, simulate, null, null);
  modelTemperature = this.model;
  modelHumidity = utils.findProperty('humidity');

  // init
  addData([0, 0]);
};
util.inherits(Dht22Plugin, CorePlugin);

function stop() {
  actuator.unexport();
};

function simulate() {
  addData([utils.randomInt(0, 40), utils.randomInt(20, 100)]);
};

function addData(value) {
  modelTemperature.data.push({"t": value[0], "timestamp": utils.isoTimestamp()});
  modelHumidity.data.push({"h": value[1], "timestamp": utils.isoTimestamp()});
};

function showValue() {
  console.info('Temperature: %s C, humidity %s \%',
    modelTemperature.value, modelHumidity.value);
};

Dht22Plugin.prototype.connectHardware = function () {
  var sensorDriver = require('node-dht-sensor');
  var sensor = {
    initialize: function () {
      return sensorDriver.initialize(22, modelTemperature.values.t.customFields.gpio);
    },
    read: function () {
      var readout = sensorDriver.read();
      addData([parseFloat(readout.temperature.toFixed(2)), parseFloat(readout.humidity.toFixed(2))]);
      showValue();

      setTimeout(function () {
        sensor.read();
      }, localParams.frequency);
    }
  };
  if (sensor.initialize()) {
    console.info('Hardware %s sensor started!', this.model.name);
    sensor.read();
  } else {
    console.warn('Failed to initialize sensor!');
  }
};


