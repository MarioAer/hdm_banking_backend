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
 * @api {get} /bank/ Read data from bank
 * @apiVersion 1.0.0
 * @apiName GetBank
 * @apiDescription Get List of banks.
 * @apiGroup Bank
 */
router.get('/', function(req, res, next) {
  var db = req.db;
  var collection = db.get('bank');
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
 * @api {get} /bank/:id Read data from bank
 * @apiVersion 1.0.0
 * @apiName GetBank
 * @apiDescription Get Information about a specific bank.
 * @apiGroup Bank
 *
 * @apiSuccess {String} bankId Bank id.
 * @apiSuccess {String} bankName Name of the bank.
 * @apiSuccess {String} bankDescription Description of the bank.
 * @apiSuccess {String} address The adress of the bank.
 */
router.get('/:id', function(req, res, next) {
  var db = req.db;
  var collection = db.get('bank');
  var userToGet = req.params.id;
  collection.find({ 'bankId' : userToGet },function(e, data){
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
 * @api {post} /bank Creates a new Bank
 * @apiVersion 1.0.0
 * @apiName AddBank
 * @apiDescription Create a new Bank entry.
 * @apiGroup Bank
 */
router.post('/bank', function(req, res) {
    var db = req.db;
    var collection = db.get('bank');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/**
 * @api {delete} /bank/:id Remove Bank
 * @apiVersion 1.0.0
 * @apiName removeBank
 * @apiDescription Removes a Bank from the DB.
 * @apiGroup Bank
 */
router.delete('/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('bank');
    var userToDelete = req.params.id;
    collection.remove({ 'bankId' : userToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
