package com.badlogic.gdx.graphics.g2d

import com.badlogic.gdx.graphics.Texture

import scala.scalajs.js
import scala.scalajs.js.annotation.JSName

@JSName("gdx.graphics.g2d.Batch")
@js.native
class Batch extends js.Object {

  def begin(): Unit = js.native
  def draw(texture: Texture, x: Float, y: Float): Unit = js.native
  def draw(region: TextureRegion, x: Float, y: Float, width:Float, height:Float): Unit = js.native
  def end(): Unit = js.native
  def setProjectionMatrix(projection: Any): Unit = js.native
}
