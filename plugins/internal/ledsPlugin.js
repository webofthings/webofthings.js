//TODO: Take code from chapter 7
var CorePlugin = require('./../corePlugin').CorePlugin,
  resources = require('./../../resources/model'),
  util = require('util'),
  utils = require('./../../utils/utils.js');

var actuator, model;

var LedsPlugin = exports.LedsPlugin = function (params) { //#A
  CorePlugin.call(this, params, 'leds',
    stop, simulate, ['ledState'], switchOnOff); //#B
  model = this.model;
  addData(false);
};
util.inherits(LedsPlugin, CorePlugin); //#F

function addData(value) { //#C
  //TODO: Fix the size of the array
  model.data.push({"1" : value, "2" : false, "timestamp" : utils.isoTimestamp()});
 //model.data = [{"1" : value, "2" : false, "timestamp" : utils.isoTimestamp()}];
};

function switchOnOff(changes) { //#D
  +changes.state;
  actuator.write(changes.state, function () {
    console.info('Changed value to %i', changes.state);
  });
};

function stop() {
  actuator.unexport();
};

function simulate() {
  addData(false);
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