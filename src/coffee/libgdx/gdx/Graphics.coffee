`import GL20 from 'gdx/graphics/GL20'`
`import Gdx from  'gdx/Gdx'`

###
 * @JSName("gdx.Graphics")
###
class Graphics 

    constructor:(config) ->
        @config = config
        @gl20 = new GL20()
        @frameId = -1
        @lastTime = 0
        @deltaTime = 0
        @frames = 0
        @time = 0
        @fps = 0
    

    getDeltaTime: -> @deltaTime
    getWidth: -> @config.width
    getHeight: -> @config.height
    getDensity: -> window.devicePixelRatio
    setupDisplay: () ->
        Gdx.gl = @gl20
    
    update:(time) ->
        if @lastTime <= 0 
            @lastTime = time
            return

        @deltaTime = (time - @lastTime) * .001
        @lastTime = time
        @time += @deltaTime
        @frames++
        if @time > 1
            @fps = @frames
            @time = 0
            @frames = 0
    
`export default Graphics`