'use strict';

angular.module('tractorApp')
  .controller('GameCtrl', function ($scope, $http, $stateParams, socket, Auth) {
    var off = [];

    var gameId = $stateParams.id;
    var gameUrl = '/api/games/' + gameId;

    var init = function() {
      $scope.newMessage = '';
      $scope.user = Auth.getCurrentUser();

      // Try join the game
      socket.join('game', gameId, function(game) {
        $scope.game = game;
        socket.syncItemUpdates('game', $scope.game, function(event) {
          if (event === 'deleted') {
            // Game ended
            $scope.game = null;
          }
        });
      });
    };

    var destructor = function() {
      if ($scope.game) {
        socket.unsyncItemUpdates('game', $scope.game);
      }
      socket.leave('game', gameId);

      _.each(off, function(unbind) {
        unbind();
      });
      off = null;
    };

    $scope.startGame = function() {
      $http.put(gameUrl, {
        start: true
      });
    };

    $scope.sendMessage = function() {
      $http.put(gameUrl, {
        message: $scope.newMessage
      });
      $scope.newMessage = '';
    };

    off.push($scope.$on('$destroy', destructor));
    init();
  });
