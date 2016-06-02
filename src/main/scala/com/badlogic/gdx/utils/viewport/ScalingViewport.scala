package com.badlogic.gdx.utils.viewport

import com.badlogic.gdx.graphics.Camera
import com.badlogic.gdx.utils.Scaling

import scala.scalajs.js
import scala.scalajs.js.annotation.JSName

@JSName("gdx.utils.viewport.ScalingViewport")
@js.native
class ScalingViewport extends Viewport {
  def this(scaling: Scaling, worldWidth: Float, worldHeight: Float, camera: Camera = ???) = this()
}