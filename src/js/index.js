//= require init
//= require domReady
//= require_tree Models
//= require_tree Collections
//= require_tree Views
//= require_tree Routers

var conf = {
  bookRegistry: {
    url: "http://henri-potier.xebia.fr/books",
    settings: {
      accepts: ['text/json'],
      cache: false,
      dataType: 'json',
      ifModified: true
    }
  }
};

var bookRegistryRequest = $.ajax(conf.bookRegistry.url, conf.bookRegistry.settings);
var books;

bookRegistryRequest.then(
  function bookRegistryRequestSuccess(data, status, jqXHR){
    domReady(function(){
      $(".button-collapse").sideNav();
      $('.main-loader').addClass('hidden');
    });
    var books = new baruchSpinoza.Collections.Book(data);
  },
  function bookRegistryRequestFail(data, status, jqXHR){
    console.log('FAIL: ',arguments);
  }
);

