'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GameSchema = new Schema({
  name: String,
  info: String,
  active: Boolean,
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
  cards: [{
    suit: {
      required: true,
      type: String,
      enum: ['SPADE', 'HEART', 'DIAMOND', 'CLUB', 'JOKER']
    },
    rank: {
      type: Number,
      enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
    },
    played: Boolean,
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
  }],
});

module.exports = mongoose.model('Game', GameSchema);
