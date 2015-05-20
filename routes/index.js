var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.post('/api/status', function(req, res){
	console.log(req.params.status)
});

module.exports = router;
