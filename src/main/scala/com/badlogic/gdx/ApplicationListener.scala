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
package com.badlogic.gdx

/** <p>
  * An <code>ApplicationListener</code> is called when the {@link Application} is created, resumed, rendering, paused or destroyed.
  * All methods are called in a thread that has the OpenGL context current. You can thus safely create and manipulate graphics
  * resources.
  * </p>
  *
  * <p>
  * The <code>ApplicationListener</code> interface follows the standard Android activity life-cycle and is emulated on the desktop
  * accordingly.
  * </p>
  *
  * @author mzechner */
import scala.scalajs.js.annotation.JSExport

trait ApplicationListener {
  /** Called when the {@link Application} is first created. */
  @JSExport
  def create(): Unit
  /** Called when the {@link Application} is resized. This can happen at any point during a non-paused state but will never happen
    * before a call to {@link #create()}.
    *
    * @param width the new width in pixels
    * @param height the new height in pixels */

  @JSExport
  def resize(width: Int, height: Int): Unit

  /** Called when the {@link Application} should render itself. */
  @JSExport
  def render(): Unit

  /** Called when the {@link Application} is paused, usually when it's not active or visible on screen. An Application is also
    * paused before it is destroyed. */
  @JSExport
  def pause(): Unit

  /** Called when the {@link Application} is resumed from a paused state, usually when it regains focus. */
  @JSExport
  def resume(): Unit

  /** Called when the {@link Application} is destroyed. Preceded by a call to {@link #pause()}. */
  @JSExport
  def dispose(): Unit
}
