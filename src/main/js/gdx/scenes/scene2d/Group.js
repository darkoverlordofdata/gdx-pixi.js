/**
 * @JSName("gdx.scenes.scene2d.Group")
 */
import Actor from 'gdx/scenes/scene2d/Actor'

export default class Group extends Actor {

    constructor() {
        this.children = []
    }

    act(delta) {
        super.act(delta)
        for (let i=0, n=this.children.length; i<n; i++) {
            actors[i].act(delta)
        }

    }
    childrenChanged(){}

    addActor(actor) {
        if (actor.parent != null) actor.parent.removeActor(actor, false)
        children.push(actor)
        actor.setParent(this)
        actor.setStage(getStage())
        childrenChanged()
    }

    removeActor(actor, unfocus) {
        if (!children.removeValue(actor, true)) return false
        if (unfocus) {
            let stage = getStage()
            if (stage != null) stage.unfocus(actor)
        }
        actor.setParent(null)
        actor.setStage(null)
        childrenChanged()
        return true
    }

    

}

                
