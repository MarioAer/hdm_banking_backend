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
  res.json({ supporters : "servus"});
});

/*
 * GET customerslist.
 */
router.get('/supporterslist', function(req, res, next) {
  var db = req.db;
  var collection = db.get('supporters');
  collection.find({},{},function(e, data){
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
 * GET customer.
 */
router.get('/supporter/:id', function(req, res, next) {
  var db = req.db;
  var collection = db.get('supporters');
  var userToGet = req.params.id;
  collection.find({ 'supporterID' : userToGet },function(e, data){
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
router.post('/addsupporter', function(req, res) {
    var db = req.db;
    var collection = db.get('supporters');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE to deleteuser.
 */
router.delete('/deletesupporter/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('supporters');
    var userToDelete = req.params.id;
    collection.remove({ 'supporterID' : userToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
