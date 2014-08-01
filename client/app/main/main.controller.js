'use strict';

angular.module('tractorApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.games = [];

    $http.get('/api/games').success(function(games) {
      $scope.games = games;
      socket.syncUpdates('game', $scope.games);
    });

    $scope.createGame = function() {
      if($scope.newGameName === '') {
        return;
      }
      $http.post('/api/games', { name: $scope.newGameName });
      $scope.newGameName = '';
    };

    $scope.deleteGame = function(game) {
      $http.delete('/api/games/' + game._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('game');
    });
  });
