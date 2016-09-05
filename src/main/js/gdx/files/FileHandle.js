/**
 * @JSName("gdx.files.FileHandle")
 */

import Gdx from 'gdx/Gdx'

export default class FileHandle {

    constructor(path) {
        this.path = path
    }
    
    readString() {
        console.log('readString', this.path)
        console.log('Gdx._resources', Gdx._resources['assets/'+this.path])
        return Gdx._resources['assets/'+this.path].xhr.responseText
    }

}

