gdx.utils.viewport.FillViewport = (function() {

    var Scaling = gdx.utils.Scaling;
    var ScalingViewport = gdx.utils.viewport.ScalingViewport;

    /**
     * @JSName("gdx.utils.viewport.FillViewport")
     */
    return class FillViewport extends ScalingViewport {
        constructor(worldWidth, worldHeight, camera) {
            super(Scaling.fill, worldWidth, worldHeight, camera);
        }
    }

}());
