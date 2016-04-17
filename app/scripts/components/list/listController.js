'use strict';

angular.module('ExpenseWatch')
  .controller('ListController', function($scope, EXPENSE_TYPE, StorageService, ExpenseService, ionicDatePicker, $ionicLoading, ionicToast, $ionicPopup, $ionicModal) {

    var vm = this;

    vm.EXPENSE_TYPE = EXPENSE_TYPE;

    vm.expenses = StorageService.getExpenses();

    vm.sortField = 'date';
    vm.sequenceMultiplier = '-1';

    vm.sortExpenses = function() {
      if (vm.sortField === 'date') {
        vm.expenses.sort(function(expense1, expense2) {
          return parseInt(vm.sequenceMultiplier) * (Date.parse(expense1[vm.sortField]) - Date.parse(expense2[vm.sortField]));
        });
      } else if (vm.sortField === 'amount') {
        vm.expenses.sort(function(expense1, expense2) {
          return parseInt(vm.sequenceMultiplier) * (expense1[vm.sortField] - expense2[vm.sortField]);
        });
      } else if (vm.sortField === 'name') {
        vm.expenses.sort(function(expense1, expense2) {
          return parseInt(vm.sequenceMultiplier) * (expense1[vm.sortField].localeCompare(expense2[vm.sortField]));
        });
      }
    };

    vm.deleteExpense = function(expense) {
      $ionicPopup
        .confirm({
          title: 'Are you sure?',
          template: 'Are you sure you want to delete the expense ' + expense.name + '?'
        })
        .then(function(res) {
          if (res) {
            $ionicLoading.show();
            return ExpenseService.delete(expense._id);
          }
        })
        .then(function(data) {
          if (data && data.ok && data.n) {
            _.remove(vm.expenses, {
              _id: expense._id
            });
            StorageService.setExpenses(vm.expenses);
            $ionicLoading.hide();
            ionicToast.show('Expense deleted', 'bottom', false, 1500);
          }
        })
        .catch(function(err) {
          $ionicLoading.hide();
          ionicToast.show(err.data.message, 'bottom', false, 1500);
        });
    };

    vm.editExpense = function(expense) {
      $ionicModal
        .fromTemplateUrl('scripts/components/list/editExpense.modal.html', {
          scope: $scope,
          animation: 'slide-in-up'
        })
        .then(function(modal) {
          modal.show();
          vm.editExpenseModal = modal;
          expense.date = new Date(expense.date);
          vm.expense = expense;
        });
    };

    vm.openDatePicker = function() {
      ionicDatePicker.openDatePicker({
        callback: function(date) {
          vm.expense.date = new Date(date);
        },
      });
    };

    vm.closeEditExpenseModal = function(event, expense) {
      vm.expense = null;
      vm.editExpenseModal.hide();
      if (event === 'cancel') {
        return;
      }
      $ionicLoading.show();
      ExpenseService
        .update(expense._id, expense)
        .then(function(data) {
          _.remove(vm.expenses, {
            _id: data._id
          });
          data.formattedDate = moment(data.date).format('MMM Do YY');
          vm.expenses.push(data);
          vm.sortField = 'date';
          vm.sequenceMultiplier = '-1';
          vm.expenses.sort(function(expense1, expense2) {
            return parseInt(vm.sequenceMultiplier) * (Date.parse(expense1[vm.sortField]) - Date.parse(expense2[vm.sortField]));
          });
          StorageService.setExpenses(vm.expenses);
          $ionicLoading.hide();
          ionicToast.show('Expense updated', 'bottom', false, 1500);
        })
        .catch(function(err) {
          $ionicLoading.hide();
          ionicToast.show(err.data.message, 'bottom', false, 1500);
        });

    };

  });
