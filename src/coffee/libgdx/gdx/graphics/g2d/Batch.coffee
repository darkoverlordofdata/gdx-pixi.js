`import Gdx from 'gdx/Gdx'`

pixi = require('pixi')

class Batch

    constructor:() ->
        @sprites = new pixi.Container()
        Gdx._stage.addChild(@sprites)
    
    begin:() ->
        @sprites.children.length = 0
    
    draw:(texture, x, y, width=-1, height=-1) ->
        if (texture.texture) 
            @sprites.addChild(texture.texture.sprite)
            texture.texture.sprite.x = x
            texture.texture.sprite.y = y
        else
            @sprites.addChild(texture)
            texture.x = x
            texture.y = y
        
    end:() ->
        Gdx._renderer.render(Gdx._stage)
    
    setProjectionMatrix:(projection) ->


`export default Batch`