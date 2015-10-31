define([

], function () {
  'use strict';

	var AccountStorage = (function AccountStorage() {
		var accounts = {};
		var storageItemName = 'mabe_account_data';

		function store() {
			localStorage.setItem(storageItemName, JSON.stringify(accounts));
		}

		function recover() {
			try {
				accounts = JSON.parse(localStorage.getItem(storageItemName));
				if (!accounts) {
					accounts = {};
				}
			}
			catch(e) {
				accounts = {};
			}
		}

		function getNewID() {
			var id = 0;
			for (var oid in accounts) {
				if (oid > id) {
					id = oid;
				}
			}
			id++;
			return id;
		}

		recover();

		return {
			getAllKeys: function getAccountKeys() {
				return Object.keys(accounts);
			},
			getAll: function getAccounts() {
				return accounts;
			},
			get: function getAccount(id) {
				return accounts[id];
			},
			set: function setAccount(accountData) {
				var id = 0;
				if (accountData.id) {
					id = accountData.id;
				}
				else {
					id = getNewID();
					accountData.id = id;
				}
				accounts[id] = accountData;
				store();
				return id;
			},
			del: function delAccount(id) {
				accounts[id] = undefined;
				store();
			},
			delall: function delAllAccounts() {
				localStorage.setItem(storageItemName, null);
				recover();
			}
		};
	})();

	return AccountStorage;
});
