
import Graphics from 'gdx/Graphics'
import Audio from 'gdx/Audio'
import Files from 'gdx/Files'
import Input from 'gdx/Input'
import Gdx from 'gdx/Gdx'
import Scaling from 'gdx/utils/Scaling'

function resize() {
    switch(Gdx._scaling) {
        case Scaling.fit:
            // Determine which screen dimension is least constrained
            Gdx._scaleX = Gdx._scaleY = Math.max(window.innerWidth/Gdx._width, window.innerHeight/Gdx._height)
            break
        case Scaling.fill:
            // Determine which screen dimension is most constrained
            Gdx._scaleX = Gdx._scaleY = Math.min(window.innerWidth/Gdx._width, window.innerHeight/Gdx._height)
            break
        case Scaling.fillX:
            Gdx._scaleX = window.innerWidth/Gdx._width
            Gdx._scaleY = Gdx._scaleX
            break
        case Scaling.fillY:
            Gdx._scaleY = window.innerHeight/Gdx._height
            Gdx._scaleX = Gdx._scaleY
            break
        case Scaling.stretch:
            Gdx._scaleX = window.innerWidth/Gdx._width
            Gdx._scaleY = window.innerHeight/Gdx._height
            break
        case Scaling.stretchX:
            Gdx._scaleX = window.innerWidth/Gdx._width
            Gdx._scaleY = Gdx._scaleX
            break
        case Scaling.stretchY:
            Gdx._scaleY = window.innerHeight/Gdx._height
            Gdx._scaleX = Gdx._scaleY
            break
    }
    Gdx._stage.scale.x = Gdx._scaleX
    Gdx._stage.scale.y = Gdx._scaleY
    Gdx._renderer.resize(Math.ceil(Gdx._width * Gdx._scaleX), Math.ceil(Gdx._height * Gdx._scaleY))
}    

/**
 * getJSON
 * 
 * Load a json resource
 *
 * @see https://mathiasbynens.be/notes/xhr-responsetype-json
 * @param url
 * @returns Promise
 */
function getJSON(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('get', url, true)
        xhr.responseType = 'json'
        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(xhr.response)
            } else {
                reject(xhr.status)
            }
        }
        xhr.send()
    })
}

/**
 * @JSName("gdx.JsApplication")
 */
export default class JsApplication {
    
    constructor(listener, config){

        if (config.title === null) {
            config.title = listener.constructor.name
        }
        document.title = config.title
        this.config = config
        this.graphics = new Graphics(config)
        this.audio = new Audio()
        this.files = new Files()
        this.input = new Input()
        //this.net = new Net()
        this.gl = null
        this.listener = listener
        Gdx.app = this
        Gdx.graphics = this.graphics
        Gdx.audio = this.audio
        Gdx.files = this.files
        Gdx.input = this.input
        //Gdx.net = this.net
        /**
         * Load the manifest, and initialize
         */
        getJSON('assets.json').then(data => {
            //let z = 0
            for (let name in data.atlas) {
                PIXI.loader.add(name, data.atlas[name])
            }
            PIXI.loader.load( (loader, res) => {
                Gdx._resources = Object.create(res)

                for (let path in data.files) {
                    PIXI.loader.add(data.files[path])
                }
                PIXI.loader.load( (loader, res) => {
                    this.initialize()
                })

            })
        }, status => console.log(`error ${status}: Unable to load manifest: assets.json`))
        
    }
    
    /**
     * Start the main loop
     */
    initialize() {
        
        Gdx._width = this.config.width
        Gdx._height = this.config.height
        
        Gdx._renderer = PIXI.autoDetectRenderer(this.config.width, this.config.height, {
            antialiasing: false,
            transparent: false,
            resolution: window.devicePixelRatio,
            autoResize: true
        })
        Gdx._renderer.view.style.position = "absolute"
        Gdx._renderer.view.style.top = "0px"
        Gdx._renderer.view.style.left = "0px"
        Gdx._stage = new PIXI.Container()
        resize()
        document.body.appendChild(Gdx._renderer.view)
        window.addEventListener("resize", resize)

        this.graphics.setupDisplay()
        this.listener.create()
        const mainLoop = (time) => {
            
            this.graphics.update(time)
            this.graphics.frameId++
            this.listener.render()
            window.requestAnimationFrame(mainLoop)
        }
        window.requestAnimationFrame(mainLoop)
    }
}
    
