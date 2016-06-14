var gdx;
(function (gdx) {
    var graphics;
    (function (graphics) {
        var g2d;
        (function (g2d) {
            
            /**
             * @JSName("gdx.graphics.g2d.Batch")
             */
            class Batch {
                constructor() {
                    this.sprites = new PIXI.Container();
                    gdx._stage.addChild(this.sprites)
                }

                begin() {
                    this.sprites.children.length = 0;
                }
                draw(texture, x, y, width=-1, height=-1) {
                    if (texture.texture) {
                        this.sprites.addChild(texture.texture.sprite);
                        texture.texture.sprite.x = x;
                        texture.texture.sprite.y = y;
                    } else {
                        this.sprites.addChild(texture);
                        texture.x = x;
                        texture.y = y;
                    }
                }
                end() {
                    gdx._renderer.render(gdx._stage);
                }
                setProjectionMatrix(projection) {

                }

            }

            g2d.Batch = Batch;
        })(g2d = graphics.g2d || (graphics.g2d = {}));
    })(graphics = gdx.graphics || (gdx.graphics = {}));
})(gdx || (gdx = {}));
