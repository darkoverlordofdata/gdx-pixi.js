var gdx;(function (gdx) {
    var graphics;(function (graphics) {

        var Vector3 = gdx.math.Vector3;
        
        /**
         * @JSName("gdx.graphics.Camera")
         */
        class Camera {
            constructor(viewportWidth, viewportHeight) {
                this.position = new Vector3();
                this.viewportWidth = viewportWidth;
                this.viewportHeight = viewportHeight;
            }
            update() {}
        }

        graphics.Camera = Camera;
        
    })(graphics = gdx.graphics || (gdx.graphics = {}));
})(gdx || (gdx = {}));
