/**
 * @JSName("gdx.files.FileHandle")
 */

import Gdx from 'gdx/Gdx'

export default class FileHandle {

    constructor(path) {
        this.path = path
    }
    
    readString() {
        return Gdx._internal[this.path].xhr.responseText
    }

}

