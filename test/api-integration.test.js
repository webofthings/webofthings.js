var expect = require('chai').expect,
  request = require('request'),
  server = require('../wot-server'),
  status = require('http-status'),
  util = require('util'),
  token = require('../resources/auth').apiToken;

describe('/', function () {
  var app, req;
  var port = 8777;
  var rootUrl = 'http://localhost:' + port;


  before(function () {
    app = server(port, false);

    req = request.defaults({
      json: true, headers: {
        'Accept': 'application/json',
        'Authorization' : token
      }
    });
  });

  after(function () {
    app.close();
  });

  it('returns the thing', function (done) {
    req.get(rootUrl, function (err, res, thing) {

      expect(err).to.be.null;
      expect(res.statusCode).to.equal(status.OK);

      expect(thing).to.be.a('object');
      expect(thing).to.have.keys(['id', 'name', 'description', 'tags', 'customFields']);
      done();
    });
  });


  it('returns the model', function (done) {
    req.get(rootUrl + '/model', function (err, res, model) {

      expect(err).to.be.null;
      expect(res.statusCode).to.equal(status.OK);


      expect(model).to.be.a('object');
      expect(model.links).to.have.keys(['product', 'properties', 'actions', 'type', 'help', 'ui']);
      expect(model.links.properties.resources).to.have.keys(['temperature', 'humidity', 'pir', 'leds']);
      expect(model.links.actions.resources).to.have.keys(['ledState']);
      done();
    });
  });


  it('returns the properties', function (done) {
    req.get(rootUrl + '/properties', function (err, res, props) {
      expect(err).to.be.null;
      expect(res.statusCode).to.equal(status.OK);

      expect(props).to.be.a('array');
      expect(props).to.be.of.length(4);

      done();
    });
  });


  it('returns the actions', function (done) {
    req.get(rootUrl + '/actions', function (err, res, actions) {

      expect(err).to.be.null;
      expect(res.statusCode).to.equal(status.OK);

      expect(actions).to.be.a('array');
      expect(actions[0].id).to.equal('ledState');
      expect(actions[0].name).to.equal('Change LED state');

      done();
    });
  });

  it('returns the PIR property of the Pi', function (done) {
    req.get(rootUrl + '/properties/pir', function (err, res, pir) {

      expect(err).to.be.null;
      expect(res.statusCode).to.equal(status.OK);

      // check the sensor value
      expect(pir).to.be.a('array');
      expect(pir[0].presence).to.be.a('boolean');
      expect(pir[0].timestamp).to.not.be.an('undefined');

      done();
    });
  });

  it('returns the Temperature property of the Pi', function (done) {
    req.get(rootUrl + '/properties/temperature', function (err, res, temp) {

      expect(err).to.be.null;
      expect(res.statusCode).to.equal(status.OK);

      // check the sensor value
      expect(temp).to.be.a('array');
      expect(temp[0].t).to.be.a('number');
      expect(temp[0].timestamp).to.not.be.an('undefined');

      done();
    });
  });

  it('returns the Humidity property of the Pi', function (done) {
    req.get(rootUrl + '/properties/humidity', function (err, res, humid) {

      expect(err).to.be.null;
      expect(res.statusCode).to.equal(status.OK);

      // check the sensor value
      expect(humid).to.be.a('array');
      expect(humid[0].h).to.be.a('number');
      expect(humid[0].h).to.be.at.least(0);
      expect(humid[0].h).to.be.below(100);
      expect(humid[0].timestamp).to.not.be.an('undefined');

      done();
    });
  });

  it('returns the LED properties of the Pi', function (done) {
    req.get(rootUrl + '/properties/leds', function (err, res, leds) {

      expect(err).to.be.null;
      expect(res.statusCode).to.equal(status.OK);

      // check the sensor value
      expect(leds).to.be.a('array');
      expect(leds[0]['1']).to.be.a('boolean');
      expect(leds[0]['2']).to.be.a('boolean');
      expect(leds[0].timestamp).to.not.be.an('undefined');

      done();
    });
  });

  it('creates a ledState action', function (done) {
    var uri = '/actions/ledState';
    req.post(rootUrl + uri,
      {body: {"ledId": 1, "state": true}},
      function (err, res, ledStates) {

        expect(err).to.be.null;
        expect(res.statusCode).to.equal(status.NO_CONTENT);

        expect(res.headers.location).to.contain(uri);
        expect(res.headers.location).to.have.length.above(uri.length);

        done();
      });
  });


  it('retrieves a specific ledState action', function (done) {
    var uri = '/actions/ledState';
    req.post(rootUrl + uri,
      {body: {"ledId": 1, "state": true}},
      function (err, res, ledStates) {
        req.get(rootUrl + res.headers.location, function (err, res, action) {

          console.log('Retrieved action --> %s', util.inspect(action, false, null));

          expect(err).to.be.null;
          expect(res.statusCode).to.equal(status.OK);

          // check the sensor value
          expect(action).to.be.a('object');
          expect(action.state).to.be.a('boolean');
          expect(action.status).to.be.a('string');
          expect(action.timestamp).to.be.a('string');
          expect(action.status).to.equal('completed');

          done();
        });
      });
  });


  it('creates a ledState action and ensure it is in the right place in the list', function (done) {
    var uri = '/actions/ledState';
    req.post(rootUrl + uri,
      {body: {"ledId": 1, "state": true}},
      function (err, res, ledStates) {
        var id = res.headers.location.split('/').pop();
        req.get(rootUrl + uri, function (err, res, actions) {

          console.log('Retrieved actions --> %s', util.inspect(actions, false, null));

          expect(err).to.be.null;
          expect(res.statusCode).to.equal(status.OK);
          expect(actions).to.be.an('array');
          expect(actions[0].id).to.equal(id);
          done();
        });
      });
  });


  it('returns the ledState actions', function (done) {
    req.get(rootUrl + '/actions/ledState', function (err, res, ledStates) {

      expect(err).to.be.null;
      expect(res.statusCode).to.equal(status.OK);

      // check the sensor value
      expect(ledStates).to.be.a('array');
      expect(ledStates[0].state).to.be.a('boolean');

      done();
    });
  });


  it('ensures a led action changes the led state', function (done) {
    var uri = '/actions/ledState';
    req.post(rootUrl + uri,
      {body: {"ledId": 1, "state": true}},
      function (err, res, ledStates) {
        req.get(rootUrl + '/properties/leds', function (err, res, actions) {

          expect(err).to.be.null;
          expect(res.statusCode).to.equal(status.OK);

          // check the sensor value
          expect(actions).to.be.a('array');
          expect(actions).to.have.length.above(0);
          expect(actions.pop()['1']).to.be.a('boolean');
          expect(actions.pop()['1']).to.be.true;

          done();
        });
      });
  });


  // JSONLD
  it('returns the root page in JSON-LD', function (done) {
    req.get(rootUrl, {
      json: false, headers: {
        'Accept': 'application/ld+json'
      }
    }, function (err, res, jsonld) {
      expect(err).to.be.null;
      expect(res.statusCode).to.equal(status.OK);
      expect(jsonld).to.be.a('string');
      expect(jsonld).to.contain('@context');
      expect(jsonld).to.contain('@id');

      done();
    });
  });

  // HTML views
  it('returns the properties page', function (done) {
    req.get(rootUrl + '/properties', {
      json: false, headers: {
        'Accept': 'text/html'
      }
    }, function (err, res, html) {
      expect(err).to.be.null;
      expect(res.statusCode).to.equal(status.OK);
      expect(html).to.be.a('string');
      expect(html).to.have.string('<!DOCTYPE html>');
      expect(html).to.have.string('temperature');

      done();
    });
  });

  it('returns the homepage of the gateway', function (done) {
    req.get(rootUrl, {
      json: false, headers: {
        'Accept': 'text/html'
      }
    }, function (err, res, html) {
      expect(err).to.be.null;
      expect(res.statusCode).to.equal(status.OK);
      expect(html).to.be.a('string');
      expect(html).to.have.string('<!DOCTYPE html>');

      done();
    });
  });


  //TODO: Fixme, I should fail!
  it('checks that access is unauthorized without a token', function (done) {
    req.get(rootUrl + '/properties', {
      json: true, headers: {
        'Accept': 'application/json',
        'Authorization' : '123'
      }
    }, function (err, res) {
      expect(res.statusCode).to.equal(status.OK);

      done();
    });
  });


});