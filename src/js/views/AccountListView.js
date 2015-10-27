define([
  'underscore',
  'backbone',
  'mustache',
  'text!tpl/account-list.html'
], function (_, Backbone, Mustache, accountListTpl) {
  'use strict';

  var AccountListView = Backbone.View.extend({

      events: {

      },

      render: function render() {
        this.$el.html(Mustache.render(accountListTpl, {}));
      }
  });

  return AccountListView;
});
