'use strict';

angular.module('tractorApp')
  .controller('GameCtrl', function ($scope, $http, $stateParams, socket, Auth) {
    var off = [];

    var gameId = $stateParams.id;
    var gameUrl = '/api/games/' + gameId;

    var init = function() {
      $scope.newMessage = '';
      $scope.user = Auth.getCurrentUser();

      $http.get(gameUrl).success(function(game) {
        $scope.game = game;
        socket.syncItemUpdates('game', $scope.game, function(event) {
          if (event === 'deleted') {
            // Game ended
            $scope.game = null;
          }
        });

        $http.put(gameUrl, {
          join: $scope.user
        });
      });
    };

    var destructor = function() {
      if ($scope.game) {
        socket.unsyncItemUpdates('game', $scope.game);
      }
      $http.put(gameUrl, {
        quit: $scope.user
      });

      _.each(off, function(unbind) {
        unbind();
      });
      off = null;
    };

    $scope.sendMessage = function() {
      $http.put(gameUrl, {
        message: $scope.newMessage
      });
      $scope.newMessage = '';
    };

    off.push($scope.$on('$destroy', function () {
      destructor();
    }));
    init();
  });
