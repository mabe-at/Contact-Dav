define(function () {
  'use strict';

	var CardDAV = (function CardDAV() {
		var openedConnection = null,
		    addressbooks = [],
		    contacts = [],
		    bookcalls = [],
		    contactcalls = [];

		function findBooks(account, callback) {
			bookcalls[account.url + account.user] = 0;
			bookcalls[account.url + account.user]++;
			//console.log('in findebooks.');
			openedConnection.getResource(null, function(res, error) {
				//console.log('got resource. calls ' + calls);
				_findBooks(res, error, account, callback);
			});
		}

		function _findBooks(res, error, account, callback) {
			if (res) {
				if (res.isCollection() && res.isAddressBook()) {
					addressbooks[account.url + account.user].push(res.getMetadata());
				}
				var resContent = res.getContents();
				for (var item=1; item < resContent.length; item++) {
					var element = resContent[item];
					if (element.type !== 'file') {
						bookcalls[account.url + account.user]++;
						openedConnection.getResource(element.href, function(res, error) {
							_findBooks(res, error, account, callback);
						});
					}
				}
			}
			bookcalls[account.url + account.user]--;
			if (bookcalls[account.url + account.user] == 0 && callback) {
				callback(account, addressbooks[account.url + account.user]);
			}
		}

		function getContacts(account, book, callback) {
			if (!Array.isArray(contactcalls[account.url + account.user])) {
	  		contactcalls[account.url + account.user] = [];
	  	}
			contactcalls[account.url + account.user][book.href] = 0;
			contactcalls[account.url + account.user][book.href]++;
			openedConnection.getResource(book.href, function(res, error) {
				_getContacts(res, error, account, book, callback);
			});
		}

		function _getContacts(res, error, account, book, callback) {
			if (res) {
				var resContent = res.getContents();
				if (res.isCollection() && res.isAddressBook()) {
					for (var item=0; item < resContent.length; item++) {
						var element = resContent[item];
						if (element.type == 'file') {
							contactcalls[account.url + account.user][book.href]++;
							openedConnection.getResource(element.href, function(res, error) {
								_getContacts(res, error, account, book, callback);
							});
						}
					}
				}
				else if (res.isFile()) {
					contacts[account.url + account.user][book.href].push(resContent);
				}
			}
			contactcalls[account.url + account.user][book.href]--;
			if (contactcalls[account.url + account.user][book.href] == 0 && callback) {
				callback(account, book, contacts[account.url + account.user][book.href]);
			}
		}

		return {
			findAddressbooks: function findAddressbooks(account, callback) {
				addressbooks[account.url + account.user] = [];
				try {
					openedConnection = jsDAVlib.getConnection(account);
					openedConnection.onready = function() {
						findBooks(account, callback);
					};
					openedConnection.onerror = function(error) {
						if (callback) {
							callback(account, addressbooks[account.url + account.user]);
						}
					};
					openedConnection.connect();
				}
				catch (e) {
					if (callback) {
						callback(account, addressbooks[account.url + account.user]);
					}
				}
			},
			getAllContacts: function getAllContacts(account, book, callback) {
				if (!Array.isArray(contacts[account.url + account.user])) {
					contacts[account.url + account.user] = [];
				}
				contacts[account.url + account.user][book.href] = [];
				openedConnection = jsDAVlib.getConnection(account);
				openedConnection.onready = function() {
					getContacts(account, book, callback);
				};
				openedConnection.onerror = function(error) {
					if (callback) {
						callback(account, book, contacts[account.url + account.user][book.href]);
					}
				};
				openedConnection.connect();
			}
		};
	})();

	return CardDAV;
});
