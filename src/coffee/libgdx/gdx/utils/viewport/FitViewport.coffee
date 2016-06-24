`import Scaling from 'gdx/utils/Scaling'`
`import ScalingViewport from 'gdx/utils/viewport/ScalingViewport'`

###
 * @JSName("gdx.utils.viewport.FitViewport")
###
class FitViewport extends ScalingViewport 
    constructor:(worldWidth, worldHeight, camera) ->
        super(Scaling.fit, worldWidth, worldHeight, camera)


`export default FitViewport`
