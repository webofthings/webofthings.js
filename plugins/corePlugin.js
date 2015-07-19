var utils = require('./../utils/utils.js'),
  _ = require('lodash/collection'),
  resources = require('./../resources/model');

var CorePlugin = exports.CorePlugin = function(params, propertyId, doStop, doSimulate, actionsIds, doAction) {
  if(params) {
    this.params = params;
  } else {
    this.params = {'simulate': false, 'frequency': 5000};
  }

  this.model = utils.findProperty(propertyId);
  this.actions = actionsIds;
  this.doAction = doAction;
  this.doStop = doStop;
  this.doSimulate = doSimulate;
};

CorePlugin.prototype.start = function() {
    if(this.actions) this.observeActions();
    if (this.params.simulate) {
      this.simulate();
    } else {
      this.connectHardware();
    }
};

CorePlugin.prototype.stop = function(doStop) {
  if (params.simulate) {
    clearInterval(this.params.frequency);
  } else {
    if(this.doStop) doStop();
  }
  console.info('%s plugin stopped!', this.model.name);
}

CorePlugin.prototype.simulate = function() {
  var self = this;
  this.interval = setInterval(self.doSimulate, self.params.frequency);
  console.info('Simulated %s actuator started!', this.model.name);
};

CorePlugin.prototype.connectHardware = function() {
  throw new Error('connectedHardware() should be implemented by Plugin')
};

CorePlugin.prototype.showValue = function() {
  console.info('Current value for %s is %s', this.model.name, this.model.value);
};

CorePlugin.prototype.observeActions = function() {
  var self = this;
  _.forEach(self.actions, function(actionId) {
    Object.observe(resources.links.actions.resources[actionId].data, function (changes) {
      var action = changes[0].object[0];
      console.info('%s action detected by plugin', actionId);
      if(self.doAction) self.doAction(action);
    }, ['add']);
  });
};

