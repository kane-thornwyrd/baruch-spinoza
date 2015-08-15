var APIs = [
  {
    request: 'get:books',
    url: "http://henri-potier.xebia.fr/books"
  }
];


var dataRadio = Backbone.Wreqr.radio.channel('data');

var
  _generateAJAXRequest = function _generateAJAXRequest(request, url, options){
    return function(){
      return $.ajax(
        url,
        _.extend({
          accepts: ['text/json'],
          cache: true,
          dataType: 'json',
          ifModified: true,
          complete: function(jqXHR, status, errorThrown){
            Backbone.Wreqr.radio.channel('data').vent.trigger(status, request, jqXHR.responseJSON, jqXHR);
          }
        }, options)
      );
    };
  },
  _setHandler = function _setHandler(conf){
    if(_.isArray(conf.request)){
      for (var _j = 0, _rlen = conf.request.length; _j < _rlen; _j++) {
        if(typeof conf.response === 'undefined'){
          if( typeof conf.url !== 'undefined' ){
            dataRadio.reqres.setHandler(conf.request[_j], _generateAJAXRequest(conf.request[_j], conf.url));
          }
        } else {
          dataRadio.reqres.setHandler(conf.request[_j], conf.response);
        }
      }
    }else{
      dataRadio.reqres.setHandler(conf.request, _generateAJAXRequest(conf.request, conf.url));
    }
  }
;

_.each(APIs, _setHandler);
