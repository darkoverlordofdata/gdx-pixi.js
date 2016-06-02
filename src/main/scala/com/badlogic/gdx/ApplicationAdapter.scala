package com.badlogic.gdx

trait ApplicationAdapter extends ApplicationListener {
  override def create(): Unit
  override def resize(width: Int, height: Int): Unit
  override def render(): Unit
  override def pause(): Unit
  override def resume(): Unit
  override def dispose(): Unit
}
