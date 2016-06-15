/**
 * @JSName("gdx.graphics.g2d.BitmapFont")
 */
gdx.graphics.g2d.BitmapFont = (function(){

    var Gdx = gdx.Gdx;
    class BitmapFont {
        
        constructor(fontFile, region, integer) {
            this.fontFile = fontFile;
            this.region = region;
            this.integer = integer;
            
            let name = this.fontFile.path.split('/').pop().split('.')[0];
            let dom = (new DOMParser()).parseFromString(Gdx._resources[name].xhr.responseText, 'text/xml');
            this.face = dom.evaluate('/font/info/@face', dom, null, XPathResult.STRING_TYPE, null).stringValue;
            this.size = dom.evaluate('/font/info/@size', dom, null, XPathResult.STRING_TYPE, null).stringValue;
        }
        setUseIntegerPositions(integer) {}
        getWidth() {}
        getHeight() {}
        draw(batch, str, x, y) {
            let texture = new PIXI.extras.BitmapText(str, {font: `${this.size}px ${this.face}`, align: 'right' });
            batch.draw(texture, x, Gdx._height-y);
        }
    }

    return BitmapFont;
}());

