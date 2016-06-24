`import Gdx from 'gdx/Gdx'`
`import TextureRegion from 'gdx/graphics/g2d/TextureRegion'`

###
 * @JSName("gdx.graphics.g2d.Sprite")
###
class Sprite extends TextureRegion 

    constructor:(texture) ->
        super(texture)
    
    getWidth:-> @texture.sprite._texture.width
    getHeight:-> @texture.sprite._texture.height
    setX:(value) ->

    setY:(value) ->

    setColor:(red, green, blue, alpha) ->

    setScale:(x, y) ->
        @texture.sprite.scale.set(x, y)

    setPosition:(x, y) ->
        @texture.sprite.position.set(x, Gdx.graphics.getHeight()-y-@texture.sprite._texture.height)
    
    draw:(batch) ->
        batch.draw(this, @texture.sprite.position.x, @texture.sprite.position.y)

`export default Sprite`