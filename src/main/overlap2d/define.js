// Generated by CoffeeScript 1.10.0

/*
 * AMD Module library self loader
 *
 * @param global window object
 * @param modules preloaded cache entries
 *
 */
var define;

define = (function(global, modules) {

  /*
   *  require module
   *
   * load from cache, fallback to global require 
   * 
   * @param name
   * @returns module exports reference
   */
  var require;
  require = function(name) {
    if (modules[name] != null) {
      return modules[name].exports;
    } else {
      return global != null ? global.require(name) : void 0;
    }
  };

  /*
   *  define module
   * 
   * @param name of module
   * @param deps for module
   * @param callback to the module cide itself
   */
  define = function(name, deps, callback) {
    var args;
    modules[name] = {
      id: name,
      exports: {}
    };
    args = [require, modules[name].exports];
    deps.slice(2).forEach(function(dep) {
      return args.push(modules[dep].exports);
    });
    callback.apply(modules[name].exports, args);
  };

  /*
   *  export to the global namespace
   * 
   * @param name
   * @param exports
   */
  define.global = function(name, exports) {
    return global[name] = exports;
  };

  /*
   *  register a module from code
   * 
   * @param name
   * @param exports
   */
  define.register = function(name, exports) {
    return modules[name] = {
      id: name,
      exports: {}
    };
  };

  /*
   * allow cache chaining with the next library
   */
  define.env = modules;
  return define;
})(this, (define != null ? define.env : void 0) || {});
