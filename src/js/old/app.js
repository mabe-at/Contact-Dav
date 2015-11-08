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
