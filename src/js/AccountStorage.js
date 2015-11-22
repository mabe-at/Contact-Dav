define(function(){
  'use strict';

	var AccountStorage = (function(){
		var accounts = {},
		    storageItemName = 'mabe_account_data';

		function write(){
			localStorage.setItem(storageItemName, JSON.stringify(accounts));
		}

		function read(){
			accounts = JSON.parse(localStorage.getItem(storageItemName)) || {};
		}

		function generateId(){
      var keys = Object.keys(accounts);
      return parseInt(keys[keys.length - 1]) + 1 || 0;
		}

    function getAccount(id){
      read();
      return accounts[id];
    }

    function setAccount(account){
      read();
      if(account.id === undefined){
        account.id = generateId();
      }
      accounts[account.id] = account;
      write();
      return account.id;
    }

    function deleteAccount(id){
      read();
      delete accounts[id];
      write();
    }

    function getAllAccounts(){
      read();
      return accounts;
    }

    function deleteAllAccounts(){
      accounts = {};
      write();
    }

		return {
			get: getAccount,
			set: setAccount,
			delete: deleteAccount,
      getAll: getAllAccounts,
			deleteAll: deleteAllAccounts
		};

	})();

	return AccountStorage;
});
