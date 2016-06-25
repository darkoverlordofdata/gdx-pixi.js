###
 * AMD Module library self loader
 *
 * @param global window object
 * @param modules preloaded cache entries
 *
###
define = do (global = this, modules = define?.env || {} ) ->

    ###
     *  require module
     *
     * load from cache, fallback to global require 
     * 
     * @param name
     * @returns module exports reference
    ###
    require = (name) -> 
        if modules[name]? then modules[name].exports else global?.require(name)

    ###
     *  define module
     * 
     * @param name of module
     * @param deps for module
     * @param callback to the module cide itself
    ###
    define = (name, deps, callback) ->
        modules[name] = id: name, exports: {}
        args = [require, modules[name].exports]
        deps.slice(2).forEach (dep) -> 
            args.push(modules[dep].exports)

        callback.apply modules[name].exports, args
        return

    ###
     *  export to the global namespace
     * 
     * @param name
     * @param exports
    ###
    define.global = (name, exports) ->
        global[name] = exports

    ###
     *  register a module from code
     * 
     * @param name
     * @param exports
    ###
    define.register = (name, exports) ->
        modules[name] = id: name, exports: {}

    ###
     * allow cache chaining with the next library
    ###
    define.env = modules

    define



