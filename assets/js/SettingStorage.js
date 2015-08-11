'use strict';

var SettingStorage = (function SettingStorage() {
	var default_setting = { 
		'wipe': false,
		'interval': 0	
	};
	var setting = default_setting;
	
	var storageItemName = 'mabe_sync_data';
	
	function store() {
		localStorage.setItem(storageItemName, JSON.stringify(setting));
	}
	
	function recover() {
		try {
			setting = JSON.parse(localStorage.getItem(storageItemName));
			if (!setting) {
				setting = default_setting;
			}
		}
		catch(e) {
			setting = default_setting;
		}
	}
	
	recover();
	
	return {
		getWipe: function getWipe() {
			return setting.wipe;
		},
		setWipe: function setWipe(wipe) {
			if (wipe['constructor'] === Boolean) {
				setting.wipe = wipe;
				store();
			}
		},
		getInterval: function getInterval() {
			return setting.interval;
		},
		setInterval: function setInterval(interval) {
			if (interval['constructor'] === Number) {
				setting.interval = interval;
				store();
			}
		}
	}
})();