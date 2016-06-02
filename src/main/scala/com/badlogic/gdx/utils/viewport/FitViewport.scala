package com.badlogic.gdx.utils.viewport


import com.badlogic.gdx.graphics.Camera

import scala.scalajs.js
import scala.scalajs.js.annotation.JSName

@JSName("utils.viewport.FitViewport")
@js.native
class FitViewport extends ScalingViewport {
  def this(worldWidth: Double, worldHeight: Double, camera: Camera = ???) = this()
}