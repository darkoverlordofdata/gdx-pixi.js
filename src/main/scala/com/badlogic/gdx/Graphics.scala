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
  var fps: Double = js.native
  def getDeltaTime: Double = js.native
  def getWidth: Double = js.native
  def getHeight: Double = js.native
  def getDensity: Double = js.native

}
