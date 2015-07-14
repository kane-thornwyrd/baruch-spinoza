baruchSpinoza.Views.Book = Backbone.View.extend({
  tagName: 'section',
  template: _.template('<section><img src="<%= cover %>" /><h1><%= title %> - <%= author %></h1><p><em><%= price %></em><small><%= isbn %></small></p></section>'),
  className: 'book',
  initialize: function bookViewInitialize(){
    this.listen(this.model, 'change', this.render);
    this.render();
  },
  render: function bookViewRender(){
    var self = this;
      self.$el.html(self.template(self.model.toJSON()));
  }
});
