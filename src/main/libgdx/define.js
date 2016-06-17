/**
 * AMD Compatible module loader
 * 
 * define("lib", ["require", "exports"], function (require, exports) {
 * 
 * define("test", ["require", "exports", "lib"], function (require, exports, lib_1) {
 * 
 * @param global window object
 * @param publish api flag boolean
 *
 */
var define = (function(root) {
    "use strict";
    console.log(root)
    // Module registry
    var modules = {};

    // Fetch a module from the registry
    var require = function(name) {
        return modules[name] || {};
    };

    var resolve = function(dependancy) {
        var ns = dependancy.split('/');
        var node = root;

        for (var i=0; i<ns.length; i++) {
            if (typeof node[ns[i]] === 'undefined') {
                return null;
                //node[ns[i]] = {};
            }
            node = node[ns[i]];
        }
        return node;
    }

    return function(name, deps, callback) {
        "use strict";

        // the exported module reference
        var exports = modules[name] = {};

        // first 2 dependencies are built-in:
        var args = [require, exports];

        // remaining dependencues
        for (var i=2; i<deps.length; i++) {
            args.push(resolve(deps[i]));
        }

        // initialize the module
        callback.apply(null, args);

        // do exports:
        var ns = name.split('/');
        var node = root;

        // find the module node
        for (var i=0; i<ns.length; i++) {
            if (typeof node[ns[i]] === 'undefined') {
                node[ns[i]] = {};
            }
            node = node[ns[i]];
        }

        // export default replaces the module node
        if (exports.__esModule || exports['default']) {
            var defaultName = ns.pop();
            var defaultNode = root;
            for (var i=0; i<ns.length; i++) {
                defaultNode = defaultNode[ns[i]];
            }
            defaultNode[defaultName] = exports['default'];
            defaultNode[defaultName]['default'] = exports['default'];
        } 

        // expose all of the exported values
        for (var key in exports) {
            if (key !== 'default')
                node[key] = exports[key];
        }
        
    };

}(this));
// }({}));