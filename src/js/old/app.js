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
