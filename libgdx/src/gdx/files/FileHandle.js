/**
 * @JSName("gdx.files.FileHandle")
 */
gdx.files.FileHandle = (function(){

    var Gdx = gdx.Gdx;

    class FileHandle {

        constructor(path) {
            this.path = path;
        }
        
        readString() {
            return Gdx._internal[this.path].xhr.responseText;
        }

    }

    return FileHandle;

}());
