define("lib", ["require", "exports"], function (require, exports) {
    "use strict";
    //------ lib.js ------
    exports.sqrt = Math.sqrt;
    function square(x) {
        return x * x;
    }
    exports.square = square;
    function diag(x, y) {
        return exports.sqrt(square(x) + square(y));
    }
    exports.diag = diag;
});
define("sub/lib2", ["require", "exports"], function (require, exports) {
    "use strict";
    //------ lib2.js ------
    exports.sqrt = Math.sqrt;
    function square(x) {
        return x * x;
    }
    exports.square = square;
    function diag(x, y) {
        return exports.sqrt(square(x) + square(y));
    }
    exports.diag = diag;
});
define("test", ["require", "exports", "lib", "sub/lib2"], function (require, exports, lib_1, lib2_1) {
    "use strict";
    console.log(lib_1.square(11)); // 121
    console.log(lib2_1.diag(4, 3)); // 5
});
