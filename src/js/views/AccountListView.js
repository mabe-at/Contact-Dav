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
        'click [data-action="edit-account"]': 'editAccount',
        'click [data-action="remove-all-accounts"]': 'removeAllAccounts'
      },

      render: function render() {
        this.$el.html(Mustache.render(accountListTpl, {}));
        this.renderAccounts();
      },

      renderAccounts: function renderAccounts(){
        var $accountList = this.$el.find('[data-target="account-list"]');

        $.each(AccountStorage.getAll(), function(index, account){
          if(account !== undefined){
            var $account = $('<li id="account-'+account.id+'" />');

            $account.html([
              '<a href="#" data-action="edit-account" data-id="',account.id,'">',
                '<p><strong>',account.name,'</strong><br>',account.url,'</p>',
              '</a>'
            ].join(''));

        		$accountList.append($account);
          }
        });
      },

      editAccount: function editAccount(ev){
        app.EventBus.trigger('app:changePage', {
          page: 'account-form',
          params: {
            formType: 'edit',
            accountId: $(ev.currentTarget).attr('data-id')
          }
        });
      },

      removeAllAccounts: function removeAllAccounts(){
        if(confirm('Are you sure you want to remove all accounts?') === true){
          this.$el.find('[data-target="account-list"]').html('');
          AccountStorage.deleteAll();
        }
      }
  });

  return AccountListView;
});
