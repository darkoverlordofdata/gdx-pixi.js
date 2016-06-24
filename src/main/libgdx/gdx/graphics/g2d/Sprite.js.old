    
import Gdx from 'gdx/Gdx';
import TextureRegion from 'gdx/graphics/g2d/TextureRegion';

/**
 * @JSName("gdx.graphics.g2d.Sprite")
 */
export default class Sprite extends TextureRegion {

    constructor(texture) {
        super(texture);
    }
    getWidth() {return this.texture.sprite._texture.width;}
    getHeight(){return this.texture.sprite._texture.height;}
    setX(value){

    }
    setY(value) {

    }
    setColor(red, green, blue, alpha) {

    }
    setScale(x, y) {
        this.texture.sprite.scale.set(x, y);
    }
    setPosition(x, y) {
        //this.texture.sprite.position.set(x, y);
        //this.texture.sprite.position.set(Gdx.graphics.getWidth()-x, Gdx.graphics.getHeight()-y);
        this.texture.sprite.position.set(x, Gdx.graphics.getHeight()-y-this.texture.sprite._texture.height);
    }
    draw(batch) {
        batch.draw(this, this.texture.sprite.position.x, this.texture.sprite.position.y)
    }
}
