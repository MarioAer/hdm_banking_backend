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
 * @api {get} /refpcc/ Get personal condition
 * @apiVersion 1.0.0
 * @apiName GetPersonalCondition
 * @apiDescription Retrieves a list of personal conditions
 * @apiGroup refPersonalConditionCode
 *
 * @apiSuccess {Array} List List of saved conditions.
 */
router.get('/', function(req, res, next) {
    var db = req.db;
    var collection = db.get('refPersonalConditionCode');
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
 * @api {get} /refpcc/:id Get personal condition
 * @apiVersion 1.0.0
 * @apiName GetPersonalCondition
 * @apiDescription Retrives a specfic personal condition
 * @apiGroup refPersonalConditionCode
 *
 * @apiParam {String} conditionID Condition's id.
 *
 * @apiSuccess {String} conditionID Condition's id.
 * @apiSuccess {String} conditionDescription Condition's description.
 */
router.get('/:id', function(req, res, next) {
  var db = req.db;
  var collection = db.get('refPersonalConditionCode');
  var userToGet = req.params.id;
  collection.find({ 'conditionID' : userToGet },function(e, data){
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
 * @api {post} /refpcc/ Save personal condition
 * @apiVersion 1.0.0
 * @apiName AddPersonalCondition
 * @apiDescription Creates a new personal condition entry
 * @apiGroup refPersonalConditionCode
 */
router.post('/', function(req, res) {
    var db = req.db;
    var collection = db.get('refPersonalConditionCode');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/**
 * @api {delete} /refpcc/:id Remove personal condition
 * @apiVersion 1.0.0
 * @apiName DeletePersonalCondition
 * @apiDescription Removes a condition
 * @apiGroup refPersonalConditionCode
 *
 * @apiParam {String} conditionID Condition's id.
 */
router.delete('/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('refPersonalConditionCode');
    var userToDelete = req.params.id;
    collection.remove({ 'conditionID' : userToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
