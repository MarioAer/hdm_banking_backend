var express = require('express');
var router = express.Router();
var EasyXml = require('easyxml');
var passport = require('passport');

var serializer = new EasyXml({
    singularizeChildren: true,
    allowAttributes: true,
    rootElement: 'customers',
    dateFormat: 'JS',
    indent: 2,
    manifest: true
});

/**
 * @api {get} /customers List of customers
 * @apiVersion 1.0.0
 * @apiName GetCustomersList
 * @apiDescription Retrieves a list of customers
 * @apiGroup Customer
 *
 * @apiSuccess {Object[]} customer Customer Objects.
 */
router.get('/', passport.authenticate('basic', { session: true }), function(req, res, next) {
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
 * @apiDescription Retrieves a specific (id based) ustomer
 * @apiGroup Customer
 *
 * @apiParam {String} customerID Customer id.
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
 * @api {post} /customers Creates a new customer
 * @apiVersion 1.0.0
 * @apiDescription  Creates a new customer
 * @apiName AddCustomers
 * @apiGroup Customer
 *
 * @apiParam {String} customerID Customer id.
 * @apiParam {String} address Customer's address.
 * @apiParam {String} personalConditionCode Disability code.
 * @apiParam {String} supporterID Supporter id of respective customer.
 * @apiParam {String} contactDetails Extra details about the customer.
 *
 * @apiSuccess {String} customerID Customer id.
 */
router.post('/', passport.authenticate('basic', { session: true }), function(req, res) {
    var db = req.db;
    var collection = db.get('customers');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: 'Customer saved' } : { msg: err }
        );
    });
});

/**
 * @api {delete} /customers/:id Deletes customer from the DB.
 * @apiVersion 1.0.0
 * @apiName AddCustomers
 * @apiDescription  Deletes customer from the DB
 * @apiGroup Customer
 *
 * @apiParam {String} customerID Customer id.
 *
 * @apiSuccess {String} customerID Customer id.
 */
router.delete('/:id', passport.authenticate('basic', { session: true }), function(req, res) {
    var db = req.db;
    var collection = db.get('customers');
    var userToDelete = req.params.id;
    collection.remove({ 'customerID' : userToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
