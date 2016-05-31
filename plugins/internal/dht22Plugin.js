var CorePlugin = require('./../corePlugin').CorePlugin,
  util = require('util'),
  utils = require('./../../utils/utils.js');

var modelTemperature, modelHumidity, sensor, interval;

var Dht22Plugin = exports.Dht22Plugin = function (params) {
  CorePlugin.call(this, params, 'temperature', stop, simulate, null, null);
  modelTemperature = this.model;
  modelHumidity = utils.findProperty('humidity');

  // init
  this.addValue([0, 0]);
};
util.inherits(Dht22Plugin, CorePlugin);

function stop() {
  clearInterval(interval);
}

function simulate() {
  this.addValue([utils.randomInt(0, 40), utils.randomInt(20, 100)]);
}

Dht22Plugin.prototype.addValue = function(values) {
  utils.cappedPush(modelTemperature.data, {"t": values[0], "timestamp": utils.isoTimestamp()});
  utils.cappedPush(modelHumidity.data, {"h": values[1], "timestamp": utils.isoTimestamp()});
};

Dht22Plugin.prototype.showValues = function () {
  console.info('Temperature: %s C, Humidity: %s \%', modelTemperature.data[modelTemperature.data.length-1].t, modelHumidity.data[modelHumidity.data.length-1].h);
};

Dht22Plugin.prototype.connectHardware = function () {
  var sensorDriver = require('node-dht-sensor');
  var self = this;
  sensor = {
    initialize: function () {
      console.log('Starting DHT Sensor on GPIO, %s', self.model.values.t.customFields.gpio);
      return sensorDriver.initialize(22, self.model.values.t.customFields.gpio);
    },
    read: function () {
      var readout = sensorDriver.read();
      self.addValue([parseFloat(readout.temperature.toFixed(2)), parseFloat(readout.humidity.toFixed(2))]);
      self.showValues();
    }
  };
  if (sensor.initialize()) {
    console.info('Hardware %s sensor started!', self.model.name);
    interval = setInterval(function () {
      sensor.read();
    }, 2000);
  } else {
    console.warn('Failed to initialize sensor!');
  }
};


