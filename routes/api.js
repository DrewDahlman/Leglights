var express = require('express');
var router = express.Router();

var statuses = ['on','off'];

function get_db(req, collection){
	// Get the DB
	var db = req.db;
	var leglights = db.get(collection) || db.createCollection(collection);

	return leglights;
}

// Index
router.get('/', function(req, res) {

	res.json({
		status: 200,
		message: "You should provide a method!"
	});
});

// GET the logs
router.get('/logs', function(req, res) {
	var db = get_db(req, 'status');
	
	db.find( { $query: {}, $orderby: { created_at: -1 } },function(event, data){
		console.log("I haz data");
		res.json(data);
	});

});

router.post("/clear", function(req, res){
	var db = get_db(req, 'status');
	db.remove();
	res.json({
		status: 200
	})
});

// Post to the API
router.post('/status', function(req, res){
	var db = get_db(req, 'status');

	var default_status = statuses[Math.round(Math.random() * (statuses.length - 1))]

	// Create the new record
	var new_status = {
		who: req.body.who || "Ghosts",
		status: req.body.status || default_status,
		message: req.body.message || "",
		created_at: Date.now()
	}

	// Insert the record
	db.insert(new_status);

	// Render out our new record!
	res.json(new_status);
});

module.exports = router;
