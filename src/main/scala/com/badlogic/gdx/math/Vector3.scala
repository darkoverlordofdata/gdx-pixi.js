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
package com.badlogic.gdx.math

import scala.scalajs.js
import scala.scalajs.js.annotation.JSName

/** Encapsulates a 3D vector. Allows chaining operations by returning a reference to itself in all modification methods.
  * @author badlogicgames@gmail.com */
@JSName("gdx.math.Vector3")
@js.native
class Vector3 extends js.Object {

  val x:Float = js.native
  val y:Float = js.native
  val z:Float = js.native

  /** Sets the vector to the given components
    *
    * @param x The x-component
    * @param y The y-component
    * @param z The z-component
    * @return this vector for chaining */
  def set(x: Float, y:Float, z:Float): Unit = js.native

}
