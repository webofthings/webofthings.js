var express = require('express'),
  router = express.Router(),
  uuid = require('node-uuid'),
  utils = require('./../utils/utils');


var perPage = 30;

exports.create = function (model) {

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

    if (model['@context']) type = model['@context'];
    else type = 'http://model.webofthings.org/';

    res.links({
      model: '/model/',
      properties: '/properties/',
      actions: '/actions/',
      things: '/things/',
      type: type
    });


    next();
  });
};


function createModelRoutes(model) {
  // GET /model
  router.route('/model').get(function (req, res, next) {
    req.result = model;

    req.model = model;

    res.links({
      type: model['@context']
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
    req.entityId = 'properties';

    req.result = utils.modelToResources(properties.resources, true);

    // Generate the Link headers 
    if (properties['@context']) type = properties['@context'];
    else type = 'http://model.webofthings.org/properties';

    res.links({
      type: type
    });

    next();
  });

  // GET /properties/{id}
  router.route(properties.link + '/:id').get(function (req, res, next) {
    req.model = model;
    req.propertyModel = properties.resources[req.params.id];
    req.type ='property';
    req.entityId = req.params.id;

    req.result = properties.resources[req.params.id].data;

    // Generate the Link headers 
    if (properties.resources[req.params.id]['@context']) type = properties.resources[req.params.id]['@context'];
    else type = 'http://model.webofthings.org/properties';

    res.links({
      type: type
    });

    next();
  });
};

function createActionsRoutes(model) {

  var actions= model.links.actions;

  // GET /actions
  router.route(actions.link).get(function (req, res, next) {
    req.result = utils.modelToResources(actions.resources, true);
    
    req.model = model;
    req.type ='actions';
    req.entityId = 'actions';

    if (actions['@context']) type = actions['@context'];
    else type = 'http://model.webofthings.org/actions';

    res.links({
      type: type
    });

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

    next();
  });


  // GET /actions/{actionType}
  router.route(actions.link + '/:actionType').get(function (req, res, next) {

    // TODO handle pagination here & in the headers
    //console.log("Asking for page: " + req.query.page +"(Total #: "+ actions.resources[req.params.actionType].data.length +")");

    req.result = actions.resources[req.params.actionType].data;
    req.actionModel = actions.resources[req.params.actionType];
    req.model = model;

    req.entityId = req.params.actionType;


    if (actions.resources[req.params.actionType]['@context']) type = actions.resources[req.params.actionType]['@context'];
    else type = 'http://model.webofthings.org/actions';

    res.links({
      type: type
    });

    res.links({
      type: type,
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



