package com.badlogic.gdx.graphics

import com.badlogic.gdx.math.Vector3

import scala.scalajs.js
import scala.scalajs.js.annotation.JSName

@JSName("gdx.graphics.Camera")
@js.native
class Camera extends js.Object {
  val position:Vector3 = js.native
  val viewportWidth: Float = js.native
  val viewportHeight: Float = js.native
  def update(): Unit = js.native
}

