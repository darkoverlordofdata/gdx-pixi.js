package com.badlogic.gdx.graphics.g2d

import com.badlogic.gdx.graphics.Texture

import scala.scalajs.js
import scala.scalajs.js.annotation.JSName

@JSName("gdx.graphics.g2d.Sprite")
@js.native
class Sprite extends TextureRegion {
  def this(texture:Texture) = this()
  def getWidth(): Int = js.native
  def getHeight(): Int = js.native
  def setX(value:Float): Unit = js.native
  def setY(value:Float): Unit = js.native
  def setColor(red:Float, green:Float, blue:Float, alpha:Float): Unit = js.native
  def setScale(x:Float, y:Float = ???): Unit = js.native
  def setPosition(x:Float, y:Float): Unit = js.native
  def draw(batch:Batch): Unit = js.native
}
