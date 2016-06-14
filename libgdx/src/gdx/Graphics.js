var gdx;(function (gdx) {
    
    var GL20 = gdx.graphics.GL20;
    var Gdx = gdx.Gdx;
    
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

    gdx.Graphics = Graphics;
    
})(gdx || (gdx = {}));
