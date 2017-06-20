'use strict';

// Setting up route
angular.module('contactus').config(['$stateProvider',
    function ($stateProvider) {
        // Articles state routing
        $stateProvider
            .state('contactus', {
                abstract: true,
                url: '/contactus',
                template: '<ui-view/>'
            })
            //frontend routes
            .state('contact-us', {
                url: '/contact-us',
                templateUrl: 'modules/contactus/client/views/create-contactus.client.view.html'
            })
            //frontend routes
            .state('contactus.list', {
                url: '',
                templateUrl: 'modules/contactus/client/views/list-contactus.client.view.html'
            })
            /*.state('contactus.create', {
                url: '/create',
                templateUrl: 'modules/contactus/client/views/create-contactus.client.view.html',
                data: {
                    roles: ['user', 'admin']
                }
            })*/
            .state('contactus.view', {
                url: '/:articleId',
                templateUrl: 'modules/contactus/client/views/view-contactus.client.view.html'
            })
            .state('contactus.edit', {
                url: '/:articleId/edit',
                templateUrl: 'modules/contactus/client/views/edit-contactus.client.view.html',
                data: {
                    roles: ['user', 'admin']
                }
            });
    }
]);
