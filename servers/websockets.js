var WebSocketServer = require('ws').Server,
  url = require('url'),
  resources = require('./../resources/model'),
  utils = require('./../utils/utils');

/**
 * Fake Array.Observe if not available
 */
var ArrayObserver = Array.observe || function (resource, callback, extra) {
	resource.push = function (data) {
		Array.prototype.push.call(resource, data);
		callback([{object: resource}]);
	};
};

exports.listen = function (server) {
  var wss = new WebSocketServer({server: server}); //#A
  console.info('WebSocket server started...');
  wss.on('connection', function (ws) { //#B
    var reqUrl = url.parse(ws.upgradeReq.url, true);
    if (!utils.isTokenValid(reqUrl.query.token)) {
      ws.send(JSON.stringify({'error': 'Invalid access token.'}));
    } else {
      try {
    	  ArrayObserver(selectResource(reqUrl.pathname), function (changes) { //#C
          ws.send(JSON.stringify(changes[0].object[changes[0].object.length - 1]), function () {
          });
        }, ['add'])
      } catch (e) { //#D
        console.log('Unable to observe %s resource!', url);
      }
    }
  });
};

function selectResource(url) { //#E
  var parts = url.split('/');
  parts.shift();

  var result;
  console.log(" parts ==> ", parts)
  if (parts[0] === 'actions') {
    result = resources.links.actions.resources[parts[1]].data;
  } else {
    result = resources.links.properties.resources[parts[1]].data;
  }
  console.log(result);
  return result;
}

//#A Create a WebSocket server by passing it the Express server
//#B Triggered after a protocol upgrade when the client connected
//#C We register an observer corresponding to the resource in the protocol upgrade URL
//#D We use a try/catch to catch to intercept error (e.g., malformed/unsupported URLs)
//#E This function takes a request URL and returns the corresponding resource


