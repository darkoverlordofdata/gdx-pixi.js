###
 * @JSName("gdx.scenes.scene2d.Actor")
###

class Actor 

    constructor:() ->
        @width = 0;
        @height = 0;
        @x = 0;
        @y = 0;
        @scale = 0;
        @listeners = []        
    

    getWidth: -> Math.ceil(@width)
    getHeight: -> Math.ceil(@height)

    setX:(x) ->
        @x = x
    
    setY:(y) ->
        @y = y
    
    setScale:(scaleXY) ->
        @scale = scaleXY
    
    addListener:(listener) ->
        console.log(listener)
        @listeners.push(listener)

                
`export default Actor`