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

/**
 * @api {get} /accounts/accountslist List of Accounts
 * @apiVersion 1.0.0
 * @apiName GetAccountsList
 * @apiGroup Account
 *
 * @apiSuccess {Object[]} account Accounts Objects.
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

/**
 * @api {get} /accounts/customer/:id Read data from account
 * @apiVersion 1.0.0
 * @apiName GetAccounts
 * @apiDescription Get Account information with the customer id.
 * @apiGroup Account
 *
 * @apiSuccess {String} accountNumber Account number.
 * @apiSuccess {String} customerID Accounts owner id.
 * @apiSuccess {String} accountTypeCode Account type code.
 * @apiSuccess {String} accountStatusCode Account status code.
 * @apiSuccess {String} currentBalance Accounts current balance.
 * @apiSuccess {String} otherDetails Other details about the account.
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

/**
 * @api {get} /accounts/:id Read data from account
 * @apiVersion 1.0.0
 * @apiName GetAccountsList
 * @apiDescription Get Account information with the accounts id.
 * @apiGroup Account
 *
 * @apiSuccess {String} accountNumber Account number.
 * @apiSuccess {String} customerID Accounts owner id.
 * @apiSuccess {String} accountTypeCode Account type code.
 * @apiSuccess {String} accountStatusCode Account status code.
 * @apiSuccess {String} currentBalance Accounts current balance.
 * @apiSuccess {String} otherDetails Other details about the account.
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

/**
 * @api {post} /accounts/addAccount Create a new Account
 * @apiVersion 1.0.0
 * @apiName AddAccounts
 * @apiDescription Saves a new account in the DB.
 * @apiGroup Account
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

/**
 * @api {post} /accounts/:id/updateBalance/:newBalance Updates the accounts balance
 * @apiVersion 1.0.0
 * @apiName UpdateAccountBalance
 * @apiDescription Updates the balance of a specific account.
 * @apiGroup Account
 */
 router.get('/:id/updateBalance/:newBalance', function(req, res) {
     var db = req.db;
     var collection = db.get('accounts');
     var accountToUpdate = req.params.id;
     var newBalance = req.params.newBalance;
     console.log(newBalance)
     collection.findAndModify({ 'accountNumber' : accountToUpdate },{ $set : {"currentBalance" : newBalance}},function(err, result){
       res.send(
           (err === null) ? { msg: '' } : { msg: err }
       );
     });
 });

 /**
  * @api {delete} /accounts/deleteAccount/:id Remove Account
  * @apiVersion 1.0.0
  * @apiName deleteAccount
  * @apiDescription Removes Account from DB.
  * @apiGroup Account
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
