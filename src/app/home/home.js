

/*
    This is the home js file.
*/
angular.module('app.home', [
    'ui.router'
])
    .config(function config($stateProvider){
        $stateProvider.state('home', {
            url: '/home',
            views: {
                'main': {
                    controller: 'homeController',
                    templateUrl: 'app/home/home.tpl.html'
                }
            },
            data: {
                pageTitle: 'Home'
            }
        });
    })

    .controller('homeController', function HomeController($scope){

    });

/*
    End home js file
*/
