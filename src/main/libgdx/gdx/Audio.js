// Generated by CoffeeScript 1.10.0
import Sound from 'gdx/audio/Sound';
var Audio;

Audio = (function() {
  function Audio() {}

  Audio.prototype.newSound = function(raw) {
    return new Sound(raw);
  };

  return Audio;

})();

export default Audio;
