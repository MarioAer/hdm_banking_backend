var express = require('express');
var router = express.Router();
var EasyXml = require('easyxml');

var serializer = new EasyXml({
    singularizeChildren: true,
    allowAttributes: true,
    rootElement: 'accounts',
    dateFormat: 'JS',
    indent: 2,
    manifest: true
});

router.get('/', function(req, res, next) {
  res.json({accounts : "select an account"});
});

/*
 * GET customerslist.
 */
router.get('/accountslist', function(req, res, next) {
  var db = req.db;
  var collection = db.get('accounts');
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
 * GET account by customer.
 */
router.get('/customer/:id', function(req, res, next) {
  var db = req.db;
  var collection = db.get('accounts');
  var accountToGet = req.params.id;
  collection.find({ 'customerID' : accountToGet },function(e, data){
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
 * GET account by number.
 */
router.get('/:id', function(req, res, next) {
  var db = req.db;
  var collection = db.get('accounts');
  var accountToGet = req.params.id;
  collection.find({ 'accountNumber' : accountToGet },function(e, data){
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
 * POST to addAccount.
 */
router.post('/addAccount', function(req, res) {
    var db = req.db;
    var collection = db.get('accounts');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE to deleteuser.
 */
router.delete('/deleteAccount/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('accounts');
    var accountToDelete = req.params.id;
    collection.remove({ 'accountNumber' : accountToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;