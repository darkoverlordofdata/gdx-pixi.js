/**
 * @JSName("gdx.graphics.g2d.Batch")
 */

import Gdx from 'gdx/Gdx'

export default class Batch {
    
    constructor() {
        this.sprites = new PIXI.Container()
        Gdx._stage.addChild(this.sprites)
    }

    begin() {
        this.sprites.children.length = 0
    }
    draw(texture, x, y, width=-1, height=-1) {
        if (texture.texture) {
            this.sprites.addChild(texture.texture.sprite)
            texture.texture.sprite.x = x
            texture.texture.sprite.y = y
        } else {
            this.sprites.addChild(texture)
            texture.x = x
            texture.y = y
        }
    }
    end() {
        Gdx._renderer.render(Gdx._stage)
    }
    setProjectionMatrix(projection) {

    }

}

