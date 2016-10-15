/*******************************************************************************
  * Copyright 2011 See AUTHORS file.
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *   http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  ******************************************************************************/
package com.badlogic.gdx.utils.viewport

import com.badlogic.gdx.graphics.Camera
import com.badlogic.gdx.utils.Scaling

import scala.scalajs.js
import scala.scalajs.js.annotation.JSName

/** A viewport that scales the world using {@link Scaling}.
  * <p>
  * {@link Scaling#fit} keeps the aspect ratio by scaling the world up to fit the screen, adding black bars (letterboxing) for the
  * remaining space.
  * <p>
  * {@link Scaling#fill} keeps the aspect ratio by scaling the world up to take the whole screen (some of the world may be off
  * screen).
  * <p>
  * {@link Scaling#stretch} does not keep the aspect ratio, the world is scaled to take the whole screen.
  * <p>
  * {@link Scaling#none} keeps the aspect ratio by using a fixed size world (the world may not fill the screen or some of the world
  * may be off screen).
  * @author Daniel Holderbaum
  * @author Nathan Sweet */
@JSName("gdx.utils.viewport.ScalingViewport")
@js.native
class ScalingViewport extends Viewport {
  /** Creates a new viewport using a new {@link OrthographicCamera}. */
  def this(scaling: Scaling, worldWidth: Float, worldHeight: Float, camera: Camera = ???) = this()
}