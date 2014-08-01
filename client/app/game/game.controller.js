'use strict';

angular.module('tractorApp')
  .controller('GameCtrl', function ($scope, $http, $stateParams, socket, Auth) {
    var gameId = $stateParams.id;
    var gameUrl = '/api/games/' + gameId;
    var currentUser = Auth.getCurrentUser();

    $http.get(gameUrl).success(function(game) {
      $scope.game = game;
      socket.syncItemUpdates('game', $scope.game, function(event) {
        if (event === 'deleted') {
          // Game ended
          $scope.game = null;
        }
      });

      $http.put(gameUrl, {
        join: currentUser
      });
    });

    $scope.$on('$destroy', function () {
      if ($scope.game) {
        socket.unsyncItemUpdates('game', $scope.game);
      }

      $http.put(gameUrl, {
        quit: currentUser
      });
    });
  });
