define(['lodash', 'dav', 'vcard'], function (_, Dav, Vcard){
  'use strict';

	var CardDavConnector = (function(){

    function getConnection(account, connectionType){
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
        loadObjects: (connectionType === 'load-objects') ? true : false
      };
    }

    function getAddressbooks(accounts, connectionType){
      return new Promise(function(resolve, reject){

        var connections = _.map(accounts, function(account){
              return getConnection(account, connectionType);
            }),
            accountPromises = _.map(connections, Dav.createAccount);

        Promise.all(accountPromises).then(function(responses){
          var addressbooks = [];
          _.each(responses, function(response){
            _.each(response.addressBooks, function(addressBook){
              var accountPath = response.server.split('//')[1],
                  isAddressBook = _.includes(addressBook.resourcetype, 'addressbook');
              if(isAddressBook === true && addressBook.url.search(accountPath) !== -1){
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

    function getContacts(accounts){
      return new Promise(function(resolve, reject){
        getAddressbooks(accounts, 'load-objects')
          .then(function(addressbooks){

            var contacts = [];
            addressbooks.forEach(function(addressBook){
              addressBook.objects.forEach(function(object){
                var contact = object.data.props.addressData;
                Vcard.parse(contact, function(vcard){
                  // TODO remove objectUrl if not needed in ContactHandler
                  vcard.objectUrl = object.url;
                  contacts.push(vcard);
                });
              });
            });
            resolve(contacts);

          })
          .catch(function(error){
            reject(error);
          });
      });
    }

    return {
      getAddressbooks: getAddressbooks,
      getContacts: getContacts
    };

  })();

	return CardDavConnector;
});
