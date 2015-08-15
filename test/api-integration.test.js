var expect = require('chai').expect,
  request = require('request'),
  server = require('../wot-server'),
  status = require('http-status'),
  util = require('util');

describe('/', function () {
  var app, req;
  var port = 8777;
  var rootUrl = 'http://localhost:' + port;


  before(function () {
    app = server(port);

    req = request.defaults({
      json: true, headers: {
        'Accept': 'application/json'
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

      done();
    });
  });

  it('creates a ledState action', function (done) {
    var uri = '/actions/ledState'
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
    var uri = '/actions/ledState'
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
    });

    done();
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
    });
    done();
  });


});