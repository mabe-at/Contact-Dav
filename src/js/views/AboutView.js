define([
  'lodash',
  'backbone',
  'mustache',
  'text!tpl/about.html'
], function (_, Backbone, Mustache, aboutTpl) {
  'use strict';

  var AboutView = Backbone.View.extend({

      events: {

      },

      render: function render() {
        this.$el.html(Mustache.render(aboutTpl, {}));
      }
  });

  return AboutView;
});
