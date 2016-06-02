package com.badlogic.gdx

import scala.scalajs.js.annotation.JSExport

trait ApplicationListener {
  @JSExport
  def create(): Unit
  @JSExport
  def resize(width: Int, height: Int): Unit
  @JSExport
  def render(): Unit
  @JSExport
  def pause(): Unit
  @JSExport
  def resume(): Unit
  @JSExport
  def dispose(): Unit
}
