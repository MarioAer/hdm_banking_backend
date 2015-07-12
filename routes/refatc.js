var express = require('express');
var router = express.Router();
var EasyXml = require('easyxml');

var serializer = new EasyXml({
    singularizeChildren: true,
    allowAttributes: true,
    rootElement: 'referenceCodes',
    dateFormat: 'JS',
    indent: 2,
    manifest: true
});

/**
 * @api {get} /refatc/ Get account type code
 * @apiVersion 1.0.0
 * @apiName GetAccountType
 * @apiDescription Retrieves a list of account types
 * @apiGroup refAccountTypeCode
 *
 * @apiSuccess {Array} List List of account type codes.
 */
router.get('/', function(req, res, next) {
  var db = req.db;
  var collection = db.get('refAccountTypeCode');
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
 * @api {get} /refatc/:code Get account type code
 * @apiVersion 1.0.0
 * @apiName GetAccountType
 * @apiDescription Retrieves a specific account type
 * @apiGroup refAccountTypeCode
 *
 * @apiParam {String} accountTypeCode Account type code.
 *
 * @apiSuccess {String} accountTypeCode Account type code.
 * @apiSuccess {String} accountTypeDescription Account type code's description.
 */
router.get('/:code', function(req, res, next) {
  var db = req.db;
  var collection = db.get('refAccountTypeCode');
  var acreferenceToGet = req.params.code;
  collection.find({'accountTypeCode' : acreferenceToGet },function(e, data){
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
 * @api {post} /refatc/ Save account type reference
 * @apiVersion 1.0.0
 * @apiDescription  Creates a new account type
 * @apiName AddAccountType
 * @apiGroup refAccountTypeCode
 */
router.post('/', function(req, res) {
    var db = req.db;
    var collection = db.get('refAccountTypeCode');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/**
 * @api {delete} /refatc/:id Remove account type reference
 * @apiVersion 1.0.0
 * @apiDescription  Deletes a account type
 * @apiName DeleteAccountType
 * @apiGroup refAccountTypeCode
 */
router.delete('/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('refAccountTypeCode');
    var acreferenceToGet = req.params.id;
    collection.remove({ 'accountTypeCode' : acreferenceToGet }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
