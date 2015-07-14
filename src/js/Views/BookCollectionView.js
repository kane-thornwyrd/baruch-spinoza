baruchSpinoza.Views.BookCollection = Backbone.View.extend({
  tagName: 'ul',
  render: function bookCollectionViewRender(){
    var self = this;
    domReady(function bookCollectionViewRenderDomReady(){
      self.collection.each(function(){
        console.log('COloction: ', arguments);
      });
    });
  },
  renderBook: function bookCollectionViewRenderBook(book){
    var bookView = new baruchSpinoza.Views.Book({model: book});
  }

});
