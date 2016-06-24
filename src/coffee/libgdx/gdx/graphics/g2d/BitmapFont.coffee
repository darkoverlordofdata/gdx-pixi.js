`import Gdx from 'gdx/Gdx'`
###
 * @JSName("gdx.graphics.g2d.BitmapFont")
###

pixi = require('pixi')

class BitmapFont 
    
    constructor:(@fontFile, @region, @integer) ->
        name = @fontFile.path.split('/').pop().split('.')[0]
        dom = (new DOMParser()).parseFromString(Gdx._resources[name].xhr.responseText, 'text/xml')
        @face = dom.evaluate('/font/info/@face', dom, null, XPathResult.STRING_TYPE, null).stringValue
        @size = dom.evaluate('/font/info/@size', dom, null, XPathResult.STRING_TYPE, null).stringValue
    
    setUseIntegerPositions:(integer) ->
    getWidth:() ->
    getHeight:() ->
    draw:(batch, str, x, y) ->
        texture = new pixi.extras.BitmapText(str, font: "#{@size}px #{@face}", align: 'right' )
        batch.draw(texture, x, Gdx._height-y)


`export default BitmapFont`