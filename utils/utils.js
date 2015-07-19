var model = require('./../resources/model'),
  _ = require('lodash/collection');

exports.addDevice = function(id, name, description, sensors, actuators) {
  if(!model.things) {
    model.things = {};
  }
  model.things[id] = {'name' : name,
    'description' : description,
    'sensors' : sensors,
    'actuators' : actuators
  }
};

exports.randomInt = function(low, high) {
  return Math.floor(Math.random() * (high - low + 1) + low);
};

exports.findObjectInArray = function(array, filterObj) {
  //TODO: could be made async if array is big
  return _.find(array, filterObj);
};

exports.findProperty = function(propertyId){
  return model.links.properties.resources[propertyId];
};

exports.isoTimestamp = function(){
  var date = new Date();
  return date.toISOString();
};

exports.extractFields = function(fields, object, target) {
  if(!target) var target = {};
  var arrayLength = fields.length;
  for (var i = 0; i < arrayLength; i++) {
    var field = fields[i];
    target[field] = object[field];
  }
  return target;
};