var gdx;(function (gdx) {
    var utils;(function (utils) {
        var viewport;(function (viewport) {

            var Viewport = gdx.utils.viewport.Viewport;
            var OrthographicCamera = gdx.graphics.OrthographicCamera;
            /**
             * @JSName("gdx.utils.viewport.ScalingViewport")
             */
            class ScalingViewport extends Viewport {
                constructor(scaling, worldWidth, worldHeight, camera) {
                    super();
                    this.scaling = scaling;
                    this.worldWidth = worldWidth;
                    this.worldHeight = worldHeight;
                    this.camera = camera ? camera : new OrthographicCamera();
                }
            }

            viewport.ScalingViewport = ScalingViewport;
            
        })(viewport = utils.viewport || (utils.viewport = {}));
    })(utils = gdx.utils || (gdx.utils = {}));
})(gdx || (gdx = {}));
