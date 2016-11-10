var WebSocketServer = require('ws').Server,
  url = require('url'),
  resources = require('./../resources/model'),
  utils = require('./../utils/utils');

/**
 * Fake Array.Observe if not available
 */
if (Array.observe) {
	function ArrayObserver(res, cb, methods) {
		Array.observe(res.res.data,cb, methods);
	};
} else {
	var callbacklist={'properties': {}, 'actions' : {} };
	function ArrayObserver(res, cb, methods) {
		if (! callbacklist[res.type][res.resname]) {
			callbacklist[res.type][res.resname]=[];
		}
		callbacklist[res.type][res.resname].push(cb);
		res.res.data.push = function (data) {
			Array.prototype.push.call(res.res.data, data);
			if (callbacklist[res.type][res.resname]) {
				callbacklist[res.type][res.resname].forEach(function(cb) {
					cb([{object: res.res.data}]);
					});
			}
			
		};
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
      var observedResource = selectResource(reqUrl.pathname); 
      var resObjserver =  function (changes) { //#C
    		  console.log("coucou");
          ws.send(JSON.stringify(changes[0].object[changes[0].object.length - 1]), function () {
          });
        };
      try {
    	  ArrayObserver(observedResource, resObjserver, ['add']);
      } catch (e) { //#D
        console.log('Unable to observe %s resource!', url);
      }
      ws.on('close', function (code, message) {
      	if (! Array.observe) {
      		var array = callbacklist[observedResource.type][observedResource.resname]
      		var index = array.indexOf(resObjserver);
      		if (index > -1) {
      		    array.splice(index, 1);
      		}
      	}
      	console.log("ws connection is closed");
      });

    }
  });
};

function selectResource(url) { //#E
  var parts = url.split('/');
  parts.shift();

  var result;
  //console.log(" parts ==> ", parts)
  if (parts[0] === 'actions') {
    result = resources.links.actions.resources[parts[1]];
  } else {
    result = resources.links.properties.resources[parts[1]];
  }
  // console.log("===> ", result);
  return { res: result, type: parts[0], resname: parts[1]};
}

//#A Create a WebSocket server by passing it the Express server
//#B Triggered after a protocol upgrade when the client connected
//#C We register an observer corresponding to the resource in the protocol upgrade URL
//#D We use a try/catch to catch to intercept error (e.g., malformed/unsupported URLs)
//#E This function takes a request URL and returns the corresponding resource


