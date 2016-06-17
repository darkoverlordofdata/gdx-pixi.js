import Sound from 'gdx/audio/Sound';

export default class Audio {
    newSound(raw) {
        return new Sound(raw);
    }
}