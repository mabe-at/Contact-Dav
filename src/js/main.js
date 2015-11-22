var app = {};

(function () {
  'use strict';

  require.config({
    paths: {
      text: 'libs/require-text',

      jquery: 'libs/jquery',
      lodash: 'libs/lodash',
      backbone: 'libs/backbone',
      mustache: 'libs/mustache',
      dav: 'libs/dav',
      vcard: 'libs/vcard',

      tpl: '../tpl'
    }
  });

  require(['views/AppView'], function(AppView){
    var appview = new AppView({ el: '.app' });
    appview.render();
  });

}());
