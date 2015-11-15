var app = {};

(function () {
  'use strict';

  require.config({
    paths: {
      text: 'libs/require-text',

      jquery: 'libs/jquery',
      underscore: 'libs/underscore',
      backbone: 'libs/backbone',
      mustache: 'libs/mustache',
      promise: 'libs/es6-promise',
      dav: 'libs/dav',
      vcard: 'libs/vcard',

      tpl: '../tpl'
    },
    shim: {
      backbone: ['jquery', 'underscore']
    }
  });

  require(['views/AppView', 'CardDavConnector', 'AccountStorage', 'underscore'], function (AppView, CardDavConnector, AccountStorage, _) {
    var appview = new AppView({ el: '.app' });
    appview.render();

/*
    var accounts = AccountStorage.getAll();

    CardDavConnector.getAddressbooks(accounts).then(function(addressbooks){
      console.log(addressbooks);
    }).catch(function(error){
      console.log('Error', error);
    });
*/

  });

}());
