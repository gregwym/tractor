'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GameSchema = new Schema({
  name: String,
  info: String,
  active: Boolean,
  maxPlayers: Number,
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  players: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  messages: [{
    sender: String,
    date: Date,
    content: String
  }],
  cards: [require('./card/card.schema')],
});

module.exports = mongoose.model('Game', GameSchema);
