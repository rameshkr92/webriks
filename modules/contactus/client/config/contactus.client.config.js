'use strict';

// Configuring the Articles module
angular.module('contactus').run(['Menus',
  function (Menus) {
    // Add the articles dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Contactus',
      state: 'contactus',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'contactus', {
      title: 'List Contactus',
      state: 'contactus.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'contactus', {
      title: 'Create Contactus',
      // state: 'contactus.create',
      state: 'contact-us',
      roles: ['user']
    });
  }
]);
