package com.badlogic.gdx.graphics.g2d

import com.badlogic.gdx.graphics.Texture

import scala.scalajs.js
import scala.scalajs.js.annotation.JSName

@JSName("gdx.graphics.g2d.TextureRegion")
@js.native
class TextureRegion extends js.Object {
  def this(texture: Texture) = this()
  def setX(value:Float): Unit = js.native
  def setY(value:Float): Unit = js.native
  def setColor(red:Float, green:Float, blue:Float, alpha:Float): Unit = js.native
}
