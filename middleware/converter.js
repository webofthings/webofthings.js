var msgpack = require('msgpack5')(),
  encode = msgpack.encode;

function represent(req, res, next) {
  if (req.result) {
    if (req.accepts('html')) {

      var helpers = {
        json: function(object) {
          return JSON.stringify(object);
        },
        getById: function(object,id) {
          return object[id];
        }
      };

      // Check if there's a custom renderer for this type of resource
      if (req.type) res.render(req.type, { req: req , helpers: helpers });
      else res.render('default', { req: req , helpers: helpers });

      return;
    } else if (req.accepts('application/x-msgpack')) {
      res.type('application/x-msgpack');
      res.send(encode(req.result));
      return;
    } else { // Resturn JSON by default
      res.send(req.result);
      return;      
    }
  }
  else if (res.location) {
    res.status(204).send();
    return;
  } else {
    next();
  }
}
module.exports = represent;




