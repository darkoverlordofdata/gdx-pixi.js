`import GL20 from 'gdx/graphics/GL20'`
`import Gdx from 'gdx/Gdx'`

###
 * @JSName("gdx.graphics.Texture")
###

pixi = require('pixi')

class Texture 

    @uniqueId: 0
    @TextureFilter:
        Nearest: GL20.GL_NEAREST
        Linear: GL20.GL_LINEAR
        MipMap: GL20.GL_LINEAR_MIPMAP_LINEAR
        MipMapNearestNearest:GL20.GL_NEAREST_MIPMAP_NEAREST
        MipMapLinearNearest: GL20.GL_LINEAR_MIPMAP_NEAREST
        MipMapNearestLinear: GL20.GL_NEAREST_MIPMAP_LINEAR
        MipMapLinearLinear: GL20.GL_LINEAR_MIPMAP_LINEAR

    constructor:(path) ->
        if typeof path is 'string'
            @path = if Gdx._resources[path]? then Gdx._resources[path].url else path
        else
            @path = path.path
            
        @sprite = pixi.Sprite.fromImage(@path)
        @id = Texture.uniqueId++
    
    setFilter:(minFilter ,magFilter) ->


`export default Texture`
