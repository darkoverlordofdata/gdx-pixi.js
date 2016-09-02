/**
 * @JSName("gdx.audio.Sound")
 */
define("audio/Sound", ["require", "exports"], function (require, exports) {
    "use strict";
    class Sound {
        play() {
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Sound;
});
define("Gdx", ["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * @JSName("Gdx")
     */
    class Gdx {
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Gdx;
    Gdx.app = null;
    Gdx.graphics = null;
    Gdx.audio = null;
    Gdx.files = null;
    Gdx.input = null;
    Gdx.get = null;
    Gdx.gl = null;
    Gdx._resources = null; // list of all loaded resources
    Gdx._internal = null; // xhr data buffers
    Gdx._renderer = null; // pixi renderer
    Gdx._stage = null; // top level stage
    Gdx._scaling = 1; // Scaling.fill
    Gdx._scaleX = 1; // screen scaling x
    Gdx._scaleY = 1; // screen scaling y
    Gdx._height = 0; // screen height
    Gdx._width = 0; // screen width
});
/**
 * @JSName("gdx.files.FileHandle")
 */
define("files/FileHandle", ["require", "exports", "Gdx"], function (require, exports, Gdx_1) {
    "use strict";
    class FileHandle {
        constructor(path) {
            this.path = path;
        }
        readString() {
            return Gdx_1.default._internal[this.path].xhr.responseText;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = FileHandle;
});
/**
 * @JSName("gdx.graphics.g2d.Batch")
 */
define("graphics/g2d/Batch", ["require", "exports", "Gdx"], function (require, exports, Gdx_2) {
    "use strict";
    class Batch {
        constructor() {
            this.sprites = new PIXI.Container();
            Gdx_2.default._stage.addChild(this.sprites);
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
            Gdx_2.default._renderer.render(Gdx_2.default._stage);
        }
        setProjectionMatrix(projection) {
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Batch;
});
/**
 * @JSName("gdx.graphics.g2d.BitmapFont")
 */
define("graphics/g2d/BitmapFont", ["require", "exports", "Gdx"], function (require, exports, Gdx_3) {
    "use strict";
    class BitmapFont {
        constructor(fontFile, region, integer) {
            this.fontFile = fontFile;
            this.region = region;
            this.integer = integer;
            const name = this.fontFile.path.split('/').pop().split('.')[0];
            const dom = (new DOMParser()).parseFromString(Gdx_3.default._resources[name].xhr.responseText, 'text/xml');
            this.face = dom.evaluate('/font/info/@face', dom, null, XPathResult.STRING_TYPE, null).stringValue;
            this.size = dom.evaluate('/font/info/@size', dom, null, XPathResult.STRING_TYPE, null).stringValue;
        }
        setUseIntegerPositions(integer) { }
        getWidth() { }
        getHeight() { }
        draw(batch, str, x, y) {
            const texture = new PIXI.extras.BitmapText(str, { font: `${this.size}px ${this.face}`, align: 'right' });
            batch.draw(texture, x, Gdx_3.default._height - y);
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = BitmapFont;
});
/**
 * @JSName("gdx.graphics.g2d.TextureRegion")
 */
define("graphics/g2d/TextureRegion", ["require", "exports"], function (require, exports) {
    "use strict";
    class TextureRegion {
        constructor(texture) {
            this.texture = texture;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TextureRegion;
});
define("graphics/g2d/Sprite", ["require", "exports", "Gdx", "graphics/g2d/TextureRegion"], function (require, exports, Gdx_4, TextureRegion_1) {
    "use strict";
    /**
     * @JSName("gdx.graphics.g2d.Sprite")
     */
    class Sprite extends TextureRegion_1.default {
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
            //this.texture.sprite.position.set(x, y)
            //this.texture.sprite.position.set(Gdx.graphics.getWidth()-x, Gdx.graphics.getHeight()-y)
            this.texture.sprite.position.set(x, Gdx_4.default.graphics.getHeight() - y - this.texture.sprite._texture.height);
        }
        draw(batch) {
            batch.draw(this, this.texture.sprite.position.x, this.texture.sprite.position.y);
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Sprite;
});
define("graphics/g2d/SpriteBatch", ["require", "exports", "graphics/g2d/Batch"], function (require, exports, Batch_1) {
    "use strict";
    /**
     * @JSName("gdx.graphics.g2d.SpriteBatch")
     */
    class SpriteBatch extends Batch_1.default {
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SpriteBatch;
});
/*
 * @JSName("gdx.graphics.g2d.TextureAtlas")
 */
define("graphics/g2d/TextureAtlas", ["require", "exports"], function (require, exports) {
    "use strict";
    class TextureAtlas {
        constructor(packFile) {
            this.packFile = packFile;
        }
        createSprite(name) { }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TextureAtlas;
});
/**
 * @JSName("gdx.math.Vector3")
 */
define("math/Vector3", ["require", "exports"], function (require, exports) {
    "use strict";
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Vector3;
});
define("graphics/Camera", ["require", "exports", "math/Vector3"], function (require, exports, Vector3_1) {
    "use strict";
    /*
     * @JSName("gdx.graphics.Camera")
     */
    class Camera {
        constructor(viewportWidth, viewportHeight) {
            this.viewportWidth = viewportWidth;
            this.viewportHeight = viewportHeight;
            this.position = new Vector3_1.default();
        }
        update() { }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Camera;
});
define("graphics/GL20", ["require", "exports", "Gdx"], function (require, exports, Gdx_5) {
    "use strict";
    /**
     * @JSName("gdx.graphics.GL20")
     */
    class GL20 {
        glClearColor(red, green, blue, alpha) {
            const hexColor = ((1 << 24) + (red * 255 << 16) + (green * 255 << 8) + blue * 255); //.toString(16).substr(1)
            Gdx_5.default._renderer.backgroundColor = hexColor;
        }
        glClear(mask) {
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GL20;
    GL20.GL_COLOR_BUFFER_BIT = 0x00004000;
    GL20.GL_NEAREST = 0x2600;
    GL20.GL_LINEAR = 0x2601;
    GL20.GL_LINEAR_MIPMAP_LINEAR = 0x2703;
    GL20.GL_NEAREST_MIPMAP_NEAREST = 0x2700;
    GL20.GL_LINEAR_MIPMAP_NEAREST = 0x2701;
    GL20.GL_NEAREST_MIPMAP_LINEAR = 0x2702;
    GL20.GL_LINEAR_MIPMAP_LINEAR = 0x2703;
});
define("graphics/OrthographicCamera", ["require", "exports", "graphics/Camera"], function (require, exports, Camera_1) {
    "use strict";
    /**
     * @JSName("gdx.graphics.OrthographicCamera")
     */
    class OrthographicCamera extends Camera_1.default {
        constructor(viewportWidth, viewportHeight) {
            super(viewportWidth, viewportHeight);
            this.combined = null;
        }
        update() { }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = OrthographicCamera;
});
define("graphics/Texture", ["require", "exports", "graphics/GL20", "Gdx"], function (require, exports, GL20_1, Gdx_6) {
    "use strict";
    /**
     * @JSName("gdx.graphics.Texture")
     */
    class Texture {
        constructor(path) {
            //let file = Gdx.files.internal(path)
            if (typeof path === 'string')
                this.path = Gdx_6.default._resources[path] ? Gdx_6.default._resources[path].url : path;
            else
                this.path = path.path;
            this.sprite = PIXI.Sprite.fromImage(this.path);
            this.id = Texture.uniqueId++;
        }
        setFilter(minFilter, magFilter) { }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Texture;
    Texture.uniqueId = 0;
    /**
     * @JSName("gdx.graphics.Texture.TextureFilter")
     */
    Texture.TextureFilter = {
        Nearest: GL20_1.default.GL_NEAREST,
        Linear: GL20_1.default.GL_LINEAR,
        MipMap: GL20_1.default.GL_LINEAR_MIPMAP_LINEAR,
        MipMapNearestNearest: GL20_1.default.GL_NEAREST_MIPMAP_NEAREST,
        MipMapLinearNearest: GL20_1.default.GL_LINEAR_MIPMAP_NEAREST,
        MipMapNearestLinear: GL20_1.default.GL_NEAREST_MIPMAP_LINEAR,
        MipMapLinearLinear: GL20_1.default.GL_LINEAR_MIPMAP_LINEAR
    };
});
/**
 * @JSName("gdx.scenes.scene2d.utils.ClickListener")
 */
define("scenes/scene2d/utils/ClickListener", ["require", "exports"], function (require, exports) {
    "use strict";
    class ClickListener {
        clicked(event, x, y) { }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ClickListener;
});
/**
 * @JSName("gdx.scenes.scene2d.Actor")
 */
define("scenes/scene2d/Actor", ["require", "exports"], function (require, exports) {
    "use strict";
    class Actor {
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Actor;
});
/**
 * @JSName("gdx.scenes.scene2d.Event")
 */
define("scenes/scene2d/Event", ["require", "exports"], function (require, exports) {
    "use strict";
    class Event {
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Event;
});
/**
 * @JSName("gdx.scenes.scene2d.EventListener")
 */
define("scenes/scene2d/EventListener", ["require", "exports"], function (require, exports) {
    "use strict";
    class EventListener {
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = EventListener;
});
/**
 * @JSName("gdx.scenes.scene2d.InputEvent")
 */
define("scenes/scene2d/InputEvent", ["require", "exports"], function (require, exports) {
    "use strict";
    class InputEvent {
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = InputEvent;
});
define("scenes/scene2d/InputListener", ["require", "exports", "scenes/scene2d/EventListener"], function (require, exports, EventListener_1) {
    "use strict";
    /**
     * @JSName("gdx.scenes.scene2d.InputListener")
     */
    class InputListener extends EventListener_1.default {
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = InputListener;
});
define("utils/Scaling", ["require", "exports"], function (require, exports) {
    "use strict";
    class Scaling {
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Scaling;
    Scaling[Scaling.fit = 0] = 'fit';
    Scaling[Scaling.fill = 1] = 'fill';
    Scaling[Scaling.fillX = 2] = 'fillX';
    Scaling[Scaling.fillY = 3] = 'fillY';
    Scaling[Scaling.stretch = 4] = 'stretch';
    Scaling[Scaling.stretchX = 5] = 'stretchX';
    Scaling[Scaling.stretchY = 6] = 'stretchY';
    Scaling[Scaling.none = 7] = 'none';
});
/**
 * @JSName("gdx.utils.viewport.Viewport")
 */
define("utils/viewport/Viewport", ["require", "exports"], function (require, exports) {
    "use strict";
    class Viewport {
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Viewport;
});
define("utils/viewport/ScalingViewport", ["require", "exports", "utils/viewport/Viewport", "graphics/OrthographicCamera"], function (require, exports, Viewport_1, OrthographicCamera_1) {
    "use strict";
    /**
     * @JSName("gdx.utils.viewport.ScalingViewport")
     */
    class ScalingViewport extends Viewport_1.default {
        constructor(scaling, worldWidth, worldHeight, camera) {
            super();
            this.scaling = scaling;
            this.worldWidth = worldWidth;
            this.worldHeight = worldHeight;
            this.camera = camera ? camera : new OrthographicCamera_1.default();
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ScalingViewport;
});
define("utils/viewport/FillViewport", ["require", "exports", "utils/Scaling", "utils/viewport/ScalingViewport"], function (require, exports, Scaling_1, ScalingViewport_1) {
    "use strict";
    /**
     * @JSName("gdx.utils.viewport.FillViewport")
     */
    class FillViewport extends ScalingViewport_1.default {
        constructor(worldWidth, worldHeight, camera) {
            super(Scaling_1.default.fill, worldWidth, worldHeight, camera);
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = FillViewport;
});
define("utils/viewport/FitViewport", ["require", "exports", "utils/Scaling", "utils/viewport/ScalingViewport"], function (require, exports, Scaling_2, ScalingViewport_2) {
    "use strict";
    /**
     * @JSName("gdx.utils.viewport.FitViewport")
     */
    class FitViewport extends ScalingViewport_2.default {
        constructor(worldWidth, worldHeight, camera) {
            super(Scaling_2.default.fit, worldWidth, worldHeight, camera);
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = FitViewport;
});
define("Audio", ["require", "exports", "audio/Sound"], function (require, exports, Sound_1) {
    "use strict";
    class Audio {
        newSound(raw) {
            return new Sound_1.default(raw);
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Audio;
});
define("Files", ["require", "exports", "files/FileHandle"], function (require, exports, FileHandle_1) {
    "use strict";
    /**
     * @JSName("gdx.Files")
     */
    class Files {
        internal(path) {
            return new FileHandle_1.default(path);
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Files;
});
define("Graphics", ["require", "exports", "graphics/GL20", "Gdx"], function (require, exports, GL20_2, Gdx_7) {
    "use strict";
    /**
     * @JSName("gdx.Graphics")
     */
    class Graphics {
        constructor(config) {
            this.config = config;
            this.gl20 = new GL20_2.default();
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
            Gdx_7.default.gl = this.gl20;
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Graphics;
});
define("Input", ["require", "exports", "Gdx"], function (require, exports, Gdx_8) {
    "use strict";
    /**
     * @JSName("gdx.Input")
     */
    class Input {
        setInputProcessor(processor) {
            Gdx_8.default._processor = processor;
            document.addEventListener('touchstart', (event) => {
                const pixel = window.devicePixelRatio;
                event = event.targetTouches ? event.targetTouches[0] : event;
                Gdx_8.default._processor.touchDown(Math.ceil(event.clientX / Gdx_8.default._scaleX * pixel), Math.ceil(event.clientY / Gdx_8.default._scaleY * pixel), 0, 0);
            }, true);
            document.addEventListener('touchmove', (event) => {
                const pixel = window.devicePixelRatio;
                event = event.targetTouches ? event.targetTouches[0] : event;
                Gdx_8.default._processor.touchDragged(Math.ceil(event.clientX / Gdx_8.default._scaleX * pixel), Math.ceil(event.clientY / Gdx_8.default._scaleY * pixel), 0);
            }, true);
            document.addEventListener('touchend', (event) => {
                event = event.targetTouches ? event.targetTouches[0] : event;
                Gdx_8.default._processor.touchUp(0, 0, 0, 0);
            }, true);
            document.addEventListener('mousedown', (event) => {
                Gdx_8.default._processor.touchDown(Math.ceil(event.clientX / Gdx_8.default._scaleX), Math.ceil(event.clientY / Gdx_8.default._scaleY), -1, event.button);
            }, true);
            document.addEventListener('mousemove', (event) => {
                Gdx_8.default._processor.mouseMoved(Math.ceil(event.clientX / Gdx_8.default._scaleX), Math.ceil(event.clientY / Gdx_8.default._scaleY));
            }, true);
            document.addEventListener('mouseup', (event) => {
                Gdx_8.default._processor.touchUp(Math.ceil(event.clientX / Gdx_8.default._scaleX), Math.ceil(event.clientY / Gdx_8.default._scaleY), -1, event.button);
            }, true);
            window.addEventListener('keydown', (event) => Gdx_8.default._processor.keyDown(event.which), true);
            window.addEventListener('keyup', (event) => Gdx_8.default._processor.keyUp(event.which), true);
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Input;
    /**
     * @JSName("gdx.Input.Buttons")
     */
    class Buttons {
    }
    Buttons[Buttons.LEFT = 0] = 'LEFT';
    Buttons[Buttons.RIGHT = 1] = 'RIGHT';
    Buttons[Buttons.MIDDLE = 2] = 'MIDDLE';
    Buttons[Buttons.BACK = 3] = 'BACK';
    Buttons[Buttons.FORWARD = 4] = 'FORWARD';
    /**
     * @JSName("gdx.InpuyKeys")
     */
    class Keys {
    }
    Keys.ANY_KEY = -1;
    Keys.NUM_0 = 96;
    Keys.NUM_1 = 97;
    Keys.NUM_2 = 98;
    Keys.NUM_3 = 99;
    Keys.NUM_4 = 100;
    Keys.NUM_5 = 101;
    Keys.NUM_6 = 102;
    Keys.NUM_7 = 103;
    Keys.NUM_8 = 104;
    Keys.NUM_9 = 105;
    Keys.A = 65;
    Keys.B = 66;
    Keys.BACKSLASH = 220;
    Keys.C = 67;
    Keys.COMMA = 188;
    Keys.D = 68;
    Keys.DEL = 46;
    Keys.BACKSPACE = 8;
    Keys.DOWN = 40;
    Keys.LEFT = 37;
    Keys.RIGHT = 39;
    Keys.UP = 38;
    Keys.E = 69;
    Keys.EQUALS = 187;
    Keys.F = 70;
    Keys.G = 71;
    Keys.H = 72;
    Keys.HOME = 36;
    Keys.I = 73;
    Keys.J = 74;
    Keys.K = 75;
    Keys.L = 76;
    Keys.LEFT_BRACKET = 219;
    Keys.M = 77;
    Keys.MINUS = 189;
    Keys.N = 78;
    Keys.O = 79;
    Keys.P = 80;
    Keys.PERIOD = 190;
    Keys.PLUS = 187;
    Keys.Q = 81;
    Keys.R = 82;
    Keys.RIGHT_BRACKET = 221;
    Keys.S = 83;
    Keys.SEMICOLON = 186;
    Keys.SLASH = 191;
    Keys.SPACE = 32;
    Keys.T = 84;
    Keys.TAB = 9;
    Keys.U = 85;
    Keys.UNKNOWN = 0;
    Keys.V = 86;
    Keys.W = 87;
    Keys.X = 88;
    Keys.Y = 89;
    Keys.Z = 90;
    Keys.ESCAPE = 27;
    Keys.END = 35;
    Keys.INSERT = 45;
    Keys.PAGE_UP = 33;
    Keys.PAGE_DOWN = 34;
    Keys.COLON = 186;
    Input.Buttons = Buttons;
    Input.Keys = Keys;
});
define("JsApplication", ["require", "exports", "Graphics", "Audio", "Files", "Input", "Gdx", "utils/Scaling"], function (require, exports, Graphics_1, Audio_1, Files_1, Input_1, Gdx_9, Scaling_3) {
    "use strict";
    function resize() {
        switch (Gdx_9.default._scaling) {
            case Scaling_3.default.fit:
                // Determine which screen dimension is least constrained
                Gdx_9.default._scaleX = Gdx_9.default._scaleY = Math.max(window.innerWidth / Gdx_9.default._width, window.innerHeight / Gdx_9.default._height);
                break;
            case Scaling_3.default.fill:
                // Determine which screen dimension is most constrained
                Gdx_9.default._scaleX = Gdx_9.default._scaleY = Math.min(window.innerWidth / Gdx_9.default._width, window.innerHeight / Gdx_9.default._height);
                break;
            case Scaling_3.default.fillX:
                Gdx_9.default._scaleX = window.innerWidth / Gdx_9.default._width;
                Gdx_9.default._scaleY = Gdx_9.default._scaleX;
                break;
            case Scaling_3.default.fillY:
                Gdx_9.default._scaleY = window.innerHeight / Gdx_9.default._height;
                Gdx_9.default._scaleX = Gdx_9.default._scaleY;
                break;
            case Scaling_3.default.stretch:
                Gdx_9.default._scaleX = window.innerWidth / Gdx_9.default._width;
                Gdx_9.default._scaleY = window.innerHeight / Gdx_9.default._height;
                break;
            case Scaling_3.default.stretchX:
                Gdx_9.default._scaleX = window.innerWidth / Gdx_9.default._width;
                Gdx_9.default._scaleY = Gdx_9.default._scaleX;
                break;
            case Scaling_3.default.stretchY:
                Gdx_9.default._scaleY = window.innerHeight / Gdx_9.default._height;
                Gdx_9.default._scaleX = Gdx_9.default._scaleY;
                break;
        }
        Gdx_9.default._stage.scale.x = Gdx_9.default._scaleX;
        Gdx_9.default._stage.scale.y = Gdx_9.default._scaleY;
        Gdx_9.default._renderer.resize(Math.ceil(Gdx_9.default._width * Gdx_9.default._scaleX), Math.ceil(Gdx_9.default._height * Gdx_9.default._scaleY));
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
            const xhr = new XMLHttpRequest();
            xhr.open('get', url, true);
            xhr.responseType = 'json';
            xhr.onload = () => {
                if (xhr.status === 200) {
                    resolve(xhr.response);
                }
                else {
                    reject(xhr.status);
                }
            };
            xhr.send();
        });
    }
    /**
     * @JSName("gdx.JsApplication")
     */
    class JsApplication {
        constructor(listener, config) {
            if (config.title === null) {
                config.title = listener.constructor.name;
            }
            document.title = config.title;
            this.config = config;
            this.graphics = new Graphics_1.default(config);
            this.audio = new Audio_1.default();
            this.files = new Files_1.default();
            this.input = new Input_1.default();
            //this.net = new Net()
            this.gl = null;
            this.listener = listener;
            Gdx_9.default.app = this;
            Gdx_9.default.graphics = this.graphics;
            Gdx_9.default.audio = this.audio;
            Gdx_9.default.files = this.files;
            Gdx_9.default.input = this.input;
            //Gdx.net = this.net
            /**
             * Load the manifest, and initialize
             */
            getJSON('manifest.json').then(data => {
                for (let name in data.atlas) {
                    PIXI.loader.add(name, data.atlas[name]);
                }
                PIXI.loader.load((loader, res) => {
                    Gdx_9.default._resources = Object.create(res);
                    for (let path in data.files) {
                        PIXI.loader.add(data.files[path]);
                    }
                    PIXI.loader.load((loader, res) => {
                    });
                    this.initialize();
                });
            }, status => console.log(`error ${status}: Unable to load manifest.json`));
        }
        /**
         * Start the main loop
         */
        initialize() {
            Gdx_9.default._width = this.config.width;
            Gdx_9.default._height = this.config.height;
            Gdx_9.default._renderer = PIXI.autoDetectRenderer(this.config.width, this.config.height, {
                antialiasing: false,
                transparent: false,
                resolution: window.devicePixelRatio,
                autoResize: true
            });
            Gdx_9.default._renderer.view.style.position = "absolute";
            Gdx_9.default._renderer.view.style.top = "0px";
            Gdx_9.default._renderer.view.style.left = "0px";
            Gdx_9.default._stage = new PIXI.Container();
            resize();
            document.body.appendChild(Gdx_9.default._renderer.view);
            window.addEventListener("resize", resize);
            this.graphics.setupDisplay();
            this.listener.create();
            const mainLoop = (time) => {
                this.graphics.update(time);
                this.graphics.frameId++;
                this.listener.render();
                window.requestAnimationFrame(mainLoop);
            };
            window.requestAnimationFrame(mainLoop);
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = JsApplication;
});
/**
 * @JSName("gdx.JsApplicationConfiguration")
 */
define("JsApplicationConfiguration", ["require", "exports"], function (require, exports) {
    "use strict";
    class JsApplicationConfiguration {
        constructor() {
            this.height = 480;
            this.width = 640;
            this.fullscreen = false;
            this.title = null;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = JsApplicationConfiguration;
});
define("index", ["require", "exports", "audio/Sound", "files/FileHandle", "graphics/g2d/Batch", "graphics/g2d/BitmapFont", "graphics/g2d/Sprite", "graphics/g2d/SpriteBatch", "graphics/g2d/TextureAtlas", "graphics/g2d/TextureRegion", "graphics/Camera", "graphics/GL20", "graphics/OrthographicCamera", "graphics/Texture", "math/Vector3", "scenes/scene2d/utils/ClickListener", "scenes/scene2d/Actor", "scenes/scene2d/Event", "scenes/scene2d/EventListener", "scenes/scene2d/InputEvent", "scenes/scene2d/InputListener", "utils/viewport/FillViewport", "utils/viewport/FitViewport", "utils/viewport/ScalingViewport", "utils/viewport/Viewport", "Audio", "Files", "Gdx", "Graphics", "Input", "JsApplication", "JsApplicationConfiguration"], function (require, exports, Sound_2, FileHandle_2, Batch_2, BitmapFont_1, Sprite_1, SpriteBatch_1, TextureAtlas_1, TextureRegion_2, Camera_2, GL20_3, OrthographicCamera_2, Texture_1, Vector3_2, ClickListener_1, Actor_1, Event_1, EventListener_2, InputEvent_1, InputListener_1, FillViewport_1, FitViewport_1, ScalingViewport_3, Viewport_2, Audio_2, Files_2, Gdx_10, Graphics_2, Input_2, JsApplication_1, JsApplicationConfiguration_1) {
    "use strict";
    /**
     * Export the global gdx namespace
     */
    class gdx {
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = gdx;
    gdx.audio = {
        Sound: Sound_2.default
    };
    gdx.files = {
        FileHandle: FileHandle_2.default
    };
    gdx.graphics = {
        g2d: {
            Batch: Batch_2.default,
            BitmapFont: BitmapFont_1.default,
            Sprite: Sprite_1.default,
            SpriteBatch: SpriteBatch_1.default,
            TextureAtlas: TextureAtlas_1.default,
            TextureRegion: TextureRegion_2.default
        },
        Camera: Camera_2.default,
        GL20: GL20_3.default,
        OrthographicCamera: OrthographicCamera_2.default,
        Texture: Texture_1.default
    };
    gdx.math = {
        MathUtils: Math,
        Vector3: Vector3_2.default
    };
    gdx.scenes = {
        scene2d: {
            utils: {
                ClickListener: ClickListener_1.default
            },
            Actor: Actor_1.default,
            Event: Event_1.default,
            EventListener: EventListener_2.default,
            InputEvent: InputEvent_1.default,
            InputListener: InputListener_1.default
        }
    };
    gdx.utils = {
        viewport: {
            FillViewport: FillViewport_1.default,
            FitViewport: FitViewport_1.default,
            ScalingViewport: ScalingViewport_3.default,
            Viewport: Viewport_2.default
        },
        Scaling: ScalingViewport_3.default
    };
    gdx.Audio = Audio_2.default;
    gdx.Files = Files_2.default;
    gdx.Gdx = Gdx_10.default;
    gdx.Graphics = Graphics_2.default;
    gdx.Input = Input_2.default;
    gdx.JsApplication = JsApplication_1.default;
    gdx.JsApplicationConfiguration = JsApplicationConfiguration_1.default;
});
