var express = require('express');
var router = express.Router();

/**
 * @apiIgnore Documentation Page
 * @api {get} /
 */
router.get('/apidoc', function(req, res, next) {
  res.redirect('../apidoc/index.html');
});

module.exports = router;
