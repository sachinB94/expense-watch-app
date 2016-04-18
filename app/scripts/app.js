'use strict';

/**
 * @ngdoc overview
 * @name ExpenseWatch
 * @description
 * # Initializes main application and routing
 *
 * Main module of the application.
 */


angular.module('ExpenseWatch', ['ionic', 'ionic-toast', 'ngCordova', 'ngResource', 'restangular', 'LocalStorageModule', 'ionic-datepicker', 'nvd3'])

  .run(function($ionicPlatform) {

    $ionicPlatform.ready(function() {
      // save to use plugins here
    });

    // add possible global event handlers here

  })

  .config(function($stateProvider, $urlRouterProvider, RestangularProvider, StorageServiceProvider, SERVER_URL, localStorageServiceProvider) {
    
    // Set base URL for Restangular
    RestangularProvider.setBaseUrl(SERVER_URL + '/api');

    // Attach user's token to Authorization header
    RestangularProvider.setFullRequestInterceptor(function(element, operation, route, url, headers, params) {
        var user = StorageServiceProvider.$get().getUser();
        if (user && user.token) {
          return {
              element: element,
              params: params,
              headers: _.extend(headers, {
                  Authorization: 'Bearer ' + user.token
              })
          };
        }
    });

    // Set angular local storage
    localStorageServiceProvider
      .setPrefix('ExpenseWatch');

    // Application routing
    $stateProvider
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'scripts/components/main/main.html',
        controller: 'MainController as vm'
      })
      .state('app.login', {
        url: '/login',
        cache: false,
        views: {
          'viewContent': {
            templateUrl: 'scripts/components/login/login.html',
            controller: 'LoginController as vm'
          }
        }
      }).state('app.add', {
        url: '/add',
        cache: false,
        views: {
          'viewContent': {
            templateUrl: 'scripts/components/add/add.html',
            controller: 'AddController as vm'
          }
        }
      }).state('app.view', {
        url: '/view?login',
        cache: false,
        views: {
          'viewContent': {
            templateUrl: 'scripts/components/view/view.html',
            controller: 'ViewController as vm'
          }
        }
      }).state('app.list', {
        url: '/list',
        cache: false,
        views: {
          'viewContent': {
            templateUrl: 'scripts/components/list/list.html',
            controller: 'ListController as vm'
          }
        }
      }).state('app.about', {
        url: '/about',
        cache: false,
        views: {
          'viewContent': {
            templateUrl: 'scripts/components/about/about.html',
            controller: 'AboutController as vm'
          }
        }
      });


    // redirects to default route for undefined routes
    $urlRouterProvider.otherwise('/app/login');
  });


