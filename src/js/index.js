//= require init
//= require domReady
//= require API
//= require application
//= require_tree Models
//= require_tree Collections
//= require_tree Views
//= require_tree Routers

  // var books;
  //
  // bookRegistryRequest.then(
  //   function bookRegistryRequestSuccess(data, status, jqXHR){
  //     var books = new baruchSpinoza.Collections.Book(data);
  //     console.log('BOOKS: ', books);
  //   },
  //   function bookRegistryRequestFail(data, status, jqXHR){
  //     console.log('FAIL: ',arguments);
  //   }
  // );


(new BaruchSpinozaBooks({container: 'body'})).start();

// Backbone.Wreqr.radio.channel('data').vent.on('error', function(req, res){
//   console.log('DATA ERROR:', arguments);
// });
//
// Backbone.Wreqr.radio.channel('data').vent.on('success', function(req, res){
//   console.log('DATA SUCCESS:', arguments);
// });

// Backbone.Wreqr.radio.channel('data').reqres.request('get:books').done(function(data, status, jqXHR){
//   console.log('GET BOOKS !', data);
// });
Backbone.Wreqr.radio.channel('data').vent.on('success', function(req, res){
  // console.log('GET BOOKS !', arguments);
  if(req === 'get:books'){
    console.log('GET BOOKS !', arguments);
  }
});

Backbone.Wreqr.radio.channel('data').reqres.request('get:books');

});
