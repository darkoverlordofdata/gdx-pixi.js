// Generated by CoffeeScript 1.10.0
import Gdx from 'gdx/Gdx';
var Batch;

Batch = (function() {
  function Batch() {
    this.sprites = new PIXI.Container();
    Gdx._stage.addChild(this.sprites);
  }

  Batch.prototype.begin = function() {
    return this.sprites.children.length = 0;
  };

  Batch.prototype.draw = function(texture, x, y, width, height) {
    if (width == null) {
      width = -1;
    }
    if (height == null) {
      height = -1;
    }
    if (texture.texture) {
      this.sprites.addChild(texture.texture.sprite);
      texture.texture.sprite.x = x;
      return texture.texture.sprite.y = y;
    } else {
      this.sprites.addChild(texture);
      texture.x = x;
      return texture.y = y;
    }
  };

  Batch.prototype.end = function() {
    return Gdx._renderer.render(Gdx._stage);
  };

  Batch.prototype.setProjectionMatrix = function(projection) {};

  return Batch;

})();

export default Batch;
