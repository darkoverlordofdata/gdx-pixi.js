/**
 * uwsoft.js
 *
 * MIT License
 * Copyright (c) 2016 Bruce Davidson &lt;darkoverlordofdata@gmail.com&gt;
 *
 * partial implementation. to start, this is just enough for ShmupWarz to
 * run in the browser.
 */
import Engine from 'uwsoft/editor/renderer/Engine'
import SceneLoader from 'uwsoft/editor/renderer/SceneLoader'
import ResourceManager from 'uwsoft/editor/renderer/resources/ResourceManager'
import CompositeActor from 'uwsoft/editor/renderer/scene2d/CompositeActor'
import ButtonClickListener from 'uwsoft/editor/renderer/scene2d/ButtonClickListener'

export default class uwsoft {}

window['uwsoft'] = uwsoft

uwsoft.editor = {}
uwsoft.editor.renderer = {
    SceneLoader: SceneLoader,

    commons: {},
    components: {},
    data: {},
    factory: {},
    physics: {},
    resources: {
        ResourceManager: ResourceManager
    },
    scene2d: {
        CompositeActor: CompositeActor,
        ButtonClickListener: ButtonClickListener
    },
    scripts: {},
    systems: {},
    utils: {}
}


