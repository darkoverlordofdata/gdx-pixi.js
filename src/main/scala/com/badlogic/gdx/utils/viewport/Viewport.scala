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

import scala.scalajs.js
import scala.scalajs.js.annotation.JSName

/** Manages a {@link Camera} and determines how world coordinates are mapped to and from the screen.
  * @author Daniel Holderbaum
  * @author Nathan Sweet */
@JSName("gdx.utils.viewport.Viewport")
@js.native
class Viewport extends js.Object {
  /** Applies the viewport to the camera and sets the glViewport.
    * @param centerCamera If true, the camera position is set to the center of the world. */
  @JSName("applyCamera")
  def apply(): Unit = js.native

  /** Calls {@link #update(int, int, boolean)} with false. */
  def update(width:Float, height:Float): Unit = js.native
}