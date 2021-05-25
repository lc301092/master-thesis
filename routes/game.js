const express = require('express');
const router = express.Router();
const GameData = require('../model/GameData');

router.post('/save-data', function (req, res) { 
	let clientData = req.body;
	if(!clientData.playerId) return res.send(400);
	let query = {playerId: clientData.playerId};
	GameData.findOneAndUpdate(query, clientData, {upsert: true}, function(err, doc) {
		if (err) {
			console.log('got an error: ', error);
			return res.send(500, {error: err});
		}
		return res.send('Successfully saved.');
	});
});

module.exports = router;
