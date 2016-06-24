`import Gdx from  'gdx/Gdx'`

###
 * @JSName("gdx.Input.Buttons")
###
class Buttons

    @[@LEFT     = 0] = 'LEFT'
    @[@RIGHT    = 1] = 'RIGHT'
    @[@MIDDLE   = 2] = 'MIDDLE'
    @[@BACK     = 3] = 'BACK'
    @[@FORWARD  = 4] = 'FORWARD'


###
 * @JSName("gdx.InpuyKeys")
###
class Keys 

    @ANY_KEY: -1
    @NUM_0: 96
    @NUM_1: 97
    @NUM_2: 98
    @NUM_3: 99
    @NUM_4: 100
    @NUM_5: 101
    @NUM_6: 102
    @NUM_7: 103
    @NUM_8: 104
    @NUM_9: 105
    @A: 65
    @B: 66
    @BACKSLASH: 220
    @C: 67
    @COMMA: 188
    @D: 68
    @DEL: 46
    @BACKSPACE: 8
    @DOWN: 40
    @LEFT: 37
    @RIGHT: 39
    @UP: 38
    @E: 69
    @EQUALS: 187
    @F: 70
    @G: 71
    @H: 72
    @HOME: 36
    @I: 73
    @J: 74
    @K: 75
    @L: 76
    @LEFT_BRACKET: 219
    @M: 77
    @MINUS: 189
    @N: 78
    @O: 79
    @P: 80
    @PERIOD: 190
    @PLUS: 187
    @Q: 81
    @R: 82
    @RIGHT_BRACKET: 221
    @S: 83
    @SEMICOLON: 186
    @SLASH: 191
    @SPACE: 32
    @T: 84
    @TAB: 9
    @U: 85
    @UNKNOWN: 0
    @V: 86
    @W: 87
    @X: 88
    @Y: 89
    @Z: 90
    @ESCAPE: 27
    @END: 35
    @INSERT: 45
    @PAGE_UP: 33
    @PAGE_DOWN: 34
    @COLON: 186    

###
 * @JSName("gdx.Input")
###
class Input 
    @Buttons: Object.freeze(Buttons)
    @Keys: Object.freeze(Keys)


    setInputProcessor:(processor) ->
        Gdx._processor = processor
        
        document.addEventListener 'touchstart', (event) => 
            pixel = window.devicePixelRatio
            event = if event.targetTouches? then event.targetTouches[0] else event
            Gdx._processor.touchDown(Math.ceil(event.clientX/Gdx._scaleX*pixel), Math.ceil(event.clientY/Gdx._scaleY*pixel), 0, 0)
        , true

        document.addEventListener 'touchmove', (event) =>  
            pixel = window.devicePixelRatio
            event = if event.targetTouches? then event.targetTouches[0] else event
            Gdx._processor.touchDragged(Math.ceil(event.clientX/Gdx._scaleX*pixel), Math.ceil(event.clientY/Gdx._scaleY*pixel), 0)
        , true

        document.addEventListener 'touchend', (event) =>
            event = if event.targetTouches? then event.targetTouches[0] else event
            Gdx._processor.touchUp(0, 0, 0, 0)
        , true

        document.addEventListener 'mousedown', (event) =>
            Gdx._processor.touchDown(Math.ceil(event.clientX/Gdx._scaleX), Math.ceil(event.clientY/Gdx._scaleY), -1, event.button)
        , true

        document.addEventListener 'mousemove', (event) =>
            Gdx._processor.mouseMoved(Math.ceil(event.clientX/Gdx._scaleX), Math.ceil(event.clientY/Gdx._scaleY))
        , true

        document.addEventListener 'mouseup', (event) => 
            Gdx._processor.touchUp(Math.ceil(event.clientX/Gdx._scaleX), Math.ceil(event.clientY/Gdx._scaleY), -1, event.button)
        , true

        window.addEventListener 'keydown', ((event) => Gdx._processor.keyDown(event.which)), true
        window.addEventListener 'keyup', ((event) => Gdx._processor.keyUp(event.which)), true


`export default Input`