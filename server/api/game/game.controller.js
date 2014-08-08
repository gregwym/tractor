'use strict';

var _ = require('lodash');
var Game = require('./game.model');
var CardSchema = require('./card/card.schema');

// Get list of games
exports.index = function(req, res) {
  Game.find(function (err, games) {
    if(err) { return handleError(res, err); }
    return res.json(200, games);
  });
};

// Get a single game
exports.show = function(req, res) {
  Game
    .findById(req.params.id)
    .populate('creator', 'name email')
    .populate('players', 'name email')
    .exec(function (err, game) {
      if(err) { return handleError(res, err); }
      if(!game) { return res.send(404); }
      return res.json(game);
    });
};

// Creates a new game in the DB.
exports.create = function(req, res) {
  var game = _.extend({
    creator: req.user,
    maxPlayers: 4,
  }, req.body);
  Game.create(game, function(err, game) {
    if(err) { return handleError(res, err); }
    return res.json(201, game);
  });
};

// Updates an existing game in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Game.findById(req.params.id, function (err, game) {
    if (err) { return handleError(res, err); }
    if(!game) { return res.send(404); }

    var playerIndex = game.players.indexOf(req.user._id);
    var rtnStatus;
    if (req.body.join) {
      rtnStatus = game.join(req.user._id) || 409;
    } else if (req.body.quit) {
      rtnStatus = game.quit(req.user._id) || 400;
    } else if (req.body.start) {
      game.resetCards();
      game.shuffleCards();
    } else if (req.body.message) {
      rtnStatus = game.addMessage(req.body.message, req.user.name)
    } else {
      _.merge(game, req.body);
    }

    // If return status is set, send it without saving
    if (_.isNumber(rtnStatus)) {
      return res.json(rtnStatus, game);
    }

    game.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, game);
    });
  });
};

// Deletes a game from the DB.
exports.destroy = function(req, res) {
  Game.findById(req.params.id, function (err, game) {
    if(err) { return handleError(res, err); }
    if(!game) { return res.send(404); }
    game.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
