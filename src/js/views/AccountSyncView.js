define([
  'jquery',
  'lodash',
  'backbone',
  'mustache',
  'CardDavConnector',
  'AccountStorage',
  'text!tpl/account-sync.html'
], function ($, _, Backbone, Mustache, CardDavConnector, AccountStorage, accountSyncTpl) {
  'use strict';

  var AccountSyncView = Backbone.View.extend({

      events: {
        'click [data-action="sync"]': 'sync'
      },

      initialize: function initialize(){

      },

      sync: function sync(ev){
        var accounts = AccountStorage.getAll(),
            saveContact = this.saveContact,
            syncEnded = this.syncEnded;

        if(this.$el.find('[name="clear-contacts"]').is(':checked') === true){
          this.clearContacts();
        }

        $.each(accounts, $.proxy(function(index, account){
          if (account.books.length > 0) {
            $.each(account.books, $.proxy(function(index, book){
console.log(book);
/*
              CardDAV.getAllContacts(account, book, $.proxy(function(account, book, contacts){
                if (contacts.length > 0) {

              		async.forEachOfSeries(contacts,
                    function (value, key, callback) {
              				console.log("key: " + key);
              				try {
              					VCF.parse(value, function(vcard) {
              						saveContact(vcard, book);
              						callback();
              					}, window);
              				}
              				catch (e) {
              					console.log(e.message);
                    				return callback(e);
              				}
              			},
              			function (err) {
                				if (err) console.error(err.message);
              				syncEnded();
              			}
              		);

              	}
              	else {
              		syncEnded();
              	}
              }, this));
*/
            }, this));
        	}
        }, this));

        ev.preventDefault();
      },

      saveContact: function saveContact(vcard, book){
        // TODO resume refactoring
        //ContactHandler.setContact(vcard, book);
        console.log(vcard);
      },

      syncEnded: function syncEnded(){
        alert('All contacts synchronized!');
      },

      clearContacts: function clearContacts(){
        var request = navigator.mozContacts.clear();
        request.onsuccess = function () {
          console.log('All contacts have been removed.');
          // TODO ContactMapStorage.delall();
        };
        request.onerror = function () {
          console.log('No contacts were removed.');
        };
      },

      render: function render() {
        this.$el.html(Mustache.render(accountSyncTpl, {}));
      }
  });

  return AccountSyncView;
});
