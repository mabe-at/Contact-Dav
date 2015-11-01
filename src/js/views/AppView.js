define([
  'underscore',
  'backbone',
  'mustache',
  'views/IndexView',
  'views/AccountListView',
  'views/AccountSyncView',
  'views/AboutView',
  'views/AccountFormView'
], function (
  _,
  Backbone,
  Mustache,
  IndexView,
  AccountListView,
  AccountSyncView,
  AboutView,
  AccountFormView
) {
  'use strict';

  var AppView = Backbone.View.extend({

      events: {
        'click [data-action="change-page"]': 'changePage'
      },

      initialize: function initialize() {
        // init eventbus
        app.EventBus = _.extend({}, Backbone.Events);

        // add eventbus events
        app.EventBus.on('app:changePage', this.render, this);
      },

      render: function render(data) {
        var page = (data !== undefined && data.page !== undefined) ? data.page : 'index',
            params = (data !== undefined && data.params !== undefined) ? data.params : {},
            $appContent = this.$el.find('.app-content'),
            view = { render: function(){} };

        // reset view events
        $appContent.off();

        // set view container
        params.el = $appContent;

        switch (page) {
          case 'index':
            view = new IndexView(params);
          break;

          case 'account-list':
            view = new AccountListView(params);
          break;

          case 'account-sync':
            view = new AccountSyncView(params);
          break;

          case 'about':
            view = new AboutView(params);
          break;

          case 'account-form':
            view = new AccountFormView(params);
          break;
        }

        view.render();
      },

      changePage: function changePage(ev) {
        var $elem = $(ev.currentTarget);
        this.render({
          page: ($elem.attr('href') === undefined) ? $elem.attr('data-href') : $elem.attr('href')
        });
        ev.preventDefault();
      }
  });

  return AppView;
});
