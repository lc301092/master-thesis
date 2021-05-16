const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GameDataSchema = new Schema({
    playerId: { type: String },
    interactions: { type: Array },
    answers: { type: Array },
    timeToComplete1: { type: Number }, 
    timeToComplete2: { type: Number }

});

const GameData = mongoose.model('test-data', GameDataSchema);

module.exports = GameData;