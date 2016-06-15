gdx.Files = (function(){

    var FileHandle = gdx.files.FileHandle;
    /**
     * @JSName("gdx.Files")
     */
    return class Files{
        internal(path) {
            return new FileHandle(path)
        }
    }

    
}());    
