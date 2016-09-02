
import ClickListener from  'gdx/scenes/scene2d/utils/ClickListener'

export default class ButtonClickListener extends ClickListener {
    touchDown(event, x, y, pointer, button) {
        let compositeActor = event.getListenerActor()
        compositeActor.setLayerVisibility("normal", false)
        compositeActor.setLayerVisibility("pressed", true)
        return true
    }
    touchUp(event, x, y, pointer, button) {
        let compositeActor = event.getListenerActor()
        compositeActor.setLayerVisibility("normal", true)
        compositeActor.setLayerVisibility("pressed", false)
    }
}

