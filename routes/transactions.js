var express = require('express');
var router = express.Router();
var EasyXml = require('easyxml');

var serializer = new EasyXml({
    singularizeChildren: true,
    allowAttributes: true,
    rootElement: 'transactions',
    dateFormat: 'JS',
    indent: 2,
    manifest: true
});

router.get('/', function(req, res, next) {
  res.json({ transactions : "trasaction information"});
});

/*
 * GET customerslist.
 */
router.get('/transactionlist', function(req, res, next) {
  var db = req.db;
  var collection = db.get('transactions');
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
 * GET transaction by account.
 */
router.get('/account/:id', function(req, res, next) {
  var db = req.db;
  var collection = db.get('transactions');
  var transToGet = req.params.id;
  collection.find({ 'accountNumber' : transToGet },function(e, data){
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
 * GET transaction by ID.
 */
router.get('/:id', function(req, res, next) {
  var db = req.db;
  var collection = db.get('transactions');
  var transToGet = req.params.id;
  collection.find({ 'transactionID' : transToGet },function(e, data){
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
 * POST transaction.
 */
router.post('/addtransaction', function(req, res) {
    var db = req.db;
    var collection = db.get('transactions');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE to deleteuser.
 */
router.delete('/deleteTransaction/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('transactions');
    var transToDelete = req.params.id;
    collection.remove({ 'transactionID' : transToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
