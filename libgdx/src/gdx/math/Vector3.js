
/**
 * @JSName("gdx.math.Vector3")
 */
gdx.math.Vector3 = (function(){

    return class Vector3 {
        constructor() {
            this.set(0, 0, 0);
        }
        set(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
    };

}());

