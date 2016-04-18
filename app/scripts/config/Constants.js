'use strict';

angular.module('ExpenseWatch')

  // .constant('SERVER_URL', 'http://localhost:9000')
  // .constant('SERVER_URL', 'http://10.0.2.2:9000')
  .constant('SERVER_URL', 'https://expense-watch.herokuapp.com')
  .constant('EXPENSE_TYPE', ['cash', 'credit']);