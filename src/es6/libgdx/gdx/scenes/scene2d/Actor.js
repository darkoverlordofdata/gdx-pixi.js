/**
 * @JSName("gdx.scenes.scene2d.Actor")
 */

export default class Actor {

    constructor() {
        this.width = 0
        this.height = 0
        this.x = 0
        this.y = 0
        this.scale = 0
        this.listeners = []        
    }

    getWidth() {return Math.ceil(this.width)}
    getHeight() {return Math.ceil(this.height)}

    setX(x) {
        this.x = x
    }
    setY(y) {
        this.y = y
    }
    setScale(scaleXY) {
        this.scale = scaleXY
    }
    addListener(listener) {
        console.log(listener)
        this.listeners.push(listener)
    }
}

                
