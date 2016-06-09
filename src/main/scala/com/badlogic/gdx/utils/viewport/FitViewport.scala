package com.badlogic.gdx.utils.viewport


import com.badlogic.gdx.graphics.Camera

import scala.scalajs.js
import scala.scalajs.js.annotation.JSName

/** A ScalingViewport that uses {@link Scaling#fit} so it keeps the aspect ratio by scaling the world up to fit the screen, adding
  * black bars (letterboxing) for the remaining space.
  * @author Daniel Holderbaum
  * @author Nathan Sweet */
@JSName("gdx.utils.viewport.FitViewport")
@js.native
class FitViewport extends ScalingViewport {
  /** Creates a new viewport using a new {@link OrthographicCamera}. */
  def this(worldWidth: Double, worldHeight: Double, camera: Camera = ???) = this()
}