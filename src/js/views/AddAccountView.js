define([
  'underscore',
  'backbone',
  'mustache',
  'CardDAV',
  'text!tpl/add-account.html'
], function (_, Backbone, Mustache, CardDAV, addAccountTpl) {
  'use strict';

  var AddAccountView = Backbone.View.extend({

      events: {
        'click [data-action="save-account"]': 'saveAccount'
      },

      render: function render() {
        this.$el.html(Mustache.render(addAccountTpl, {}));
      },

      saveAccount: function saveAccount(ev) {
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
          accountData.sync = $form.find('[name="sync"]').is(':checked');
      		this.checkAdressbooks(accountData);
      	}
      	else {
      		alert('Please fill out all fields!');
      	}

        ev.preventDefault();
      },

      checkAdressbooks: function checkAdressbooks(account) {
        var $status = this.$el.find('[data-target="save-account-status"]');

        $status.html('Searching for Adressbooks ...');

      	try {
      		CardDAV.findAddressbooks(account, this.saveWithBooks);
      	}
      	catch(e) {
      		this.saveWithBooks(account, []);
      	}
      },

      saveWithBooks: function saveWithBooks(account, books) {
        var $status = this.$el.find('[data-target="save-account-status"]');

      	if (books.length > 0) {
          var content = books.length + ' ' + (books.length > 1 ? 'Adressbooks' : 'Adressbook') + ' found:<br><ul>';

          $.each(books, function(index, book){
            content += '<li>'+book.displayname+'</li>';
    			});

          content += '</ul>';
          $status.html(content);

          // TODO add #find-adressbooks view

      		app.TMP.account = account;
      		app.TMP.books = books;
      	}
      	else {
      		$status.html('No Adressbooks Found!');
      	}
      }
  });

  return AddAccountView;
});
