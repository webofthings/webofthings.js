var keys = require('../resources/auth');

exports.simpleTokenAuth = function(req, res, next) {
  console.log(req.method + " " + req.path);
  if (req.path.substring(0, 5) === "/css/") {
    next(); //#A

  } else {
    var token = req.body.token || req.headers['authorization'] || req.param.token; //#B

    if (!token) { //#C
      return res.status(401).send({success: false, message: 'API token missing.'});
    } else {
      if (token != keys.apiToken) { //#D
        return res.status(403).send({success: false, message: 'API token invalid.'});
      } else { //#E
        next();
      }
    }
  }
};
//#A Allow unauthorized access to the css folder
//#B check header or url parameters or post parameters for token 
//#C If no token provided, return 401 UNAUTHORIZED 
//#D If token is not a valid API key, return 403 FORBIDDEN 
//#E If everything is good, save to request for use in other routes