
import Scaling from 'gdx/utils/Scaling'
import ScalingViewport from 'gdx/utils/viewport/ScalingViewport'

/**
 * @JSName("gdx.utils.viewport.FillViewport")
 */
export default class FillViewport extends ScalingViewport {
    constructor(worldWidth, worldHeight, camera) {
        super(Scaling.fill, worldWidth, worldHeight, camera)
    }
}

