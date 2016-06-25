
import Camera from 'gdx/graphics/Camera'

/**
 * @JSName("gdx.graphics.OrthographicCamera")
 */
export default class OrthographicCamera extends Camera {
    constructor(viewportWidth, viewportHeight) {
        super(viewportWidth, viewportHeight)
        this.combined = null
    }
    update() {}

}
