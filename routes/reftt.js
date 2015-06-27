var express = require('express');
var router = express.Router();
var EasyXml = require('easyxml');

var serializer = new EasyXml({
    singularizeChildren: true,
    allowAttributes: true,
    rootElement: 'transactionTypes',
    dateFormat: 'JS',
    indent: 2,
    manifest: true
});

router.get('/', function(req, res, next) {
  res.json({refTransactionTypes : "info"});
});

/*
 * GET refpcc.
 */
router.get('/:id', function(req, res, next) {
  var db = req.db;
  var collection = db.get('refTransactionTypes');
  var transTypeToGet = req.params.id;
  collection.find({ 'transactionTypeCode' : transTypeToGet },function(e, data){
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
 * POST to addrefpcc.
 */
router.post('/addreftt', function(req, res) {
    var db = req.db;
    var collection = db.get('refTransactionTypes');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE from refpcc.
 */
router.delete('/deletereftt/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('refTransactionTypes');
    var transTypeToDelete = req.params.id;
    collection.remove({ 'transactionTypeCode' : transTypeToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
