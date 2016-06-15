gdx.graphics.OrthographicCamera = (function() {

    var Camera = gdx.graphics.Camera;
    /**
     * @JSName("gdx.graphics.OrthographicCamera")
     */
    return class OrthographicCamera extends Camera {
        constructor(viewportWidth, viewportHeight) {
            super(viewportWidth, viewportHeight);
            this.combined = null;
        }
        update() {}

    }

}());        
