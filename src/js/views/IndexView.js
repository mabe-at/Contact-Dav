define([
  'lodash',
  'backbone',
  'mustache',
  'text!tpl/index.html'
], function (_, Backbone, Mustache, indexTpl) {
  'use strict';

  var IndexView = Backbone.View.extend({

      events: {

      },

      render: function render() {
        this.$el.html(Mustache.render(indexTpl, { pagetitle: 'Contact Dav' }));
      }
  });

  return IndexView;
});
