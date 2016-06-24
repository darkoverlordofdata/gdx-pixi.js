    
###
 * @JSName("Gdx")
###
class Gdx 
    @app: null
    @graphics: null
    @audio: null
    @files: null
    @input: null
    @get: null
    @gl: null

    @_resources: null  # list of all loaded resources
    @_internal: null   # xhr data buffers
    @_renderer: null   # pixi renderer
    @_stage: null      # top level stage
    @_scaling: 1       # Scaling.fill
    @_scaleX: 1        # screen scaling x
    @_scaleY: 1        # screen scaling y
    @_height: 0        # screen height
    @_width: 0          # screen width


`export default Gdx`