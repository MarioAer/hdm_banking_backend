var express = require('express');
var router = express.Router();
var EasyXml = require('easyxml');
var passport = require('passport');

var serializer = new EasyXml({
    singularizeChildren: true,
    allowAttributes: true,
    rootElement: 'customer',
    dateFormat: 'JS',
    indent: 2,
    manifest: true
});

router.get('/', function(req, res, next) {
  res.send(
      (err === null) ? { msg: '' } : { msg: err }
  );
});

/**
 * @api {get} /customer/customerslist List of customers
 * @apiVersion 1.0.0
 * @apiName GetCustomersList
 * @apiGroup Customer
 *
 * @apiSuccess {Object[]} customer Customer Objects.
 */
router.get('/customerslist', passport.authenticate('basic', { session: true }), function(req, res, next) {
  var db = req.db;
  var collection = db.get('customers');
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
 * @api {get} /customer/:id Read data of a customer
 * @apiVersion 1.0.0
 * @apiName GetCustomers
 * @apiGroup Customer
 *
 * @apiSuccess {String} customerID Customer id.
 * @apiSuccess {String} address Customer's address.
 * @apiSuccess {String} personalConditionCode Disability code.
 * @apiSuccess {String} supporterID Supporter id of respective customer.
 * @apiSuccess {String} contactDetails Extra details about the customer.
 */
router.get('/:id', passport.authenticate('basic', { session: true }), function(req, res, next) {
  var db = req.db;
  var collection = db.get('customers');
  var userToGet = req.params.id;
  collection.find({ 'customerID' : userToGet },function(e, data){
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
 * @api {post} /customer/addCustomer Saves a customer in the DB.
 * @apiVersion 1.0.0
 * @apiName AddCustomers
 * @apiGroup Customer
 */
router.post('/addcustomer', passport.authenticate('basic', { session: true }), function(req, res) {
    var db = req.db;
    var collection = db.get('customers');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/**
 * @api {post} /customer/deleteCustomer Deletes customer from the DB.
 * @apiVersion 1.0.0
 * @apiName AddCustomers
 * @apiGroup Customer
 */
router.delete('/deletecustomer/:id', passport.authenticate('basic', { session: true }), function(req, res) {
    var db = req.db;
    var collection = db.get('customers');
    var userToDelete = req.params.id;
    collection.remove({ 'customerID' : userToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
