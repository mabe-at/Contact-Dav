/**
	 * MozContact.additionalName 	string array
	 * MozContact.adr				AddressField object array
	 * 									type			string ("home", "work", ...)
	 * 									pref			bool
	 * 									streetAddress	string
	 * 									locality		string (city)
	 * 									region			string
	 * 									postalCode		string
	 * 									countryName		string
	 * MozContact.anniversary		date
	 * MozContact.bday				date
	 * MozContact.category			string array
	 * MozContact.email				ContactField object array
	 * 									type			string ("home", "work", ...)
	 * 									pref			bool
	 * 									value			string (email)
	 * MozContact.familyName		string array
	 * MozContact.genderIdentity	string
	 * MozContact.givenName			string array
	 * MozContact.honorificPrefix	string array
	 * MozContact.honorificSuffix	string array
	 * MozContact.id				string ro
	 * MozContact.impp				ContactField object array
	 * 									type			string ("home", "work", ...)
	 * 									pref			bool
	 * 									value			string (impp address)
	 * MozContact.jobTitle			string array
	 * MozContact.key				string array (e.g. pgp-public-key)
	 * MozContact.name				string array (vcard fn)
	 * MozContact.nickname			string array
	 * MozContact.note				string array
	 * MozContact.org				string array
	 * MozContact.photo				blob array
	 * MozContact.published			date ro
	 * MozContact.sex				string
	 * MozContact.tel				TelField object array
	 * 									type			string ("home", "work", ...)
	 * 									pref			bool
	 * 									value			string (phone number)
	 * 									carrier			string (?)
	 * MozContact.updated			date ro
	 */

	 /**
	  * vCard
	  * ADR		value
	  * 			the post office box;
	  * 			the extended address (e.g., apartment or suite number);
	  * 			the street address;
	  * 			the locality (e.g., city);
	  * 			the region (e.g., state or province);
	  * 			the postal code;
	  * 			the country name (full name in the language specified in Section 5.1).
	  */

var ContactHandler = (function ContactHandler() {

	function mergeContact(vcard, person) {
		if (vcard.hasOwnProperty('fn')) {
			person.name = [vcard.fn];
		}
		if (vcard.hasOwnProperty('n')) {
			if (vcard.n.hasOwnProperty('given-name')) {
				person.givenName = vcard.n['given-name'];
			}
			if (vcard.n.hasOwnProperty('family-name')) {
				person.familyName = vcard.n['family-name'];
			}
			if (vcard.n.hasOwnProperty('honorific-prefix')) {
				person.honorificPrefix = vcard.n['honorific-prefix'];
			}
			if (vcard.n.hasOwnProperty('honorific-suffix')) {
				person.honorificSuffix = vcard.n['honorific-suffix'];
			}
			if (vcard.n.hasOwnProperty('additional-name')) {
				person.additionalName = vcard.n['additional-name'];
			}
		}
		if (vcard.hasOwnProperty('tel')) {
			//if (!person.tel) {
				person.tel = [];
			//}
			for(var vtelid in vcard.tel) {
				var vtel = vcard.tel[vtelid];
				var tel = {};
				tel.pref = vtel.pref;
				tel.value = vtel.value;
				if (isArray(vtel.type)) {
					tel.type = vtel.type;
				}
				tel.carrier = null;
				person.tel.push(tel);
			}
		}
		if (vcard.hasOwnProperty('email')) {
			person.email = [];
			for(var vemailid in vcard.email) {
				var vemail = vcard.email[vemailid];
				var email = {};
				email.pref = vemail.pref;
				email.value = vemail.value;
				if (isArray(vemail.type)) {
					email.type = vemail.type;
				}
				person.email.push(email);
			}
		}
		if (vcard.hasOwnProperty('url')) {
			person.url = [];
			for(var vurlid in vcard.url) {
				var vurl = vcard.url[vurlid];
				var url = {};
				url.pref = vurl.pref;
				url.value = vurl.value;
				if (isArray(vurl.type)) {
					url.type = vurl.type;
				}
				person.url.push(url);
			}
		}
		if (vcard.hasOwnProperty('adr')) {
			person.adr = [];
			for(var vadrid in vcard.adr) {
				var vadr = vcard.adr[vadrid];
				var adr = {};
				adr.pref = vadr.pref;
				var parts =  vadr.value.split(';');
				adr.streetAddress = ((parts[0] != '') ? parts[0] + ' ' : '') + parts[2] + ((parts[1] != '') ? ' ' + parts[1] : '');
				adr.locality = parts[3];
	 			adr.region = parts[4];
				adr.postalCode = parts[5];
				adr.countryName = parts[6];
				//adr.value = vadr.value;
				if (isArray(vadr.type)) {
					adr.type = vadr.type;
				}
				person.adr.push(adr);
			}
		}
		if (vcard.hasOwnProperty('anniversary')) {
			person.anniversary = vcard.anniversary;
		}
		if (vcard.hasOwnProperty('bday')) {
			person.bday = vcard.bday;
		}
		if (vcard.hasOwnProperty('title')) {
			person.jobTitle = [vcard.title];
		}
		if (vcard.hasOwnProperty('nickname')) {
			person.nickname = [];
			for(var vnickid in vcard.nickname) {
				person.nickname.push(vcard.nickname[vnickid]);
			}
		}
		if (vcard.hasOwnProperty('categories')) {
			person.category = [];
			for(var vcatid in vcard.categories) {
				for(var vcatidid in vcard.categories[vcatid]) {
					person.category.push(vcard.categories[vcatid][vcatidid]);
				}
			}
		}
		if (vcard.hasOwnProperty('org')) {
			person.org = [];
			for(var vorgid in vcard.org) {
				if (vcard.org[vorgid].hasOwnProperty('organization-name')) {
					person.org.push(vcard.org[vorgid]['organization-name']);
				}
			}
		}
		if (vcard.hasOwnProperty('note')) {
			person.note = [];
			for(var vnoteid in vcard.note) {
				var cparts =  vcard.note[vnoteid].split('\\n');
				for(var cpid in cparts) {
					person.note.push(cparts[cpid]);
				}
			}
		}
		return person;
	}

	function getContact(cid, cb) {
		if (cid == undefined) {
			return cb(null, new mozContact());
		}
		var filter = {
		  filterBy: ['id'],
		  filterValue: cid,
		  filterOp: 'equals',
		  filterLimit: 1
		};
		var request = navigator.mozContacts.find(filter);
		request.onsuccess = function () {
			if (this.result.length == 1) {
				return cb(null, this.result[0]);
			}
			return cb(null, new mozContact());
		}
		request.onerror = function () {
		  return cb(this.error, new mozContact());
		}
	}

	function saveContact(vcard, cardid, cid) {
		getContact(cid, function(err, person) {
			if (err == null) {
				person = mergeContact(vcard, person);
				// save the contact
				var saving = navigator.mozContacts.save(person);
				saving.onsuccess = function() {
				  //console.log('new contact saved');
				  var obj = {};
				  obj[cardid] = person.id;
				  ContactMapStorage.set(obj);
				};
				saving.onerror = function(err) {
				  console.error(err.name + " " + person.name + " " + person.id);
				};
			}

		});
	}

	function isString(v) {
		if (v != undefined && v['constructor'] === String) {
			return true;
		}
		return false;
	}

	function isArray(v) {
		if (v != undefined && v['constructor'] === Array) {
			return true;
		}
		return false;
	}

	return {
		setContact: function setContact(vcard, book) {
			var cardid;
			var cid = undefined;
			if (vcard.uid == undefined || !vcard.uid || vcard.uid == '') {
				cardid = md5(book.href+vcard.fn+vcard.n['given-name']+vcard.n['family-name']);
			}
			else {
				cardid = md5(book.href+vcard.uid);
			}
			cid = ContactMapStorage.get(cardid);
			console.log(cid + " ... " + cardid);
			saveContact(vcard, cardid, cid);
		}
	}
})();
