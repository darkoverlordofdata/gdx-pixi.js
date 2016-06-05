package com.badlogic.gdx

abstract class Game extends ApplicationListener {
  var screen: Screen = null

  override def dispose(): Unit = {
    if (screen != null) screen.hide()
  }
  override def pause(): Unit = {
    if (screen != null) screen.pause()
  }

  override def resume(): Unit = {
    if (screen != null) screen.resume()
  }

  override def render(): Unit = {
    if (screen != null) screen.render(Gdx.graphics.getDeltaTime())
  }

  override def resize(width: Int, height: Int): Unit = {
    if (screen != null) screen.resize(width, height)
  }

  def setScreen(screen:Screen): Unit = {
    if (this.screen != null) this.screen.hide()
    this.screen = screen
    if (this.screen != null) {
      this.screen.show()
      this.screen.resize(Gdx.graphics.getWidth(), Gdx.graphics.getHeight())
    }
  }
  def getScreen: Screen = screen
}

