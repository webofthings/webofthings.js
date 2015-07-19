var msgpack = require('msgpack5')(),
  encode = msgpack.encode;

function represent(req, res, next) {
  console.info('Representation converter middleware called!');
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

      if (req.type) res.render(req.type, { req: req , helpers: helpers });
      else res.render('default', { req: req , helpers: helpers });

      return;
    }

    if (req.accepts('application/x-msgpack')) {
      console.info('MessagePack representation selected!');
      res.type('application/x-msgpack');
      res.send(encode(req.result));
      return;
    }
    console.info('JSON representation selected!');
    res.send(req.result);
    return;
  }
  else if (res.location) {
    res.status(204).send();
    return;
  } else {
    next();
  }
}
module.exports = represent;




