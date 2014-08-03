'use strict';

angular.module('tractorApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    var off = [];

    var init = function() {
      $scope.games = [];

      $http.get('/api/games').success(function(games) {
        $scope.games = games;
        socket.syncUpdates('game', $scope.games);
      });
    };

    var destructor = function() {
      socket.unsyncUpdates('game');

      _.each(off, function(unbind) {
        unbind();
      });
      off = null;
    };

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

    off.push($scope.$on('$destroy', destructor));
    init();
  });
