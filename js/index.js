var ULTRASTART = Date.now();

var libLoad = function libLoad(libs) {
  "use strict";
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
  }
})(function libLoadedCallback() {
  "use strict";
  $(function() {
    $("html").removeClass("no-js").addClass("js");
    _.templateSettings = {
      "interpolate": /\{\{= (.+?)\}\}/g,
      "escape": /\{\{!(.+?)\}\}/g,
      "evaluate": /\{\{(.+?)\s\}\}/g
    };
    (function(t, e) {
      "use strict";
      var n = {
        "pulses": 1,
        "interval": 0,
        "returnDelay": 0,
        "duration": 500
      };
      t.fn.pulse = function(u, a, r) {
        var i = "destroy" === u;
        return "function" == typeof a && (r = a, a = {}), a = t.extend({}, n, a), a.interval >= 0 || (a.interval = 0), 
        a.returnDelay >= 0 || (a.returnDelay = 0), a.duration >= 0 || (a.duration = 500), 
        a.pulses >= -1 || (a.pulses = 1), "function" != typeof r && (r = function() {}), 
        this.each(function() {
          function n() {
            return void 0 === s.data("pulse") || s.data("pulse").stop ? void 0 : a.pulses > -1 && ++p > a.pulses ? r.apply(s) : (s.animate(u, f), 
            void 0);
          }
          var o, s = t(this), l = {}, d = s.data("pulse") || {};
          d.stop = i, s.data("pulse", d);
          for (o in u) {
            u.hasOwnProperty(o) && (l[o] = s.css(o));
          }
          var p = 0, c = t.extend({}, a);
          c.duration = a.duration / 2, c.complete = function() {
            e.setTimeout(n, a.interval);
          };
          var f = t.extend({}, a);
          f.duration = a.duration / 2, f.complete = function() {
            e.setTimeout(function() {
              s.animate(l, c);
            }, a.returnDelay);
          }, n();
        });
      };
    })(jQuery, window, document);
    /*
 * pluginMaker
 * Easy jQuery plugin registering.
 *
 * @module pluginMaker
 *
 * Copyright (c) 2014 Jean-cédric Thérond - Cellfish Media France
 * Proprietary Software.
 */
    $.pluginMaker = $.pluginMaker || function(Plugin) {
      $.fn[Plugin.prototype.meta.name] = function(options) {
        var args = $.makeArray(arguments), after = args.slice(1);
        return this.each(function() {
          var instance = $.data(this, "_" + Plugin.prototype.meta.name);
          if (instance) {
            if (typeof options === "string") {
              instance[options].apply(instance, after);
            } else {
              if (instance.update) {
                instance.update.apply(instance, args);
              }
            }
          } else {
            var def = Plugin.prototype.defaultConf;
            if (def) {
              options = $.extend(true, {}, def, options);
            }
            var $this = $(this).addClass(Plugin.prototype.meta.name);
            instance = new Plugin($this, options);
            $this.data("_" + Plugin.prototype.meta.name, instance);
            if (instance.teardown) {
              $this.bind("destroyed", $.proxy(instance.teardown, instance));
            } else {
              $this.one("destroyed", function() {
                $this.removeData("_" + Plugin.prototype.meta.name, instance).removeClass(Plugin.prototype.meta.name);
              });
            }
          }
        });
      };
      return $.fn[Plugin.prototype.meta.name];
    };
    var ShoppingCart = function ShoppingCart($el, options) {
      "use strict";
      this.attr = _.extend({}, this.defaults, options);
      this.attr.commercialBackendRequestTemplate = _.template(_.template(this.attr.commercialBackendRequestTemplate)({
        "algorithm": ShoppingCart.prototype.isbnConcatAlgorithms[this.attr.isbnConcatAlgorithms]()
      }));
      this.attr.$el = $el;
      this.counter = $('<span class="item-count hide"></span>');
      this.attr.$el.append(this.counter);
      return this.listen();
    };
    _.extend(ShoppingCart.prototype, {
      "meta": {
        "name": "ShoppingCart"
      },
      "defaults": {
        "cart": [],
        "indexKey": "isbn",
        "isbnConcatAlgorithms": "single",
        "commercialBackendRequestTemplate": "http://henri-potier.xebia.fr/books/{{= algorithm }}/commercialOffers",
        "cartView": undefined
      },
      "availableISBNConcatAlgorithms": [ "single", "multiple" ],
      "listen": function shoppingCartListen() {
        "use strict";
        this.cartViewState = !this.attr.cartView.hasClass("hide");
        var cartToggleCB = _.partial(this.cartButtonCallback, this);
        this.attr.cartView.on("click", ".close", cartToggleCB);
        this.attr.$el.on("click", cartToggleCB);
        return this;
      },
      "cartButtonCallback": function shoppingCartCartButtonCallback(ctx, e) {
        "use strict";
        e.preventDefault();
        e.stopPropagation();
        if (ctx.cartViewState) {
          ctx.hideCart();
        } else {
          ctx.showCart();
        }
      },
      "showCart": function shoppingCartShowCart() {
        "use strict";
        this.attr.cartView.slideUp().removeClass("hide");
        this.cartViewState = true;
      },
      "hideCart": function shoppingCartHideCart() {
        "use strict";
        this.attr.cartView.slideDown().addClass("hide");
        this.cartViewState = false;
      },
      "isbnConcatAlgorithms": {
        "single": function singleIsbnConcatAlgorithm() {
          "use strict";
          return "{{= _.pluck(books, 'isbn').join(',') }}";
        },
        "multiple": function singleIsbnConcatAlgorithm() {
          "use strict";
          var helper = "var algo = function concatAlgo(books){" + "var book, i, isbns=[], len, y;" + "_.each(books, function(book){_(book.quantity).times(function(n){isbns.push(book.isbn);});});" + "return isbns.join(',');" + "};";
          return "{{" + helper + "}}{{= algo(books) }}";
        }
      },
      "push": function shoppingCartPush(input) {
        "use strict";
        if (_.isArray(input)) {
          for (var book in input) {
            if (input.hasOwnProperty(book)) {
              this.push(book);
            }
          }
        } else {
          var alreadyInCart = this.itemAlreadyInCart(input);
          var _self = this;
          if (!alreadyInCart) {
            alreadyInCart = _.extend({
              "quantity": 0,
              "addOne": function itemAddOne() {
                alreadyInCart.quantity++;
                _self.increaseCounter.call(_self);
              }
            }, input);
            this.attr.cart.push(alreadyInCart);
          }
          alreadyInCart.addOne();
        }
      },
      "getItemsAmount": function shoppingCartGetItemsAmount() {
        "use strict";
        return _.reduce(_.pluck(this.attr.cart, "quantity"), function(m, v) {
          return m + v;
        });
      },
      "increaseCounter": function shoppingCartIncreaseCounter(amount) {
        "use strict";
        amount = amount || 1;
        var prev = this.counter.data("amount") || 0;
        this.counter.data("amount", prev + amount);
        return this.refreshCounter();
      },
      "decreaseCounter": function shoppingCartDecreaseCounter(amount) {
        "use strict";
        amount = amount || 1;
        var prev = this.counter.data("amount") || 0;
        this.counter.data("amount", prev - amount);
        return this.refreshCounter();
      },
      "resetCounter": function shoppingCartresetCounter() {
        "use strict";
        this.counter.data("amount", 0);
        return this.refreshCounter();
      },
      "refreshCounter": function shoppingCartrefreshCounter() {
        "use strict";
        var amount = this.counter.data("amount") || this.getItemsAmount();
        this.counter.html(amount);
        if (amount) {
          this.counter.removeClass("hide");
        } else {
          this.counter.addClass("hide");
        }
        return this;
      },
      "itemAlreadyInCart": function shoppingCartItemAlreadyInCart(item) {
        "use strict";
        var select = {};
        select[this.attr.indexKey] = item[this.attr.indexKey];
        return this.get(select);
      },
      "get": function shoppingCartGet(select) {
        "use strict";
        return _.findWhere(this.attr.cart, select) || false;
      },
      "askPrice": function shoppingCartAskPrice() {
        "use strict";
        console.log(this.attr.commercialBackendRequestTemplate({
          "books": this.attr.cart
        }));
      }
    });
    $.pluginMaker(ShoppingCart);
    var books = $.ajax("http://henri-potier.xebia.fr/books"), shoppingCart = $("#shoppingCartAccess").ShoppingCart({
      "cartView": $("#cart")
    }).data("_ShoppingCart"), TPLs = {
      "bookFullTpl": _.template(window.bookFull.innerHTML),
      "booksTpl": _.template(window.books.innerHTML)
    }, $mainContainer = $(".main-container"), $loader = $(".loader");
    var addingCallback = function addingCallback(e) {
      "use strict";
      e.preventDefault();
      e.stopPropagation();
      var $this = $(this);
      var book = _.findWhere(books, {
        "isbn": $this.data("isbn")
      });
      shoppingCart.push(book);
      setTimeout(function() {
        $this.blur();
      }, 10);
    };
    books.done(function(data, textStatus, jqXHR) {
      "use strict";
      books = data;
      $mainContainer.append(TPLs.booksTpl({
        "books": books,
        "bookTpl": TPLs.bookFullTpl
      })).find("button.add").on("click", addingCallback);
    });
    books.fail(function(jqXHR, textStatus, error) {
      "use strict";
      $mainContainer.append(booksTpl());
    });
    books.always(function() {
      "use strict";
      $loader.hide();
    });
  });
});