'use strict';

/**
 * @ngdoc function
 * @name ExpenseWatch.controller:MainController
 * @description
 * # MainController
 */
angular.module('ExpenseWatch')
  .controller('MainController', function($scope, $rootScope, $state, StorageService) {

    var vm = this;

    vm.isAuthorized = false;

    (function() {
      var user = StorageService.getUser();
      if (user) {
        vm.isAuthorized = true;
      }
    })();

    $scope.$on('state:authorize:changed', function(event, data) {
      vm.isAuthorized = data.isAuthorized;
    });

    vm.logout = function() {
      StorageService.clearAll();
      $rootScope.$broadcast('state:authorize:changed', {
        isAuthorized: false
      });
      $state.go('app.login');
    };

  });
