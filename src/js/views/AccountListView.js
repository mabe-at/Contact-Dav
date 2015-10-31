define([
  'underscore',
  'backbone',
  'mustache',
  'AccountStorage',
  'text!tpl/account-list.html'
], function (_, Backbone, Mustache, AccountStorage, accountListTpl) {
  'use strict';

  var AccountListView = Backbone.View.extend({

      events: {
        'click [data-action="edit-account"]': 'editAccount'
      },

      render: function render() {
        this.$el.html(Mustache.render(accountListTpl, {}));
        this.renderAccounts();
      },

      renderAccounts: function renderAccounts(){
        var $accountList = this.$el.find('[data-target="account-list"]');

        $.each(AccountStorage.getAll(), function(index, account){
          var $account = $('<li id="account-'+account.id+'" />');

          $account.html([
            '<a href="#" data-action="edit-account" data-id="',account.id,'">',
              '<p>',account.name,'</p>',
              '<p>',account.url,'</p>',
            '</a>'
          ].join(''));

      		$accountList.append($account);
        });
      },

      editAccount: function editAccount(ev){
        var accountId = $(ev.currentTarget).attr('data-id');
  			    account = AccountStorage.get(accountId);

        /*
  			document.getElementById('edit_account_name').value = account.name;
  			document.getElementById('edit_account_name').defaultValue = account.name;

  			document.getElementById('edit_account_url').value = account.url;
  			document.getElementById('edit_account_url').defaultValue = account.url;

  			document.getElementById('edit_account_user').value = account.user;
  			document.getElementById('edit_account_user').defaultValue = account.user;

  			document.getElementById('edit_account_password').value = account.password;
  			document.getElementById('edit_account_password').defaultValue = account.password;

  			if (account.sync) {
  				document.getElementById('edit_account_sync').checked = true;
  			}
  			else {
  				document.getElementById('edit_account_sync').checked = false;
  			}

  			document.getElementById('edit_account_id').value = accountId;
        */

        alert('edit account: '+accountId);
        console.log(account);
      }
  });

  return AccountListView;
});
