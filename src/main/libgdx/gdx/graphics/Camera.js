
import Vector3 from 'gdx/math/Vector3';

/**
 * @JSName("gdx.graphics.Camera")
 */
export default class Camera {
    
    constructor(viewportWidth, viewportHeight) {
        this.position = new Vector3();
        this.viewportWidth = viewportWidth;
        this.viewportHeight = viewportHeight;
    }
    update() {}
}

