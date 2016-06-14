var gdx;(function (gdx) {
    var graphics;(function (graphics) {

        var GL20 = gdx.graphics.GL20;
        
        /**
         * @JSName("gdx.graphics.Texture")
         */
        class Texture {
            constructor(path) {
                //let file = Gdx.files.internal(path);

                if (typeof path === 'string')
                    this.path = gdx._resources[path] ? gdx._resources[path].url : path;
                else
                    this.path = path.path;
                    
                this.sprite = PIXI.Sprite.fromImage(this.path);
                this.id = Texture.uniqueId++;
            }
            setFilter(minFilter ,magFilter) {}
        }
        
        Texture.uniqueId = 0;

        /**
         * @JSName("gdx.graphics.Texture.TextureFilter")
         */
        Texture.TextureFilter = {
            Nearest: GL20.GL_NEAREST,
            Linear: GL20.GL_LINEAR,
            MipMap: GL20.GL_LINEAR_MIPMAP_LINEAR,
            MipMapNearestNearest:GL20.GL_NEAREST_MIPMAP_NEAREST,
            MipMapLinearNearest: GL20.GL_LINEAR_MIPMAP_NEAREST,
            MipMapNearestLinear: GL20.GL_NEAREST_MIPMAP_LINEAR,
            MipMapLinearLinear: GL20.GL_LINEAR_MIPMAP_LINEAR
        }

        graphics.Texture = Texture;

    })(graphics = gdx.graphics || (gdx.graphics = {}));
})(gdx || (gdx = {}));
