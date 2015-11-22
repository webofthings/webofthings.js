var utils = require('./../utils/utils.js'),
  util = require('util'),
  _ = require('lodash/collection'),
  resources = require('./../resources/model');

/**
 * params: e.g., {'simulate': false, 'frequency': 5000};
 * propertyId: the name of the Web Thing Model property covered by the sensor/actuator
 * doStop: function to invoke to stop the plugin, on top of what the Core Plugin provides
 * doSimulate: function to invoke to simulate a new value, on top of what the Core Plugin provides
 * actionIds: an Array of Actions to observe, e.g., ['ledState'], this is only for Actuators
 * doAction: this will be invoked when an observed Action happens, this is only for Actuators
 * @type {exports.CorePlugin}
 */
var CorePlugin = exports.CorePlugin = function (params, propertyId, doStop, doSimulate, actionsIds, doAction) {
  if (params) { //#A
    this.params = params;
  } else {
    this.params = {'simulate': false, 'frequency': 5000};
  }

  this.doAction = doAction;
  this.doStop = doStop;
  this.doSimulate = doSimulate; //#B
  this.actions = actionsIds; //#C
  this.model = utils.findProperty(propertyId); //#D
};

CorePlugin.prototype.start = function () {
  if (this.actions) this.observeActions(); //#E
  if (this.params.simulate) {
    this.simulate();
  } else {
    this.connectHardware();
  }
  console.info('[plugin started] %s', this.model.name);
};

CorePlugin.prototype.stop = function (doStop) {
  if (this.params.simulate) {
    clearInterval(this.interval);
  } else {
    if (this.doStop) doStop();
  }
  console.info('[plugin stopped] %s', this.model.name);
};

CorePlugin.prototype.simulate = function () {
  var self = this;
  this.interval = setInterval(function () {
    self.doSimulate();
    self.showValue();
  }, self.params.frequency);
  console.info('[simulator started] %s', this.model.name);
};

CorePlugin.prototype.connectHardware = function () {
  throw new Error('connectedHardware() should be implemented by Plugin');
};

CorePlugin.prototype.showValue = function () {
  console.info('Current value for %s is %s', this.model.name, util.inspect(this.model.data[this.model.data.length-1]));
};

CorePlugin.prototype.observeActions = function () {
  var self = this;
  _.forEach(self.actions, function (actionId) { //#F
    Object.observe(resources.links.actions.resources[actionId].data, function (changes) {
      var action = changes[0].object.pop();
      console.info('[plugin action detected] %s', actionId);
      if (self.doAction) self.doAction(action);
    }, ['add']);
  });
};

CorePlugin.prototype.createValue = function (data) {
  throw new Error('createValue() should be implemented by Plugin');
};

CorePlugin.prototype.addValue = function(data) {
  utils.cappedPush(this.model.data, this.createValue(data));
};

//#A Initialize a new concrete plugin with the given parameters and functions
//#B doActions is provided by the concrete plugin and contains what to do when an Action is received
//#C A list of the identifiers of actions to observe
//#D This helper function returns the property of this plugin
//#E Start observing the actions
//#F For each Action ID find it in the model and register a callback to doAction