var express = require('express');
var router = express.Router();
const GameData = require('../model/GameData');

/* GET users listing. */
router.post('/save-data', function (req, res) {
	// 
	let clientData = req.body;
	let query = {playerId: clientData.playerId};
	GameData.findOneAndUpdate(query, clientData, {upsert: true}, function(err, doc) {
		if (err) return res.send(500, {error: err});
		return res.send('Succesfully saved.');
	});
});

module.exports = router;
