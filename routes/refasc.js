var express = require('express');
var router = express.Router();
var EasyXml = require('easyxml');

var serializer = new EasyXml({
    singularizeChildren: true,
    allowAttributes: true,
    rootElement: 'AccountStatus',
    dateFormat: 'JS',
    indent: 2,
    manifest: true
});

router.get('/', function(req, res, next) {
  res.json({refPersonalConditionCode : "info"});
});

/**
 * @api {get} /refasc/:id Get account status reference
 * @apiVersion 1.0.0
 * @apiName GetAccountStatusCode
 * @apiGroup refAccountStatusCode
 *
 * @apiSuccess {String} accountStatusCode Status code.
 * @apiSuccess {String} accountStatusDescription Status code's description.
 */
router.get('/:id', function(req, res, next) {
  var db = req.db;
  var collection = db.get('refAccountStatusCode');
  var statusToGet = req.params.id;
  collection.find({ 'accountStatusCode' : statusToGet },function(e, data){
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
 * @api {post} /refasc Add account status reference
 * @apiVersion 1.0.0
 * @apiName AddAccountStatusCode
 * @apiGroup refAccountStatusCode
 */
router.post('/', function(req, res) {
    var db = req.db;
    var collection = db.get('refAccountStatusCode');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/**
 * @api {delete} /refasc/:id Remove account status reference
 * @apiVersion 1.0.0
 * @apiName RemoveAccountStatusCode
 * @apiGroup refAccountStatusCode
 */
router.delete('/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('refAccountStatusCode');
    var statusToGet = req.params.id;
    collection.remove({ 'accountStatusCode' : statusToGet }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
