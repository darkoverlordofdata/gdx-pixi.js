var gdx;
(function (gdx) {
    var graphics;
    (function (graphics) {
        var g2d;
        (function (g2d) {

            var Batch = gdx.graphics.g2d.Batch;
            /**
             * @JSName("gdx.graphics.g2d.SpriteBatch")
             */
            class SpriteBatch extends Batch {
                
            }
            g2d.SpriteBatch = SpriteBatch;
        })(g2d = graphics.g2d || (graphics.g2d = {}));
    })(graphics = gdx.graphics || (gdx.graphics = {}));
})(gdx || (gdx = {}));
