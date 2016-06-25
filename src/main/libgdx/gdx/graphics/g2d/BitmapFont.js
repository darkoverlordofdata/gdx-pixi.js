/**
 * @JSName("gdx.graphics.g2d.BitmapFont")
 */

import Gdx from 'gdx/Gdx'

export default class BitmapFont {
    
    constructor(fontFile, region, integer) {
        this.fontFile = fontFile
        this.region = region
        this.integer = integer
        
        const name = this.fontFile.path.split('/').pop().split('.')[0]
        const dom = (new DOMParser()).parseFromString(Gdx._resources[name].xhr.responseText, 'text/xml')
        this.face = dom.evaluate('/font/info/@face', dom, null, XPathResult.STRING_TYPE, null).stringValue
        this.size = dom.evaluate('/font/info/@size', dom, null, XPathResult.STRING_TYPE, null).stringValue
    }
    setUseIntegerPositions(integer) {}
    getWidth() {}
    getHeight() {}
    draw(batch, str, x, y) {
        const texture = new PIXI.extras.BitmapText(str, {font: `${this.size}px ${this.face}`, align: 'right' })
        batch.draw(texture, x, Gdx._height-y)
    }
}

