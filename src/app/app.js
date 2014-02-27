

/*
    This is our app js file
*/
angular.module('app', [
    'app-html-templates',
    'common-html-templates',
    'app.home',
    'app.about',
    'ui.router'
])
    .config(function($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise('/home');
    })

    .controller('appController', function HomeController($scope, $location){
        $scope.$on('$stateChangeSuccess', function(ev, toState, toParams, fromState, fromParams){
            if(angular.isDefined( toState.data.pageTitle )){
                $scope.pageTitle = toState.data.pageTitle + ' | myNgBoilerplate';
            }
        });
    });
/*
    End app js file
*/
