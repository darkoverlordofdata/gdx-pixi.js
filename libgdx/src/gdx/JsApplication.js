var gdx;(function (gdx) {

    var Graphics = gdx.Graphics;
    var Audio = gdx.Audio;
    var Files = gdx.Files;
    var Input = gdx.Input;
    var Gdx = gdx.Gdx;
    var Scaling = gdx.utils.Scaling;

    function resize() {
        switch(gdx._scaling) {
            case Scaling.fit:
                // Determine which screen dimension is least constrained
                gdx._scaleX = gdx._scaleY = Math.max(window.innerWidth/gdx._width, window.innerHeight/gdx._height);
                break;
            case Scaling.fill:
                // Determine which screen dimension is most constrained
                gdx._scaleX = gdx._scaleY = Math.min(window.innerWidth/gdx._width, window.innerHeight/gdx._height);
                break;
            case Scaling.fillX:
                gdx._scaleX = window.innerWidth/gdx._width
                gdx._scaleY = gdx._scaleX
                break;
            case Scaling.fillY:
                gdx._scaleY = window.innerHeight/gdx._height
                gdx._scaleX = gdx._scaleY
                break;
            case Scaling.stretch:
                gdx._scaleX = window.innerWidth/gdx._width
                gdx._scaleY = window.innerHeight/gdx._height
                break;
            case Scaling.stretchX:
                gdx._scaleX = window.innerWidth/gdx._width
                gdx._scaleY = gdx._scaleX
                break;
            case Scaling.stretchY:
                gdx._scaleY = window.innerHeight/gdx._height
                gdx._scaleX = gdx._scaleY
                break;
        }
        gdx._stage.scale.x = gdx._scaleX;
        gdx._stage.scale.y = gdx._scaleY;
        gdx._renderer.resize(Math.ceil(gdx._width * gdx._scaleX), Math.ceil(gdx._height * gdx._scaleY));
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
                } else {
                    reject(status);
                }
            };
            xhr.send();
        });
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
                PIXI.loader.load( (loader, res) => {
                    console.log(res);
                    gdx._resources = Object.create(res);

                    for (let path in data.files) {
                        console.log(data.files[path]);
                        PIXI.loader.add(data.files[path]);
                    }//_internal
                    PIXI.loader.load( (loader, res) => {
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
            
            //console.log(JSON.parse(gdx._resources['main'].xhr.responseText));
            gdx._width = this.config.width//*window.devicePixelRatio;
            gdx._height = this.config.height//*window.devicePixelRatio;
            
            gdx._renderer = PIXI.autoDetectRenderer(this.config.width, this.config.height, {
                antialiasing: false,
                transparent: false,
                resolution: window.devicePixelRatio,
                autoResize: true
            })
            gdx._renderer.view.style.position = "absolute";
            gdx._renderer.view.style.top = "0px";
            gdx._renderer.view.style.left = "0px";
            gdx._stage = new PIXI.Container();
            resize(); // listener.resize();
            document.body.appendChild(gdx._renderer.view);
            window.addEventListener("resize", resize);

            this.graphics.setupDisplay();
            this.listener.create();
            let mainLoop = (time) => {
                
                this.graphics.update(time);
                this.graphics.frameId++;
                this.listener.render();
                window.requestAnimationFrame(mainLoop);
            }
            window.requestAnimationFrame(mainLoop);
        }
    }
    
    gdx.JsApplication = JsApplication;

})(gdx || (gdx = {}));
