/**
 * AMD Compatible module loader
 * 
 * @param root object
 * @returns module loader function define
 *
 */
var define = (function (modules) {
    return (name, deps, callback) => {
        modules[name] = { id: name, exports: {} }
        const args = [(name) => modules[name].exports, modules[name].exports]
        for (let i = 2; i < deps.length; i++)
            args.push(modules[deps[i]].exports)
        callback.apply(modules[name].exports, args)
    }
}({}));
