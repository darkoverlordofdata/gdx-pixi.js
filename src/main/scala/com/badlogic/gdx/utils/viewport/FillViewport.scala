package com.badlogic.gdx.utils.viewport

import scala.scalajs.js
import scala.scalajs.js.annotation.JSName
import com.badlogic.gdx.graphics._

/** A ScalingViewport that uses {@link Scaling#fill} so it keeps the aspect ratio by scaling the world up to take the whole screen
  * (some of the world may be off screen).
  * @author Daniel Holderbaum
  * @author Nathan Sweet */
@JSName("gdx.utils.viewport.FillViewport")
@js.native
class FillViewport extends ScalingViewport {
  /** Creates a new viewport using a new {@link OrthographicCamera}. */
  def this(worldWidth: Float, worldHeight: Float, camera: Camera = ???) = this()
}

