baruchSpinoza.Views.common = Marionette.ItemView.extend(Backbone.Model.extend({
  super: baruchSpinoza.Views.common,
  constructor: function commonItemViewConstructor(options){
    Marionette.ItemView.apply(this, arguments);
  }
}));
