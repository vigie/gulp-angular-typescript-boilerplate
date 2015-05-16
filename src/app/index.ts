/// <reference path="../../.tmp/typings/tsd.d.ts" />

/// <reference path="main/main.controller.ts" />
/// <reference path="../app/components/navbar/navbar.controller.ts" />

module gulpAngularTypescriptBoilerplate {
   'use strict';

   angular.module('gulpAngularTypescriptBoilerplate', ['ngCookies', 'ngRoute'])
      .controller('MainCtrl', MainCtrl)
      .controller('NavbarCtrl', NavbarCtrl)

      .config(function ($routeProvider:ng.route.IRouteProvider) {
         $routeProvider
            .when('/', {
               templateUrl: 'app/main/main.html',
               controller: 'MainCtrl'
            })
            .otherwise({
               redirectTo: '/'
            });
      });
}
