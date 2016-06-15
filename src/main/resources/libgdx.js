/**
 * libGDX.js
 *
 * MIT License
 * Copyright (c) 2016 Bruce Davidson &lt;darkoverlordofdata@gmail.com&gt;
 *
 * PIXI.js wrapper with libGDX api
 * partial implementation. to start, this is just enough for ShmupWarz to
 * run in the browser.
 */
var gdx = (function () {
    return {
        audio: {},
        files: {},
        graphics: {
            g2d: {},
        },
        math: {},
        scenes: {
            scene2d: {
                utils: {},
            }
        },
        utils: {
            viewport: {}
        }
    };
}());
/**
 * @JSName("gdx.math.Vector3")
 */
gdx.math.Vector3 = (function () {
    return class Vector3 {
        constructor() {
            this.set(0, 0, 0);
        }
        set(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
    }
    ;
}());
gdx.math.MathUtils = Math;
/**
 * libjs
 *
 * MIT License
 * Copyright (c) 2016 Bruce Davidson &lt;darkoverlordofdata@gmail.com&gt;
 *
 */
/**
 * @JSName("Gdx")
 */
gdx.Gdx = (function () {
    return {
        app: null,
        graphics: null,
        audio: null,
        files: null,
        input: null,
        get: null,
        gl: null,
        _resources: null,
        _internal: null,
        _renderer: null,
        _stage: null,
        _scaling: 1,
        _scaleX: 1,
        _scaleY: 1,
        _height: 0,
        _width: 0 // screen width
    };
}());
/**
 * @JSName("gdx.audio.Sound")
 */
gdx.audio.Sound = (function () {
    class Sound {
        play() {
        }
    }
    return Sound;
}());
/**
 * @JSName("gdx.files.FileHandle")
 */
gdx.files.FileHandle = (function () {
    var Gdx = gdx.Gdx;
    class FileHandle {
        constructor(path) {
            this.path = path;
        }
        readString() {
            return Gdx._internal[this.path].xhr.responseText;
        }
    }
    return FileHandle;
}());
/**
 * @JSName("gdx.graphics.g2d.Batch")
 */
gdx.graphics.g2d.Batch = (function () {
    var Gdx = gdx.Gdx;
    class Batch {
        constructor() {
            this.sprites = new PIXI.Container();
            Gdx._stage.addChild(this.sprites);
        }
        begin() {
            this.sprites.children.length = 0;
        }
        draw(texture, x, y, width = -1, height = -1) {
            if (texture.texture) {
                this.sprites.addChild(texture.texture.sprite);
                texture.texture.sprite.x = x;
                texture.texture.sprite.y = y;
            }
            else {
                this.sprites.addChild(texture);
                texture.x = x;
                texture.y = y;
            }
        }
        end() {
            Gdx._renderer.render(Gdx._stage);
        }
        setProjectionMatrix(projection) {
        }
    }
    return Batch;
}());
/**
 * @JSName("gdx.graphics.g2d.BitmapFont")
 */
gdx.graphics.g2d.BitmapFont = (function () {
    var Gdx = gdx.Gdx;
    class BitmapFont {
        constructor(fontFile, region, integer) {
            this.fontFile = fontFile;
            this.region = region;
            this.integer = integer;
            let name = this.fontFile.path.split('/').pop().split('.')[0];
            let dom = (new DOMParser()).parseFromString(Gdx._resources[name].xhr.responseText, 'text/xml');
            this.face = dom.evaluate('/font/info/@face', dom, null, XPathResult.STRING_TYPE, null).stringValue;
            this.size = dom.evaluate('/font/info/@size', dom, null, XPathResult.STRING_TYPE, null).stringValue;
        }
        setUseIntegerPositions(integer) { }
        getWidth() { }
        getHeight() { }
        draw(batch, str, x, y) {
            let texture = new PIXI.extras.BitmapText(str, { font: `${this.size}px ${this.face}`, align: 'right' });
            batch.draw(texture, x, Gdx._height - y);
        }
    }
    return BitmapFont;
}());
gdx.graphics.g2d.SpriteBatch = (function () {
    var Batch = gdx.graphics.g2d.Batch;
    /**
     * @JSName("gdx.graphics.g2d.SpriteBatch")
     */
    return class SpriteBatch extends Batch {
    }
    ;
}());
/**
 * @JSName("gdx.graphics.g2d.TextureAtlas")
 */
gdx.graphics.g2d.TextureAtlas = (function () {
    return class TextureAtlas {
        constructor(packFile) {
            this.packFile = packFile;
        }
        createSprite(name) { }
    }
    ;
}());
/**
 * @JSName("gdx.graphics.g2d.TextureRegion")
 */
gdx.graphics.g2d.TextureRegion = (function () {
    return class TextureRegion {
        constructor(texture) {
            this.texture = texture;
        }
    }
    ;
}());
gdx.graphics.g2d.Sprite = (function () {
    var Gdx = gdx.Gdx;
    var TextureRegion = gdx.graphics.g2d.TextureRegion;
    /**
     * @JSName("gdx.graphics.g2d.Sprite")
     */
    return class Sprite extends TextureRegion {
        constructor(texture) {
            super(texture);
        }
        getWidth() { return this.texture.sprite._texture.width; }
        getHeight() { return this.texture.sprite._texture.height; }
        setX(value) {
        }
        setY(value) {
        }
        setColor(red, green, blue, alpha) {
        }
        setScale(x, y) {
            this.texture.sprite.scale.set(x, y);
        }
        setPosition(x, y) {
            //this.texture.sprite.position.set(x, y);
            //this.texture.sprite.position.set(Gdx.graphics.getWidth()-x, Gdx.graphics.getHeight()-y);
            this.texture.sprite.position.set(x, Gdx.graphics.getHeight() - y - this.texture.sprite._texture.height);
        }
        draw(batch) {
            batch.draw(this, this.texture.sprite.position.x, this.texture.sprite.position.y);
        }
    }
    ;
}());
gdx.graphics.Camera = (function () {
    var Vector3 = gdx.math.Vector3;
    /**
     * @JSName("gdx.graphics.Camera")
     */
    return class Camera {
        constructor(viewportWidth, viewportHeight) {
            this.position = new Vector3();
            this.viewportWidth = viewportWidth;
            this.viewportHeight = viewportHeight;
        }
        update() { }
    }
    ;
}());
gdx.graphics.GL20 = (function () {
    var Gdx = gdx.Gdx;
    /**
     * @JSName("gdx.graphics.GL20")
     */
    class GL20 {
        glClearColor(red, green, blue, alpha) {
            let hexColor = ((1 << 24) + (red * 255 << 16) + (green * 255 << 8) + blue * 255); //.toString(16).substr(1);
            Gdx._renderer.backgroundColor = hexColor;
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
    return GL20;
}());
gdx.graphics.OrthographicCamera = (function () {
    var Camera = gdx.graphics.Camera;
    /**
     * @JSName("gdx.graphics.OrthographicCamera")
     */
    return class OrthographicCamera extends Camera {
        constructor(viewportWidth, viewportHeight) {
            super(viewportWidth, viewportHeight);
            this.combined = null;
        }
        update() { }
    }
    ;
}());
gdx.graphics.Texture = (function () {
    var GL20 = gdx.graphics.GL20;
    var Gdx = gdx.Gdx;
    /**
     * @JSName("gdx.graphics.Texture")
     */
    class Texture {
        constructor(path) {
            //let file = Gdx.files.internal(path);
            if (typeof path === 'string')
                this.path = Gdx._resources[path] ? Gdx._resources[path].url : path;
            else
                this.path = path.path;
            this.sprite = PIXI.Sprite.fromImage(this.path);
            this.id = Texture.uniqueId++;
        }
        setFilter(minFilter, magFilter) { }
    }
    Texture.uniqueId = 0;
    /**
     * @JSName("gdx.graphics.Texture.TextureFilter")
     */
    Texture.TextureFilter = {
        Nearest: GL20.GL_NEAREST,
        Linear: GL20.GL_LINEAR,
        MipMap: GL20.GL_LINEAR_MIPMAP_LINEAR,
        MipMapNearestNearest: GL20.GL_NEAREST_MIPMAP_NEAREST,
        MipMapLinearNearest: GL20.GL_LINEAR_MIPMAP_NEAREST,
        MipMapNearestLinear: GL20.GL_NEAREST_MIPMAP_LINEAR,
        MipMapLinearLinear: GL20.GL_LINEAR_MIPMAP_LINEAR
    };
    return Texture;
}());
/**
 * @JSName("gdx.scenes.scene2d.utils.ClickListener")
 */
gdx.scenes.scene2d.utils.ClickListener = (function () {
    return class ClickListener {
        clicked(event, x, y) { }
    }
    ;
}());
/**
 * @JSName("gdx.scenes.scene2d.Actor")
 */
gdx.scenes.scene2d.Actor = (function () {
    return class Actor {
        constructor() {
            this.width = 0;
            this.height = 0;
            this.x = 0;
            this.y = 0;
            this.scale = 0;
            this.listeners = [];
        }
        getWidth() { return Math.ceil(this.width); }
        getHeight() { return Math.ceil(this.height); }
        setX(x) {
            this.x = x;
        }
        setY(y) {
            this.y = y;
        }
        setScale(scaleXY) {
            this.scale = scaleXY;
        }
        addListener(listener) {
            console.log(listener);
            this.listeners.push(listener);
        }
    }
    ;
}());
/**
 * @JSName("gdx.scenes.scene2d.Event")
 */
gdx.scenes.scene2d.Event = (function () {
    return class Event {
    }
    ;
}());
/**
 * @JSName("gdx.scenes.scene2d.EventListener")
 */
gdx.scenes.scene2d.EventListener = (function () {
    return class EventListener {
    }
    ;
}());
/**
 * @JSName("gdx.scenes.scene2d.InputEvent")
 */
gdx.scenes.scene2d.InputEvent = (function () {
    return class InputEvent {
    }
    ;
}());
gdx.scenes.scene2d.InputListener = (function () {
    var EventListener = gdx.scenes.scene2d.EventListener;
    /**
     * @JSName("gdx.scenes.scene2d.InputListener")
     */
    return class InputListener extends EventListener {
    }
    ;
}());
gdx.utils.Scaling = (function () {
    /**
     * @JSName("gdx.utils.Scaling")
     */
    return {
        fit: 0,
        fill: 1,
        fillX: 2,
        fillY: 3,
        stretch: 4,
        stretchX: 5,
        stretchY: 6,
        none: 7
    };
}());
/**
 * @JSName("gdx.utils.viewport.Viewport")
 */
gdx.utils.viewport.Viewport = (function () {
    return class Viewport {
        update(x, y) {
        }
        /**
        * applyCamera
        *
        * Calls to the apply method of an object x map to
        * calling x, i.e., x(...) instead of x.apply(...).
        * @see https://www.scala-js.org/doc/interoperability/facade-types.html
        */
        applyCamera() {
        }
    }
    ;
}());
gdx.utils.viewport.ScalingViewport = (function () {
    var Viewport = gdx.utils.viewport.Viewport;
    var OrthographicCamera = gdx.graphics.OrthographicCamera;
    /**
     * @JSName("gdx.utils.viewport.ScalingViewport")
     */
    return class ScalingViewport extends Viewport {
        constructor(scaling, worldWidth, worldHeight, camera) {
            super();
            this.scaling = scaling;
            this.worldWidth = worldWidth;
            this.worldHeight = worldHeight;
            this.camera = camera ? camera : new OrthographicCamera();
        }
    }
    ;
}());
gdx.utils.viewport.FillViewport = (function () {
    var Scaling = gdx.utils.Scaling;
    var ScalingViewport = gdx.utils.viewport.ScalingViewport;
    /**
     * @JSName("gdx.utils.viewport.FillViewport")
     */
    return class FillViewport extends ScalingViewport {
        constructor(worldWidth, worldHeight, camera) {
            super(Scaling.fill, worldWidth, worldHeight, camera);
        }
    }
    ;
}());
gdx.utils.viewport.FitViewport = (function () {
    var Scaling = gdx.utils.Scaling;
    var ScalingViewport = gdx.utils.viewport.ScalingViewport;
    /**
     * @JSName("gdx.utils.viewport.FitViewport")
     */
    return class FitViewport extends ScalingViewport {
        constructor(worldWidth, worldHeight, camera) {
            super(Scaling.fit, worldWidth, worldHeight, camera);
        }
    }
    ;
}());
gdx.Audio = (function () {
    var Sound = gdx.audio.Sound;
    /**
     * @JSName("gdx.Audio")
     */
    return class Audio {
        newSound(raw) {
            return new Sound(raw);
        }
    }
    ;
}());
gdx.Files = (function () {
    var FileHandle = gdx.files.FileHandle;
    /**
     * @JSName("gdx.Files")
     */
    return class Files {
        internal(path) {
            return new FileHandle(path);
        }
    }
    ;
}());
gdx.Graphics = (function () {
    var GL20 = gdx.graphics.GL20;
    var Gdx = gdx.Gdx;
    /**
     * @JSName("gdx.Graphics")
     */
    return class Graphics {
        constructor(config) {
            this.config = config;
            this.gl20 = new GL20();
            this.frameId = -1;
            this.lastTime = 0;
            this.deltaTime = 0;
            this.frames = 0;
            this.time = 0;
            this.fps = 0;
        }
        getDeltaTime() { return this.deltaTime; }
        getWidth() { return this.config.width; }
        getHeight() { return this.config.height; }
        getDensity() { return window.devicePixelRatio; }
        setupDisplay() {
            Gdx.gl = this.gl20;
        }
        update(time) {
            if (this.lastTime <= 0) {
                this.lastTime = time;
                return;
            }
            this.deltaTime = (time - this.lastTime) * .001;
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
    ;
}());
gdx.Input = (function () {
    var Gdx = gdx.Gdx;
    /**
     * @JSName("gdx.Input")
     */
    class Input {
        setInputProcessor(processor) {
            Gdx._processor = processor;
            document.addEventListener('touchstart', (event) => {
                let pixel = window.devicePixelRatio;
                event = event.targetTouches ? event.targetTouches[0] : event;
                Gdx._processor.touchDown(Math.ceil(event.clientX / Gdx._scaleX * pixel), Math.ceil(event.clientY / Gdx._scaleY * pixel), 0, 0);
            }, true);
            document.addEventListener('touchmove', (event) => {
                let pixel = window.devicePixelRatio;
                event = event.targetTouches ? event.targetTouches[0] : event;
                Gdx._processor.touchDragged(Math.ceil(event.clientX / Gdx._scaleX * pixel), Math.ceil(event.clientY / Gdx._scaleY * pixel), 0);
            }, true);
            document.addEventListener('touchend', (event) => {
                event = event.targetTouches ? event.targetTouches[0] : event;
                Gdx._processor.touchUp(0, 0, 0, 0);
            }, true);
            document.addEventListener('mousedown', (event) => {
                Gdx._processor.touchDown(Math.ceil(event.clientX / Gdx._scaleX), Math.ceil(event.clientY / Gdx._scaleY), -1, event.button);
            }, true);
            document.addEventListener('mousemove', (event) => {
                Gdx._processor.mouseMoved(Math.ceil(event.clientX / Gdx._scaleX), Math.ceil(event.clientY / Gdx._scaleY));
            }, true);
            document.addEventListener('mouseup', (event) => {
                Gdx._processor.touchUp(Math.ceil(event.clientX / Gdx._scaleX), Math.ceil(event.clientY / Gdx._scaleY), -1, event.button);
            }, true);
            window.addEventListener('keydown', (event) => Gdx._processor.keyDown(event.keyCode), true);
            window.addEventListener('keyup', (event) => Gdx._processor.keyUp(event.keyCode), true);
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
    };
    /**
     * @JSName("gdx.InpuyKeys")
     */
    Input.Keys = {
        A: 54,
        Z: 90
    };
    return Input;
}());
gdx.JsApplication = (function () {
    var Graphics = gdx.Graphics;
    var Audio = gdx.Audio;
    var Files = gdx.Files;
    var Input = gdx.Input;
    var Gdx = gdx.Gdx;
    var Scaling = gdx.utils.Scaling;
    function resize() {
        switch (Gdx._scaling) {
            case Scaling.fit:
                // Determine which screen dimension is least constrained
                Gdx._scaleX = Gdx._scaleY = Math.max(window.innerWidth / Gdx._width, window.innerHeight / Gdx._height);
                break;
            case Scaling.fill:
                // Determine which screen dimension is most constrained
                Gdx._scaleX = Gdx._scaleY = Math.min(window.innerWidth / Gdx._width, window.innerHeight / Gdx._height);
                break;
            case Scaling.fillX:
                Gdx._scaleX = window.innerWidth / Gdx._width;
                Gdx._scaleY = Gdx._scaleX;
                break;
            case Scaling.fillY:
                Gdx._scaleY = window.innerHeight / Gdx._height;
                Gdx._scaleX = Gdx._scaleY;
                break;
            case Scaling.stretch:
                Gdx._scaleX = window.innerWidth / Gdx._width;
                Gdx._scaleY = window.innerHeight / Gdx._height;
                break;
            case Scaling.stretchX:
                Gdx._scaleX = window.innerWidth / Gdx._width;
                Gdx._scaleY = Gdx._scaleX;
                break;
            case Scaling.stretchY:
                Gdx._scaleY = window.innerHeight / Gdx._height;
                Gdx._scaleX = Gdx._scaleY;
                break;
        }
        Gdx._stage.scale.x = Gdx._scaleX;
        Gdx._stage.scale.y = Gdx._scaleY;
        Gdx._renderer.resize(Math.ceil(Gdx._width * Gdx._scaleX), Math.ceil(Gdx._height * Gdx._scaleY));
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
            var xhr = new XMLHttpRequest();
            xhr.open('get', url, true);
            xhr.responseType = 'json';
            xhr.onload = () => {
                var status = xhr.status;
                if (status == 200) {
                    resolve(xhr.response);
                }
                else {
                    reject(status);
                }
            };
            xhr.send();
        });
    }
    /**
     * @JSName("gdx.JsApplication")
     */
    return class JsApplication {
        constructor(listener, config) {
            if (config.title === null) {
                config.title = listener.constructor.name;
            }
            document.title = config.title;
            this.config = config;
            this.graphics = new Graphics(config);
            this.audio = new Audio();
            this.files = new Files();
            this.input = new Input();
            //this.net = new Net();
            this.gl = null;
            this.listener = listener;
            Gdx.app = this;
            Gdx.graphics = this.graphics;
            Gdx.audio = this.audio;
            Gdx.files = this.files;
            Gdx.input = this.input;
            //Gdx.net = this.net;
            /**
             * Load the manifest, and initialize
             */
            getJSON('manifest.json').then(data => {
                for (let name in data.atlas) {
                    PIXI.loader.add(name, data.atlas[name]);
                }
                PIXI.loader.load((loader, res) => {
                    console.log(res);
                    Gdx._resources = Object.create(res);
                    for (let path in data.files) {
                        console.log(data.files[path]);
                        PIXI.loader.add(data.files[path]);
                    } //_internal
                    PIXI.loader.load((loader, res) => {
                        console.log(res);
                    });
                    this.initialize();
                });
            }, status => console.log(`error ${status}: Unable to load manifest.json`));
        }
        /**
         * Start the main loop
         */
        initialize() {
            //console.log(JSON.parse(Gdx._resources['main'].xhr.responseText));
            Gdx._width = this.config.width; //*window.devicePixelRatio;
            Gdx._height = this.config.height; //*window.devicePixelRatio;
            Gdx._renderer = PIXI.autoDetectRenderer(this.config.width, this.config.height, {
                antialiasing: false,
                transparent: false,
                resolution: window.devicePixelRatio,
                autoResize: true
            });
            Gdx._renderer.view.style.position = "absolute";
            Gdx._renderer.view.style.top = "0px";
            Gdx._renderer.view.style.left = "0px";
            Gdx._stage = new PIXI.Container();
            resize(); // listener.resize();
            document.body.appendChild(Gdx._renderer.view);
            window.addEventListener("resize", resize);
            this.graphics.setupDisplay();
            this.listener.create();
            let mainLoop = (time) => {
                this.graphics.update(time);
                this.graphics.frameId++;
                this.listener.render();
                window.requestAnimationFrame(mainLoop);
            };
            window.requestAnimationFrame(mainLoop);
        }
    }
    ;
}());
/**
 * @JSName("gdx.JsApplicationConfiguration")
 */
gdx.JsApplicationConfiguration = (function () {
    return class JsApplicationConfiguration {
        constructor() {
            this.height = 480;
            this.width = 640;
            this.fullscreen = false;
            this.title = null;
        }
    }
    ;
}());
