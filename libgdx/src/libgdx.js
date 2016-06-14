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
(function(window, document) {
    "use strict";
    // var _processor = null;  // reference to input processor
    // // var _internal = null;
    // var gdx._resources = null;  // list of all loaded resources
    // //var gdx._renderer = null;   // pixi renderer
    // var gdx._stage = null;      // top level stage
    // var gdx._scaling = 1;       // Scaling.fill
    // var gdx._scaleX = 1;        // screen scaling x
    // var gdx._scaleY = 1;        // screen scaling y
    // var gdx._height = 0;        // screen height
    // var gdx._width = 0;         // screen width

    // /**
    //  * getJSON
    //  * 
    //  * Load a json resource
    //  *
    //  * @see https://mathiasbynens.be/notes/xhr-responsetype-json
    //  * @param url
    //  * @returns Promise
    //  */
    // function getJSON(url) {
    //     return new Promise((resolve, reject) => {
    //         var xhr = new XMLHttpRequest();
    //         xhr.open('get', url, true);
    //         xhr.responseType = 'json';
    //         xhr.onload = () => {
    //             var status = xhr.status;
    //             if (status == 200) {
    //                 resolve(xhr.response);
    //             } else {
    //                 reject(status);
    //             }
    //         };
    //         xhr.send();
    //     });
    // }

    // /**
    //  * @JSName("gdx.audio.Sound")
    //  */
    // class Sound {
    //     play() {
    //     }
    // }

    // /**
    //  * @JSName("gdx.files.FileHandle")
    //  */
    // class FileHandle {
    //     constructor(path) {
    //         this.path = path;
    //     }
    //     readString() {
    //         return _internal[this.path].xhr.responseText;
    //     }

    // }

    // /**
    //  * @JSName("gdx.graphics.Camera")
    //  */
    // class Camera {
    //     constructor(viewportWidth, viewportHeight) {
    //         this.position = new Vector3();
    //         this.viewportWidth = viewportWidth;
    //         this.viewportHeight = viewportHeight;
    //     }
    //     update() {}
    // }

    // /**
    //  * @JSName("gdx.graphics.OrthographicCamera")
    //  */
    // class OrthographicCamera extends Camera {
    //     constructor(viewportWidth, viewportHeight) {
    //         super(viewportWidth, viewportHeight);
    //         this.combined = null;
    //     }
    //     update() {}

    // }


    // /**
    //  * @JSName("gdx.graphics.GL20")
    //  */
    // class GL20 {
    //     glClearColor(red, green, blue, alpha) {
    //         let hexColor = ((1 << 24) + (red*255 << 16) + (green*255 << 8) + blue*255)//.toString(16).substr(1);
    //         gdx._renderer.backgroundColor = hexColor;
    //     }
    //     glClear(mask) {
    //     }
    // }

    // GL20.GL_COLOR_BUFFER_BIT = 0x00004000;
	// GL20.GL_NEAREST = 0x2600;
    // GL20.GL_LINEAR = 0x2601;
    // GL20.GL_LINEAR_MIPMAP_LINEAR = 0x2703;
	// GL20.GL_NEAREST_MIPMAP_NEAREST = 0x2700;
    // GL20.GL_LINEAR_MIPMAP_NEAREST = 0x2701;
	// GL20.GL_NEAREST_MIPMAP_LINEAR = 0x2702;
    // GL20.GL_LINEAR_MIPMAP_LINEAR = 0x2703;

    // /**
    //  * @JSName("gdx.graphics.Texture")
    //  */
    // class Texture {
    //     constructor(path) {
    //         //let file = Gdx.files.internal(path);

    //         if (typeof path === 'string')
    //             this.path = gdx._resources[path] ? gdx._resources[path].url : path;
    //         else
    //             this.path = path.path;
                
    //         this.sprite = PIXI.Sprite.fromImage(this.path);
    //         this.id = Texture.uniqueId++;
    //     }
    //     setFilter(minFilter ,magFilter) {}
    // }
    // Texture.uniqueId = 0;

    // /**
    //  * @JSName("gdx.graphics.Texture.TextureFilter")
    //  */
    // Texture.TextureFilter = {
	// 	Nearest: GL20.GL_NEAREST,
    //     Linear: GL20.GL_LINEAR,
    //     MipMap: GL20.GL_LINEAR_MIPMAP_LINEAR,
    //     MipMapNearestNearest:GL20.GL_NEAREST_MIPMAP_NEAREST,
    //     MipMapLinearNearest: GL20.GL_LINEAR_MIPMAP_NEAREST,
    //     MipMapNearestLinear: GL20.GL_NEAREST_MIPMAP_LINEAR,
    //     MipMapLinearLinear: GL20.GL_LINEAR_MIPMAP_LINEAR
    // }

    // /**
    //  * @JSName("gdx.graphics.g2d.Batch")
    //  */
    // class Batch {
    //     constructor() {
    //         this.sprites = new PIXI.Container();
    //         gdx._stage.addChild(this.sprites)
    //     }

    //     begin() {
    //         this.sprites.children.length = 0;
    //     }
    //     draw(texture, x, y, width=-1, height=-1) {
    //         if (texture.texture) {
    //             this.sprites.addChild(texture.texture.sprite);
    //             texture.texture.sprite.x = x;
    //             texture.texture.sprite.y = y;
    //         } else {
    //             this.sprites.addChild(texture);
    //             texture.x = x;
    //             texture.y = y;
    //         }
    //     }
    //     end() {
    //         gdx._renderer.render(gdx._stage);
    //     }
    //     setProjectionMatrix(projection) {

    //     }

    // }

    // /**
    //  * @JSName("gdx.graphics.g2d.BitmapFont")
    //  */
    // class BitmapFont {
    //     constructor(fontFile, region, integer) {
    //         this.fontFile = fontFile;
    //         this.region = region;
    //         this.integer = integer;
            
    //         let name = this.fontFile.path.split('/').pop().split('.')[0];
    //         let dom = (new DOMParser()).parseFromString(gdx._resources[name].xhr.responseText, 'text/xml');
    //         this.face = dom.evaluate('/font/info/@face', dom, null, XPathResult.STRING_TYPE, null).stringValue;
    //         this.size = dom.evaluate('/font/info/@size', dom, null, XPathResult.STRING_TYPE, null).stringValue;
    //     }
    //     setUseIntegerPositions(integer) {}
    //     getWidth() {}
    //     getHeight() {}
    //     draw(batch, str, x, y) {
    //         let texture = new PIXI.extras.BitmapText(str, {font: `${this.size}px ${this.face}`, align: 'right' });
    //         batch.draw(texture, x, gdx._height-y);
    //     }
    // }

    // /**
    //  * @JSName("gdx.graphics.g2d.TextureRegion")
    //  */
    // class TextureRegion {
    //     constructor(texture) {
    //         this.texture = texture;
    //     }
    // }

    // /**
    //  * @JSName("gdx.graphics.g2d.Sprite")
    //  */
    // class Sprite extends TextureRegion {
    //     constructor(texture) {
    //         super(texture);
    //     }
    //     getWidth() {return this.texture.sprite._texture.width;}
    //     getHeight(){return this.texture.sprite._texture.height;}
    //     setX(value){

    //     }
    //     setY(value) {

    //     }
    //     setColor(red, green, blue, alpha) {

    //     }
    //     setScale(x, y) {
    //         this.texture.sprite.scale.set(x, y);
    //     }
    //     setPosition(x, y) {
    //         //this.texture.sprite.position.set(x, y);
    //         //this.texture.sprite.position.set(Gdx.graphics.getWidth()-x, Gdx.graphics.getHeight()-y);
    //         this.texture.sprite.position.set(x, Gdx.graphics.getHeight()-y-this.texture.sprite._texture.height);
    //     }
    //     draw(batch) {
    //         batch.draw(this, this.texture.sprite.position.x, this.texture.sprite.position.y)
    //     }
    // }

    // /**
    //  * @JSName("gdx.graphics.g2d.SpriteBatch")
    //  */
    // class SpriteBatch extends Batch {}

    // /**
    //  * @JSName("gdx.graphics.g2d.TextureAtlas")
    //  */
    // class TextureAtlas {
    //     constructor(packFile) {
    //         this.packFile = packFile
    //     }
    //     createSprite(name){}
    // }


    // /**
    //  * @JSName("gdx.math.Vector3")
    //  */
    // class Vector3 {
    //     constructor() {
    //         this.set(0, 0, 0);
    //     }
    //     set(x, y, z) {
    //         this.x = x;
    //         this.y = y;
    //         this.z = z;
    //     }
    // }

    // /**
    //  * @JSName("gdx.scenes.scene2d.utils.ClickListener")
    //  */
    // class ClickListener {
    //     clicked(event, x, y){}
    // }

    // /**
    //  * @JSName("gdx.scenes.scene2d.Actor")
    //  */
    // class Actor {

    //     constructor() {
    //         this.width = 0;
    //         this.height = 0;
    //         this.x = 0;
    //         this.y = 0;
    //         this.scale = 0;
    //         this.listeners = []        
    //     }

    //     getWidth() {return Math.ceil(this.width);}
    //     getHeight() {return Math.ceil(this.height);}

    //     setX(x) {
    //         this.x = x;
    //     }
    //     setY(y) {
    //         this.y = y;
    //     }
    //     setScale(scaleXY) {
    //         this.scale = scaleXY;
    //     }
    //     addListener(listener) {
    //         console.log(listener)
    //         this.listeners.push(listener);
    //     }
    // }

    // /**
    //  * @JSName("gdx.scenes.scene2d.Event")
    //  */
    // class Event {}

    // /**
    //  * @JSName("gdx.scenes.scene2d.EventListener")
    //  */
    // class EventListener {}

    // /**
    //  * @JSName("gdx.scenes.scene2d.InputEvent")
    //  */
    // class InputEvent {}

    // /**
    //  * @JSName("gdx.scenes.scene2d.InputListener")
    //  */
    // class InputListener extends EventListener {}
    // class InputProcessor {

    //      keyDown(keycode){}
    //      keyUp(keycode){}
    //      keyTyped(character){}
    //      touchDown(screenX, screenY, pointer, button){}
    //      touchUp(screenX, screenY, pointer, button){}
    //      touchDragged(screenX, screenY, pointer){}
    //      mouseMoved(screenX, screenY){}
    //      scrolled(amount){}
    // }


    // /**
    //  * @JSName("gdx.scenes.scene2d.Stage")
    //  */
    // class Stage extends InputProcessor {
    //     getWidth(){}
    //     getHeight(){}
    //     act() {

    //     }
    //     draw() {

    //     }
    //     addActor(actor) {

    //     }
    // }

    // /**
    //  * @JSName("gdx.utils.Scaling")
    //  */
    // var Scaling = {
    //     fit: 0,
    //     fill: 1,
    //     fillX: 2,
    //     fillY: 3,
    //     stretch: 4,
    //     stretchX: 5,
    //     stretchY: 6,
    //     none: 7
    // }


    // /**
    //  * @JSName("gdx.utils.viewport.Viewport")
    //  */
    // class Viewport {
    //     update(x, y) {
            
    //     }
    //     /**
    //     * applyCamera
    //     * 
    //     * Calls to the apply method of an object x map to 
    //     * calling x, i.e., x(...) instead of x.apply(...). 
    //     * @see https://www.scala-js.org/doc/interoperability/facade-types.html
    //     */
    //     applyCamera() {
    //     }
    // }

    // /**
    //  * @JSName("gdx.utils.viewport.ScalingViewport")
    //  */
    // class ScalingViewport extends Viewport {
    //     constructor(scaling, worldWidth, worldHeight, camera) {
    //         super();
    //         this.scaling = scaling;
    //         this.worldWidth = worldWidth;
    //         this.worldHeight = worldHeight;
    //         this.camera = camera ? camera : new OrthographicCamera();
    //     }
    // }

    // /**
    //  * @JSName("gdx.utils.viewport.FillViewport")
    //  */
    // class FillViewport extends ScalingViewport {
    //     constructor(worldWidth, worldHeight, camera) {
    //         super(Scaling.fill, worldWidth, worldHeight, camera);
    //     }
    // }

    // /**
    //  * @JSName("gdx.utils.viewport.FitViewport")
    //  */
    // class FitViewport extends ScalingViewport {
    //     constructor(worldWidth, worldHeight, camera) {
    //         super(Scaling.fit, worldWidth, worldHeight, camera);
    //     }
    // }

    /**
     * @JSName("gdx.utils.Json")
     */
    class Json {
    }

    // /**
    //  * @JSName("gdx.Audio")
    //  */
    // class Audio{
    //     newSound(raw) {
    //         return new Sound(raw);
    //     }
    // }

    // /**
    //  * @JSName("gdx.Files")
    //  */
    // class Files{
    //     internal(path) {
    //         return new FileHandle(path)
    //     }
    // }

    // /**
    //  * @JSName("gdx.Gdx")
    //  */
    // const Gdx = {
    //     app: null,
    //     graphics: null,
    //     audio: null,
    //     files: null,
    //     input: null,
    //     get: null,
    //     gl: null
    // }

    // /**
    //  * @JSName("gdx.Graphics")
    //  */
    // class Graphics {
    //     constructor(config){
    //         this.config = config;
    //         this.gl20 = new GL20()
    //         this.frameId = -1;
    //         this.lastTime = 0;
    //         this.deltaTime = 0;
    //         this.frames = 0;
    //         this.time = 0;
    //         this.fps = 0;
    //     }

    //     getDeltaTime() {return this.deltaTime;}
    //     getWidth() {return this.config.width;}
    //     getHeight() {return this.config.height;}
    //     getDensity() {return window.devicePixelRatio;}
    //     setupDisplay() {
    //         Gdx.gl = this.gl20;
    //     }
    //     update(time) {
    //         if (this.lastTime <= 0) {
    //             this.lastTime = time;
    //             return;
    //         }

    //         this.deltaTime = (time - this.lastTime) * .001
    //         this.lastTime = time;
    //         this.time += this.deltaTime;
    //         this.frames++;
    //         if (this.time > 1) {
    //             this.fps = this.frames;
    //             this.time = 0;
    //             this.frames = 0;
    //         }
    //     }
    // }

    // /**
    //  * @JSName("gdx.Input")
    //  */
    // class Input {

    //     setInputProcessor(processor) {
    //         _processor = processor;
            
    //         document.addEventListener('touchstart', (event) => {
    //             let pixel = window.devicePixelRatio
    //             event = event.targetTouches ? event.targetTouches[0] : event;
    //             _processor.touchDown(Math.ceil(event.clientX/gdx._scaleX*pixel), Math.ceil(event.clientY/gdx._scaleY*pixel), 0, 0)
    //         }, true);
    //         document.addEventListener('touchmove', (event) =>  {
    //             let pixel = window.devicePixelRatio
    //             event = event.targetTouches ? event.targetTouches[0] : event;
    //             _processor.touchDragged(Math.ceil(event.clientX/gdx._scaleX*pixel), Math.ceil(event.clientY/gdx._scaleY*pixel), 0)
    //         }, true);
    //         document.addEventListener('touchend', (event) =>  {
    //             event = event.targetTouches ? event.targetTouches[0] : event;
    //             _processor.touchUp(0, 0, 0, 0)
    //         }, true);
    //         document.addEventListener('mousedown', (event) =>  {
    //             _processor.touchDown(Math.ceil(event.clientX/gdx._scaleX), Math.ceil(event.clientY/gdx._scaleY), -1, event.button)
    //         }, true);
    //         document.addEventListener('mousemove', (event) =>  {
    //             _processor.mouseMoved(Math.ceil(event.clientX/gdx._scaleX), Math.ceil(event.clientY/gdx._scaleY))
    //         }, true);
    //         document.addEventListener('mouseup', (event) =>  {
    //             _processor.touchUp(Math.ceil(event.clientX/gdx._scaleX), Math.ceil(event.clientY/gdx._scaleY), -1, event.button)
    //         }, true);
    //         window.addEventListener('keydown', (event) => _processor.keyDown(event.keyCode), true);
    //         window.addEventListener('keyup', (event) => _processor.keyUp(event.keyCode), true);
    //     }
    // }

    // /**
    //  * @JSName("gdx.Input.Buttons")
    //  */
    // Input.Buttons = {
    //     LEFT: 0,
    //     RIGHT: 1,
    //     MIDDLE: 2,
    //     BACK: 3,
    //     FORWARD: 4
    // }

    // /**
    //  * @JSName("gdx.InpuyKeys")
    //  */
    // Input.Keys = {
    //     A: 54,
    //     Z: 90
    // }

    class Net{}

    // /**
    //  * @JSName("gdx.JsApplicationConfiguration")
    //  */
    // class JsApplicationConfiguration {
    //     constructor() {
    //         this.height = 480;
    //         this.width = 640;
    //         this.fullscreen = false;
    //         this.title = null;
    //     }
    // }
    
    // function resize() {
    //     switch(gdx._scaling) {
    //         case Scaling.fit:
    //             // Determine which screen dimension is least constrained
    //             gdx._scaleX = gdx._scaleY = Math.max(window.innerWidth/gdx._width, window.innerHeight/gdx._height);
    //             break;
    //         case Scaling.fill:
    //             // Determine which screen dimension is most constrained
    //             gdx._scaleX = gdx._scaleY = Math.min(window.innerWidth/gdx._width, window.innerHeight/gdx._height);
    //             break;
    //         case Scaling.fillX:
    //             gdx._scaleX = window.innerWidth/gdx._width
    //             gdx._scaleY = gdx._scaleX
    //             break;
    //         case Scaling.fillY:
    //             gdx._scaleY = window.innerHeight/gdx._height
    //             gdx._scaleX = gdx._scaleY
    //             break;
    //         case Scaling.stretch:
    //             gdx._scaleX = window.innerWidth/gdx._width
    //             gdx._scaleY = window.innerHeight/gdx._height
    //             break;
    //         case Scaling.stretchX:
    //             gdx._scaleX = window.innerWidth/gdx._width
    //             gdx._scaleY = gdx._scaleX
    //             break;
    //         case Scaling.stretchY:
    //             gdx._scaleY = window.innerHeight/gdx._height
    //             gdx._scaleX = gdx._scaleY
    //             break;
    //     }
    //     gdx._stage.scale.x = gdx._scaleX;
    //     gdx._stage.scale.y = gdx._scaleY;
    //     gdx._renderer.resize(Math.ceil(gdx._width * gdx._scaleX), Math.ceil(gdx._height * gdx._scaleY));
    // }    
    

    // /**
    //  * @JSName("gdx.JsApplication")
    //  */
    // class JsApplication {
    //     constructor(listener, config){

    //         if (config.title === null) {
    //             config.title = listener.constructor.name;
    //         }
    //         document.title = config.title;
    //         this.config = config;
    //         this.graphics = new Graphics(config);
    //         this.audio = new Audio();
    //         this.files = new Files();
    //         this.input = new Input();
    //         this.net = new Net();
    //         this.gl = null;
    //         this.listener = listener;
    //         Gdx.app = this;
    //         Gdx.graphics = this.graphics;
    //         Gdx.audio = this.audio;
    //         Gdx.files = this.files;
    //         Gdx.input = this.input;
    //         Gdx.net = this.net;
    //         /**
    //          * Load the manifest, and initialize
    //          */
    //         getJSON('manifest.json').then(data => {
    //             for (let name in data.atlas) {
    //                 PIXI.loader.add(name, data.atlas[name]);
    //             }
    //             PIXI.loader.load( (loader, res) => {
    //                 console.log(res);
    //                 gdx._resources = Object.create(res);

    //                 for (let path in data.files) {
    //                     console.log(data.files[path]);
    //                     PIXI.loader.add(data.files[path]);
    //                 }//_internal
    //                 PIXI.loader.load( (loader, res) => {
    //                     console.log(res);
    //                 });
    //                 this.initialize();

    //             });
    //         }, status => console.log(`error ${status}: Unable to load manifest.json`));
            
    //     }
        
    //     /**
    //      * Start the main loop
    //      */
    //     initialize() {
            
    //         //console.log(JSON.parse(gdx._resources['main'].xhr.responseText));
    //         gdx._width = this.config.width//*window.devicePixelRatio;
    //         gdx._height = this.config.height//*window.devicePixelRatio;
            
    //         gdx._renderer = PIXI.autoDetectRenderer(this.config.width, this.config.height, {
    //             antialiasing: false,
    //             transparent: false,
    //             resolution: window.devicePixelRatio,
    //             autoResize: true
    //         })
    //         gdx._renderer.view.style.position = "absolute";
    //         gdx._renderer.view.style.top = "0px";
    //         gdx._renderer.view.style.left = "0px";
    //         gdx._stage = new PIXI.Container();
    //         resize(); // listener.resize();
    //         document.body.appendChild(gdx._renderer.view);
    //         window.addEventListener("resize", resize);

    //         this.graphics.setupDisplay();
    //         this.listener.create();
    //         let mainLoop = (time) => {
                
    //             this.graphics.update(time);
    //             this.graphics.frameId++;
    //             this.listener.render();
    //             window.requestAnimationFrame(mainLoop);
    //         }
    //         window.requestAnimationFrame(mainLoop);
    //     }
    // }

    /**
     * export the api
     * 
     */
    window.gdx =  {
        _internal: null,
        _renderer = null,   // pixi renderer
        _resources = null,  // list of all loaded resources
        _stage = null,      // top level stage
        _scaling = 1,       // Scaling.fill
        _scaleX = 1,        // screen scaling x
        _scaleY = 1,        // screen scaling y
        _height = 0,        // screen height
        _width = 0,         // screen width
        // utils: {
        //     viewport: {
        //         FillViewport: FillViewport,
        //         FitViewport: FitViewport,
        //         ScalingViewport: ScalingViewport,
        //         Viewport: Viewport
        //     }
        //     // Json: Json,
        //     // Scaling: Scaling
        // },
        // audio: {
        //     Sound: Sound  
        // },
        // files: {
        //     FileHandle
        // },
        // graphics: {
        //     g2d: {
        //         Batch: Batch,
        //         BitmapFont: BitmapFont,
        //         Sprite: Sprite,
        //         SpriteBatch: SpriteBatch,
        //         TextureAtlas: TextureAtlas,
        //         TextureRegion: TextureRegion
        //     },
        //     Camera: Camera,
        //     GL20: GL20,
        //     OrthographicCamera: OrthographicCamera,
        //     Texture: Texture
        // },
        math: {
            MathUtils: Math
//            Vector3: Vector3
        },
        // scenes: {
        //     scene2d: {
        //         utils: {
        //             ClickListener: ClickListener
        //         },
        //         Actor: Actor,
        //         Event: Event,
        //         EventListener: EventListener,
        //         InputEvent: InputEvent,
        //         InputListener: InputListener,
        //         Stage: Stage
        //     }
        // },
        Audio: Audio,
        Files: Files,
        Gdx: Gdx,
        Graphics: Graphics,
        Input: Input,
        Net: Net,
        JsApplication: JsApplication,
        JsApplicationConfiguration: JsApplicationConfiguration
    }
}(this, this.document));

