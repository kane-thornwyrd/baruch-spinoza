var ULTRASTART = Date.now();

var libLoad = function libLoad(libs) {
  var rootScript = document.getElementsByTagName("script")[0];
  var loaded = [], mainDeps = [], mainLoad, main;
  var hasDependencies = function hasDependencies(lib) {
    return !(typeof lib.dependOn === "undefined" || lib.dependOn.length <= 0);
  };
  var resolvingCallback = function resolvingCallback(lib) {
    return function libLoaded() {
      console.log(lib.name, "took", Date.now() - lib.loadStart + "ms via", lib.src);
      lib.loaded = true;
      loaded.push(lib.name);
      reloadLibs(libs);
      tryMainLoad(main);
    };
  };
  var load = function load(lib) {
    if (typeof lib.loaded === "undefined" || !lib.loaded) {
      lib.loadStart = Date.now();
      rootScript.parentNode.insertBefore(lib.el, rootScript);
    }
    return lib;
  };
  var allDependenciesMet = function allDependenciesMet(deps) {
    var okay = true;
    for (var i = deps.length - 1; i >= 0; i--) {
      okay &= loaded.indexOf(deps[i]) === -1 !== true;
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
      console.log("Dependencies", libKey, mainDeps);
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
    return clearInterval(interval.ID);
  };
  return function libsLoaded(cb) {
    var retry = {
      "ID": 0
    };
    main = cb;
    retry.ID = tryMainLoad(cb, retry);
  };
};

libLoad({
  "jquery": {
    "src": "https://cdn.jsdelivr.net/jquery/2.1.4/jquery.min.js"
  },
  "underscore": {
    "src": "https://cdn.jsdelivr.net/underscorejs/1.8.3/underscore-min.js"
  },
  "backbone": {
    "src": "https://cdn.jsdelivr.net/backbonejs/1.2.1/backbone-min.js",
    "dependOn": [ "jquery", "underscore" ]
  },
  "marionette": {
    "src": "https://cdn.jsdelivr.net/backbone.marionette/2.4.2/backbone.marionette.min.js",
    "dependOn": [ "backbone" ]
  }
})(function libLoadedCallback() {
  var Marionette = Backbone.Marionette;
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
  var APIs = [ {
    "request": "get:books",
    "url": "http://henri-potier.xebia.fr/books"
  } ];
  var dataRadio = Backbone.Wreqr.radio.channel("data");
  var _generateAJAXRequest = function _generateAJAXRequest(request, url, options) {
    return function() {
      return $.ajax(url, _.extend({
        "accepts": [ "text/json" ],
        "cache": true,
        "dataType": "json",
        "ifModified": true,
        "complete": function(jqXHR, status, errorThrown) {
          Backbone.Wreqr.radio.channel("data").vent.trigger(status, request, jqXHR.responseJSON, jqXHR);
        }
      }, options));
    };
  }, _setHandler = function _setHandler(conf) {
    if (_.isArray(conf.request)) {
      for (var _j = 0, _rlen = conf.request.length; _j < _rlen; _j++) {
        if (typeof conf.response === "undefined") {
          if (typeof conf.url !== "undefined") {
            dataRadio.reqres.setHandler(conf.request[_j], _generateAJAXRequest(conf.request[_j], conf.url));
          }
        } else {
          dataRadio.reqres.setHandler(conf.request[_j], conf.response);
        }
      }
    } else {
      dataRadio.reqres.setHandler(conf.request, _generateAJAXRequest(conf.request, conf.url));
    }
  };
  _.each(APIs, _setHandler);
  var BaruchSpinozaBooks = Marionette.Application.extend({
    "regions": {
      "header": ".site-header",
      "mainContainer": ".main-container"
    },
    "defaults": {},
    "initialize": function applicationInitialize(options) {
      this.options = _.extend({}, this.defaults, options);
      domReady(_.bind(function() {
        this.vent.trigger("domReady", this);
      }, this));
      console.log("App initialized");
      return this.listen();
    },
    "listen": function appListen() {
      this.on("start", function() {
        console.log("START");
        this.vent.on("domReady", function() {
          try {
            Backbone.history.start({
              "pushState": true
            });
            console.log("BACKBONE HISTORY RUNNING…");
          } catch (e) {
            console.log(e);
          }
        });
      });
      return this;
    }
  });
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
  baruchSpinoza.Views.BookCard = Marionette.ItemView.extend({
    "template": "#bookCard",
    "initialize": function bookViewInitialize() {
      var globalCh = Backbone.Wreqr.radio.channel("global");
      console.log("globalCh", globalCh);
      globalCh.vent.on("domReady", this.ping);
    },
    "ping": function() {
      console.log("PING !");
    }
  });
  baruchSpinoza.Views.common = Marionette.ItemView.extend(Backbone.Model.extend({
    "super": baruchSpinoza.Views.common,
    "constructor": function commonItemViewConstructor(options) {
      Marionette.ItemView.apply(this, arguments);
    }
  }));
  new BaruchSpinozaBooks({
    "container": "body"
  }).start();
  Backbone.Wreqr.radio.channel("data").vent.on("success", function(req, res) {
    if (req === "get:books") {
      console.log("GET BOOKS !", arguments);
    }
  });
  Backbone.Wreqr.radio.channel("data").reqres.request("get:books");
});