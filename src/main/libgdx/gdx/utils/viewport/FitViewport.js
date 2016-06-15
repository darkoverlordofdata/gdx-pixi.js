gdx.utils.viewport.FitViewport = (function() {

    var Scaling = gdx.utils.Scaling;
    var ScalingViewport = gdx.utils.viewport.ScalingViewport;
    /**
     * @JSName("gdx.utils.viewport.FitViewport")
     */
    return class FitViewport extends ScalingViewport {
        constructor(worldWidth, worldHeight, camera) {
            super(Scaling.fit, worldWidth, worldHeight, camera);
        }
    }

}());
