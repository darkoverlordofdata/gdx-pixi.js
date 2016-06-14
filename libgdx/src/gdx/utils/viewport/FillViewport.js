var gdx;(function (gdx) {
    var utils;(function (utils) {
        var viewport;(function (viewport) {

            var Scaling = gdx.utils.Scaling;
            var ScalingViewport = gdx.utils.viewport.ScalingViewport;

            /**
             * @JSName("gdx.utils.viewport.FillViewport")
             */
            class FillViewport extends ScalingViewport {
                constructor(worldWidth, worldHeight, camera) {
                    super(Scaling.fill, worldWidth, worldHeight, camera);
                }
            }

            viewport.FillViewport = FillViewport;
            
        })(viewport = utils.viewport || (utils.viewport = {}));
    })(utils = gdx.utils || (gdx.utils = {}));
})(gdx || (gdx = {}));
