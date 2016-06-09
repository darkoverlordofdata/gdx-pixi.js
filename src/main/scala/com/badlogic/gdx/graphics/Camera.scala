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
package com.badlogic.gdx.graphics

import com.badlogic.gdx.math.Vector3

import scala.scalajs.js
import scala.scalajs.js.annotation.JSName

/** Base class for {@link OrthographicCamera} and {@link PerspectiveCamera}.
  * @author mzechner */
@JSName("gdx.graphics.Camera")
@js.native
class Camera extends js.Object {
  /** the position of the camera **/
  val position:Vector3 = js.native

  /** the combined projection and view matrix **/
  val combined:Any = js.native

  /** the viewport width **/
  val viewportWidth: Float = js.native

  /** the viewport height **/
  val viewportHeight: Float = js.native

  /** Recalculates the projection and view matrix of this camera and the {@link Frustum} planes. Use this after you've manipulated
    * any of the attributes of the camera. */
  def update(): Unit = js.native
}

