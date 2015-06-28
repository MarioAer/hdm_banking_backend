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

router.get('/', function(req, res, next) {
  res.json({refPersonalConditionCode : "info"});
});

/**
 * @api {get} /refatc/:id Get account type reference
 * @apiVersion 1.0.0
 * @apiName GetAccountType
 * @apiGroup refAccountTypeCode
 *
 * @apiSuccess {String} accountTypeCode Account type code.
 * @apiSuccess {String} accountTypeDescription Account type code's description.
 */
router.get('/:id', function(req, res, next) {
  var db = req.db;
  var collection = db.get('refAccountTypeCode');
  var acreferenceToGet = req.params.id;
  collection.find({ 'accountTypeCode' : acreferenceToGet },function(e, data){
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
 * @api {post} /refatc/addrefact Save account type reference
 * @apiVersion 1.0.0
 * @apiName AddAccountType
 * @apiGroup refAccountTypeCode
 */
router.post('/addrefact', function(req, res) {
    var db = req.db;
    var collection = db.get('refAccountTypeCode');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/**
 * @api {delete} /refatc/deleterefact/:id Remove account type reference
 * @apiVersion 1.0.0
 * @apiName DeleteAccountType
 * @apiGroup refAccountTypeCode
 */
router.delete('/deleterefact/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('refAccountTypeCode');
    var acreferenceToGet = req.params.id;
    collection.remove({ 'accountTypeCode' : acreferenceToGet }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
