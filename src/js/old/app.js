'use strict';

// helpers
var forEach = Array.prototype.forEach,
    $ = document.querySelector,
    $All = document.querySelectorAll;

var syncCalls = 0;
var bookCalls = 0;
var syncCount = 0;
var sync_count;

var TMP = {};

$('#sel-sync-interval').addEventListener('change', function() {
	SettingStorage.setInterval(parseInt(this.value));
});
$('#chk-del-contacts').addEventListener('change', function() {
	SettingStorage.setWipe(this.checked);
});

//add-account
$('#btn-find-addressbooks-cancel').addEventListener ('click', function () {
	$('#find-addressbooks').className = 'fade-out';
	cleanTMP();
});

$('#btn-find-addressbooks-save').addEventListener ('click', function () {
	$('#find-addressbooks').className = 'fade-out';
	var account = TMP.account;
	var books = TMP.books;
	account.books = books;
	var aid = AccountStorage.set(account);
	if (account.id) {
		var a = $('[data-id="'+ account.id +'"]')
		if (!a) {
			addAccount(account);
		}
		else {
			updateAccount(account);
		}
	}
	else {
		account.id = aid;
		addAccount(account);
	}

	$('.current').className = 'right';
	$('[data-position="current"]').className = 'current';

	resetNewAccountFields();

	utils.status.show('Account saved!');
	cleanTMP();
});

// remove all accounts
$('#btn-remove-all-account').addEventListener ('click', function () {
  $('#confirm-remove-all').className = 'fade-in';
});
$('#btn-remove-all-cancel').addEventListener ('click', function () {
  $('#confirm-remove-all').className = 'fade-out';
});
$('#btn-account-remove-cancel').addEventListener ('click', function () {
  $('#confirm-remove-account').className = 'fade-out';
});
$('#btn-remove-all-confirmed').addEventListener ('click', function () {
	AccountStorage.delall();
	var l = $('#list-accounts');
	while (l.firstChild) {
		l.removeChild(l.firstChild);
	}
  $('#confirm-remove-all').className = 'fade-out';
  utils.status.show('All accounts removed!');
});

// about
$('#action-about').addEventListener ('click', function () {
	resetNewAccountFields();
  $('#about').className = 'current';
  $('[data-position="current"]').className = 'left';
});
$('#btn-about-back').addEventListener ('click', function () {
  $('#about').className = 'right';
  $('[data-position="current"]').className = 'current';
});

// edit account
$('#btn-edit-account-back').addEventListener ('click', function () {
  $('#edit-account').className = 'right';
  $('[data-position="current"]').className = 'current';
});

// sync accounts
$('#action-sync').addEventListener ('click', function () {
	$('#sync').className = 'current';
	$('[data-position="current"]').className = 'left';

	$('#chk-del-contacts').checked = SettingStorage.getWipe();
	$('#sel-sync-interval').value = SettingStorage.getInterval()+"";

	$('#btn-sync').disabled = true;
	var accs = AccountStorage.getAll();
	for (var accId in accs) {
		if (accs[accId].sync) {
			$('#btn-sync').disabled = false;
			break;
		}
	}
	/*var request  = window.navigator.mozContacts.getAll();
	request.onsuccess = function () {
	  if(this.result) {
	    console.log(this.result.givenName + ' ' + this.result.familyName);
	    // Move to the next contact which will call the request.onsuccess with a new result
	    this.continue();
	  }
	};

	request.onerror = function () {
	  console.log('Something goes wrong!');
	};*/
});
$('#btn-sync-back').addEventListener ('click', function () {
  $('#sync').className = 'right';
  $('[data-position="current"]').className = 'current';
});

$('#btn-sync').addEventListener ('click', function () {
	if ($('#chk-del-contacts').checked) {
		console.log("DEL CONTACTS");
		navigator.mozContacts.clear();
		var request = window.navigator.mozContacts.clear();
		request.onsuccess = function () {
		  console.log('All contacts have been removed.');
		  ContactMapStorage.delall();
		}
		request.onerror = function () {
		  console.log('No contacts were removed.');
		}
	}
	syncCount = 0;
	sync_count = $('#sync-count');
	sync_count.textContent = syncCount + "";
	$('#sync-accounts').className = 'fade-in';
	try {
		syncCalls = 0;
		bookCalls = 0;
		var accs = AccountStorage.getAll();
		for (var accId in accs) {
			if (accs[accId].sync) {
				syncCalls++;
				CardDAV.findAddressbooks(accs[accId], syncBook);
			}
		}
	}
	catch(e) {
		console.log(e);
	}
});

function syncBook(account, books) {
	if (books.length > 0) {
		for (var b in books) {
			bookCalls++;
			CardDAV.getAllContacts(account, books[b], receiveContacts);
		}
	}
	syncCalls--;
}

function receiveContacts(account, book, contacts) {
	if (contacts.length > 0) {
		console.log('contacts found: ' + contacts.length);
		async.forEachOfSeries(contacts, function (value, key, callback) {
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
}

function syncEnded() {
	bookCalls--;
	if (syncCalls == 0 && bookCalls == 0) {
		utils.status.show('All contacts synchronized!');
		$('#sync-accounts').className = 'fade-out';
	}
}

function saveContact(vcard, book) {
	syncCount++;
	sync_count.textContent = syncCount + "";

	ContactHandler.setContact(vcard, book);
}

$('#btn-account-update').addEventListener ('click', function() {
		var error = false;
		if (document.getElementById('edit_account_name').value.trim() == '') {
			error = true;
		}
		if (document.getElementById('edit_account_url').value.trim() == '') {
			error = true;
		}
		if (document.getElementById('edit_account_user').value.trim() == '') {
			error = true;
		}
		if (document.getElementById('edit_account_password').value.trim() == '') {
			error = true;
		}
		if (!error) {
			var account_data = {
				id: document.getElementById('edit_account_id').value,
				name: document.getElementById('edit_account_name').value,
				url: document.getElementById('edit_account_url').value,
				user: document.getElementById('edit_account_user').value,
				password: document.getElementById('edit_account_password').value,
				sync: document.getElementById('edit_account_sync').checked
			};

			checkAdressbooks(account_data);
    }
    else {
			utils.status.show('Please fill out all data!');
		}
});
$('#btn-account-remove').addEventListener ('click', function() {
	$('#confirm-remove-account').className = 'fade-in';
});
$('#btn-account-remove-confirmed').addEventListener ('click', function() {
	var aid = document.getElementById('edit_account_id').value;
	AccountStorage.del(aid);

	var listItem = document.getElementById('account-' + aid);
	var list = document.getElementById('list-accounts');
	list.removeChild(listItem);

	$('#confirm-remove-account').className = 'fade-out';
	$('#edit-account').className = 'right';
  $('[data-position="current"]').className = 'current';
  utils.status.show('Account Removed!');
});

function updateAccount(account) {
	var a = $('[data-id="'+ account.id +'"]');
	if (!a) {
		return;
	}
	while (a.firstChild) {
		a.removeChild(a.firstChild);
	}

	var p1 = document.createElement('p');
	p1.textContent = account.name;
	var p2 = document.createElement('p');
	p2.textContent = account.url;

	a.appendChild(p1);
	a.appendChild(p2);
}









function checkCardDAV(account) {
	CardDAV.openAccount(account);
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
