var express = require('express'),
  routesCreator = require('./../routes/routesCreator'),
  resources = require('./../resources/model'),
  converter = require('./../middleware/converter'),
  auth = require('./../middleware/auth'),
  keys = require('../resources/auth'),
  bodyParser = require('body-parser'),
  cons = require('consolidate'),
  utils = require('./../utils/utils'),
  cors = require('cors');

var app = express();

app.use(bodyParser.json());
app.use(cors());

// Enables API Auth
//console.info('Here is a crypto-secure API Key: ' + utils.generateApiToken());
console.info('My API Token is: ' + keys.apiToken);
app.use(auth.simpleTokenAuth); // uncomment to enable the auth middleware

// Create Routes
app.use('/', routesCreator.create(resources));

// Templating engine
app.engine('html', cons.handlebars);
app.set('view engine', 'html');
app.set('views', __dirname + '/../views');
// Sets the public folder (for static content such as .css files & co)
app.use(express.static(__dirname + '/../public'));

app.use(converter);

module.exports = app;