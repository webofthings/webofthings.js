var CorePlugin = require('./../corePlugin').CorePlugin,
  resources = require('./../../resources/model'),
  util = require('util'),
  utils = require('./../../utils/utils.js');

var actuator, model;

var LedsPlugin = exports.LedsPlugin = function (params) { //#A
  CorePlugin.call(this, params, 'leds',
    stop, simulate, ['ledState'], switchOnOff); //#B
  model = this.model;
  this.addValue(false);
};
util.inherits(LedsPlugin, CorePlugin); //#F

function switchOnOff(value) { //#D
  var self = this;
  if (!this.params.simulate) {
    actuator.write(value.state === true ? 1 : 0, function () {
      self.addValue(value.state);
    });
  } else {
    self.addValue(value.state);
  }
  value.status = 'completed';
  console.info('Changed value of %s to %s', self.model.name, value.state);
};

function stop() {
  actuator.unexport();
};

function simulate() {
  this.addValue(false);
};

LedsPlugin.prototype.createValue = function (data){
  return {"1" : data, "2" : false, "timestamp" : utils.isoTimestamp()};
};

LedsPlugin.prototype.connectHardware = function () { //#E
  var Gpio = require('onoff').Gpio;
  var self = this;
  actuator = new Gpio(self.model.values['1'].customFields.gpio, 'out');
  console.info('Hardware %s actuator started!', self.model.name);
};



//#A We call the initalization function of the parent plugin (corePlugin.js)
//#B We pass it the Property we will update (leds) and the Actions we want to observe (ledState) as well as the implementation of what to do when a ledState Action is created (switchOnOff)
//#C Adds a new data entry to the property in the model
//#D Changes the state of the LED using the on/off library
//#E Extends the function connectHardware of corePlugin.js
//#F Make our LedsPlugin inherit from all the corePlugin.js functionality