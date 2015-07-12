var express = require('express');
var router = express.Router();
var EasyXml = require('easyxml');

var serializer = new EasyXml({
    singularizeChildren: true,
    allowAttributes: true,
    rootElement: 'customer',
    dateFormat: 'JS',
    indent: 2,
    manifest: true
});

/**
 * @api {get} /supporters/ List of supporters
 * @apiVersion 1.0.0
 * @apiName GetSupportersList
 * @apiDescription Retrieves a list of supporters
 * @apiGroup Supporters
 *
 * @apiSuccess {Array} List List of supporters.
 */
router.get('/', function(req, res, next) {
  var db = req.db;
  var collection = db.get('supporters');
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
 * @api {get} /supporters/:id Get supporter
 * @apiVersion 1.0.0
 * @apiName GetSupporter
 * @apiDescription Retrieves a specific supporter
 * @apiGroup Supporters
 *
 * @apiParam {String} supporterID Supporter id.
 *
 * @apiSuccess {String} supporterID Supporter id.
 * @apiSuccess {String} supporterName Supporter name.
 * @apiSuccess {String} supporterDescription Supporter Description.
 */
router.get('/:id', function(req, res, next) {
  var db = req.db;
  var collection = db.get('supporters');
  var userToGet = req.params.id;
  collection.find({ 'supporterID' : userToGet },function(e, data){
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
 * @api {post} /supporters/ Save supporter
 * @apiVersion 1.0.0
 * @apiName CreateSupporter
 * @apiDescription Creates a supporter
 * @apiGroup Supporters
 */
router.post('/', function(req, res) {
    var db = req.db;
    var collection = db.get('supporters');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/**
 * @api {delete} /:id Remove supporter
 * @apiVersion 1.0.0
 * @apiName DeleteSupporter
 * @apiDescription Removes a supporter
 * @apiGroup Supporters
 *
 * @apiParam {String} supporterID Supporter id.
 */
router.delete('/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('supporters');
    var userToDelete = req.params.id;
    collection.remove({ 'supporterID' : userToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
