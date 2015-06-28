var express = require('express');
var router = express.Router();

/**
 * @apiIgnore Home Page
 * @api {get} /
 */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
