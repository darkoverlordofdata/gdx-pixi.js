gdx.Input = (function(){

    var Gdx = gdx.Gdx;
    /**
     * @JSName("gdx.Input")
     */
    class Input {

        setInputProcessor(processor) {
            Gdx._processor = processor;
            
            document.addEventListener('touchstart', (event) => {
                let pixel = window.devicePixelRatio
                event = event.targetTouches ? event.targetTouches[0] : event;
                Gdx._processor.touchDown(Math.ceil(event.clientX/Gdx._scaleX*pixel), Math.ceil(event.clientY/Gdx._scaleY*pixel), 0, 0)
            }, true);
            document.addEventListener('touchmove', (event) =>  {
                let pixel = window.devicePixelRatio
                event = event.targetTouches ? event.targetTouches[0] : event;
                Gdx._processor.touchDragged(Math.ceil(event.clientX/Gdx._scaleX*pixel), Math.ceil(event.clientY/Gdx._scaleY*pixel), 0)
            }, true);
            document.addEventListener('touchend', (event) =>  {
                event = event.targetTouches ? event.targetTouches[0] : event;
                Gdx._processor.touchUp(0, 0, 0, 0)
            }, true);
            document.addEventListener('mousedown', (event) =>  {
                Gdx._processor.touchDown(Math.ceil(event.clientX/Gdx._scaleX), Math.ceil(event.clientY/Gdx._scaleY), -1, event.button)
            }, true);
            document.addEventListener('mousemove', (event) =>  {
                Gdx._processor.mouseMoved(Math.ceil(event.clientX/Gdx._scaleX), Math.ceil(event.clientY/Gdx._scaleY))
            }, true);
            document.addEventListener('mouseup', (event) =>  {
                Gdx._processor.touchUp(Math.ceil(event.clientX/Gdx._scaleX), Math.ceil(event.clientY/Gdx._scaleY), -1, event.button)
            }, true);
            window.addEventListener('keydown', (event) => Gdx._processor.keyDown(event.keyCode), true);
            window.addEventListener('keyup', (event) => Gdx._processor.keyUp(event.keyCode), true);
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

    return Input;

}());
