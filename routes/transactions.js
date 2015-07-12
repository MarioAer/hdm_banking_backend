var express = require('express');
var router = express.Router();
var EasyXml = require('easyxml');
var passport = require('passport');

var serializer = new EasyXml({
    singularizeChildren: true,
    allowAttributes: true,
    rootElement: 'transactions',
    dateFormat: 'JS',
    indent: 2,
    manifest: true
});

/**
 * @api {get} /transactions/ List of Transactions
 * @apiVersion 1.0.0
 * @apiName GetTransactionsList
 * @apiGroup Transactions
 *
 * @apiSuccess {Array} List List of transactions.
 */
router.get('/', passport.authenticate('basic', { session: true }), function(req, res, next) {
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

/**
 * @api {get} /transactions/account/:id Get Transaction
 * @apiVersion 1.0.0
 * @apiName GetTransaction
 * @apiDescription Get Transactions from account.
 * @apiGroup Transactions
 *
 * @apiParam {String} accountID Account id.
 *
 * @apiSuccess {String} transactionID Transaction's id.
 * @apiSuccess {String} accountNumber Associated account's number.
 * @apiSuccess {String} merchantID Merchant's id.
 * @apiSuccess {String} transactionType Transaction's type.
 * @apiSuccess {String} transactionDateTime Transaction's date.
 */
router.get('/account/:id', passport.authenticate('basic', { session: true }), function(req, res, next) {
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

/**
 * @api {get} /transactions/:id Get Transaction
 * @apiVersion 1.0.0
 * @apiName GetTransaction
 * @apiDescription Get Transaction from the transaction's id.
 * @apiGroup Transactions
 *
 * @apiParam {String} transactionID Transaction's id.
 *
 * @apiSuccess {String} transactionID Transaction's id.
 * @apiSuccess {String} accountNumber Associated account's number.
 * @apiSuccess {String} merchantID Merchant's id.
 * @apiSuccess {String} transactionType Transaction's type.
 * @apiSuccess {String} transactionDateTime Transaction's date.
 */
router.get('/:id', passport.authenticate('basic', { session: true }), function(req, res, next) {
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

/**
 * @api {post} /transactions/ Save Transaction
 * @apiVersion 1.0.0
 * @apiName AddTransaction
 * @apiDescription Create a new transaction.
 * @apiGroup Transactions
 */
router.post('/', passport.authenticate('basic', { session: true }), function(req, res) {
    var db = req.db;
    var collection = db.get('transactions');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/**
 * @api {delete} /transactions/:id Remove Transaction
 * @apiVersion 1.0.0
 * @apiName DeleteTransaction
 * @apiDescription Remove transaction.
 * @apiGroup Transactions
 *
 * @apiParam {String} transactionID Transaction's id.
 */
router.delete('/:id', passport.authenticate('basic', { session: true }), function(req, res) {
    var db = req.db;
    var collection = db.get('transactions');
    var transToDelete = req.params.id;
    collection.remove({ 'transactionID' : transToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
