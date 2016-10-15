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

import scala.scalajs.js
import scala.scalajs.js.annotation.JSName

/** A camera with orthographic projection.
  *
  * @author mzechner */
@JSName("gdx.graphics.OrthographicCamera")
@js.native
class OrthographicCamera extends Camera {
  /** Constructs a new OrthographicCamera, using the given viewport width and height. For pixel perfect 2D rendering just supply
    * the screen size, for other unit scales (e.g. meters for box2d) proceed accordingly. The camera will show the region
    * [-viewportWidth/2, -(viewportHeight/2-1)] - [(viewportWidth/2-1), viewportHeight/2]
    * @param viewportWidth the viewport width
    * @param viewportHeight the viewport height */
  def this(viewportWidth:Float, viewportHeight:Float) = this()

}

