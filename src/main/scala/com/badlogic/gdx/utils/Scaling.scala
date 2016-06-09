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
package com.badlogic.gdx.utils

import scala.scalajs.js
import scala.scalajs.js.annotation.JSName

@JSName("gdx.utils.Scaling")
@js.native
class Scaling extends js.Object {
  /** Scales the source to fit the target while keeping the same aspect ratio. This may cause the source to be smaller than the
    * target in one direction. */
  val fit: Int = js.native
  /** Scales the source to fill the target while keeping the same aspect ratio. This may cause the source to be larger than the
    * target in one direction. */
  val fill: Int = js.native
  /** Scales the source to fill the target in the x direction while keeping the same aspect ratio. This may cause the source to be
    * smaller or larger than the target in the y direction. */
  val fillX: Int = js.native
  /** Scales the source to fill the target in the y direction while keeping the same aspect ratio. This may cause the source to be
    * smaller or larger than the target in the x direction. */
  val fillY: Int = js.native
  /** Scales the source to fill the target. This may cause the source to not keep the same aspect ratio. */
  val stretch: Int = js.native
  /** Scales the source to fill the target in the x direction, without changing the y direction. This may cause the source to not
    * keep the same aspect ratio. */
  val stretchX: Int = js.native
  /** Scales the source to fill the target in the y direction, without changing the x direction. This may cause the source to not
    * keep the same aspect ratio. */
  val stretchY: Int = js.native
  /** The source is not scaled. */
  val none: Int = js.native

}