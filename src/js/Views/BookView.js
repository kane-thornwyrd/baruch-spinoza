baruchSpinoza.Views.BookCard = Marionette.ItemView.extend({
  template: '#bookCard',
  initialize: function bookViewInitialize(){
    var globalCh = Backbone.Wreqr.radio.channel('global');
    console.log('globalCh',globalCh);
    globalCh.vent.on('domReady', this.ping);
  },
  ping: function(){
    console.log('PING !');
  }
});
