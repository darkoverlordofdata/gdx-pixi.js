package com.badlogic.gdx

import scala.scalajs.js
import scala.scalajs.js.annotation.JSName

@JSName("gdx.InputProcessor")
@js.native
class InputProcessor extends js.Object {
  def keyDown(keycode: Double): Boolean = js.native
  def keyUp(keycode: Double): Boolean = js.native
  def keyTyped(keycode: String): Boolean = js.native
  def touchDown(screenX: Double, screenY: Double, pointer: Double, button: Double): Boolean = js.native
  def touchUp(screenX: Double, screenY: Double, pointer: Double, button: Double): Boolean = js.native
  def touchDragged(screenX: Double, screenY: Double, pointer: Double): Boolean = js.native
  def mouseMoved(screenX: Double, screenY: Double): Boolean = js.native
  def scrolled(amount: Double): Boolean = js.native
}

