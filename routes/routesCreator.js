var express = require('express'),
  router = express.Router(),
  uuid = require('node-uuid'),
  utils = require('./../utils/utils'),
  _ = require('lodash');

exports.create = function (model) {

  //TODO: Do we really need this? Isn't this injected by the plugins?
  createDefaultData(model.links.properties.resources);
  createDefaultData(model.links.actions.resources);

  // Let's create the routes
  createRootRoute(model);
  createModelRoutes(model);
  createPropertiesRoutes(model);
  createActionsRoutes(model);

  return router;
};

function createRootRoute(model) {
  router.route('/').get(function (req, res, next) {

    req.model = model;
    req.type ='root';

    var fields = ['id', 'name', 'description', 'tags', 'customFields'];
    req.result = utils.extractFields(fields, model);

    if (req.accepts('html')) {
      //TODO: Vlad: Templating here or in routes directly
      res.render('root', { result: req.result});
      return;
    }

    res.links({
      model: 'http://api.example.com/users?page=2'
    });


    next();
  });
};


function createModelRoutes(model) {
  // GET /model
  router.route('/model').get(function (req, res, next) {
    req.result = model;

    req.model = model;
    req.type ='model';

    res.links({
      next: 'http://api.example.com/users?page=2'
    });

    next();
  });
};

function createPropertiesRoutes(model) {

  var properties = model.links.properties;
  // GET /properties
  router.route(properties.link).get(function (req, res, next) {
    req.model = model;
    req.type ='properties';
    //TODO: must fetch the array of all data for all model
    req.result = transformProperties(properties.resources);
    next();
  });

  // GET /properties/{id}
  router.route(properties.link + '/:id').get(function (req, res, next) {
    req.model = model;
    req.type ='property';
    req.result = properties.resources[req.params.id].data;
    next();
  });
};

function createActionsRoutes(model) {


  var actions= model.links.actions;

  // GET /actions
  router.route(actions.link).get(function (req, res, next) {
    req.result = transformActions(actions.resources);
    
    req.model = model;
    req.type ='actions';

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

    req.model = model;
    req.type ='action';

    res.links({
      next: 'http://api.example.com/users?page=2',
      last: 'http://api.example.com/users?page=5'
    });

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