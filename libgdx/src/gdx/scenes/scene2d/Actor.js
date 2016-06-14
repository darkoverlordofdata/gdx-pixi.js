var gdx;(function (gdx) {
    var scenes;(function (scenes) {
        var scene2d;(function (scene2d) {

        /**
         * @JSName("gdx.scenes.scene2d.Actor")
         */
        class Actor {

            constructor() {
                this.width = 0;
                this.height = 0;
                this.x = 0;
                this.y = 0;
                this.scale = 0;
                this.listeners = []        
            }

            getWidth() {return Math.ceil(this.width);}
            getHeight() {return Math.ceil(this.height);}

            setX(x) {
                this.x = x;
            }
            setY(y) {
                this.y = y;
            }
            setScale(scaleXY) {
                this.scale = scaleXY;
            }
            addListener(listener) {
                console.log(listener)
                this.listeners.push(listener);
            }
        }
            
        scene2d.Actor = Actor;

        })(scene2d = scenes.scene2d || (scenes.scene2d = {}));
    })(scenes = gdx.scenes || (gdx.scenes = {}));
})(gdx || (gdx = {}));
