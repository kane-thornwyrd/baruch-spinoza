var libLoad = function libLoad(libs) {
  var rootScript = document.getElementsByTagName("script")[0];
  var loaded = [], mainDeps = [], mainLoad, main;
  var hasDependencies = function hasDependencies(lib) {
    return !(typeof lib.dependOn === "undefined" || lib.dependOn.length <= 0);
  };
  var resolvingCallback = function resolvingCallback(lib) {
    return function libLoaded() {
      lib.loaded = true;
      loaded.push(lib.name);
      reloadLibs(libs);
      tryMainLoad(main);
    };
  };
  var load = function load(lib) {
    if (typeof lib.loaded === "undefined" || !lib.loaded) {
      rootScript.parentNode.insertBefore(lib.el, rootScript);
    }
    return lib;
  };
  var allDependenciesMet = function allDependenciesMet(deps) {
    var okay = true;
    for (var i = deps.length - 1; i >= 0; i--) {
      okay = okay && !(loaded.indexOf(deps[i]) === -1);
    }
    return okay;
  };
  var reloadLibs = function reloadLibs(libs) {
    for (var libKey in libs) {
      if (libs.hasOwnProperty(libKey) && hasDependencies(libs[libKey]) && allDependenciesMet(libs[libKey].dependOn)) {
        load(libs[libKey]);
      }
    }
  };
  for (var libKey in libs) {
    if (libs.hasOwnProperty(libKey)) {
      mainDeps.push(libKey);
      var lib = libs[libKey];
      var el = document.createElement("script");
      el.src = libs[libKey].src;
      el.type = "text/javascript";
      el.async = "true";
      el.defer = "true";
      el.onload = resolvingCallback(lib);
      lib.el = el;
      lib.name = libKey;
      if (!hasDependencies(lib)) {
        load(lib);
      } else {
        if (allDependenciesMet(lib.dependOn)) {
          load(lib);
        }
      }
    }
  }
  var tryMainLoad = function tryMainLoad(main, interval) {
    if (typeof interval === "undefined") {
      interval = {
        "ID": 0
      };
    }
    if (allDependenciesMet(mainDeps)) {
      main.call(window);
    }
    clearInterval(interval.ID);
  };
  return function libsLoaded(cb) {
    var retry = {
      "ID": 0
    };
    main = cb;
    retry.ID = setInterval(tryMainLoad, 100, cb, retry);
  };
};

libLoad({
  "jquery": {
    "src": "https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"
  },
  "underscore": {
    "src": "https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore.js"
  },
  "backbone": {
    "src": "https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.2.1/backbone-min.js",
    "dependOn": [ "jquery", "underscore" ]
  },
  "marionette": {
    "src": "https://cdnjs.cloudflare.com/ajax/libs/backbone.marionette/2.4.2/backbone.marionette.min.js",
    "dependOn": [ "backbone" ]
  },
  "materialize": {
    "src": "https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.0/js/materialize.min.js",
    "dependOn": [ "jquery" ]
  }
})(function libLoadedCallback() {
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
    "tagName": "ul",
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
});