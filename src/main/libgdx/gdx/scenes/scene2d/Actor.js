// Generated by CoffeeScript 1.10.0

/*
 * @JSName("gdx.scenes.scene2d.Actor")
 */
var Actor;

Actor = (function() {
  function Actor() {
    this.width = 0;
    this.height = 0;
    this.x = 0;
    this.y = 0;
    this.scale = 0;
    this.listeners = [];
  }

  Actor.prototype.getWidth = function() {
    return Math.ceil(this.width);
  };

  Actor.prototype.getHeight = function() {
    return Math.ceil(this.height);
  };

  Actor.prototype.setX = function(x) {
    return this.x = x;
  };

  Actor.prototype.setY = function(y) {
    return this.y = y;
  };

  Actor.prototype.setScale = function(scaleXY) {
    return this.scale = scaleXY;
  };

  Actor.prototype.addListener = function(listener) {
    console.log(listener);
    return this.listeners.push(listener);
  };

  return Actor;

})();

export default Actor;
