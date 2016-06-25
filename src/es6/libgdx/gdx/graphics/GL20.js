
import Gdx from 'gdx/Gdx'
/**
 * @JSName("gdx.graphics.GL20")
 */
export default class GL20 {
    glClearColor(red, green, blue, alpha) {
        const hexColor = ((1 << 24) + (red*255 << 16) + (green*255 << 8) + blue*255)//.toString(16).substr(1)
        Gdx._renderer.backgroundColor = hexColor
    }
    glClear(mask) {
    }
}

GL20.GL_COLOR_BUFFER_BIT = 0x00004000
GL20.GL_NEAREST = 0x2600
GL20.GL_LINEAR = 0x2601
GL20.GL_LINEAR_MIPMAP_LINEAR = 0x2703
GL20.GL_NEAREST_MIPMAP_NEAREST = 0x2700
GL20.GL_LINEAR_MIPMAP_NEAREST = 0x2701
GL20.GL_NEAREST_MIPMAP_LINEAR = 0x2702
GL20.GL_LINEAR_MIPMAP_LINEAR = 0x2703

