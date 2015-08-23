var keys = require('../resources/auth');

exports.simpleTokenAuth = function simpleTokenAuth(req, res, next) {
  console.log(req.method + " " + req.path);
  if (req.path.substring(0, 5) === "/css/") { //#A  
    next();
  } else {
    var token = req.body.token || req.param('token') || req.headers['Authorization']; //#B

    if (!token) { //#C
      return res.status(401).send({success: false, message: 'API token missing.'});      
    } else { 
      if (token != keys.apiToken) { //#D
        //return res.json({ success: false, message: 'API token invalid.' });    
        return res.status(403).send({success: false, message: 'API token invalid.'});      
      } else { //#E
        //req.decoded = decoded;  
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
 

exports.jwtAuth = function jwtAuth(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.param('token') || req.headers['Authorization'];

  // decode token
  if (token) {
    console.log("Token: " + token)

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;  
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
      success: false, 
      message: 'No token provided.'
    });
    
  }

};
