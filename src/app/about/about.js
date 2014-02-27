

/*
    This is the About js file.
*/
angular.module('app.about', [
    'ui.router'
])
    .config(function config($stateProvider){
        $stateProvider.state('about', {
            url: '/about',
            views: {
                'main': {
                    controller: 'aboutController',
                    templateUrl: 'app/about/about.tpl.html'
                }
            },
            data: {
                pageTitle: 'About'
            }
        });
    })

    .controller('aboutController', function aboutController($scope){

    });

/*
    End about js file.
*/
