package com.uwsoft.editor.renderer

import com.badlogic.gdx.utils.viewport.Viewport
import com.uwsoft.editor.renderer.resources.ResourceManager

import scala.scalajs.js
import scala.scalajs.js.annotation.JSName


@JSName("uwsoft.editor.renderer.SceneLoader")
@js.native
class SceneLoader extends js.Object {

    var engine:Engine = js.native

    def getRm(): ResourceManager = js.native

    def loadScene(name: String, viewport: Viewport): Unit = js.native
    def loadVoFromLibrary(name: String): Any = js.native

}
