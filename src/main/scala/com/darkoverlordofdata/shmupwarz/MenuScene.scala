package com.darkoverlordofdata.shmupwarz

import com.badlogic.gdx.Gdx
import com.badlogic.gdx.Screen
import com.badlogic.gdx.graphics.GL20
import com.badlogic.gdx.scenes.scene2d.Stage
import com.uwsoft.editor.renderer.SceneLoader

class MenuScene(sceneLoader: SceneLoader, ui: Stage) extends Screen {

  override def hide(): Unit = {}
  override def dispose(): Unit = {}
  override def pause(): Unit = {}
  override def show(): Unit = {}
  override def resume(): Unit = {}
  override def render(delta: Float) = {
    Gdx.gl.glClearColor(0f, 0f, 0f, 1f)
    Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT)
    sceneLoader.engine.update(delta)
    ui.act()
    ui.draw()

  }
  override def resize(width: Int, height: Int): Unit = {}

}
