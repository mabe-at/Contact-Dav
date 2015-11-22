define([
  'jquery',
  'lodash',
  'backbone',
  'mustache',
  'CardDavConnector',
  'AccountStorage',
  'text!tpl/account-form.html'
], function ($, _, Backbone, Mustache, CardDavConnector, AccountStorage, accountFormTpl) {
  'use strict';

  var AccountFormView = Backbone.View.extend({

      events: {
        'click [data-action="submit-accountform"]': 'processAccountForm',
        'click [data-action="save-account"]': 'saveAccount',
        'click [data-action="remove-account"]': 'removeAccount'
      },

      initialize: function initialize(params){
        this.formType = params.formType || 'add';
        this.accountId = params.accountId || 0;
      },

      render: function render() {
        var account = AccountStorage.get(this.accountId) || {};

        this.$el.html(Mustache.render(accountFormTpl, {
          title: (this.formType === 'edit') ? 'Edit Account' : 'Add Account',
          editAccount: (this.formType === 'edit') ? true : false,
          account: account
        }));
      },

      processAccountForm: function processAccountForm(ev) {
        var $form = this.$el.find('form'),
            error = false,
            fields = ['name', 'url', 'user', 'password'],
            accountData = {};

        $.each(fields, function(index, field){
          var val = $form.find('[name="'+field+'"]').val().trim();
          if(val === '') {
            error = true;
            return false;
          }
          accountData[field] = val;
        });

      	if (!error) {
          if(this.accountId !== 0) accountData.id = this.accountId;
          this.accountData = accountData;
          $form.remove();
          this.getBooks();
      	}
      	else {
      		alert('Please fill out all fields!');
      	}

        ev.preventDefault();
      },

      getBooks: function getBooks(){
        var $status = this.$el.find('[data-target="getbooks-status"]');

        $status.html('Searching for Adressbooks ...');

        CardDavConnector.getAddressbooks({ 0: this.accountData })
          .then($.proxy(this.displayBooks, this))
          .catch(function(error){
            $status.html('Verbindungsfehler!');
          });

      },

      displayBooks: function displayBooks(books) {
        var $status = this.$el.find('[data-target="getbooks-status"]');

      	if (books.length > 0) {
          var content = books.length + ' ' + (books.length > 1 ? 'Adressbooks' : 'Adressbook') + ' found:<br><ul>';

          $.each(books, function(index, book){
            content += '<li>'+book.displayName+'</li>';
    			});

          content += '</ul><button data-action="save-account">Save</button><button data-action="change-page" data-href="account-list">Cancel</button>';
          $status.html(content);
      	}
      	else {
      		$status.html('No Adressbooks Found!');
      	}
      },

      saveAccount: function saveAccount(ev){
        var msg = (this.formType === 'add') ? 'Account saved!' : 'Account updated!';

        AccountStorage.set(this.accountData);
        alert(msg);
        app.EventBus.trigger('app:changePage', {
          page: 'account-list'
        });
        ev.preventDefault();
      },

      removeAccount: function removeAccount(ev){
        if(confirm('Are you sure you want to remove this account?') === true){
        	AccountStorage.delete(this.accountId);
          alert('Account Removed!');
          app.EventBus.trigger('app:changePage', {
            page: 'account-list'
          });
        }
        ev.preventDefault();
      }
  });

  return AccountFormView;
});
