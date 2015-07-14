var libLoad = function libLoad(libs) {
  for (var libKey in libs) {
    if (libs.hasOwnProperty(libKey)) {
      var lib = libs[libKey];
      for (var libAttr in libs[libKey]) {
        if (libs[libKey].hasOwnProperty(libAttr)) {}
      }
      var el = document.createElement("script");
    }
  }
};

var baruchSpinoza = {
  "Models": {},
  "Collections": {},
  "Views": {}
};

var domReady = function() {
  var isTop, testDiv, scrollIntervalId, isBrowser = typeof window !== "undefined" && window.document, isPageLoaded = !isBrowser, doc = isBrowser ? document : null, readyCalls = [];
  function runCallbacks(callbacks) {
    var i;
    for (i = 0; i < callbacks.length; i += 1) {
      callbacks[i](doc);
    }
  }
  function callReady() {
    var callbacks = readyCalls;
    if (isPageLoaded) {
      if (callbacks.length) {
        readyCalls = [];
        runCallbacks(callbacks);
      }
    }
  }
  function pageLoaded() {
    if (!isPageLoaded) {
      isPageLoaded = true;
      if (scrollIntervalId) {
        clearInterval(scrollIntervalId);
      }
      callReady();
    }
  }
  if (isBrowser) {
    if (document.addEventListener) {
      document.addEventListener("DOMContentLoaded", pageLoaded, false);
      window.addEventListener("load", pageLoaded, false);
    } else {
      if (window.attachEvent) {
        window.attachEvent("onload", pageLoaded);
        testDiv = document.createElement("div");
        try {
          isTop = window.frameElement === null;
        } catch (e) {}
        if (testDiv.doScroll && isTop && window.external) {
          scrollIntervalId = setInterval(function() {
            try {
              testDiv.doScroll();
              pageLoaded();
            } catch (e) {}
          }, 30);
        }
      }
    }
    if (document.readyState === "complete") {
      pageLoaded();
    }
  }
  /**
   * Registers a callback for DOM ready. If DOM is already ready, the
   * callback is called immediately.
   * @param {Function} callback
   */
  function domReady(callback) {
    if (isPageLoaded) {
      callback(doc);
    } else {
      readyCalls.push(callback);
    }
    return domReady;
  }
  domReady.version = "2.0.1";
  domReady.load = function(name, req, onLoad, config) {
    if (config.isBuild) {
      onLoad(null);
    } else {
      domReady(onLoad);
    }
  };
  return domReady;
}();

baruchSpinoza.Models.Book = Backbone.Model.extend({
  "defaults": {
    "isbn": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "title": "default title",
    "author": "Jeanne Catherine Rangeant",
    "price": 0,
    "cover": "http://placekitten.com/g/200/300"
  }
});

baruchSpinoza.Collections.Book = Backbone.Collection.extend({
  "model": baruchSpinoza.Models.Book
});

baruchSpinoza.Views.BookCollection = Backbone.View.extend({
  "tagName": "div",
  "render": function bookCollectionViewRender() {
    var self = this;
    domReady(function bookCollectionViewRenderDomReady() {
      self.collection.each(function() {
        console.log("COloction: ", arguments);
      });
    });
  },
  "renderBook": function bookCollectionViewRenderBook(book) {
    var bookView = new baruchSpinoza.Views.Book({
      "model": book
    });
  }
});

baruchSpinoza.Views.Book = Backbone.View.extend({
  "tagName": "section",
  "template": _.template('<section><img src="<%= cover %>" /><h1><%= title %> - <%= author %></h1><p><em><%= price %></em><small><%= isbn %></small></p></section>'),
  "className": "book",
  "initialize": function bookViewInitialize() {
    this.listen(this.model, "change", this.render);
    this.render();
  },
  "render": function bookViewRender() {
    var self = this;
    self.$el.html(self.template(self.model.toJSON()));
  }
});

var conf = {
  "bookRegistry": {
    "url": "http://henri-potier.xebia.fr/books",
    "settings": {
      "accepts": [ "text/json" ],
      "cache": false,
      "dataType": "json",
      "ifModified": true
    }
  }
};

domReady(function() {
  $(".button-collapse").sideNav();
  $(".main-loader").addClass("hidden").hide();
});

var bookRegistryRequest = $.ajax(conf.bookRegistry.url, conf.bookRegistry.settings);

var books;

bookRegistryRequest.then(function bookRegistryRequestSuccess(data, status, jqXHR) {
  var books = new baruchSpinoza.Collections.Book(data);
  console.log("BOOKS: ", books);
}, function bookRegistryRequestFail(data, status, jqXHR) {
  console.log("FAIL: ", arguments);
});