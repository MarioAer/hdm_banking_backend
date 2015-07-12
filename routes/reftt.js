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

/**
 * @api {get} /reftt/ Get Transaction type
 * @apiVersion 1.0.0
 * @apiName TransactionType
 * @apiDescription Retrieves a list of transaction types
 * @apiGroup refTransactionTypes
 *
 * @apiSuccess {Array} List List of trasaction types
 */
router.get('/', function(req, res, next) {
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

/**
 * @api {get} /reftt/:id Get Transaction type
 * @apiVersion 1.0.0
 * @apiName TransactionType
 * @apiDescription Removes a condition
 * @apiGroup refTransactionTypes
 *
 * @apiParam {String} transactionTypeCode Trasaction type code's reference.
 *
 * @apiSuccess {String} transactionTypeCode Trasaction type code's reference.
 * @apiSuccess {String} transactionTypeDescription Trasaction type code's description.
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

/**
 * @api {post} /reftt/ Add Transaction type
 * @apiVersion 1.0.0
 * @apiName AddTransactionType
 * @apiDescription Removes a transaction type
 * @apiGroup refTransactionTypes
 */
router.post('/', function(req, res) {
    var db = req.db;
    var collection = db.get('refTransactionTypes');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/**
 * @api {delete} /reftt/:id Remove Transaction type
 * @apiVersion 1.0.0
 * @apiName DeleteTransactionType
 * @apiDescription Removes a transaction type
 * @apiGroup refTransactionTypes
 *
 * @apiParam {String} transactionTypeCode Trasaction type code's reference.
 *
 * @apiSuccess {String} transactionTypeCode Trasaction type code's reference.
 */
router.delete('/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('refTransactionTypes');
    var transTypeToDelete = req.params.id;
    collection.remove({ 'transactionTypeCode' : transTypeToDelete }, function(err) {
        res.send((err === null) ? { id: transTypeToDelete } : { msg:'error: ' + err });
    });
});

module.exports = router;
