var express = require('express');
var router = express.Router();
var EasyXml = require('easyxml');
var passport = require('passport');

var serializer = new EasyXml({
    singularizeChildren: true,
    allowAttributes: true,
    rootElement: 'accounts',
    dateFormat: 'JS',
    indent: 2,
    manifest: true
});

/**
 * @api {get} /accounts List of Accounts
 * @apiVersion 1.0.0
 * @apiName GetAccountsList
 * @apiDescription Retrieves a list of accounts
 * @apiGroup Account
 *
 * @apiSuccess {Object[]} account Accounts Objects.
 */
router.get('/', function(req, res, next) {
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
 * @api {get} /accounts/:id Retrieves data from account
 * @apiVersion 1.0.0
 * @apiName GetAccountsList
 * @apiDescription Retrieves account information with the accounts id.
 * @apiGroup Account
 *
 * @apiParam {String} accountID Account id.
 *
 * @apiSuccess {String} accountNumber Account number.
 * @apiSuccess {String} customerID Accounts owner id.
 * @apiSuccess {String} accountTypeCode Account type code.
 * @apiSuccess {String} accountStatusCode Account status code.
 * @apiSuccess {String} currentBalance Accounts current balance.
 * @apiSuccess {String} otherDetails Other details about the account.
 */
router.get('/:id', passport.authenticate('basic', { session: true }), function(req, res, next) {
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
 * @api {get} /accounts/customer/:id Retrieves data from account
 * @apiVersion 1.0.0
 * @apiName GetAccounts
 * @apiDescription Retrieves account information with the customer id.
 * @apiGroup Account
 *
 * @apiParam {String} customerID Customer id.
 *
 * @apiSuccess {String} accountNumber Account number.
 * @apiSuccess {String} customerID Accounts owner id.
 * @apiSuccess {String} accountTypeCode Account type code.
 * @apiSuccess {String} accountStatusCode Account status code.
 * @apiSuccess {String} currentBalance Accounts current balance.
 * @apiSuccess {String} otherDetails Other details about the account.
 */
router.get('/customer/:id', passport.authenticate('basic', { session: true }), function(req, res, next) {
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
 * @api {post} /accounts Create a new account
 * @apiVersion 1.0.0
 * @apiName AddAccounts
 * @apiDescription Creates a new account
 * @apiGroup Account
 *
 * @apiParam {String} accountNumber Account number.
 * @apiParam {String} customerID Accounts owner id.
 * @apiParam {String} accountTypeCode Account type code.
 * @apiParam {String} accountStatusCode Account status code.
 * @apiParam {String} currentBalance Accounts current balance.
 * @apiParam {String} otherDetails Other details about the account.
 *
 * @apiSuccess {String} accountID Account id.
 */
router.post('/', passport.authenticate('basic', { session: true }), function(req, res) {
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
 *
 * @apiParam {String} customerID Account's owner id.
 * @apiParam {String} newBalance Account's new balance in cents.
 *
 * @apiSuccess {String} accountID Account id.
 */
 router.get('/:id/updateBalance/:newBalance', passport.authenticate('basic', { session: true }), function(req, res) {
     var db = req.db;
     var collection = db.get('accounts');
     var accountToUpdate = req.params.id;
     var newBalance = req.params.newBalance;
     console.log(newBalance)
     collection.findAndModify({ 'accountNumber' : accountToUpdate },{ $set : {"currentBalance" : newBalance}},function(err, result){
       res.send(
           (err === null) ? { id: accountToUpdate } : { msg: err }
       );
     });
 });

 /**
  * @api {delete} /accounts/deleteAccount/:id Remove Account
  * @apiVersion 1.0.0
  * @apiName deleteAccount
  * @apiDescription Removes Account from DB.
  * @apiGroup Account
  *
  * @apiParam {String} accountID Account id.
  *
  * @apiSuccess {String} accountID Account id.
  */
router.delete('/:id', passport.authenticate('basic', { session: true }), function(req, res) {
    var db = req.db;
    var collection = db.get('accounts');
    var accountToDelete = req.params.id;
    collection.remove({ 'accountNumber' : accountToDelete }, function(err) {
        res.send((err === null) ? { id: accountToDelete } : { msg:'error: ' + err });
    });
});

module.exports = router;
