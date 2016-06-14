var gdx;
(function (gdx) {
    var graphics;
    (function (graphics) {
        var g2d;
        (function (g2d) {
            var Gdx = gdx.Gdx;
            var TextureRegion = gdx.graphics.g2d.TextureRegion;
            /**
             * @JSName("gdx.graphics.g2d.Sprite")
             */
            class Sprite extends TextureRegion {
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

            g2d.Sprite = Sprite;
        })(g2d = graphics.g2d || (graphics.g2d = {}));
    })(graphics = gdx.graphics || (gdx.graphics = {}));
})(gdx || (gdx = {}));
