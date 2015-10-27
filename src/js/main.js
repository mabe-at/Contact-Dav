(function () {
  'use strict';

  require.config({
    paths: {
      text: 'libs/require/text',

      jquery: 'libs/jquery/jquery',
      underscore: 'libs/underscore/underscore',
      backbone: 'libs/backbone/backbone',
      mustache: 'libs/mustache/mustache',

      tpl: '../tpl'
    },
    shim: {
      backbone: ['jquery', 'underscore']
    }
  });

  require(['views/AppView'], function (AppView) {
    var appview = new AppView();
  });

}());
