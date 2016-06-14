var gdx;(function (gdx) {
    
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
    gdx.Gdx = Gdx;
    gdx._internal = null;
    gdx._renderer = null;   // pixi renderer
    gdx._resources = null;  // list of all loaded resources
    gdx._stage = null;      // top level stage
    gdx._scaling = 1;       // Scaling.fill
    gdx._scaleX = 1;        // screen scaling x
    gdx._scaleY = 1;        // screen scaling y
    gdx._height = 0;        // screen height
    gdx._width = 0;         // screen width


})(gdx || (gdx = {}));
