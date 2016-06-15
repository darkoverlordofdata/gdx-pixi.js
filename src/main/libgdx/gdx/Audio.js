gdx.Audio = (function() {

    var Sound = gdx.audio.Sound;
    
    /**
     * @JSName("gdx.Audio")
     */
    return class Audio{
        newSound(raw) {
            return new Sound(raw);
        }
    }
    
}());
