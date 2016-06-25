
import Viewport from 'gdx/utils/viewport/Viewport';
import OrthographicCamera from 'gdx/graphics/OrthographicCamera';

/**
 * @JSName("gdx.utils.viewport.ScalingViewport")
 */
export default class ScalingViewport extends Viewport {
    constructor(scaling, worldWidth, worldHeight, camera) {
        super();
        this.scaling = scaling;
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        this.camera = camera ? camera : new OrthographicCamera();
    }
}
