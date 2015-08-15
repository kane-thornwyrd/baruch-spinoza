var BaruchSpinozaBooks = Marionette.Application.extend({
  regions: {
    header: '.site-header',
    mainContainer: '.main-container'
  },
  defaults: {

  },
  initialize: function applicationInitialize(options){
    this.options = _.extend({}, this.defaults, options);
    domReady(_.bind(function(){ this.vent.trigger('domReady', this); }, this));
    console.log('App initialized');
    return this.listen();
  },
  listen: function appListen(){
    this.on("start", function () {
      console.log('START');
      this.vent.on('domReady', function(){
        try{
          Backbone.history.start({pushState: true});
          console.log('BACKBONE HISTORY RUNNING…');
        }catch(e){
          console.log(e);
        }
      });
    });

    return this;
  }
});
