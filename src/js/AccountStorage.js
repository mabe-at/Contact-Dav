define([], function () {
  'use strict';

	var AccountStorage = (function AccountStorage() {
		var accounts = {},
		    storageItemName = 'mabe_account_data';

		function write() {
			localStorage.setItem(storageItemName, JSON.stringify(accounts));
		}

		function read() {
			accounts = JSON.parse(localStorage.getItem(storageItemName)) || {};
		}

		function generateId() {
      var keys = Object.keys(accounts);
      return parseInt(keys[keys.length - 1]) + 1 || 0;
		}

		read();

		return {

			get: function getAccount(id) {
				return accounts[id];
			},

			set: function setAccount(account) {
				if(account.id === undefined){
					account.id = generateId();
				}
				accounts[account.id] = account;
				write();
				return account.id;
			},

			delete: function deleteAccount(id) {
        delete accounts[id];
				write();
			},

      getAll: function getAccounts() {
				return accounts;
			},

			deleteAll: function deleteAllAccounts() {
				accounts = {};
				write();
			}

		};
	})();

	return AccountStorage;
});
