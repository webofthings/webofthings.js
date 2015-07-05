var utils = require('./../utils/utils.js');

var CorePlugin = exports.CorePlugin = function(params, model, doStop, doAction) {
  if(params) {
    this.params = params;
  } else {
    this.params = {'simulate': false, 'frequency': 5000};
  }

  this.model = model;
  this.doAction = doAction;
  this.doStop = doStop;
};

CorePlugin.prototype.start = function() {
    this.observe();
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
  this.interval = setInterval(function () {
    switch (typeof self.model.value) {
      case 'boolean':
        self.model.value = !self.model.value;
        break;
      case 'number':
        self.model.value = utils.randomInt(0, 100);
        break
    }
  }, self.params.frequency);
  console.info('Simulated %s actuator started!', this.model.name);
};

CorePlugin.prototype.connectHardware = function() {
  throw new Error('connectedHardware() should be implemented by Plugin')
};

CorePlugin.prototype.showValue = function() {
  console.info('Current value for %s is %s', this.model.name, this.model.value);
};

CorePlugin.prototype.observe = function() {
  var self = this;
  Object.observe(self.model, function (changes) {
    console.info('Change detected by plugin for %s...', self.model.name);
    if(self.params.simulate) {
      console.info('Change simulated for', self.model.name);
    }
    else if(self.doAction) self.doAction(self.model);
  });
};
