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

/*
 * GET refact.
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

/*
 * POST to refact.
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

/*
 * DELETE from refact.
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
