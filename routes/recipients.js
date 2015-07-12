var express = require('express');
var router = express.Router();
var EasyXml = require('easyxml');

var serializer = new EasyXml({
    singularizeChildren: true,
    allowAttributes: true,
    rootElement: 'recipients',
    dateFormat: 'JS',
    indent: 2,
    manifest: true
});

/**
 * @api {get} /recipients Retrieve a list recipients
 * @apiVersion 1.0.0
 * @apiName GetRecipients
 * @apiDescription Retrieves recipient based on id.
 * @apiGroup Recipient
 *
 * @apiSuccess {List} Recipeint List of recipients.
 */
router.get('/', function(req, res, next) {
  var db = req.db;
  var collection = db.get('recipients');
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
 * @api {get} /recipients/:id Retrieve recipients
 * @apiVersion 1.0.0
 * @apiName GetRecipients
 * @apiDescription Retrieves recipient based on id.
 * @apiGroup Recipient
 *
 * @apiParam {String} recipientID Recipient id.
 *
 * @apiSuccess {String} customerID Customer's id.
 * @apiSuccess {String} recipientID Recipient's id.
 * @apiSuccess {String} recipientName Recipient's name.
 * @apiSuccess {String} recipientAccountNumber Recipient's account number.
 * @apiSuccess {String} recipientBankName Recipient's bank name.
 * @apiSuccess {String} recipientIBAN Recipient's IBAN code.
 * @apiSuccess {String} recipientPhoto Recipient's picture name.
 */
router.get('/:id', function(req, res, next) {
  var db = req.db;
  var collection = db.get('recipients');
  var recipientToGet = req.params.id;
  collection.find({ 'recipientID' : recipientToGet },function(e, data){
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
 * @api {get} /recipients/customer/:id Retrieve recipients
 * @apiVersion 1.0.0
 * @apiName GetRecipients
 * @apiDescription Retrieves recipient based on customer's id.
 * @apiGroup Recipient
 *
 * @apiParam {String} customerID Customer id.
 *
 * @apiSuccess {String} customerID Customer's id.
 * @apiSuccess {String} recipientID Recipient's id.
 * @apiSuccess {String} recipientName Recipient's name.
 * @apiSuccess {String} recipientAccountNumber Recipient's account number.
 * @apiSuccess {String} recipientBankName Recipient's bank name.
 * @apiSuccess {String} recipientIBAN Recipient's IBAN code.
 * @apiSuccess {String} recipientPhoto Recipient's picture name.
 */
router.get('/customer/:id', function(req, res, next) {
  var db = req.db;
  var collection = db.get('recipients');
  var customerID = req.params.id;
  collection.find({ 'customerID' : customerID },function(e, data){
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
 * @api {post} /recipients Creates a new recipient
 * @apiVersion 1.0.0
 * @apiName AddRecipient
 * @apiDescription Creates a new recipient
 * @apiGroup Recipient
 *
 * @apiSuccess {String} msg message.
 */
router.post('/', function(req, res) {
    var db = req.db;
    var collection = db.get('recipients');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: 'Recipient added' } : { msg: err }
        );
    });
});

/**
 * @api {delete} /recipients/:id Remove recipient
 * @apiVersion 1.0.0
 * @apiName DeleteRecipient
 * @apiDescription Removes Recipient from DB.
 * @apiGroup Recipient
 *
 * @apiParam {String} accountID Account id.
 *
 * @apiSuccess {String} accountID Account id.
 */
router.delete('/:id', function(req, res) {
   var db = req.db;
   var collection = db.get('recipients');
   var recipientToDelete = req.params.id;
   collection.remove({ 'recipientID' : recipientToDelete }, function(err) {
       res.send((err === null) ? { id: recipientToDelete } : { msg:'error: ' + err });
   });
});



module.exports = router;
