'use strict';

angular.module('ExpenseWatch')
  .controller('LoginController', function(UserService, ExpenseService, StorageService, $rootScope, $state, $ionicLoading, ionicToast) {

    var vm = this;

    var user = StorageService.getUser();
    if (user) {
      $state.go('app.view');
    }

    vm.loginActive = true;

    vm.showLogin = function() {
      vm.loginActive = true;
    };

    vm.showSignup = function() {
      vm.loginActive = false;
    };

    vm.login = function() {
      $ionicLoading.show();
      UserService
        .login(vm.loginUser)
        .then(function(user) {
          StorageService.setUser(user);
          $rootScope.$broadcast('state:authorize:changed', {
            isAuthorized: true
          });
          return ExpenseService.getMyExpenses();
        })
        .then(function(expenses) {
          expenses = expenses.map(function(expense) {
            expense.formattedDate = moment(expense.date).format('MMM Do YY');
            return expense;
          });
          StorageService.setExpenses(expenses);
          $ionicLoading.hide();
          $state.go('app.view');
        })
        .catch(function(err) {
          $ionicLoading.hide();
          ionicToast.show(err.data.message, 'bottom', false, 1500);
        });
    };

    vm.signup = function() {
      $ionicLoading.show();
      UserService
        .create(vm.signupUser)
        .then(function(user) {
          StorageService.setUser(user);
          StorageService.setExpenses([]);
          $rootScope.$broadcast('state:authorize:changed', {
            isAuthorized: true
          });
          $ionicLoading.hide();
          $state.go('app.view');
        })
        .catch(function(err) {
          $ionicLoading.hide();
          ionicToast.show(err.data.message, 'bottom', false, 1500);
        });
    };

  });
