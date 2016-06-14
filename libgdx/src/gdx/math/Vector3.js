var gdx;(function (gdx) {
    var math;(function (math) {

        /**
         * @JSName("gdx.math.Vector3")
         */
        class Vector3 {
            constructor() {
                this.set(0, 0, 0);
            }
            set(x, y, z) {
                this.x = x;
                this.y = y;
                this.z = z;
            }
        }

        math.Vector3 = Vector3;
        
    })(math = gdx.math || (gdx.math = {}));
})(gdx || (gdx = {}));
