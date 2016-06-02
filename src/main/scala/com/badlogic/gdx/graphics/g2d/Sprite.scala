package com.badlogic.gdx.graphics.g2d


import scala.scalajs.js
import scala.scalajs.js.annotation.JSName

@JSName("gdx.graphics.g2d.Sprite")
@js.native
class Sprite extends TextureRegion {
  def getWidth(): Int = js.native
  def getHeight(): Int = js.native
  def setScale(x:Float, y:Float = ???): Unit = js.native
  def setPosition(x:Float, y:Float): Unit = js.native
  def draw(batch:Batch): Unit = js.native
}
