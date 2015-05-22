var express = require('express'),
	router = express.Router();

// Get DB
function get_db(req, collection){
	// Get the DB
	var db = req.db;
	var db_collection = db.get(collection) || db.createCollection(collection);

	// return the selected document
	return db_collection;
}

// Get new status
function get_new_status(db, callback){
	db.find( { $query: {}, $orderby: { created_at: -1 } }, function(event, data){
		
		if(data[0]){
			if(data[0].status == "on"){
				callback("off");
			} else {
				callback("on");
			}
		} else {
			callback("on");
		}
	});
}

// Push Websockets
function push_websockets(req, status){

	if(req.get('connections')){
		req.app.get('connections').forEach( function(conn){
			conn.sendText(JSON.stringify(status));
		});
	}
	
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
		res.json(data);
	});

});

router.post("/clear", function(req, res){
	var db = get_db(req, 'status');
	db.remove();
	res.json({
		status: 200
	});
});

// Post to the API
router.post('/status', function(req, res){
	var db = get_db(req, 'status');

	get_new_status(db, function(status){
		// Create the new record
		var new_status = {
			who: req.body.who || "Ghosts",
			status: status,
			message: req.body.message || "2 Spooky 4 Me",
			created_at: Date.now()
		}

		// Insert the record
		db.insert(new_status);

		// Push out to the web socks
		push_websockets(req, new_status);

		// Render out our new record!
		res.json(new_status);
	});
});

module.exports = router;
