package com.badlogic.gdx

trait Game extends ApplicationListener {
  //var screen: Screen
  def setScreen(screen:Screen): Unit
  def getScreen(): Screen
  override def create(): Unit
  override def resize(width: Int, height: Int): Unit
  override def render(): Unit
  override def pause(): Unit
  override def resume(): Unit
  override def dispose(): Unit
}

