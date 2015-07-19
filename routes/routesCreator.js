var express = require('express'),
  router = express.Router(),
  uuid = require('node-uuid'),
  utils = require('./../utils/utils'),
  _ = require('lodash');

exports.create = function (model) {

  //TODO: Do we really need this? Isn't this injected by the plugins?
  createDefaultData(model.links.properties.resources);
  createDefaultData(model.links.actions.resources);

  createModelRoutes(model);
  createPropertiesRoutes(model.links.properties);
  createActionsRoutes(model.links.actions);

  createRootRoute(model);

  return router;
};

function createRootRoute(model) {
  router.route('/').get(function (req, res, next) {
    // TODO: Headers

    var fields = ['id', 'name', 'description', 'tags', 'customFields'];
    req.result = utils.extractFields(fields, model);
    next();
  });
};


function createModelRoutes(model) {
  // GET /model
  router.route('/model').get(function (req, res, next) {
    req.result = model;
    next();
  });
};

function createPropertiesRoutes(properties) {
  // GET /properties
  router.route(properties.link).get(function (req, res, next) {
    //TODO: must fetch the array of all data for all model
    req.result = transformProperties(properties.resources);
    next();
  });

  // GET /properties/{id}
  router.route(properties.link + '/:id').get(function (req, res, next) {
    req.result = properties.resources[req.params.id].data;
    next();
  });
};

function createActionsRoutes(actions) {
  // GET /actions
  router.route(actions.link).get(function (req, res, next) {
    req.result = transformActions(actions.resources);
    next();
  });

  // POST /actions/{actionType}
  router.route(actions.link + '/:actionType').post(function (req, res, next) {
    var action = req.body;
    action.id = uuid.v1();
    action.status = "pending";
    action.timestamp = utils.isoTimestamp();
    actions.resources[req.params.actionType].data.push(action);
    res.location(req.originalUrl + '/' + action.id);

    // TODO: Vlad: you can add the links header as follow:
    res.links({
      next: 'http://api.example.com/users?page=2',
      last: 'http://api.example.com/users?page=5'
    });

    next();
  });

  // GET /actions/{actionType}
  router.route(actions.link + '/:actionType').get(function (req, res, next) {
    req.result = actions.resources[req.params.actionType].data;
    next();
  });

  // GET /actions/{id}/{actionId}
  router.route(actions.link + '/:actionType/:actionId').get(function (req, res, next) {
    req.result = utils.findObjectInArray(actions.resources[req.params.actionType].data,
      {"id" : req.params.actionId});
    next();
  });
};

function createSubscriptionsRoutes() {
  //TODO
};

function createDefaultData(resources) {
  // Add the latest values to the model
  Object.keys(resources).forEach(function (resKey) {
    var resource = resources[resKey];
    //Object.keys(resource.values).forEach(function(valKey) {
    resource.data = [];
    //var value = {};
    //  value[valKey] = 'hello';
    //resource.data.push(value);
    //});
  });
}

function transformProperties(properties) {
  var result = [];
  Object.keys(properties).forEach(function(key) {
    var val = properties[key];
    var property = {};
    property.id = key;
    property = utils.extractFields(['name'], val, property);
    property.values = val.data[0];
    result.push(property);
  });
  return result;
}

function transformActions(actions) {
  var result = [];
  Object.keys(actions).forEach(function(key) {
    var val = actions[key];
    var action = {};
    action.id = key;
    action = utils.extractFields(['name'], val, action);
    result.push(action);
  });
  return result;
}