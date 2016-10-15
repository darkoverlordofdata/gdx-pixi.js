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

/** Interface wrapping all the methods of OpenGL ES 2.0
  * @author mzechner */
@JSName("gdx.graphics.GL20")
@js.native
object GL20 extends js.Object {
  var GL_COLOR_BUFFER_BIT: Double = js.native
  var GL_NEAREST: Double = js.native
  var GL_LINEAR: Double = js.native
  var GL_NEAREST_MIPMAP_NEAREST: Double = js.native
  var GL_LINEAR_MIPMAP_NEAREST: Double = js.native
  var GL_NEAREST_MIPMAP_LINEAR: Double = js.native
  var GL_LINEAR_MIPMAP_LINEAR: Double = js.native
}

@JSName("gdx.graphics.GL20")
@js.native
class GL20 extends js.Object {
  def glClearColor(red: Double, green: Double, blue: Double, alpha: Double): Unit = js.native
  def glClear(mask: Double): Unit = js.native
}

