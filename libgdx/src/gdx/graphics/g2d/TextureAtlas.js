var gdx;
(function (gdx) {
    var graphics;
    (function (graphics) {
        var g2d;
        (function (g2d) {

        /**
         * @JSName("gdx.graphics.g2d.TextureAtlas")
         */
        class TextureAtlas {
            constructor(packFile) {
                this.packFile = packFile
            }
            createSprite(name){}
        }

        g2d.TextureAtlas = TextureAtlas;
        
        })(g2d = graphics.g2d || (graphics.g2d = {}));
    })(graphics = gdx.graphics || (gdx.graphics = {}));
})(gdx || (gdx = {}));
