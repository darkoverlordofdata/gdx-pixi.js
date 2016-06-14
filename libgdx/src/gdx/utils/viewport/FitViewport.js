var gdx;(function (gdx) {
    var utils;(function (utils) {
        var viewport;(function (viewport) {

            var Scaling = gdx.utils.Scaling;
            var ScalingViewport = gdx.utils.viewport.ScalingViewport;
            /**
             * @JSName("gdx.utils.viewport.FitViewport")
             */
            class FitViewport extends ScalingViewport {
                constructor(worldWidth, worldHeight, camera) {
                    super(Scaling.fit, worldWidth, worldHeight, camera);
                }
            }

            viewport.FitViewport = FitViewport;

            
        })(viewport = utils.viewport || (utils.viewport = {}));
    })(utils = gdx.utils || (gdx.utils = {}));
})(gdx || (gdx = {}));
