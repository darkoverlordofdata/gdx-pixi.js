/**
 * AMD Compatible module loader
 *
 * @param root object
 * @returns module loader function define
 *
 */
var define = (function (root) {
    "use strict";
    // get a module by path
    var require = function (dependancy) {
        var ns = dependancy.split('/');
        var node = root;
        for (var i = 0; i < ns.length; i++) {
            if (typeof node[ns[i]] === 'undefined') {
                return void 0;
            }
            node = node[ns[i]];
        }
        return node;
    };
    // define
    return function (name, deps, callback) {
        "use strict";
        // the exported module reference
        var exports = {};
        // first 2 dependencies are built-in:
        var args = [require, exports];
        // remaining dependencues
        for (var i = 2; i < deps.length; i++) {
            args.push(require(deps[i]));
        }
        // initialize the module
        callback.apply(exports, args);
        // do exports:
        var ns = name.split('/');
        var node = root;
        // ensure the module node
        for (var i = 0; i < ns.length; i++) {
            if (typeof node[ns[i]] === 'undefined') {
                node[ns[i]] = {};
            }
            node = node[ns[i]];
        }
        // default replaces the module node
        if (exports.__esModule || exports['default']) {
            var moduleName = ns.pop();
            var moduleNode = root;
            for (var i = 0; i < ns.length; i++) {
                moduleNode = moduleNode[ns[i]];
            }
            moduleNode[moduleName] = exports['default'];
            moduleNode[moduleName]['default'] = exports['default'];
        }
        // expose all of the exported values
        for (var key in exports) {
            if (key !== 'default')
                node[key] = exports[key];
        }
    };
}(this));
/**
 * @JSName("gdx.math.Vector3")
 */
System.register("gdx/math/Vector3", [], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Vector3;
    return {
        setters:[],
        execute: function() {
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
            exports_1("default", Vector3);
        }
    }
});
System.register("gdx/math/MathUtils", [], function(exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var math;
    return {
        setters:[],
        execute: function() {
            math = Math;
            exports_2("default", math);
        }
    }
});
System.register("gdx/Gdx", [], function(exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var Gdx;
    return {
        setters:[],
        execute: function() {
            /**
             * @JSName("Gdx")
             */
            Gdx = {
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
            exports_3("default", Gdx);
        }
    }
});
/**
 * @JSName("gdx.audio.Sound")
 */
System.register("gdx/audio/Sound", [], function(exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var Sound;
    return {
        setters:[],
        execute: function() {
            class Sound {
                play() {
                }
            }
            exports_4("default", Sound);
        }
    }
});
/**
 * @JSName("gdx.files.FileHandle")
 */
System.register("gdx/files/FileHandle", ["gdx/Gdx"], function(exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var Gdx_1;
    var FileHandle;
    return {
        setters:[
            function (Gdx_1_1) {
                Gdx_1 = Gdx_1_1;
            }],
        execute: function() {
            class FileHandle {
                constructor(path) {
                    this.path = path;
                }
                readString() {
                    return Gdx_1.default._internal[this.path].xhr.responseText;
                }
            }
            exports_5("default", FileHandle);
        }
    }
});
/**
 * @JSName("gdx.graphics.g2d.Batch")
 */
System.register("gdx/graphics/g2d/Batch", ["gdx/Gdx"], function(exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var Gdx_2;
    var Batch;
    return {
        setters:[
            function (Gdx_2_1) {
                Gdx_2 = Gdx_2_1;
            }],
        execute: function() {
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
            exports_6("default", Batch);
        }
    }
});
/**
 * @JSName("gdx.graphics.g2d.BitmapFont")
 */
System.register("gdx/graphics/g2d/BitmapFont", ["gdx/Gdx"], function(exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var Gdx_3;
    var BitmapFont;
    return {
        setters:[
            function (Gdx_3_1) {
                Gdx_3 = Gdx_3_1;
            }],
        execute: function() {
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
            exports_7("default", BitmapFont);
        }
    }
});
System.register("gdx/graphics/g2d/SpriteBatch", ["gdx/graphics/g2d/Batch"], function(exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    var Batch_1;
    var SpriteBatch;
    return {
        setters:[
            function (Batch_1_1) {
                Batch_1 = Batch_1_1;
            }],
        execute: function() {
            /**
             * @JSName("gdx.graphics.g2d.SpriteBatch")
             */
            class SpriteBatch extends Batch_1.default {
            }
            exports_8("default", SpriteBatch);
        }
    }
});
/**
 * @JSName("gdx.graphics.g2d.TextureAtlas")
 */
System.register("gdx/graphics/g2d/TextureAtlas", [], function(exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    var TextureAtlas;
    return {
        setters:[],
        execute: function() {
            class TextureAtlas {
                constructor(packFile) {
                    this.packFile = packFile;
                }
                createSprite(name) { }
            }
            exports_9("default", TextureAtlas);
        }
    }
});
/**
 * @JSName("gdx.graphics.g2d.TextureRegion")
 */
System.register("gdx/graphics/g2d/TextureRegion", [], function(exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    var TextureRegion;
    return {
        setters:[],
        execute: function() {
            class TextureRegion {
                constructor(texture) {
                    this.texture = texture;
                }
            }
            exports_10("default", TextureRegion);
        }
    }
});
System.register("gdx/graphics/g2d/Sprite", ["gdx/Gdx", "gdx/graphics/g2d/TextureRegion"], function(exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    var Gdx_4, TextureRegion_1;
    var Sprite;
    return {
        setters:[
            function (Gdx_4_1) {
                Gdx_4 = Gdx_4_1;
            },
            function (TextureRegion_1_1) {
                TextureRegion_1 = TextureRegion_1_1;
            }],
        execute: function() {
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
                    //this.texture.sprite.position.set(x, y);
                    //this.texture.sprite.position.set(Gdx.graphics.getWidth()-x, Gdx.graphics.getHeight()-y);
                    this.texture.sprite.position.set(x, Gdx_4.default.graphics.getHeight() - y - this.texture.sprite._texture.height);
                }
                draw(batch) {
                    batch.draw(this, this.texture.sprite.position.x, this.texture.sprite.position.y);
                }
            }
            exports_11("default", Sprite);
        }
    }
});
System.register("gdx/graphics/Camera", ["gdx/math/Vector3"], function(exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
    var Vector3_1;
    var Camera;
    return {
        setters:[
            function (Vector3_1_1) {
                Vector3_1 = Vector3_1_1;
            }],
        execute: function() {
            /**
             * @JSName("gdx.graphics.Camera")
             */
            class Camera {
                constructor(viewportWidth, viewportHeight) {
                    this.position = new Vector3_1.default();
                    this.viewportWidth = viewportWidth;
                    this.viewportHeight = viewportHeight;
                }
                update() { }
            }
            exports_12("default", Camera);
        }
    }
});
System.register("gdx/graphics/GL20", ["gdx/Gdx"], function(exports_13, context_13) {
    "use strict";
    var __moduleName = context_13 && context_13.id;
    var Gdx_5;
    var GL20;
    return {
        setters:[
            function (Gdx_5_1) {
                Gdx_5 = Gdx_5_1;
            }],
        execute: function() {
            /**
             * @JSName("gdx.graphics.GL20")
             */
            class GL20 {
                glClearColor(red, green, blue, alpha) {
                    const hexColor = ((1 << 24) + (red * 255 << 16) + (green * 255 << 8) + blue * 255); //.toString(16).substr(1);
                    Gdx_5.default._renderer.backgroundColor = hexColor;
                }
                glClear(mask) {
                }
            }
            exports_13("default", GL20);
            GL20.GL_COLOR_BUFFER_BIT = 0x00004000;
            GL20.GL_NEAREST = 0x2600;
            GL20.GL_LINEAR = 0x2601;
            GL20.GL_LINEAR_MIPMAP_LINEAR = 0x2703;
            GL20.GL_NEAREST_MIPMAP_NEAREST = 0x2700;
            GL20.GL_LINEAR_MIPMAP_NEAREST = 0x2701;
            GL20.GL_NEAREST_MIPMAP_LINEAR = 0x2702;
            GL20.GL_LINEAR_MIPMAP_LINEAR = 0x2703;
        }
    }
});
System.register("gdx/graphics/OrthographicCamera", ["gdx/graphics/Camera"], function(exports_14, context_14) {
    "use strict";
    var __moduleName = context_14 && context_14.id;
    var Camera_1;
    var OrthographicCamera;
    return {
        setters:[
            function (Camera_1_1) {
                Camera_1 = Camera_1_1;
            }],
        execute: function() {
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
            exports_14("default", OrthographicCamera);
        }
    }
});
System.register("gdx/graphics/Texture", ["gdx/graphics/GL20", "gdx/Gdx"], function(exports_15, context_15) {
    "use strict";
    var __moduleName = context_15 && context_15.id;
    var GL20_1, Gdx_6;
    var Texture;
    return {
        setters:[
            function (GL20_1_1) {
                GL20_1 = GL20_1_1;
            },
            function (Gdx_6_1) {
                Gdx_6 = Gdx_6_1;
            }],
        execute: function() {
            /**
             * @JSName("gdx.graphics.Texture")
             */
            class Texture {
                constructor(path) {
                    //let file = Gdx.files.internal(path);
                    if (typeof path === 'string')
                        this.path = Gdx_6.default._resources[path] ? Gdx_6.default._resources[path].url : path;
                    else
                        this.path = path.path;
                    this.sprite = PIXI.Sprite.fromImage(this.path);
                    this.id = Texture.uniqueId++;
                }
                setFilter(minFilter, magFilter) { }
            }
            exports_15("default", Texture);
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
        }
    }
});
/**
 * @JSName("gdx.scenes.scene2d.utils.ClickListener")
 */
System.register("gdx/scenes/scene2d/utils/ClickListener", [], function(exports_16, context_16) {
    "use strict";
    var __moduleName = context_16 && context_16.id;
    var ClickListener;
    return {
        setters:[],
        execute: function() {
            class ClickListener {
                clicked(event, x, y) { }
            }
            exports_16("default", ClickListener);
        }
    }
});
/**
 * @JSName("gdx.scenes.scene2d.Actor")
 */
System.register("gdx/scenes/scene2d/Actor", [], function(exports_17, context_17) {
    "use strict";
    var __moduleName = context_17 && context_17.id;
    var Actor;
    return {
        setters:[],
        execute: function() {
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
            exports_17("default", Actor);
        }
    }
});
/**
 * @JSName("gdx.scenes.scene2d.Event")
 */
System.register("gdx/scenes/scene2d/Event", [], function(exports_18, context_18) {
    "use strict";
    var __moduleName = context_18 && context_18.id;
    var Event;
    return {
        setters:[],
        execute: function() {
            class Event {
            }
            exports_18("default", Event);
        }
    }
});
/**
 * @JSName("gdx.scenes.scene2d.EventListener")
 */
System.register("gdx/scenes/scene2d/EventListener", [], function(exports_19, context_19) {
    "use strict";
    var __moduleName = context_19 && context_19.id;
    var EventListener;
    return {
        setters:[],
        execute: function() {
            class EventListener {
            }
            exports_19("default", EventListener);
        }
    }
});
/**
 * @JSName("gdx.scenes.scene2d.InputEvent")
 */
System.register("gdx/scenes/scene2d/InputEvent", [], function(exports_20, context_20) {
    "use strict";
    var __moduleName = context_20 && context_20.id;
    var InputEvent;
    return {
        setters:[],
        execute: function() {
            class InputEvent {
            }
            exports_20("default", InputEvent);
        }
    }
});
System.register("gdx/scenes/scene2d/InputListener", ["gdx/scenes/scene2d/EventListener"], function(exports_21, context_21) {
    "use strict";
    var __moduleName = context_21 && context_21.id;
    var EventListener_1;
    var InputListener;
    return {
        setters:[
            function (EventListener_1_1) {
                EventListener_1 = EventListener_1_1;
            }],
        execute: function() {
            /**
             * @JSName("gdx.scenes.scene2d.InputListener")
             */
            class InputListener extends EventListener_1.default {
            }
            exports_21("default", InputListener);
        }
    }
});
System.register("gdx/utils/Scaling", [], function(exports_22, context_22) {
    "use strict";
    var __moduleName = context_22 && context_22.id;
    var Scaling;
    return {
        setters:[],
        execute: function() {
            Scaling = {};
            Scaling[Scaling.fit = 0] = 'fit';
            Scaling[Scaling.fill = 1] = 'fill';
            Scaling[Scaling.fillX = 2] = 'fillX';
            Scaling[Scaling.fillY = 3] = 'fillY';
            Scaling[Scaling.stretch = 4] = 'stretch';
            Scaling[Scaling.stretchX = 5] = 'stretchX';
            Scaling[Scaling.stretchY = 6] = 'stretchY';
            Scaling[Scaling.none = 7] = 'none';
            exports_22("default", Scaling);
        }
    }
});
// return {
//     fit: 0,
//     fill: 1,
//     fillX: 2,
//     fillY: 3,
//     stretch: 4,
//     stretchX: 5,
//     stretchY: 6,
//     none: 7
// }
/**
 * @JSName("gdx.utils.viewport.Viewport")
 */
System.register("gdx/utils/viewport/Viewport", [], function(exports_23, context_23) {
    "use strict";
    var __moduleName = context_23 && context_23.id;
    var Viewport;
    return {
        setters:[],
        execute: function() {
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
            exports_23("default", Viewport);
        }
    }
});
System.register("gdx/utils/viewport/ScalingViewport", ["gdx/utils/viewport/Viewport", "gdx/graphics/OrthographicCamera"], function(exports_24, context_24) {
    "use strict";
    var __moduleName = context_24 && context_24.id;
    var Viewport_1, OrthographicCamera_1;
    var ScalingViewport;
    return {
        setters:[
            function (Viewport_1_1) {
                Viewport_1 = Viewport_1_1;
            },
            function (OrthographicCamera_1_1) {
                OrthographicCamera_1 = OrthographicCamera_1_1;
            }],
        execute: function() {
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
            exports_24("default", ScalingViewport);
        }
    }
});
System.register("gdx/utils/viewport/FillViewport", ["gdx/utils/Scaling", "gdx/utils/viewport/ScalingViewport"], function(exports_25, context_25) {
    "use strict";
    var __moduleName = context_25 && context_25.id;
    var Scaling_1, ScalingViewport_1;
    var FillViewport;
    return {
        setters:[
            function (Scaling_1_1) {
                Scaling_1 = Scaling_1_1;
            },
            function (ScalingViewport_1_1) {
                ScalingViewport_1 = ScalingViewport_1_1;
            }],
        execute: function() {
            /**
             * @JSName("gdx.utils.viewport.FillViewport")
             */
            class FillViewport extends ScalingViewport_1.default {
                constructor(worldWidth, worldHeight, camera) {
                    super(Scaling_1.default.fill, worldWidth, worldHeight, camera);
                }
            }
            exports_25("default", FillViewport);
        }
    }
});
System.register("gdx/utils/viewport/FitViewport", ["gdx/utils/Scaling", "gdx/utils/viewport/ScalingViewport"], function(exports_26, context_26) {
    "use strict";
    var __moduleName = context_26 && context_26.id;
    var Scaling_2, ScalingViewport_2;
    var FitViewport;
    return {
        setters:[
            function (Scaling_2_1) {
                Scaling_2 = Scaling_2_1;
            },
            function (ScalingViewport_2_1) {
                ScalingViewport_2 = ScalingViewport_2_1;
            }],
        execute: function() {
            /**
             * @JSName("gdx.utils.viewport.FitViewport")
             */
            class FitViewport extends ScalingViewport_2.default {
                constructor(worldWidth, worldHeight, camera) {
                    super(Scaling_2.default.fit, worldWidth, worldHeight, camera);
                }
            }
            exports_26("default", FitViewport);
        }
    }
});
System.register("gdx/Audio", ["gdx/audio/Sound"], function(exports_27, context_27) {
    "use strict";
    var __moduleName = context_27 && context_27.id;
    var Sound_1;
    var Audio;
    return {
        setters:[
            function (Sound_1_1) {
                Sound_1 = Sound_1_1;
            }],
        execute: function() {
            class Audio {
                newSound(raw) {
                    return new Sound_1.default(raw);
                }
            }
            exports_27("default", Audio);
        }
    }
});
System.register("gdx/Files", ["gdx/files/FileHandle"], function(exports_28, context_28) {
    "use strict";
    var __moduleName = context_28 && context_28.id;
    var FileHandle_1;
    var Files;
    return {
        setters:[
            function (FileHandle_1_1) {
                FileHandle_1 = FileHandle_1_1;
            }],
        execute: function() {
            /**
             * @JSName("gdx.Files")
             */
            class Files {
                internal(path) {
                    return new FileHandle_1.default(path);
                }
            }
            exports_28("default", Files);
        }
    }
});
System.register("gdx/Graphics", ["gdx/graphics/GL20", "gdx/Gdx"], function(exports_29, context_29) {
    "use strict";
    var __moduleName = context_29 && context_29.id;
    var GL20_2, Gdx_7;
    var Graphics;
    return {
        setters:[
            function (GL20_2_1) {
                GL20_2 = GL20_2_1;
            },
            function (Gdx_7_1) {
                Gdx_7 = Gdx_7_1;
            }],
        execute: function() {
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
            exports_29("default", Graphics);
        }
    }
});
System.register("gdx/Input", ["gdx/Gdx"], function(exports_30, context_30) {
    "use strict";
    var __moduleName = context_30 && context_30.id;
    var Gdx_8;
    var Input, Buttons, Keys;
    return {
        setters:[
            function (Gdx_8_1) {
                Gdx_8 = Gdx_8_1;
            }],
        execute: function() {
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
            exports_30("default", Input);
            /**
             * @JSName("gdx.Input.Buttons")
             */
            Buttons = {};
            Buttons[Buttons.LEFT = 0] = 'LEFT';
            Buttons[Buttons.RIGHT = 1] = 'RIGHT';
            Buttons[Buttons.MIDDLE = 2] = 'MIDDLE';
            Buttons[Buttons.BACK = 3] = 'BACK';
            Buttons[Buttons.FORWARD = 4] = 'FORWARD';
            /**
             * @JSName("gdx.InpuyKeys")
             */
            Keys = {
                ANY_KEY: -1,
                NUM_0: 96,
                NUM_1: 97,
                NUM_2: 98,
                NUM_3: 99,
                NUM_4: 100,
                NUM_5: 101,
                NUM_6: 102,
                NUM_7: 103,
                NUM_8: 104,
                NUM_9: 105,
                A: 65,
                B: 66,
                BACKSLASH: 220,
                C: 67,
                COMMA: 188,
                D: 68,
                DEL: 46,
                BACKSPACE: 8,
                DOWN: 40,
                LEFT: 37,
                RIGHT: 39,
                UP: 38,
                E: 69,
                EQUALS: 187,
                F: 70,
                G: 71,
                H: 72,
                HOME: 36,
                I: 73,
                J: 74,
                K: 75,
                L: 76,
                LEFT_BRACKET: 219,
                M: 77,
                MINUS: 189,
                N: 78,
                O: 79,
                P: 80,
                PERIOD: 190,
                PLUS: 187,
                Q: 81,
                R: 82,
                RIGHT_BRACKET: 221,
                S: 83,
                SEMICOLON: 186,
                SLASH: 191,
                SPACE: 32,
                T: 84,
                TAB: 9,
                U: 85,
                UNKNOWN: 0,
                V: 86,
                W: 87,
                X: 88,
                Y: 89,
                Z: 90,
                ESCAPE: 27,
                END: 35,
                INSERT: 45,
                PAGE_UP: 33,
                PAGE_DOWN: 34,
                COLON: 186
            };
            Input.Buttons = Object.freeze(Buttons);
            Input.Keys = Object.freeze(Keys);
        }
    }
});
System.register("gdx/JsApplication", ["gdx/Graphics", "gdx/Audio", "gdx/Files", "gdx/Input", "gdx/Gdx", "gdx/utils/Scaling"], function(exports_31, context_31) {
    "use strict";
    var __moduleName = context_31 && context_31.id;
    var Graphics_1, Audio_1, Files_1, Input_1, Gdx_9, Scaling_3;
    var JsApplication;
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
    return {
        setters:[
            function (Graphics_1_1) {
                Graphics_1 = Graphics_1_1;
            },
            function (Audio_1_1) {
                Audio_1 = Audio_1_1;
            },
            function (Files_1_1) {
                Files_1 = Files_1_1;
            },
            function (Input_1_1) {
                Input_1 = Input_1_1;
            },
            function (Gdx_9_1) {
                Gdx_9 = Gdx_9_1;
            },
            function (Scaling_3_1) {
                Scaling_3 = Scaling_3_1;
            }],
        execute: function() {
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
                    //this.net = new Net();
                    this.gl = null;
                    this.listener = listener;
                    Gdx_9.default.app = this;
                    Gdx_9.default.graphics = this.graphics;
                    Gdx_9.default.audio = this.audio;
                    Gdx_9.default.files = this.files;
                    Gdx_9.default.input = this.input;
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
                            Gdx_9.default._resources = Object.create(res);
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
                    Gdx_9.default._width = this.config.width; //*window.devicePixelRatio;
                    Gdx_9.default._height = this.config.height; //*window.devicePixelRatio;
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
                    resize(); // listener.resize();
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
            exports_31("default", JsApplication);
        }
    }
});
/**
 * @JSName("gdx.JsApplicationConfiguration")
 */
System.register("gdx/JsApplicationConfiguration", [], function(exports_32, context_32) {
    "use strict";
    var __moduleName = context_32 && context_32.id;
    var JsApplicationConfiguration;
    return {
        setters:[],
        execute: function() {
            class JsApplicationConfiguration {
                constructor() {
                    this.height = 480;
                    this.width = 640;
                    this.fullscreen = false;
                    this.title = null;
                }
            }
            exports_32("default", JsApplicationConfiguration);
        }
    }
});
System.register("gdx/lib", ["gdx/audio/Sound", "gdx/files/FileHandle", 'gdx/graphics/g2d/Batch;', 'gdx/graphics/g2d/BitmapFont;', 'gdx/graphics/g2d/SpriteBatch;', 'gdx/graphics/g2d/TextureAtlas;', 'gdx/graphics/g2d/TextureRegion;', 'gdx/graphics/Camera;', 'gdx/graphics/GL20;', 'gdx/graphics/OrthographicCamera;', 'gdx/graphics/Texture;', 'gdx/math/MathUtils;', 'gdx/math/Vector3;', "gdx/scenes/scene2d/utils/ClickListener", "gdx/scenes/scene2d/Actor", "gdx/scenes/scene2d/Event", "gdx/scenes/scene2d/EventListener", "gdx/scenes/scene2d/InputEvent", "gdx/scenes/scene2d/InputListener", "gdx/utils/viewport/FillViewport", "gdx/utils/viewport/FitViewport", "gdx/utils/viewport/ScalingViewport", "gdx/utils/viewport/Viewport", "gdx/Audio", "gdx/Files", "gdx/Gdx", "gdx/Graphics", "gdx/Input", "gdx/JsApplication", "gdx/JsApplicationConfiguration"], function(exports_33, context_33) {
    "use strict";
            console.log("=================");
            console.log("gdx");
            console.log("=================");
    var __moduleName = context_33 && context_33.id;
    var Sound_2, FileHandle_2, Batch_2, BitmapFont_1, SpriteBatch_1, TextureAtlas_1, TextureRegion_2, Camera_2, GL20_3, OrthographicCamera_2, Texture_1, MathUtils_1, Vector3_2, ClickListener_1, Actor_1, Event_1, EventListener_2, InputEvent_1, InputListener_1, FillViewport_1, FitViewport_1, ScalingViewport_3, Viewport_2, Audio_2, Files_2, Gdx_10, Graphics_2, Input_2, JsApplication_1, JsApplicationConfiguration_1;
    return {
        setters:[
            function (Sound_2_1) {
                Sound_2 = Sound_2_1;
            },
            function (FileHandle_2_1) {
                FileHandle_2 = FileHandle_2_1;
            },
            function (Batch_2_1) {
                Batch_2 = Batch_2_1;
            },
            function (BitmapFont_1_1) {
                BitmapFont_1 = BitmapFont_1_1;
            },
            function (SpriteBatch_1_1) {
                SpriteBatch_1 = SpriteBatch_1_1;
            },
            function (TextureAtlas_1_1) {
                TextureAtlas_1 = TextureAtlas_1_1;
            },
            function (TextureRegion_2_1) {
                TextureRegion_2 = TextureRegion_2_1;
            },
            function (Camera_2_1) {
                Camera_2 = Camera_2_1;
            },
            function (GL20_3_1) {
                GL20_3 = GL20_3_1;
            },
            function (OrthographicCamera_2_1) {
                OrthographicCamera_2 = OrthographicCamera_2_1;
            },
            function (Texture_1_1) {
                Texture_1 = Texture_1_1;
            },
            function (MathUtils_1_1) {
                MathUtils_1 = MathUtils_1_1;
            },
            function (Vector3_2_1) {
                Vector3_2 = Vector3_2_1;
            },
            function (ClickListener_1_1) {
                ClickListener_1 = ClickListener_1_1;
            },
            function (Actor_1_1) {
                Actor_1 = Actor_1_1;
            },
            function (Event_1_1) {
                Event_1 = Event_1_1;
            },
            function (EventListener_2_1) {
                EventListener_2 = EventListener_2_1;
            },
            function (InputEvent_1_1) {
                InputEvent_1 = InputEvent_1_1;
            },
            function (InputListener_1_1) {
                InputListener_1 = InputListener_1_1;
            },
            function (FillViewport_1_1) {
                FillViewport_1 = FillViewport_1_1;
            },
            function (FitViewport_1_1) {
                FitViewport_1 = FitViewport_1_1;
            },
            function (ScalingViewport_3_1) {
                ScalingViewport_3 = ScalingViewport_3_1;
            },
            function (Viewport_2_1) {
                Viewport_2 = Viewport_2_1;
            },
            function (Audio_2_1) {
                Audio_2 = Audio_2_1;
            },
            function (Files_2_1) {
                Files_2 = Files_2_1;
            },
            function (Gdx_10_1) {
                Gdx_10 = Gdx_10_1;
            },
            function (Graphics_2_1) {
                Graphics_2 = Graphics_2_1;
            },
            function (Input_2_1) {
                Input_2 = Input_2_1;
            },
            function (JsApplication_1_1) {
                JsApplication_1 = JsApplication_1_1;
            },
            function (JsApplicationConfiguration_1_1) {
                JsApplicationConfiguration_1 = JsApplicationConfiguration_1_1;
            }],
        execute: function() {
            /**
             * gdx namespace
             */
            window.gdx = {
                audio: {
                    Sound: Sound_2.default
                },
                files: {
                    FileHandle: FileHandle_2.default
                },
                graphics: {
                    g2d: {
                        Batch: Batch_2.default,
                        BitmapFont: BitmapFont_1.default,
                        SpriteBatch: SpriteBatch_1.default,
                        TextureAtlas: TextureAtlas_1.default,
                        TextureRegion: TextureRegion_2.default
                    },
                    Camera: Camera_2.default,
                    GL20: GL20_3.default,
                    OrthographicCamera: OrthographicCamera_2.default,
                    Texture: Texture_1.default
                },
                math: {
                    MathUtils: MathUtils_1.default,
                    Vector3: Vector3_2.default
                },
                scenes: {
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
                },
                utils: {
                    viewport: {
                        FillViewport: FillViewport_1.default,
                        FitViewport: FitViewport_1.default,
                        ScalingViewport: ScalingViewport_3.default,
                        Viewport: Viewport_2.default
                    },
                    Scaling: ScalingViewport_3.default
                },
                Audio: Audio_2.default,
                Files: Files_2.default,
                Gdx: Gdx_10.default,
                Graphics: Graphics_2.default,
                Input: Input_2.default,
                JsApplication: JsApplication_1.default,
                JsApplicationConfiguration: JsApplicationConfiguration_1.default
            };
            console.log("=================");
            console.log(gdx);
            console.log("=================");
        }
    }
});
System.import('gdx/lib').then(function (m) {
}, function (reason) {
    console.log('----------------------');
    console.log(reason);
    console.log('----------------------');
});
