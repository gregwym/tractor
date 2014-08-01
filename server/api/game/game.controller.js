'use strict';

var _ = require('lodash');
var Game = require('./game.model');

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
    creator: req.user
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

    var player = _(game.players).find(req.user._id);
    if (req.body.join) {
      if (!player) {
        game.players.push(req.user);
      }
    } else if (req.body.quit) {
      if (player) {
        _(game.players).remove(req.user._id);
      }
    } else {
      _(game).merge(req.body);
    }
    console.log(game);

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
