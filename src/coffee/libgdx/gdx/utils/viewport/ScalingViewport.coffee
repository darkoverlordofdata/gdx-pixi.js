`import Viewport from 'gdx/utils/viewport/Viewport'`
`import OrthographicCamera from 'gdx/graphics/OrthographicCamera'`

###
 * @JSName("gdx.utils.viewport.ScalingViewport")
###
class ScalingViewport extends Viewport 
    constructor: (scaling, worldWidth, worldHeight, camera)  ->
        super()
        @scaling = scaling
        @worldWidth = worldWidth
        @worldHeight = worldHeight
        @camera = if camera? then camera else new OrthographicCamera()

`export default ScalingViewport`