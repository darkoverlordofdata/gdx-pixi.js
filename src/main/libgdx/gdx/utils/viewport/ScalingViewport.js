gdx.utils.viewport.ScalingViewport = (function() {

    var Viewport = gdx.utils.viewport.Viewport;
    var OrthographicCamera = gdx.graphics.OrthographicCamera;
    /**
     * @JSName("gdx.utils.viewport.ScalingViewport")
     */
    return class ScalingViewport extends Viewport {
        constructor(scaling, worldWidth, worldHeight, camera) {
            super();
            this.scaling = scaling;
            this.worldWidth = worldWidth;
            this.worldHeight = worldHeight;
            this.camera = camera ? camera : new OrthographicCamera();
        }
    }

}());
