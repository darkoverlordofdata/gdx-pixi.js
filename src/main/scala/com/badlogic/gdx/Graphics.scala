package com.badlogic.gdx

import scala.scalajs.js
import scala.scalajs.js.annotation.JSName

@JSName("gdx.Graphics")
@js.native
class Graphics extends js.Object {
  var deltaTime: Double = js.native
  var frameId: Double = js.native
  var lastTime: Double = js.native
  var frames: Double = js.native
  var fps: Int = js.native
  def getDeltaTime(): Float = js.native
  def getWidth(): Int = js.native
  def getHeight(): Int = js.native
  def getDensity(): Int = js.native

}
