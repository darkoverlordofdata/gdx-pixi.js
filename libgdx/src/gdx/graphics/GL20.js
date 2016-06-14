var gdx;(function (gdx) {
    var graphics;(function (graphics) {

        /**
         * @JSName("gdx.graphics.GL20")
         */
        class GL20 {
            glClearColor(red, green, blue, alpha) {
                let hexColor = ((1 << 24) + (red*255 << 16) + (green*255 << 8) + blue*255)//.toString(16).substr(1);
                gdx._renderer.backgroundColor = hexColor;
            }
            glClear(mask) {
            }
        }

        GL20.GL_COLOR_BUFFER_BIT = 0x00004000;
        GL20.GL_NEAREST = 0x2600;
        GL20.GL_LINEAR = 0x2601;
        GL20.GL_LINEAR_MIPMAP_LINEAR = 0x2703;
        GL20.GL_NEAREST_MIPMAP_NEAREST = 0x2700;
        GL20.GL_LINEAR_MIPMAP_NEAREST = 0x2701;
        GL20.GL_NEAREST_MIPMAP_LINEAR = 0x2702;
        GL20.GL_LINEAR_MIPMAP_LINEAR = 0x2703;

        
        graphics.GL20 = GL20;

    })(graphics = gdx.graphics || (gdx.graphics = {}));
})(gdx || (gdx = {}));
