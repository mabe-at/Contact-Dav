define([
  'underscore',
  'backbone',
  'mustache',
  'views/IndexView',
  'views/AccountListView',
  'views/AccountSyncView',
  'views/AboutView'
], function (_, Backbone, Mustache, IndexView, AccountListView, AccountSyncView, AboutView) {
  'use strict';

  var AppView = Backbone.View.extend({

      events: {
        'click .js-changepage': 'changePage'
      },

      initialize: function initialize() {
        this.setElement('.app');
        this.render();
      },

      render: function render(page) {
        var $appContent = this.$el.find('.app-content'),
            view = { render: function(){} };

        page = page || 'index';

        switch (page) {
          case 'index':
            view = new IndexView({ el: $appContent });
          break;

          case 'account-list':
            view = new AccountListView({ el: $appContent });
          break;

          case 'account-sync':
            view = new AccountSyncView({ el: $appContent });
          break;

          case 'about':
            view = new AboutView({ el: $appContent });
          break;
        }

        view.render();
      },

      changePage: function changePage(ev) {
        this.render($(ev.currentTarget).attr('href'));
        ev.preventDefault();
      }
  });

  return AppView;
});
