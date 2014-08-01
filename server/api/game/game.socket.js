/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Game = require('./game.model');

exports.register = function(socket) {
  Game.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Game.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  doc
    .populate('creator', 'name email')
    .populate('players', 'name email', function(err, doc) {
      socket.emit('game:save', doc);
      socket.emit(['game', doc._id, 'save'].join(':'), doc);
    });
}

function onRemove(socket, doc, cb) {
  socket.emit('game:remove', doc);
  socket.emit(['game', doc._id, 'remove'].join(':'), doc);
}
