define(function(){
  'use strict';

	var MozContactConnector = (function(){

    function deleteAll(){
      return new Promise(function(resolve, reject){
        var request = window.navigator.mozContacts.clear();
        request.onsuccess = function () {
          resolve();
        };
        request.onerror = function (error) {
          reject(error);
        };
      });
    }

    return {
      deleteAll: deleteAll
    };

  })();

	return MozContactConnector;
});
