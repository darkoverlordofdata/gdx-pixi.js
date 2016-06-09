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
package com.badlogic.gdx.graphics.g2d

import com.badlogic.gdx.graphics.Texture

import scala.scalajs.js
import scala.scalajs.js.annotation.JSName

/** Defines a rectangular area of a texture. The coordinate system used has its origin in the upper left corner with the x-axis
  * pointing to the right and the y axis pointing downwards.
  * @author mzechner
  * @author Nathan Sweet */
@JSName("gdx.graphics.g2d.TextureRegion")
@js.native
class TextureRegion extends js.Object {
  /** Constructs a region the size of the specified texture. */
  def this(texture: Texture) = this()

}
