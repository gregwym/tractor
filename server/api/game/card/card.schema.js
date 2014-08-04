'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var _ = require('lodash');

var CardSchemaObj = {
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
};
var CardSchema = new Schema(CardSchemaObj);

CardSchema.createDeck = function() {
  return _.map(_.range(54), function(i) {
    return {
      suit: CardSchemaObj.suit.enum[Math.floor(i / 13)],
      rank: CardSchemaObj.rank.enum[i % 13],
      played: false,
      owner: null
    }
  });
}

module.exports = CardSchema;
