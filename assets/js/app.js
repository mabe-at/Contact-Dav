'use strict';

// helpers
var forEach = Array.prototype.forEach;

var syncCalls = 0;
var bookCalls = 0;
var syncCount = 0;
var sync_count;

var TMP = {};

document.querySelector('#sel-sync-interval').addEventListener('change', function() {
	SettingStorage.setInterval(parseInt(this.value));
});
document.querySelector('#chk-del-contacts').addEventListener('change', function() {
	SettingStorage.setWipe(this.checked);
});

//add-account
document.querySelector('#btn-add-account').addEventListener ('click', function () {
	resetNewAccountFields();
	document.querySelector('#add-account').className = 'current';
	document.querySelector('[data-position="current"]').className = 'left';
});
document.querySelector('#action-add-account').addEventListener ('click', function () {
	resetNewAccountFields();
	document.querySelector('#add-account').className = 'current';
	document.querySelector('[data-position="current"]').className = 'left';
});
document.querySelector('#btn-add-account-back').addEventListener ('click', function () {
	document.querySelector('#add-account').className = 'right';
	document.querySelector('[data-position="current"]').className = 'current';
});

document.querySelector('#btn-find-addressbooks-cancel').addEventListener ('click', function () {
	document.querySelector('#find-addressbooks').className = 'fade-out';
	cleanTMP();
});

document.querySelector('#btn-find-addressbooks-save').addEventListener ('click', function () {
	document.querySelector('#find-addressbooks').className = 'fade-out';
	var account = TMP.account;
	var books = TMP.books;
	account.books = books;
	var aid = AccountStorage.set(account);
	if (account.id) {
		var a = document.querySelector('[data-id="'+ account.id +'"]')
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
	
	document.querySelector('.current').className = 'right';
	document.querySelector('[data-position="current"]').className = 'current';
	
	resetNewAccountFields();
	
	utils.status.show('Account saved!');
	cleanTMP();
});

// remove all accounts 
document.querySelector('#btn-remove-all-account').addEventListener ('click', function () {
  document.querySelector('#confirm-remove-all').className = 'fade-in';
});
document.querySelector('#btn-remove-all-cancel').addEventListener ('click', function () {
  document.querySelector('#confirm-remove-all').className = 'fade-out';
});
document.querySelector('#btn-account-remove-cancel').addEventListener ('click', function () {
  document.querySelector('#confirm-remove-account').className = 'fade-out';
});
document.querySelector('#btn-remove-all-confirmed').addEventListener ('click', function () {
	AccountStorage.delall();
	var l = document.querySelector('#list-accounts');
	while (l.firstChild) {
		l.removeChild(l.firstChild);
	}
  document.querySelector('#confirm-remove-all').className = 'fade-out';
  utils.status.show('All accounts removed!');
});

// about
document.querySelector('#action-about').addEventListener ('click', function () {
	resetNewAccountFields();
  document.querySelector('#about').className = 'current';
  document.querySelector('[data-position="current"]').className = 'left';
});
document.querySelector('#btn-about-back').addEventListener ('click', function () {
  document.querySelector('#about').className = 'right';
  document.querySelector('[data-position="current"]').className = 'current';
});

// edit account
document.querySelector('#btn-edit-account-back').addEventListener ('click', function () {
  document.querySelector('#edit-account').className = 'right';
  document.querySelector('[data-position="current"]').className = 'current';
});

// sync accounts
document.querySelector('#action-sync').addEventListener ('click', function () {
	document.querySelector('#sync').className = 'current';
	document.querySelector('[data-position="current"]').className = 'left';
	
	document.querySelector('#chk-del-contacts').checked = SettingStorage.getWipe();
	document.querySelector('#sel-sync-interval').value = SettingStorage.getInterval()+"";
	
	document.querySelector('#btn-sync').disabled = true;
	var accs = AccountStorage.getAll();
	for (var accId in accs) {
		if (accs[accId].sync) {
			document.querySelector('#btn-sync').disabled = false;
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
document.querySelector('#btn-sync-back').addEventListener ('click', function () {
  document.querySelector('#sync').className = 'right';
  document.querySelector('[data-position="current"]').className = 'current';
});

document.querySelector('#btn-sync').addEventListener ('click', function () {
	if (document.querySelector('#chk-del-contacts').checked) {
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
	sync_count = document.querySelector('#sync-count');
	sync_count.textContent = syncCount + "";
	document.querySelector('#sync-accounts').className = 'fade-in';
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
		document.querySelector('#sync-accounts').className = 'fade-out';
	}
}

function saveContact(vcard, book) {
	syncCount++;
	sync_count.textContent = syncCount + "";
	
	ContactHandler.setContact(vcard, book);
}

document.querySelector('#btn-account-update').addEventListener ('click', function() {
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
document.querySelector('#btn-account-remove').addEventListener ('click', function() {
	document.querySelector('#confirm-remove-account').className = 'fade-in';
});
document.querySelector('#btn-account-remove-confirmed').addEventListener ('click', function() {
	var aid = document.getElementById('edit_account_id').value;
	AccountStorage.del(aid);
	
	var listItem = document.getElementById('account-' + aid);
	var list = document.getElementById('list-accounts');
	list.removeChild(listItem);
	
	document.querySelector('#confirm-remove-account').className = 'fade-out';
	document.querySelector('#edit-account').className = 'right';
  document.querySelector('[data-position="current"]').className = 'current';
  utils.status.show('Account Removed!');
});

document.querySelector('#btn-account-save').addEventListener ('click', function () {
	var error = false;
	if (document.getElementById('new_account_name').value.trim() == '') {
		error = true;
	}
	if (document.getElementById('new_account_url').value.trim() == '') {
		error = true;
	}
	if (document.getElementById('new_account_user').value.trim() == '') {
		error = true;
	}
	if (document.getElementById('new_account_password').value.trim() == '') {
		error = true;
	}
	if (!error) {
		var account_data = {
			name: document.getElementById('new_account_name').value,
			url: document.getElementById('new_account_url').value,
			user: document.getElementById('new_account_user').value,
			password: document.getElementById('new_account_password').value,
			sync: document.getElementById('new_account_sync').checked
		};
		
		checkAdressbooks(account_data);
	}
	else {
		utils.status.show('Please fill out all fields!');
	}
});

function checkAdressbooks(account) {
	var ul = document.querySelector('#find-addressbooks ul');
	if (ul) {
		while (ul.firstChild) {
			ul.removeChild(ul.firstChild);
		}
	}
	
	document.querySelector('#find-addressbooks h1').textContent = 'Searching for Adressbooks ...';
	document.querySelector('#find-addressbooks section').style.overflow = 'hidden';
	document.querySelector('#find-addressbooks menu').style.display = 'none';
	document.querySelector('#find-addressbooks div').style.display = 'block';
	document.querySelector('#find-addressbooks').className = 'fade-in';
	try {
		CardDAV.findAddressbooks(account, saveWithBooks);
	}
	catch(e) {
		saveWithBooks(account, []);
	}
}

function saveWithBooks(account, books) {
	
	if (books.length > 0) {
		document.querySelector('#find-addressbooks menu').style.display = 'block';
		document.querySelector('#find-addressbooks div').style.display = 'none';
		document.querySelector('#find-addressbooks h1').textContent = books.length + ' ' + (books.length > 1 ? 'Adressbooks' : 'Adressbook') + ' found';
		var ul = document.querySelector('#find-addressbooks ul');
		if (ul) {
			for (var b in books) {
				var li = document.createElement('li');
				li.textContent = books[b].displayname;
				ul.appendChild(li);
			}
		}
		saveTMP('account', account);
		saveTMP('books', books);
	}
	else {
		document.querySelector('#find-addressbooks').className = 'fade-out';
		utils.status.show('No Adressbooks Found!');
	}
}

function resetNewAccountFields() {
	document.getElementById('new_account_name').value = '';
	document.getElementById('new_account_url').value = '';
	document.getElementById('new_account_user').value = '';
	document.getElementById('new_account_password').value = '';
	document.getElementById('new_account_sync').checked = true;
}

function updateAccount(account) {
	var a = document.querySelector('[data-id="'+ account.id +'"]');
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

function addAccount(account) {
		var a = document.createElement('a');
		a.href = '#';
		a.setAttribute("data-id",account.id);
		
		var p1 = document.createElement('p');
		p1.textContent = account.name;
		var p2 = document.createElement('p');
		p2.textContent = account.url;
				
		a.appendChild(p1);
		a.appendChild(p2);
		
		a.addEventListener('click', function() {
			var aid = this.getAttribute('data-id');
			var acc = AccountStorage.get(aid);
			
			document.getElementById('edit_account_name').value = acc.name;
			document.getElementById('edit_account_name').defaultValue = acc.name;
			
			document.getElementById('edit_account_url').value = acc.url;
			document.getElementById('edit_account_url').defaultValue = acc.url;
			
			document.getElementById('edit_account_user').value = acc.user;
			document.getElementById('edit_account_user').defaultValue = acc.user;
			
			document.getElementById('edit_account_password').value = acc.password;
			document.getElementById('edit_account_password').defaultValue = acc.password;
			
			if (acc.sync) {
				document.getElementById('edit_account_sync').checked = true;
			}
			else {
				document.getElementById('edit_account_sync').checked = false;
			}
			
			document.getElementById('edit_account_id').value = aid;
			
			document.querySelector('#edit-account').className = 'current';
			document.querySelector('[data-position="current"]').className = 'left';
		});
		
		var li = document.createElement('li');
		li.setAttribute("id",'account-'+account.id);
		li.appendChild(a);
		var list = document.getElementById('list-accounts');
		list.appendChild(li);
}

forEach.call(
	document.querySelectorAll('form p input + button[type="reset"], form p textarea + button[type="reset"]'), 
	function( el ) {
	el.addEventListener ('mousedown', function () {
		var field = document.querySelector('input:focus , textarea:focus');
		//field.value = field.defaultValue;
		field.value = '';
	});
});

// read and display all accounts
var accs = AccountStorage.getAll();
for (var acc in accs) {
	addAccount(accs[acc]);
}
utils.status.init();

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

function saveTMP(k, v) {
	TMP[k] = v;
}

function cleanTMP(k, v) {
	TMP = {};
}