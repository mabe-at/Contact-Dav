define(['underscore', 'promise', 'dav', 'vcard'], function (_, Es6Promise, Dav, Vcard) {
  'use strict';

  Promise = Es6Promise.Promise;

	var CardDavConnector = {

    getConnection: function getConnection(account, connectionType) {
      return {
        server: account.url,
        xhr: new Dav.transport.Basic(
          new Dav.Credentials({
            username: account.user,
            password: account.password
          })
        ),
        accountType: 'carddav',
        loadCollections: true,
        loadObjects: (connectionType === 'meta') ? false : true
      };
    },

    getMetaConnection: function getMetaConnection(account) {
      return CardDavConnector.getConnection(account, 'meta');
    },

    getAddressbooks: function getAddressbooks(accounts){
      return new Promise(function(resolve, reject) {
        var connections = _.map(accounts, CardDavConnector.getMetaConnection),
            accountPromises = _.map(connections, Dav.createAccount);

        Promise.all(accountPromises).then(function(responses){
          console.log(responses);
          var addressbooks = [];
          _.each(responses, function(response){
            _.each(response.addressBooks, function(addressBook){
              if(_.indexOf(addressBook.resourcetype, 'addressbook') !== -1){
                addressbooks.push(addressBook);
              }
            });
          });
          resolve(addressbooks);
        }).catch(function(error){
          reject(error);
        });

      });
    }

  };

	return CardDavConnector;
});



/*

Dav.createAccount({
  server: 'https://cloud.develhub.de/remote.php/carddav/addressbooks/jenst/kontakte',
  xhr: new Dav.transport.Basic(
    new Dav.Credentials({
      username: 'jenst',
      password: '17xnt5x1!Q60595025'
    })
  ),
  accountType: 'carddav',
  loadCollections: true,
  loadObjects: true
})
.then(function(account) {
  //console.log(account);
  account.addressBooks.forEach(function(addressBook) {
    addressBook.objects.forEach(function(object) {
      var contact = object.data.props.addressData;
      Vcard.VCF.parse(contact, function(vcard) {
        console.log(vcard);
      });
    });
  });
})
.catch(function(err) {
  console.error('Could not load: ', err);
});

 */







/*

var connection = this.connection,
    addressbooks = [];

callback = (typeof callback === 'function') ? callback : function() {};

connection.onready = function() {
  connection.getResource(null, function(resource, error) {
    if (resource.xml !== null && error === undefined) {
      _findBooks(resource, callback);
    }
  });
};

connection.onerror = function(error) {
  console.log(error);

  if(error === 'connection error'){
    // check internet connection & server availability, connection error
  }

  if(error === 'No valid DAV XML Response'){
    // check url or server, response invalid
  }

  callback(addressbooks);
};

connection.connect();

function _findBooks(resource, callback){
console.log(resource);
  if (resource.isCollection() === true && resource.isAddressBook() === true) {
    addressbooks.push(resource.getMetadata());
  }

  _.each(resource.getContents(), function(item){
console.log(item.type);
    if (item.type !== 'file') {
      connection.getResource(item.href, function(resource, error) {
        if (resource.xml !== null && error === undefined) {
          _findBooks(resource, callback);
        }
      });
    }
  });

  //if (bookcalls[account.url + account.user] == 0 && callback) {
    callback(addressbooks);
  //}
}

 */
