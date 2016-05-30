package com.badlogic.gdx

import scala.scalajs.js
import scala.scalajs.js.annotation.JSName

@JSName("gdx.Screen")
@js.native
class Screen extends js.Object {
  def hide(): Unit = js.native
  def dispose(): Unit = js.native
  def pause(): Unit = js.native
  def resize(height: Double, width: Double): Unit = js.native
  def show(): Unit = js.native
  def resume(): Unit = js.native
  def render(time: Double): Unit = js.native
}

