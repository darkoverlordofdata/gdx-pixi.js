/**
 * @JSName("uwsoft.editor.renderer.SceneLoader")
 */
import Engine from 'uwsoft/editor/renderer/Engine'
import ResourceManager from 'uwsoft/editor/renderer/resources/ResourceManager'

export default class SceneLoader {
    constructor(name, viewport) {
        this.name = ''
        this.viewport = null
        this.engine = new Engine()
        this.rm = new ResourceManager()
        this.rm.initAllResources()
        this.sceneVO = null
    }
    loadScene(sceneName, viewport) {
        this.name = name
        this.viewport = viewport
        this.sceneVO = this.rm.getSceneVO(sceneName)
        return this.sceneVO

    }
    getRm() {return this.rm;}
    loadVoFromLibrary(libraryName) {
        let projectInfoVO = this.getRm().getProjectVO()
        let compositeItemVO = projectInfoVO.libraryItems[libraryName]
        return compositeItemVO
    }
    
}

