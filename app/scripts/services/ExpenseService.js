'use strict';

angular.module('ExpenseWatch')
  .factory('ExpenseService', function(Restangular) {

    return {
      create: function(expense) {
        return Restangular
          .one('expenses')
          .all('create')
          .post(expense);
      },

      update: function(expenseId, expense) {
        return Restangular
          .one('expenses')
          .one('update', expenseId)
          .customPUT(expense);
      },

      delete: function(expenseId) {
        return Restangular
          .one('expenses')
          .one('delete', expenseId)
          .remove();
      },

      getMyExpenses: function() {
        return Restangular
          .one('expenses')
          .one('me')
          .get();
      }
      
    };

  });
