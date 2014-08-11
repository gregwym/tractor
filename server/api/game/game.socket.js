/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var debug = require('debug')('tractor:game:socket');
var Game = require('./game.model');

exports.register = function(socket) {
  Game.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Game.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });

  socket.on('join', function(data, rtn) {
    var found = data.match(/^game:([\w\d]+)$/);
    if (!found) return;
    var gameId = found[1];
    debug('User %s joining game: %s', socket.decoded_token._id, gameId);

    Game.findById(gameId, function(err, game) {
      if (err || !game) return rtn(404);
      var joined = game.join(socket.decoded_token._id);
      if (!joined) return rtn(403);
      game.save();
      debug('User %s joined game: %s', socket.decoded_token._id, gameId);

      var quitGame = function() {
        debug('User %s disconnecting game: %s', socket.decoded_token._id, gameId);
        Game.findById(gameId, function(err, game) {
          if (err || !game) return;
          if (game.quit(socket.decoded_token._id)) {
            game.save();
            debug('User %s disconnected game: %s', socket.decoded_token._id, gameId);
          }
        });
      };

      socket.once('disconnect', quitGame);
      socket.once('leave', function() {
        socket.removeListener('disconnect', quitGame);
      });

      return populateGame(game, function(err, game) {
        if (err) return rtn(500);
        rtn(game);
      })
    });
  });

  socket.on('leave', function(data) {
    var found = data.match(/^game:([\w\d]+)$/);
    if (!found) return;
    var gameId = found[1];
    debug('User %s leaving game: %s', socket.decoded_token._id, gameId);

    Game.findById(gameId, function(err, game) {
      if (err || !game) return;
      if (game.quit(socket.decoded_token._id)) {
        game.save();
        debug('User %s left game: %s', socket.decoded_token._id, gameId);
      }
    });
  })
}

function populateGame(doc, cb) {
  doc
    .populate('creator', 'name email')
    .populate('players', 'name email', cb);
}

function onSave(socket, doc, cb) {
  populateGame(doc, function(err, doc) {
    var gameRoom = ['game', doc._id].join(':');
    socket.emit('game:save', doc);
    socket.to(gameRoom).emit([gameRoom, 'save'].join(':'), doc);
  });
}

function onRemove(socket, doc, cb) {
  socket.emit('game:remove', doc);
  socket.emit(['game', doc._id, 'remove'].join(':'), doc);
}
