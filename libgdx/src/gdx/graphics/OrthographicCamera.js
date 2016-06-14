var gdx;(function (gdx) {
    var graphics;(function (graphics) {
        
        var Camera = gdx.graphics.Camera;
        /**
         * @JSName("gdx.graphics.OrthographicCamera")
         */
        class OrthographicCamera extends Camera {
            constructor(viewportWidth, viewportHeight) {
                super(viewportWidth, viewportHeight);
                this.combined = null;
            }
            update() {}

        }

        graphics.OrthographicCamera = OrthographicCamera;
        
    })(graphics = gdx.graphics || (gdx.graphics = {}));
})(gdx || (gdx = {}));
