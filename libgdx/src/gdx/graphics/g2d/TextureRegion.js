var gdx;
(function (gdx) {
    var graphics;
    (function (graphics) {
        var g2d;
        (function (g2d) {
            /**
             * @JSName("gdx.graphics.g2d.TextureRegion")
             */
            class TextureRegion {
                constructor(texture) {
                    this.texture = texture;
                }
            }

            g2d.TextureRegion = TextureRegion;
            
        })(g2d = graphics.g2d || (graphics.g2d = {}));
    })(graphics = gdx.graphics || (gdx.graphics = {}));
})(gdx || (gdx = {}));
