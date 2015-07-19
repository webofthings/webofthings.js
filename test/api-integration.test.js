var expect = require('chai').expect
var request = require('request');
var server = require('../wot-server');
var status = require('http-status');

describe('/', function() {
  var app, req;
  var port = 8777;
  var rootUrl = 'http://localhost:' + port;


  before(function() {
    app = server(port);

    req = request.defaults({json: true, headers: {
      'Accept': 'application/json'
    }});
  });

  after(function() {
    app.close();
  });

  it('returns the model', function(done) {
    req.get(rootUrl + '/model', function(err, res, model) {

      expect(err).to.be.null;
      expect(res.statusCode).to.equal(status.OK);


      expect(model).to.be.a('object');
      expect(model.links).to.have.keys(['product', 'properties', 'actions', 'type', 'help', 'ui']);
      expect(model.links.properties.resources).to.have.keys(['temperature', 'humidity', 'pir', 'leds']);
      expect(model.links.actions.resources).to.have.keys(['ledState']);
      done();
    });
  });


  it('returns the properties', function(done) {
    req.get(rootUrl + '/properties', function(err, res, sensors) {
      expect(err).to.be.null;
      expect(res.statusCode).to.equal(status.OK);

      //expect(sensors).to.have.all.keys(['temperature', 'humidity', 'pir']);

      done();
    });
  });


  it('returns the actions', function(done) {
    req.get(rootUrl + '/actions', function(err, res, sensor) {

      expect(err).to.be.null;
      expect(res.statusCode).to.equal(status.OK);

      //expect(sensor).to.have.all.keys(sensorNumProp);
      //
      //// check the sensor value
      //expect(sensor.value).to.be.within(0,50);

      done();
    });
  });

  it('returns the PIR property of the Pi', function(done) {
    req.get(rootUrl + '/properties/pir', function(err, res, pir) {

      expect(err).to.be.null;
      expect(res.statusCode).to.equal(status.OK);

      // check the sensor value
      expect(pir).to.be.a('array');
      expect(pir[0].presence).to.be.a('boolean');

      done();
    });
  });

  it('creates a ledState action', function(done) {
    var uri = '/actions/ledState'
    req.post(rootUrl + uri,
      {body : {"ledId" : 1, "state" : true}},
      function(err, res, ledStates) {

        expect(err).to.be.null;
        expect(res.statusCode).to.equal(status.NO_CONTENT);

        expect(res.headers.location).to.contain(uri);
        expect(res.headers.location).to.have.length.above(uri.length);

        done();
      });
  });

  it('returns the ledState actions', function(done) {
    req.get(rootUrl + '/actions/ledState', function(err, res, ledStates) {

      expect(err).to.be.null;
      expect(res.statusCode).to.equal(status.OK);

      // check the sensor value
      expect(ledStates).to.be.a('array');
      expect(ledStates[0].state).to.be.a('boolean');

      done();
    });
  });


  // Test the homepage!
    it('returns the homepage of the gateway', function(done) {
      req.get(rootUrl, {json: false, headers: {
        'Accept': 'text/html'
      }}, function(err, res, html) {
        expect(err).to.be.null;
        expect(res.statusCode).to.equal(status.OK);
        expect(html).to.be.a('string');
        expect(html).to.have.string('<!DOCTYPE html>');
      });

      done();
    });


});