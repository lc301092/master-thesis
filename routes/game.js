var express = require('express');
var router = express.Router();
const GameData = require('../model/GameData');

router.post('/save-data', function (req, res) {
	// 
	let clientData = req.body;
	let query = {playerId: clientData.playerId};
	console.log('updating with' + query);
	GameData.findOneAndUpdate(query, clientData, {upsert: true}, function(err, doc) {
		if (err) {
			console.log('got an error: ', error);
			return res.send(500, {error: err});
		}
		return res.send('Succesfully saved.');
	});
});

module.exports = router;
