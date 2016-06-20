/**
 * AMD Compatible module loader
 * 
 * @param root object
 * @returns module loader function define
 *
 */
var define = (function(root) {
    "use strict";

    // get a module by path
    var require = function(dependancy) {
        var ns = dependancy.split('/');
        var node = root;

        for (var i=0; i<ns.length; i++) {
            if (typeof node[ns[i]] === 'undefined') {
                return void 0;
            }
            node = node[ns[i]];
        }
        return node;
    }

    // define
    return function(name, deps, callback) {
        "use strict";

        // the exported module reference
        var exports = {};

        // first 2 dependencies are built-in:
        var args = [require, exports];

        // remaining dependencues
        for (var i=2; i<deps.length; i++) {
            args.push(require(deps[i]));
        }

        // initialize the module
        callback.apply(exports, args);

        // do exports:
        var ns = name.split('/');
        var node = root;

        // ensure the module node
        for (var i=0; i<ns.length; i++) {
            if (typeof node[ns[i]] === 'undefined') {
                node[ns[i]] = {};
            }
            node = node[ns[i]];
        }

        // default replaces the module node
        if (exports.__esModule || exports['default']) {
            var moduleName = ns.pop();
            var moduleNode = root;
            for (var i=0; i<ns.length; i++) {
                moduleNode = moduleNode[ns[i]];
            }
            moduleNode[moduleName] = exports['default'];
            moduleNode[moduleName]['default'] = exports['default'];
        } 

        // expose all of the exported values
        for (var key in exports) {
            if (key !== 'default')
                node[key] = exports[key];
        }
        
    };

}({}));
