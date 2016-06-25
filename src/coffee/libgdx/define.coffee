###
 * AMD Module self loader
 * fallback to global require
 *
###
define = do (global = this, modules = define?.env || {} ) ->

    ###
     *  require module
     *
     * shims for late loading globals
     * fallback to global require 
     * 
     * @param name
     * @returns module reference for name
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
     *  define,global
     * 
     * @param name
     * @param module
    ###
    define.global = (name, module) ->
        global[name] = module

    ###
     *  define,register
     * 
     * @param name
     * @param exports
    ###
    define.register = (name, exports) ->
        modules[name] = id: name, exports: {}

    define.env = modules

    define



