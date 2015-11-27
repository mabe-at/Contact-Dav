define([
  'jquery',
  'lodash',
  'backbone',
  'mustache',
  'CardDavConnector',
  'MozContactConnector',
  'ContactHandler',
  'AccountStorage',
  'text!tpl/account-sync.html'
], function ($, _, Backbone, Mustache, CardDavConnector, MozContactConnector, ContactHandler, AccountStorage, accountSyncTpl) {
  'use strict';

  var AccountSyncView = Backbone.View.extend({

      events: {
        'click [data-action="sync"]': 'sync'
      },

      render: function render() {
        this.$el.html(Mustache.render(accountSyncTpl, {}));
      },

      sync: function sync(ev){
        var accounts = _.filter(AccountStorage.getAll(), function(account){
          return account.sync;
        });

        if(this.$el.find('[name="clear-contacts"]').is(':checked') === true){
          this.clearContacts();
        }

        CardDavConnector.getContacts(accounts)
          .then(function(contacts){
            _.each(contacts, function(contact){
              //console.log(contact);
              ContactHandler.setContact(contact);
            });
            alert('All contacts synchronized!');
          })
          .catch(function(error){
            $status.html('Verbindungsfehler!');
          });

        ev.preventDefault();
      },

      clearContacts: function clearContacts(){
        MozContactConnector.deleteAll()
          .then(function(){
            console.log('All contacts have been removed.');
          })
          .catch(function(error){
            console.log('No contacts were removed.');
          });
      }

  });

  return AccountSyncView;
});
