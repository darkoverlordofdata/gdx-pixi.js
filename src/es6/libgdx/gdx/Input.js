import Gdx from  'gdx/Gdx'
/**
 * @JSName("gdx.Input")
 */
export default class Input {

    setInputProcessor(processor) {
        Gdx._processor = processor
        
        document.addEventListener('touchstart', (event) => {
            const pixel = window.devicePixelRatio
            event = event.targetTouches ? event.targetTouches[0] : event
            Gdx._processor.touchDown(Math.ceil(event.clientX/Gdx._scaleX*pixel), Math.ceil(event.clientY/Gdx._scaleY*pixel), 0, 0)
        }, true)
        document.addEventListener('touchmove', (event) =>  {
            const pixel = window.devicePixelRatio
            event = event.targetTouches ? event.targetTouches[0] : event
            Gdx._processor.touchDragged(Math.ceil(event.clientX/Gdx._scaleX*pixel), Math.ceil(event.clientY/Gdx._scaleY*pixel), 0)
        }, true)
        document.addEventListener('touchend', (event) =>  {
            event = event.targetTouches ? event.targetTouches[0] : event
            Gdx._processor.touchUp(0, 0, 0, 0)
        }, true)
        document.addEventListener('mousedown', (event) =>  {
            Gdx._processor.touchDown(Math.ceil(event.clientX/Gdx._scaleX), Math.ceil(event.clientY/Gdx._scaleY), -1, event.button)
        }, true)
        document.addEventListener('mousemove', (event) =>  {
            Gdx._processor.mouseMoved(Math.ceil(event.clientX/Gdx._scaleX), Math.ceil(event.clientY/Gdx._scaleY))
        }, true)
        document.addEventListener('mouseup', (event) =>  {
            Gdx._processor.touchUp(Math.ceil(event.clientX/Gdx._scaleX), Math.ceil(event.clientY/Gdx._scaleY), -1, event.button)
        }, true)
        window.addEventListener('keydown', (event) => Gdx._processor.keyDown(event.which), true)
        window.addEventListener('keyup', (event) => Gdx._processor.keyUp(event.which), true)
    }
}

/**
 * @JSName("gdx.Input.Buttons")
 */

class Buttons {}

Buttons[Buttons.LEFT     = 0] = 'LEFT'
Buttons[Buttons.RIGHT    = 1] = 'RIGHT'
Buttons[Buttons.MIDDLE   = 2] = 'MIDDLE'
Buttons[Buttons.BACK     = 3] = 'BACK'
Buttons[Buttons.FORWARD  = 4] = 'FORWARD'


/**
 * @JSName("gdx.InpuyKeys")
 */
class Keys {}
Keys.ANY_KEY = -1 
Keys.NUM_0 = 96 
Keys.NUM_1 = 97 
Keys.NUM_2 = 98 
Keys.NUM_3 = 99 
Keys.NUM_4 = 100 
Keys.NUM_5 = 101 
Keys.NUM_6 = 102 
Keys.NUM_7 = 103 
Keys.NUM_8 = 104 
Keys.NUM_9 = 105 
Keys.A = 65 
Keys.B = 66 
Keys.BACKSLASH = 220 
Keys.C = 67 
Keys.COMMA = 188 
Keys.D = 68 
Keys.DEL = 46 
Keys.BACKSPACE = 8 
Keys.DOWN = 40 
Keys.LEFT = 37 
Keys.RIGHT = 39 
Keys.UP = 38 
Keys.E = 69 
Keys.EQUALS = 187 
Keys.F = 70 
Keys.G = 71 
Keys.H = 72 
Keys.HOME = 36 
Keys.I = 73 
Keys.J = 74 
Keys.K = 75 
Keys.L = 76 
Keys.LEFT_BRACKET = 219 
Keys.M = 77 
Keys.MINUS = 189 
Keys.N = 78 
Keys.O = 79 
Keys.P = 80 
Keys.PERIOD = 190 
Keys.PLUS = 187 
Keys.Q = 81 
Keys.R = 82 
Keys.RIGHT_BRACKET = 221 
Keys.S = 83 
Keys.SEMICOLON = 186 
Keys.SLASH = 191 
Keys.SPACE = 32 
Keys.T = 84 
Keys.TAB = 9 
Keys.U = 85 
Keys.UNKNOWN = 0 
Keys.V = 86 
Keys.W = 87 
Keys.X = 88 
Keys.Y = 89 
Keys.Z = 90 
Keys.ESCAPE = 27 
Keys.END = 35 
Keys.INSERT = 45 
Keys.PAGE_UP = 33 
Keys.PAGE_DOWN = 34 
Keys.COLON = 186    

Input.Buttons = Buttons 
Input.Keys = Keys

