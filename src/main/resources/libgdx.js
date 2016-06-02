/**
 * libGDX Emulator - copyright 2016 darkoverlordofdata
 * 
 * this is not a full emulation, this is just the minimum required 
 * to allow my scala.js games to execute in the browser
 */
//var gdx =
(function($env) {
    "use strict";

    var _instance = null;
    var _processor = null;
    var _renderer = null;
    
    /**
     * @JSName("gdx.audio.Sound")
     */
    class Sound {
        play() {
        }
    }

    /**
     * @JSName("gdx.files.FileHandle")
     */
    class FileHandle {
        readString() {
        }
    }
    
    /**
     * @JSName("gdx.graphics.Camera")
     */
    class Camera {
        constructor(viewportWidth, viewportHeight) {
            this.position = new Vector3();
            this.viewportWidth = viewportWidth;
            this.viewportHeight = viewportHeight;
        }
        update() {}
    }
    
    /**
     * @JSName("gdx.graphics.OrthographicCamera")
     */
    class OrthographicCamera extends Camera {
        constructor(viewportWidth, viewportHeight) {
            super(viewportWidth, viewportHeight);
            this.combined = null;
        }
        update() {}

    }
    
    
    /**
     * @JSName("gdx.graphics.GL20")
     */
    class GL20 {
        glClearColor(red, green, blue, alpha) {
            let hexColor = ((1 << 24) + (red*255 << 16) + (green*255 << 8) + blue*255)//.toString(16).substr(1);
            _renderer.backgroundColor = hexColor;
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
    
    /**
     * @JSName("gdx.graphics.Texture")
     */
    class Texture {
        constructor(path) {
            this.path = path;
            this.sprite = PIXI.Sprite.fromImage(path);
            this.id = Texture.uniqueId++;
        }
        setFilter(minFilter ,magFilterp1) {}
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

    /**
     * @JSName("gdx.graphics.g2d.Batch")
     */
    class Batch {
        constructor() {
            this.sprites = new PIXI.Container()
        }
        
        begin() {
            this.sprites.children.length = 0;
        }
        draw(img, x, y, width=-1, height=-1) {
            this.sprites.addChild(texture.sprite);
            texture.sprite.x = x;
            texture.sprite.y = y;
        }
        end {
            _renderer.render(this.sprites);
        }
        setProjectionMatrix(projection) {
            
        }
        
    }
    
    /**
     * @JSName("gdx.graphics.g2d.BitmapFont")
     */
    class BitmapFont {
        constructor(fontFile, region, integer) {
            this.fontFile = fontFile;
            this.region = region;
            this.flip = flip;
        }
        setUseIntegerPositions(integer){}
        getWidth(){}
        getHeight(){}
        draw(batch, str, x, y){
            
        }
    }
    
    /**
     * @JSName("gdx.graphics.g2d.Sprite")
     */
    class Sprite extends TextureRegion {
        getWidth(){}
        getHeight(){}
        setScale(x, y) {
            
        }
        setPosition(x, y) {
            
        }
        draw(batch) {
            
        }
    }

    /**
     * @JSName("gdx.graphics.g2d.SpriteBatch")
     */
    class SpriteBatch extends Batch {}

    /**
     * @JSName("gdx.graphics.g2d.TextureAtlas")
     */
    class TextureAtlas {
        constructor(packFile) {
            this.packFile = packFile
        }
        createSprite(name){}
    }

    /**
     * @JSName("gdx.graphics.g2d.TextureRegion")
     */
    class TextureRegion {
        constructor(texture) {
            this.texture = texture;
        }
        setX(value){
            
        }
        setY(value) {
            
        }
        setColor(red, green, blue, alpha) {
            
        }
    }

    
    /**
     * @JSName("gdx.math.Vector3")
     */
    class Vector3 {
        constructor() {
            this.set(0, 0, 0);
        }
        set(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
    }

    /**
     * @JSName("gdx.scenes.scene2d.utils.ClickListener")
     */
    class ClickListener {
        clicked(event, x, y){}
    }
    
    /**
     * @JSName("gdx.scenes.scene2d.Actor")
     */
    class Actor {
     
        setX(x) {
            
        }   
        setY(y) {
            
        }
        setScale(scaleXY) {
            
        }
        addListener(listener) {
            
        }
    }
    
    /**
     * @JSName("gdx.scenes.scene2d.Event")
     */
    class Event {}
    
    /**
     * @JSName("gdx.scenes.scene2d.EventListener")
     */
    class EventListener {}
    
    /**
     * @JSName("gdx.scenes.scene2d.InputEvent")
     */
    class InputEvent {}
    
    /**
     * @JSName("gdx.scenes.scene2d.InputListener")
     */
    class InputListener extends EventListener {}
    
    /**
     * @JSName("gdx.scenes.scene2d.Stage")
     */
    class Stage extends InputProcessor {
        getWidth(){}
        getHeight(){}
        act() {
            
        }
        draw() {
            
        }
        addActor(actor) {
            
        }
    }
    
    /**
     * @JSName("gdx.utils.Scaling")
     */
    var Scaling = {
        fit: 0,
        fill: 1,
        fillX: 2,
        fillY: 3,
        stretch: 4,
        stretchX: 5,
        stretchY: 6,
        none: 7
    }

    
    /**
     * @JSName("gdx.utils.viewport.FillViewport")
     */
    class FillViewport extends ScalingViewport {
        constructor(worldWidth, worldHeight, camera) {
            super(Scaling.fill, worldWidth, worldHeight, camera);
        }
    }
    
    /**
     * @JSName("gdx.utils.viewport.FitViewport")
     */
    class FitViewport extends ScalingViewport {
        constructor(worldWidth, worldHeight, camera) {
            super(Scaling.fit, worldWidth, worldHeight, camera);
        }
    }
    
    /**
     * @JSName("gdx.utils.viewport.ScalingViewport")
     */
    class ScalingViewport extends Viewport {
        constructor(scaling, worldWidth, worldHeight, camera) {
            this.scaling = scaling;
            this.worldWidth = worldWidth;
            this.worldHeight = worldHeight;
            this.camera = camera ? camera : new OrthographicCamera();
        }
    }
    
    /**
     * @JSName("gdx.utils.viewport.Viewport")
     */
    class Viewport {
    }
    
    /**
     * @JSName("gdx.utils.Json")
     */
    class Json {
    }
    
    /**
     * @JSName("gdx.Audio")
     */
    class Audio{
        newSound(raw) {
            
        }
    }

    /**
     * @JSName("gdx.Files")
     */
    class Files{
        internal(path) {
            
        }
    }

    /**
     * @JSName("gdx.Game")
     */
    class Game {
        constructor() {
            this.screen = null;
            this.create();
        }
        dispose() {
            if (screen != null) screen.hide();
        }
        pause() {
            if (screen != null) screen.pause();
        }
        resume () {
            if (screen != null) screen.resume();
        }
        render() {
            if (screen != null) screen.render(Gdx.graphics.getDeltaTime());
        }
        resize(width, height) {
            if (screen != null) screen.resize(width, height);
        }
        setScreen(screen) {
            if (this.screen != null) this.screen.hide();
            this.screen = screen;
            if (this.screen != null) {
                this.screen.show();
                this.screen.resize(Gdx.graphics.getWidth(), Gdx.graphics.getHeight());
            }
		}
        getScreen() {
            return this.screen;
        }
        create() {}
    }

    /**
     * @JSName("gdx.Gdx")
     */
    const Gdx = {
        app: null,
        graphics: null,
        audio: null,
        files: null,
        input: null,
        get: null,
        gl: null
    }

    /**
     * @JSName("gdx.Graphics")
     */
    class Graphics {
        constructor(config){
            this.config = config;
            this.gl20 = new GL20()
            this.frameId = -1;
            this.lastTime = 0;
            this.deltaTime = 0;
            this.frames = 0;
            this.time = 0;
            this.fps = 0;
        }
        
        getDeltaTime() {return this.deltaTime;}
        getWidth() {return this.config.width;}
        getHeight() {return this.config.height;}
        getDensity() {return window.devicePixelRatio;}
        setupDisplay() {
            Gdx.gl = this.gl20;
        }
        update(time) {
            if (this.lastTime <= 0) {
                this.lastTime = time;
                return;
            }

            this.deltaTime = (time - this.lastTime) * .001
            this.lastTime = time;
            this.time += this.deltaTime;
            this.frames++;
            if (this.time > 1) {
                this.fps = this.frames;
                this.time = 0;
                this.frames = 0;
            }
        }
    }
    
    class Application {
        constructor(instance, config) {
            _instance = instance
        }
    }
    
    
    /**
     * @JSName("gdx.Input")
     */
    class Input {
        setInputProcessor(processor) {
            _processor = processor;
            document.addEventListener('touchstart', function(event) {
                event = event.targetTouches ? event.targetTouches[0] : event;
                _processor.touchDown(event.clientX, event.clientY, event.pointer, event.button)
            }, true);
            document.addEventListener('touchmove', function(event) {
                event = event.targetTouches ? event.targetTouches[0] : event;
                _processor.touchDragged(event.clientX, event.clientY, event.pointer)
            }, true);
            document.addEventListener('touchend', function(event) {
                _processor.touchUp(event.clientX, event.clientY, event.pointer, event.button)
            }, true);
            document.addEventListener('mousedown', function(event) {
                _processor.touchDown(event.clientX, event.clientY, event.pointer, event.button)
            }, true);
            document.addEventListener('mousemove', function(event) {
                _processor.mouseMoved(event.clientX, event.clientY)
            }, true);
            document.addEventListener('mouseup', function(event) {
                _processor.touchUp(event.clientX, event.clientY, event.pointer, event.button)
            }, true);
            window.addEventListener('keydown', function (event) {
                _processor.keyDown(event.keyCode);
            }, true);
            window.addEventListener('keyup', function (event) {
                _processor.keyUp(event.keyCode);
            }, true);
        }   
    }
    
    /**
     * @JSName("gdx.Input.Buttons")
     */
    Input.Buttons = {
        LEFT: 0,
        RIGHT: 1,
        MIDDLE: 2,
        BACK: 3,
        FORWARD: 4
    }
    
    /**
     * @JSName("gdx.InpuyKeys")
     */
    Input.Keys = {
        A: 29,
        Z: 54
    }

    class InputProcessor {
        
        keyDown(keycode){}
        keyUp(keycode){}
        keyTyped(character){}
        touchDown(screenX, screenY, pointer, button){}
        touchUp(screenX, screenY, pointer, button){}
        touchDragged(screenX, screenY, pointer){}
        mouseMoved(screenX, screenY){}
        scrolled(amount){}
    }

    class Net{}

    /**
     * @JSName("gdx.JsApplicationConfiguration")
     */
    class JsApplicationConfiguration {
        constructor() {
            this.height = 480;
            this.width = 640;
            this.fullscreen = false;
            this.title = null;
        }
    }

    /**
     * @JSName("gdx.JsApplication")
     */
    class JsApplication {
        constructor(listener, config){
            if (config.title === null) {
                config.title = listener.constructor.name;
            }
            document.title = config.title;
            this.config = config;
            this.graphics = new Graphics(config);
            this.audio = new Audio();
            this.files = new Files();
            this.input = new Input();
            this.net = new Net();
            this.gl = null;
            this.listener = listener;
            Gdx.app = this;
            Gdx.graphics = this.graphics;
            Gdx.audio = this.audio;
            Gdx.files = this.files;
            Gdx.input = this.input;
            Gdx.net = this.net;
            this.initialize();
        }
        /**
         * Start the main loop
         */
        initialize() {

            _renderer = PIXI.autoDetectRenderer(this.config.width, this.config.height)
            document.body.appendChild(_renderer.view)

            this.graphics.setupDisplay();
            this.listener.create();
            let _this = this;
            let mainLoop = function(time) {

                _this.graphics.update(time);
                _this.graphics.frameId++;
                _this.listener.render();
                window.requestAnimationFrame(mainLoop);
            }
            window.requestAnimationFrame(mainLoop);
        }
    }

    class Screen {
        hide() {}
        dispose() {}
        pause() {}
        resize(width, height) {}
        show() {}
        resume() {}
        render(time){}
    }
    


    /**
     * export the api
     */
    $env.gdx =  {
        Gdx: Gdx,
        Audio: Audio,
        Files: Files,
        Graphics: Graphics,
        Input: Input,
        Net: Net,

        JsApplication: JsApplication,
        JsApplicationConfiguration: JsApplicationConfiguration,
        Application: Application,
        InputProcessor: InputProcessor,
        Game: Game,
        Screen: Screen,

        math: {
            MathUtils: Math
        },
        utils: {
            viewport: {
                FillViewport: FillViewport,
                FitViewport: FitViewport
            }
        },
        scenes: {
            scene2d: {
                Stage: Stage,
                InputEvent: InputEvent,
                utils: {
                    ClickListener: ClickListener
                }
            }
        },
        graphics: {
            OrthographicCamera: OrthographicCamera,
            Texture: Texture,
            GL20: GL20,
            g2d: {
                //Sprite: Sprite,
                SpriteBatch: SpriteBatch,
                TextureAtlas: TextureAtlas,
                TextureRegion: TextureRegion,
                BitmapFont: BitmapFont
                
            }
        }
    }
}(this));

