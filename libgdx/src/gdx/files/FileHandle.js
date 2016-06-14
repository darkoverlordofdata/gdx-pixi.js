var gdx;(function (gdx) {
    var files;(function (files) {

        /**
         * @JSName("gdx.files.FileHandle")
         */
        class FileHandle {
            constructor(path) {
                this.path = path;
            }
            readString() {
                return gdx._internal[this.path].xhr.responseText;
            }

        }
        
        files.FileHandle = FileHandle;
    })(files = gdx.files || (gdx.files = {}));
})(gdx || (gdx = {}));
