gdx.graphics.Camera = (function(){

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
        update() {}
    }

}());
