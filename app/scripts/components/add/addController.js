'use strict';

angular.module('ExpenseWatch')
  .controller('AddController', function(ExpenseService, StorageService, ionicToast, $ionicLoading, ionicDatePicker, EXPENSE_TYPE) {

    var vm = this;

    vm.EXPENSE_TYPE = EXPENSE_TYPE;

    vm.me = StorageService.getUser();

    vm.expense = {};

    vm.openDatePicker = function() {
      ionicDatePicker.openDatePicker({
        callback: function(date) {
          vm.expense.date = new Date(date);
        },
      });
    };

    vm.addExpense = function() {
      $ionicLoading.show();
      ExpenseService
        .create(vm.expense)
        .then(function(expense) {
          expense.formattedDate = moment(expense.date).format('MMM Do YY');
          StorageService.addExpense(expense);
          ionicToast.show(expense.name + ' added', 'bottom', false, 1500);
          $ionicLoading.hide();
          vm.expense = {};
        })
        .catch(function(err) {
          $ionicLoading.hide();
          ionicToast.show(err.data.message, 'bottom', false, 1500);
        });
    };


  });
