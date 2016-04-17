'use strict';

angular.module('ExpenseWatch')
  .factory('UserService', function(Restangular) {

    return {
      create: function(user) {
        return Restangular
          .one('users')
          .all('create')
          .post(user);
      },

      login: function(user) {
        return Restangular
          .one('users')
          .all('login')
          .post(user);
      },

      updateMe: function(user) {
        return Restangular
          .one('users')
          .one('me')
          .one('update')
          .customPUT(user);
      }
    };

  });
