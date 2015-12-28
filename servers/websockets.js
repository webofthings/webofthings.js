var WebSocketServer = require('ws').Server,
  resources = require('./../resources/model');

var util = require('util');


exports.listen = function (server) {
  var wss = new WebSocketServer({server: server}); //#A
  console.info('WebSocket server started...');
  wss.on('connection', function (ws) { //#B
    var url = ws.upgradeReq.url;
    try {
      Array.observe(selectResouce(url), function (changes) { //#C
        console.log("Change detected: %s", util.inspect(changes));
        ws.send(JSON.stringify(changes[0].object[changes[0].index]), function () {
        });
      }, ['update'])
    } catch (e) { //#D
      console.log('Unable to observe %s resource!', url);
    };
  });
};

function selectResouce(url) { //#E
  var parts = url.split('/');
  parts.shift();

  var result;
  if (parts[0] === 'actions') {
    result = resources.links.actions.resources[parts[1]].data;
  } else {
    result = resources.links.properties.resources[parts[1]].data;
  }
  return result;
}

//#A Create a WebSocket server by passing it the Express server
//#B Triggered after a protocol upgrade when the client connected
//#C We register an observer corresponding to the resource in the protocol upgrade URL
//#D We use a try/catch to catch to intercept error (e.g., malformed/unsupported URLs)
//#E This function takes a request URL and returns the corresponding resource


