
import GL20 from 'gdx/graphics/GL20'
import Gdx from 'gdx/Gdx'

/**
 * @JSName("gdx.graphics.Texture")
 */
export default class Texture {
    constructor(path) {
        //let file = Gdx.files.internal(path)

        if (typeof path === 'string')
            this.path = Gdx._resources[path] ? Gdx._resources[path].url : path
        else
            this.path = path.path
            
        this.sprite = PIXI.Sprite.fromImage(this.path)
        this.id = Texture.uniqueId++
    }
    setFilter(minFilter ,magFilter) {}
}

Texture.uniqueId = 0

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


