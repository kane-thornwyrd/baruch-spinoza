// VERY VERY crude way to manage async deps...
var ULTRASTART = Date.now();
var libLoad = function libLoad(libs){
  var rootScript = document.getElementsByTagName('script')[0];
  var loaded = [], mainDeps = [], mainLoad, main;

  var hasDependencies = function hasDependencies(lib){
    return !(typeof lib.dependOn === 'undefined' || lib.dependOn.length <= 0);
  };

  var resolvingCallback = function resolvingCallback(lib){
    return function libLoaded(){
      console.log(lib.name, 'took',  Date.now() - lib.loadStart + 'ms via', lib.src);
      lib.loaded = true;
      loaded.push(lib.name);
      reloadLibs(libs);
      tryMainLoad(main);
    };
  };

  var load = function load(lib){
    if(typeof lib.loaded === 'undefined' || !lib.loaded){
      lib.loadStart = Date.now();
      rootScript.parentNode.insertBefore(lib.el, rootScript);
    }
    return lib;
  };

  var allDependenciesMet = function allDependenciesMet(deps){
    var okay = true;
    for (var i = deps.length - 1; i >= 0; i--) {
      okay &= (loaded.indexOf(deps[i]) === -1) !== true;
    }
    return okay;
  };

  var reloadLibs = function reloadLibs(libs){
    for( var libKey in libs){
      if(
        libs.hasOwnProperty(libKey) &&
        hasDependencies(libs[libKey]) &&
        allDependenciesMet(libs[libKey].dependOn)
      ){
        load(libs[libKey]);
      }
    }
  };

  for( var libKey in libs){
    if(libs.hasOwnProperty(libKey)){
      mainDeps.push(libKey);
      var lib = libs[libKey];
      var el = document.createElement('script');
      el.src = libs[libKey].src;
      el.type = 'text/javascript';
      el.async = 'true';
      el.defer = 'true';
      el.onload = resolvingCallback(lib);
      lib.el = el;
      lib.name = libKey;
      console.log('Dependencies',libKey, mainDeps);
      if( !hasDependencies(lib) ){
        load(lib);
      }else{
        if(allDependenciesMet(lib.dependOn)){ load(lib); }
      }
    }
  }

  var tryMainLoad = function tryMainLoad(main, interval){
    if(typeof interval === 'undefined'){ interval = {ID:0}; }
    if(allDependenciesMet(mainDeps)){
      main.call(window);
    }
    return clearInterval(interval.ID);
  };

  return function libsLoaded(cb){
    var retry = {ID:0};
    main = cb;
    // retry.ID = setInterval(tryMainLoad, 100, cb, retry);
    retry.ID = tryMainLoad(cb, retry);
  };
};

libLoad({
  jquery      : {
    // src: 'https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js'
    src: 'https://cdn.jsdelivr.net/jquery/2.1.4/jquery.min.js'
    // src: 'https://code.jquery.com/jquery-2.1.4.min.js'
  },
  underscore  : {
    // src: 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore.js'
    src: 'https://cdn.jsdelivr.net/underscorejs/1.8.3/underscore-min.js'
  },
  backbone    : {
    // src: 'https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.2.1/backbone.min.js',
    src: 'https://cdn.jsdelivr.net/backbonejs/1.2.1/backbone-min.js',
    dependOn: ['jquery', 'underscore']
  },
  marionette  : {
    // src: 'https://cdnjs.cloudflare.com/ajax/libs/backbone.marionette/2.4.2/backbone.marionette.js',
    src: 'https://cdn.jsdelivr.net/backbone.marionette/2.4.2/backbone.marionette.min.js',
    dependOn: ['backbone']
  }
})(function libLoadedCallback(){
var Marionette = Backbone.Marionette;

var baruchSpinoza = {
  Models : {},
  Collections : {},
  Views : {}
};
