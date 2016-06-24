`import Graphics from 'gdx/Graphics'`
`import Audio from 'gdx/Audio'`
`import Files from 'gdx/Files'`
`import Input from 'gdx/Input'`
`import Gdx from 'gdx/Gdx'`
`import Scaling from 'gdx/utils/Scaling'`

pixi = require('pixi')

resize = ->
    switch Gdx._scaling 
        when Scaling.fit
            # Determine which screen dimension is least constrained
            Gdx._scaleX = Gdx._scaleY = Math.max(window.innerWidth/Gdx._width, window.innerHeight/Gdx._height);
            
        when Scaling.fill
            # Determine which screen dimension is most constrained
            Gdx._scaleX = Gdx._scaleY = Math.min(window.innerWidth/Gdx._width, window.innerHeight/Gdx._height);
            
        when Scaling.fillX
            Gdx._scaleX = window.innerWidth/Gdx._width
            Gdx._scaleY = Gdx._scaleX
            
        when Scaling.fillY
            Gdx._scaleY = window.innerHeight/Gdx._height
            Gdx._scaleX = Gdx._scaleY
            
        when Scaling.stretch
            Gdx._scaleX = window.innerWidth/Gdx._width
            Gdx._scaleY = window.innerHeight/Gdx._height
            
        when Scaling.stretchX
            Gdx._scaleX = window.innerWidth/Gdx._width
            Gdx._scaleY = Gdx._scaleX
            
        when Scaling.stretchY
            Gdx._scaleY = window.innerHeight/Gdx._height
            Gdx._scaleX = Gdx._scaleY
            
    
    Gdx._stage.scale.x = Gdx._scaleX
    Gdx._stage.scale.y = Gdx._scaleY
    Gdx._renderer.resize Math.ceil(Gdx._width * Gdx._scaleX), Math.ceil(Gdx._height * Gdx._scaleY)


###
 * getJSON
 * 
 * Load a json resource
 *
 * @see https://mathiasbynens.be/notes/xhr-responsetype-json
 * @param url
 * @returns Promise
###
getJSON = (url) ->
    new Promise(
        (resolve, reject) => 
            xhr = new XMLHttpRequest()
            xhr.open('get', url, true)
            xhr.responseType = 'json'
            xhr.onload = () => if xhr.status is 200 then resolve(xhr.response) else reject(xhr.status)
            xhr.send()
    )
###
 * @JSName("gdx.JsApplication")
###
class JsApplication 
    
    constructor:(listener, config) ->

        if config.title is null
            config.title = listener.constructor.name

        document.title = config.title
        @config = config
        @graphics = new Graphics(config)
        @audio = new Audio()
        @files = new Files()
        @input = new Input()
        @gl = null
        @listener = listener
        Gdx.app = this
        Gdx.graphics = @graphics
        Gdx.audio = @audio
        Gdx.files = @files
        Gdx.input = @input
        _this = this
        ###
         * Load the manifest, and initialize
        ###
        getJSON('manifest.json').then((data) ->
            for name, url of data.atlas
                pixi.loader.add(name, url)

            pixi.loader.load((loader, res) -> 
                Gdx._resources = Object.create(res)

                for path in data.files
                    pixi.loader.add(path)

                pixi.loader.load((loader, res) -> console.log(res))
                _this.initialize()
                return)

        , (status) -> console.log "error #{status}: Unable to load manifest.json")
        
    
    
    ###
     * Start the main loop
    ###
    initialize:() ->
        
        Gdx._width = @config.width
        Gdx._height = @config.height
        
        Gdx._renderer = pixi.autoDetectRenderer(@config.width, @config.height, {
            antialiasing: false,
            transparent: false,
            resolution: window.devicePixelRatio,
            autoResize: true
        })
        Gdx._renderer.view.style.position = "absolute"
        Gdx._renderer.view.style.top = "0px"
        Gdx._renderer.view.style.left = "0px"
        Gdx._stage = new pixi.Container()
        resize()
        document.body.appendChild(Gdx._renderer.view)
        window.addEventListener("resize", resize)

        @graphics.setupDisplay()
        @listener.create()
        mainLoop = (time) => 
            
            @graphics.update(time)
            @graphics.frameId++
            @listener.render()
            window.requestAnimationFrame(mainLoop)

        window.requestAnimationFrame(mainLoop)

    
`export default JsApplication`