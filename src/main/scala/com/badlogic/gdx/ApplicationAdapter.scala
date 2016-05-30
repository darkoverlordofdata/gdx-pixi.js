package com.badlogic.gdx

import scala.scalajs.js.annotation.JSExport


trait ApplicationAdapter extends ApplicationListener {
  @JSExport
  override def create(): Unit
  @JSExport
  override def resize(width: Double, height: Double): Unit
  @JSExport
  override def render(): Unit
  @JSExport
  override def pause(): Unit
  @JSExport
  override def resume(): Unit
  @JSExport
  override def dispose(): Unit
}
