var gdx;(function (gdx) {

    var Sound = gdx.audio.Sound;
    
    /**
     * @JSName("gdx.Audio")
     */
    class Audio{
        newSound(raw) {
            return new Sound(raw);
        }
    }
    
    gdx.Audio = Audio;

    
})(gdx || (gdx = {}));
