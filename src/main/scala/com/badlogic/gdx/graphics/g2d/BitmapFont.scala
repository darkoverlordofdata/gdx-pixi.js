package com.badlogic.gdx.graphics.g2d

import com.badlogic.gdx.files.FileHandle

import scala.scalajs.js
import scala.scalajs.js.annotation.JSName

@JSName("gdx.graphics.g2d.BitmapFont")
@js.native
class BitmapFont extends js.Object {
  def this(raw: FileHandle, region: TextureRegion, integer:Boolean) = this()

  def setUseIntegerPositions(integer:Boolean): Unit = js.native
  def getWidth(): Int = js.native
  def getHeight(): Int = js.native
  def draw(batch: Batch, str: String, x:Float, y:Float):Unit = js.native
}
