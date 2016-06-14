var gdx;(function (gdx) {
    var scenes;(function (scenes) {
        var scene2d;(function (scene2d) {

            var EventListener = gdx.scenes.scene2d.EventListener;          
            /**
             * @JSName("gdx.scenes.scene2d.InputListener")
             */
            class InputListener extends EventListener {}
                
            scene2d.InputListener = InputListener;

        })(scene2d = scenes.scene2d || (scenes.scene2d = {}));
    })(scenes = gdx.scenes || (gdx.scenes = {}));
})(gdx || (gdx = {}));
