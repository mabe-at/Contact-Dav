'use strict';

var ContactMapStorage = (function ContactMapStorage() {
	var map = {};
	var storageItemName = 'mabe_contact_map';
	
	function store() {
		localStorage.setItem(storageItemName, JSON.stringify(map));
	}
	
	function recover() {
		try {
			map = JSON.parse(localStorage.getItem(storageItemName));
			if (!map) {
				map = {};
			}
		}
		catch(e) {
			map = {};
		}
	}
	
	recover();
	
	return {
		getAllKeys: function getMapKeys() {
			return Object.keys(map);
		},
		getAll: function getMap() {
			return map;
		},
		get: function getMap(id) {
			return map[id];
		},
		set: function setMap(mapData) {
			for (var id in mapData) { 
				if (mapData.hasOwnProperty(id)) {
					map[id] = mapData[id];
				} 
			}
			store();
			//console.log(map.length);
		},
		del: function delMap(id) {
			map[id] = undefined;
			store();
		},
		delall: function delAllMap() {
			localStorage.setItem(storageItemName, null);
			recover();
		}
	}
})();