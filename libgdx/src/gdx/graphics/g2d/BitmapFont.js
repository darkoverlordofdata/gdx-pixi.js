var gdx;
(function (gdx) {
    var graphics;
    (function (graphics) {
        var g2d;
        (function (g2d) {
            /**
             * @JSName("gdx.graphics.g2d.BitmapFont")
             */
            class BitmapFont {
                constructor(fontFile, region, integer) {
                    this.fontFile = fontFile;
                    this.region = region;
                    this.integer = integer;
                    
                    let name = this.fontFile.path.split('/').pop().split('.')[0];
                    let dom = (new DOMParser()).parseFromString(gdx._resources[name].xhr.responseText, 'text/xml');
                    this.face = dom.evaluate('/font/info/@face', dom, null, XPathResult.STRING_TYPE, null).stringValue;
                    this.size = dom.evaluate('/font/info/@size', dom, null, XPathResult.STRING_TYPE, null).stringValue;
                }
                setUseIntegerPositions(integer) {}
                getWidth() {}
                getHeight() {}
                draw(batch, str, x, y) {
                    let texture = new PIXI.extras.BitmapText(str, {font: `${this.size}px ${this.face}`, align: 'right' });
                    batch.draw(texture, x, gdx._height-y);
                }
            }

            g2d.BitmapFont = BitmapFont;
        })(g2d = graphics.g2d || (graphics.g2d = {}));
    })(graphics = gdx.graphics || (gdx.graphics = {}));
})(gdx || (gdx = {}));
