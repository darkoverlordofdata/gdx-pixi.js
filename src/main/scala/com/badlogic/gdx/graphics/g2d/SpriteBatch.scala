package com.badlogic.gdx.graphics.g2d

import com.badlogic.gdx.graphics.Texture

import scala.scalajs.js
import scala.scalajs.js.annotation.JSName

@JSName("gdx.graphics.g2d.SpriteBatch")
@js.native
class SpriteBatch extends js.Object {

  def begin(): Unit = js.native
  def draw(texture: Texture, x: Double, y: Double): Unit = js.native
  def end(): Unit = js.native
  def setProjectionMatrix(): Unit = js.native
}
