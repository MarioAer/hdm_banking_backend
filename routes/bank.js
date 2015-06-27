var express = require('express');
var router = express.Router();
var EasyXml = require('easyxml');

var serializer = new EasyXml({
    singularizeChildren: true,
    allowAttributes: true,
    rootElement: 'customer',
    dateFormat: 'JS',
    indent: 2,
    manifest: true
});

router.get('/', function(req, res, next) {
  res.json({bank : "hdmBank"});
});

/*
 * GET bank.
 */
router.get('/:id', function(req, res, next) {
  var db = req.db;
  var collection = db.get('bank');
  var userToGet = req.params.id;
  collection.find({ 'bankId' : userToGet },function(e, data){
    // transform the id's into strings for the serializer
    for(var i = 0; i < data.length; i++) {
      var tempId = data[i]._id.toString();
      data[i]._id = tempId;
    }
    // detect if the request the query xml
    if(req.query.format == 'xml') {
      res.set('Content-Type', 'text/xml');
      res.send(serializer.render(data));
    } else {
      res.set('Content-Type', 'text/json');
      res.json(data);
    }
  });
});

/*
 * POST to adduser.
 */
router.post('/addbank', function(req, res) {
    var db = req.db;
    var collection = db.get('bank');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE to deleteuser.
 */
router.delete('/deletebank/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('bank');
    var userToDelete = req.params.id;
    collection.remove({ 'bankId' : userToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
