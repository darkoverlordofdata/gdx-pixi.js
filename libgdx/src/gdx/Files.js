var gdx;(function (gdx) {
    
    var FileHandle = gdx.files.FileHandle;
    /**
     * @JSName("gdx.Files")
     */
    class Files{
        internal(path) {
            return new FileHandle(path)
        }
    }
    gdx.Files = Files;

    
})(gdx || (gdx = {}));
