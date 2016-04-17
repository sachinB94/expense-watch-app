'use strict';

angular.module('ExpenseWatch')
  .factory('StorageService', function(localStorageService) {

    return {
      setUser: function(user) {
        return localStorageService.set('user', user);
      },

      getUser: function() {
        return localStorageService.get('user');
      },

      removeUser: function() {
        return localStorageService.remove('user');
      },

      setExpenses: function(expenses) {
        return localStorageService.set('expenses', expenses);
      },

      addExpense: function(expense) {
        var expenses = localStorageService.get('expenses');
        if (!expenses) {
          expenses = [];
        }
        expenses.push(expense);
        expenses.sort(function(expense1, expense2) {
          return Date.parse(expense2.date) - Date.parse(expense1.date);
        });
        return localStorageService.set('expenses', expenses);
      },

      getExpenses: function() {
        return localStorageService.get('expenses');
      },

      removeExpenses: function() {
        return localStorageService.remove('expenses');
      },

      clearAll: function() {
        return localStorageService.clearAll();
      }
    };

  });
