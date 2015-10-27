define([
  'underscore',
  'backbone',
  'mustache',
  'text!tpl/account-sync.html'
], function (_, Backbone, Mustache, accountSyncTpl) {
  'use strict';

  var AccountSyncView = Backbone.View.extend({

      events: {

      },

      render: function render() {
        this.$el.html(Mustache.render(accountSyncTpl, {}));
      }
  });

  return AccountSyncView;
});
