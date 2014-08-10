'use strict';

var _ = require('lodash');
var mongoose = require('mongoose'),
    CardSchema = require('./card/card.schema'),
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
  cards: [CardSchema],
});

GameSchema.methods.join = function(userId) {
  // If too many players, reject.
  if (this.players.length >= this.maxPlayers) {
    return false;
  }
  if (this.players.indexOf(userId) < 0) {
    this.players.push(userId);
  }
  return this;
}

GameSchema.methods.quit = function(userId) {
  var playerIndex = this.players.indexOf(userId);
  if (playerIndex < 0) {
    return false;
  }
  this.players.splice(playerIndex, 1);
  return this;
}

GameSchema.methods.addMessage = function(content, sender) {
  this.messages.push({
    sender: sender,
    date: new Date(),
    content: content
  });
}

GameSchema.methods.resetCards = function() {
  this.cards = CardSchema.createDeck();
};

GameSchema.methods.shuffleCards = function() {
  this.cards = _.shuffle(this.cards);
};

GameSchema.methods.dealCards = function() {
  _.each(this.cards, function(card, i) {
    card.owner = this.players[i % this.players.length];
  }, this);
};

module.exports = mongoose.model('Game', GameSchema);
