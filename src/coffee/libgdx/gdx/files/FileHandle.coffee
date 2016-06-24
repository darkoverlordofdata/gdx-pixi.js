
class FileHandle
    constructor:(@path) ->
    
    readString:() ->
        Gdx._internal[this.path].xhr.responseText;



`export default FileHandle`