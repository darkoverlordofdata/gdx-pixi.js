var gdx;(function (gdx) {


    /**
     * @JSName("gdx.Input")
     */
    class Input {

        setInputProcessor(processor) {
            gdx._processor = processor;
            
            document.addEventListener('touchstart', (event) => {
                let pixel = window.devicePixelRatio
                event = event.targetTouches ? event.targetTouches[0] : event;
                gdx._processor.touchDown(Math.ceil(event.clientX/gdx._scaleX*pixel), Math.ceil(event.clientY/gdx._scaleY*pixel), 0, 0)
            }, true);
            document.addEventListener('touchmove', (event) =>  {
                let pixel = window.devicePixelRatio
                event = event.targetTouches ? event.targetTouches[0] : event;
                gdx._processor.touchDragged(Math.ceil(event.clientX/gdx._scaleX*pixel), Math.ceil(event.clientY/gdx._scaleY*pixel), 0)
            }, true);
            document.addEventListener('touchend', (event) =>  {
                event = event.targetTouches ? event.targetTouches[0] : event;
                gdx._processor.touchUp(0, 0, 0, 0)
            }, true);
            document.addEventListener('mousedown', (event) =>  {
                gdx._processor.touchDown(Math.ceil(event.clientX/gdx._scaleX), Math.ceil(event.clientY/gdx._scaleY), -1, event.button)
            }, true);
            document.addEventListener('mousemove', (event) =>  {
                gdx._processor.mouseMoved(Math.ceil(event.clientX/gdx._scaleX), Math.ceil(event.clientY/gdx._scaleY))
            }, true);
            document.addEventListener('mouseup', (event) =>  {
                gdx._processor.touchUp(Math.ceil(event.clientX/gdx._scaleX), Math.ceil(event.clientY/gdx._scaleY), -1, event.button)
            }, true);
            window.addEventListener('keydown', (event) => gdx._processor.keyDown(event.keyCode), true);
            window.addEventListener('keyup', (event) => gdx._processor.keyUp(event.keyCode), true);
        }
    }

    /**
     * @JSName("gdx.Input.Buttons")
     */
    Input.Buttons = {
        LEFT: 0,
        RIGHT: 1,
        MIDDLE: 2,
        BACK: 3,
        FORWARD: 4
    }

    /**
     * @JSName("gdx.InpuyKeys")
     */
    Input.Keys = {
        A: 54,
        Z: 90
    }

    gdx.Input = Input;
    
})(gdx || (gdx = {}));
