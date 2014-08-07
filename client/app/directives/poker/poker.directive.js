'use strict';

angular.module('tractorApp')
  .directive('poker', function () {
    var RANK_TO_POINTS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

    return {
      restrict: 'EA',
      scope: {
        suit: '&',
        rank: '&',
      },
      link: function (scope, element) {
        var suit, point;
        if (scope.suit() === 'JOKER') {
          point = scope.suit();
          suit = scope.rank() > 1 ? 'h' : 's';
        } else {
          suit = scope.suit();
          point = RANK_TO_POINTS[scope.rank() - 1];
        }
        element.html(Poker.getCardCanvas(100, suit, point));
      }
    };
  });
