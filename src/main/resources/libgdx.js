/**
 * libGDX Emulator
 * 
 * this is not a full emulation, this is just the minimum required 
 * to allow my scala.js games to execute in the browser
 */
var gdx = (function() {
    "use strict";

    var _instance = null;
    var _processor = null;
    var _renderer = null;

    var Gdx = function(){}
    Gdx.prototype = {
        constructor: Gdx
    }
    Gdx.app = null;
    Gdx.graphics = null;
    Gdx.audio = null;
    Gdx.files = null;
    Gdx.input = null;
    Gdx.net = null;
    Gdx.gl = null;


    var Vector3 = function() {
        this.set(0, 0, 0);
    }
    Vector3.prototype = {
        constructor: Vector3,
        set: function(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
    }
    
    var GL20 = function() {}
    GL20.prototype = {
        constructor: GL20,
        glClearColor: function(red, green, blue, alpha){
            var hexColor = ((1 << 24) + (red*255 << 16) + (green*255 << 8) + blue*255)//.toString(16).substr(1);
            _renderer.backgroundColor = hexColor;
        },
        glClear: function(mask){}
    }
    
    GL20.GL_COLOR_BUFFER_BIT = 0x00004000;
	GL20.GL_NEAREST = 0x2600;
    GL20.GL_LINEAR = 0x2601;
    GL20.GL_LINEAR_MIPMAP_LINEAR = 0x2703;
	GL20.GL_NEAREST_MIPMAP_NEAREST = 0x2700;
    GL20.GL_LINEAR_MIPMAP_NEAREST = 0x2701;
	GL20.GL_NEAREST_MIPMAP_LINEAR = 0x2702;
    GL20.GL_LINEAR_MIPMAP_LINEAR = 0x2703;
    
    var Application = function(instance, config) {
        constructor: Application,
        _instance = instance
        //_instance.create();
    }
    var Game = function() {
        this.create();
    }
    Game.prototype = {
        constructor: Game,
        screen: null,
        dispose: function () {
            if (screen != null) screen.hide();
        },
        pause: function () {
            if (screen != null) screen.pause();
        },
        resume: function () {
            if (screen != null) screen.resume();
        },
        render: function () {
            if (screen != null) screen.render(Gdx.graphics.getDeltaTime());
        },
        resize: function (width, height) {
            if (screen != null) screen.resize(width, height);
        },
        setScreen: function(screen) {
            if (this.screen != null) this.screen.hide();
            this.screen = screen;
            if (this.screen != null) {
                this.screen.show();
                this.screen.resize(Gdx.graphics.getWidth(), Gdx.graphics.getHeight());
            }
		},
        getScreen: function() {
            return this.screen;
        },
        create: function() {}
    }
    
    var Input = function() {}
    Input.Buttons = {
        LEFT: 0,
        RIGHT: 1,
        MIDDLE: 2,
        BACK: 3,
        FORWARD: 4
    },
    Input.Keys = {
        A: 29,
        Z: 54
    },
    Input.prototype = {
        constructor: Input,
        setInputProcessor: function(processor) {
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
    var InputProcessor = function() {}
    InputProcessor.prototype = {
        constructor: InputProcessor,
        keyDown: function(keycode){},
        keyUp: function(keycode){},
        keyTyped: function(character){},
        touchDown: function(screenX, screenY, pointer, button){},
        touchUp: function(screenX, screenY, pointer, button){},
        touchDragged: function(screenX, screenY, pointer){},
        mouseMoved: function(screenX, screenY){},
        scrolled: function(amount){}
    }

    var Net = function(){}
    Net.prototype = {
        constructor: Net
    }

    var Files = function(){}
    Files.prototype = {
        constructor: Files
    }

    var Audio = function(){}
    Audio.prototype = {
        constructor: Audio
    }

    var Screen = function() {}
    Screen.prototype = {
        constructor: Screen,
        hide: function() {},
        dispose: function() {},
        pause: function() {},
        resize: function(width, height) {},
        show: function() {},
        resume: function() {},
        render:function(time){}
    }
    
    
    var FillViewport = function(worldWidth, worldHeight, camera) {
        constructor: FillViewport,
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        this.camera = camera ? camera : new OrthographicCamera();
    }
    FillViewport.prototype = {}

    var FitViewport = function(worldWidth, worldHeight, camera) {
        constructor: FitViewport,
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        this.camera = camera ? camera : new OrthographicCamera();
    }
    FitViewport.prototype = {}
    
    var Stage = function() {};
    Stage.prototype = Object.create(InputProcessor.prototype);
    Stage.prototype.constructor = Stage;
    Stage.prototype.act = function() {};
    Stage.prototype.draw = function() {};

    var InputEvent = function() {}
    InputEvent.prototype = {
        constructor: InputEvent
    }

    var ClickListener = function() {}
    ClickListener.prototype = {
        constructor: ClickListener,
        clicked: function(event, x, y){}
    }
    
    var OrthographicCamera = function(viewportWidth, viewportHeight) {
		this.viewportWidth = viewportWidth;
		this.viewportHeight = viewportHeight;
    }
    OrthographicCamera.prototype = {
        constructor: OrthographicCamera,
        combined: null,
        position: new Vector3(),
        update: function() {}
    }
    
    var Texture = function(path) {
        this.path = path;
        this.sprite = PIXI.Sprite.fromImage(path);
        this.id = Texture.uniqueId++;
    }

    Texture.uniqueId = 0;

    Texture.TextureFilter = {
		Nearest: GL20.GL_NEAREST, 
        Linear: GL20.GL_LINEAR, 
        MipMap: GL20.GL_LINEAR_MIPMAP_LINEAR,
        MipMapNearestNearest:GL20.GL_NEAREST_MIPMAP_NEAREST, 
        MipMapLinearNearest: GL20.GL_LINEAR_MIPMAP_NEAREST, 
        MipMapNearestLinear: GL20.GL_NEAREST_MIPMAP_LINEAR, 
        MipMapLinearLinear: GL20.GL_LINEAR_MIPMAP_LINEAR
    }
    Texture.prototype = {
        constructor: Texture,
        setFilter: function(p0 ,p1) {}
    }

    var SpriteBatch = function() {
        this.sprites = new PIXI.Container()
    }
    SpriteBatch.prototype = {
        constructor: SpriteBatch,
        setProjectionMatrix: function(combined){},
        begin: function(){
            this.sprites.children.length = 0;
        },
        draw: function(texture, x, y){
            this.sprites.addChild(texture.sprite);
            texture.sprite.x = x;
            texture.sprite.y = y;
        },
        end: function(){
            _renderer.render(this.sprites);
        }
    }

    var TextureRegion = function(texture) {
        this.texture = texture;
    }
    TextureRegion.prototype = {
        constructor: TextureRegion
    }

    var TextureAtlas = function(packFile) {
        this.packFile = packFile
    }
    TextureAtlas.prototype = {
        constructor: TextureAtlas,
        createSprite: function(name){}
    }

    var BitmapFont = function(fontFile, region, flip) {
        this.fontFile = fontFile;
        this.region = region;
        this.flip = flip;
    }
    BitmapFont.prototype = {
        constructor: BitmapFont,
        setUseIntegerPositions: function(integer){}
    }

    var Graphics = function(config){
        this.config = config;
        this.gl20 = new GL20()
    }
    Graphics.prototype = {
        constructor: Graphics,
        frameId: -1,
        lastTime: 0,
        deltaTime: 0,
        frames: 0,
        time: 0,
        fps: 0,
        gl20: null,
        getDeltaTime: function () {return this.deltaTime;},
        getWidth: function() {return this.config.width;},
        getHeight: function() {return this.config.height;},
        getDensity: function() {return window.devicePixelRatio;},
        setupDisplay: function() {
            Gdx.gl = this.gl20
        },
        update: function(time) {
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

    var JsApplicationConfiguration = function(){}
    JsApplicationConfiguration.prototype = {
        constructor: JsApplicationConfiguration,
        height: 480,
        width: 640,
        fullscreen: false,
        title: null
    }

    var JsApplication = function(listener, config){
        if (config.title == null) {
            config.title = listener.constructor.name
        }
        this.config = config;
        this.graphics = new Graphics(config);
        this.audio = new Audio();
        this.files = new Files();
        this.input = new Input();
        this.net = new Net();
        this.listener = listener;
        Gdx.app = this;
        Gdx.graphics = this.graphics;
        Gdx.audio = this.audio;
        Gdx.files = this.files;
        Gdx.input = this.input;
        Gdx.net = this.net;
        this.initialize();
    }
    JsApplication.prototype = {
        constructor: JsApplication,
        listener: null,
        graphics: null,
        audio: null,
        input: null,
        files: null,
        net: null,
        gl: null,
        /**
         * Start the main loop
         */
        initialize: function() {

            _renderer = PIXI.autoDetectRenderer(this.config.width, this.config.height)
            document.body.appendChild(_renderer.view)

            this.graphics.setupDisplay();
            this.listener.create();
            var _this = this;
            var mainLoop = function(time) {

                _this.graphics.update(time);
                _this.graphics.frameId++;
                _this.listener.render();
                window.requestAnimationFrame(mainLoop);
            }
            window.requestAnimationFrame(mainLoop);
        },
    }


    return {
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
}());

