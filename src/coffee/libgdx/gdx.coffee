`import Sound from 'gdx/audio/Sound'`
`import FileHandle from 'gdx/files/FileHandle'`
`import Batch from 'gdx/graphics/g2d/Batch'`
`import BitmapFont from 'gdx/graphics/g2d/BitmapFont'`
`import Sprite from 'gdx/graphics/g2d/Sprite'`
`import SpriteBatch from 'gdx/graphics/g2d/SpriteBatch'`
`import TextureAtlas from 'gdx/graphics/g2d/TextureAtlas'`
`import TextureRegion from 'gdx/graphics/g2d/TextureRegion'`
`import Camera from 'gdx/graphics/Camera'`
`import GL20 from 'gdx/graphics/GL20'`
`import OrthographicCamera from 'gdx/graphics/OrthographicCamera'`
`import Texture from 'gdx/graphics/Texture'`
`import Vector3 from 'gdx/math/Vector3'`
`import ClickListener from 'gdx/scenes/scene2d/utils/ClickListener'`
`import Actor from 'gdx/scenes/scene2d/Actor'`
`import Event from 'gdx/scenes/scene2d/Event'`
`import EventListener from 'gdx/scenes/scene2d/EventListener'`
`import InputEvent from 'gdx/scenes/scene2d/InputEvent'`
`import InputListener from 'gdx/scenes/scene2d/InputListener'`
`import FillViewport from 'gdx/utils/viewport/FillViewport'`
`import FitViewport from 'gdx/utils/viewport/FitViewport'`
`import ScalingViewport from 'gdx/utils/viewport/ScalingViewport'`
`import Viewport from 'gdx/utils/viewport/Viewport'`
`import Scaling from 'gdx/utils/Scaling'`
`import Audio from 'gdx/Audio'`
`import Files from 'gdx/Files'`
`import Gdx from 'gdx/Gdx'`
`import Graphics from 'gdx/Graphics'`
`import Input from 'gdx/Input'`
`import JsApplication from 'gdx/JsApplication'`
`import JsApplicationConfiguration from 'gdx/JsApplicationConfiguration'`

###
 * Export the global gdx namespace
###
class libGDX 
    @audio: 
        Sound : Sound
    
    @files: 
        FileHandle: FileHandle
    
    @graphics: 
        g2d: 
            Batch: Batch
            BitmapFont: BitmapFont
            Sprite: Sprite
            SpriteBatch: SpriteBatch
            TextureAtlas: TextureAtlas
            TextureRegion: TextureRegion
        
        Camera: Camera
        GL20: GL20
        OrthographicCamera: OrthographicCamera
        Texture: Texture
    
    @math: 
        MathUtils: Math
        Vector3: Vector3
    
    @scenes: 
        scene2d: 
            utils: 
                ClickListener: ClickListener
            
            Actor: Actor
            Event: Event
            EventListener: EventListener
            InputEvent: InputEvent
            InputListener: InputListener
        
    
    @utils: 
        viewport: 
            FillViewport: FillViewport
            FitViewport: FitViewport
            ScalingViewport: ScalingViewport
            Viewport: Viewport
        
        Scaling: ScalingViewport
    
    @Audio: Audio
    @Files: Files
    @Gdx: Gdx
    @Graphics: Graphics
    @Input: Input
    @JsApplication: JsApplication
    @JsApplicationConfiguration: JsApplicationConfiguration

`export default libGDX`