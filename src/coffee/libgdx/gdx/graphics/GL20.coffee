`import Gdx from 'gdx/Gdx'`

###
 * @JSName("gdx.graphics.GL20")
###
class GL20 

    @GL_COLOR_BUFFER_BIT = 0x00004000;
    @GL_NEAREST = 0x2600;
    @GL_LINEAR = 0x2601;
    @GL_LINEAR_MIPMAP_LINEAR = 0x2703;
    @GL_NEAREST_MIPMAP_NEAREST = 0x2700;
    @GL_LINEAR_MIPMAP_NEAREST = 0x2701;
    @GL_NEAREST_MIPMAP_LINEAR = 0x2702;
    @GL_LINEAR_MIPMAP_LINEAR = 0x2703;

    glClearColor:(red, green, blue, alpha) ->
        hexColor = ((1 << 24) + (red*255 << 16) + (green*255 << 8) + blue*255)
        Gdx._renderer.backgroundColor = hexColor
    
    glClear:(mask) ->



`export default GL20`