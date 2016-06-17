/**
 * AMD Compatible module loader
 * 
 * define("lib", ["require", "exports"], function (require, exports) {
 * 
 * define("test", ["require", "exports", "lib"], function (require, exports, lib_1) {
 * 
 * @param global window object
 * @param publish boolean api flag
 *
 */

(function(global, publish){
    
    const modules = {};

    const require = function(name) {
        return modules[name] | {};
    };

    global.define = function(name, deps, callback) {

        // the exported module reference
        let exports = modules[name] = {};

        // first 2 dependencies:
        const args = [require, exports];

        // remaining dependencues
        for (let i=2; i<deps.length; i++) {
            args.push(modules[deps[i]]);
        }

        // initialize the module
        callback.apply(exports, args);

        // publish global api?
        if (publish) {
            let ns = name.split('/');
            let root = global;

            // Follow the nodes, creating if necessary
            while (ns.length > 1) {
                let node = ns.pop();
                if (!root[node]) root[node] = {};
                root = root[node];
            }

            // install the node
            root[ns.pop()] = exports;
        }
    };

}(this, true));
