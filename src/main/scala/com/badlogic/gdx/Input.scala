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

import scala.scalajs.js
import scala.scalajs.js.annotation._

/** Mouse buttons.
  * @author mzechner */
@JSName("gdx.Input.Buttons")
@js.native
class Buttons extends js.Object {
  val LEFT: Double = js.native
  val RIGHT: Double = js.native
  val MIDDLE: Double = js.native
  val BACK: Double = js.native
  val FORWARD: Double = js.native
}

/** Keys.
  *
  * @author mzechner */
@JSName("gdx.Input.Keys")
@js.native
class Keys extends js.Object {
  val A: Double = js.native
  val Z: Double = js.native
}

@JSName("gdx.Input")
@js.native
object Input extends js.Object {
  val Buttons : Buttons = js.native
  val Keys : Keys = js.native
}

/** <p>
  * Interface to the input facilities. This allows polling the state of the keyboard, the touch screen and the accelerometer. On
  * some backends (desktop, gwt, etc) the touch screen is replaced by mouse input. The accelerometer is of course not available on
  * all backends.
  * </p>
  *
  * <p>
  * Instead of polling for events, one can process all input events with an {@link InputProcessor}. You can set the InputProcessor
  * via the {@link #setInputProcessor(InputProcessor)} method. It will be called before the {@link ApplicationListener#render()}
  * method in each frame.
  * </p>
  *
  * <p>
  * Keyboard keys are translated to the constants in {@link Keys} transparently on all systems. Do not use system specific key
  * constants.
  * </p>
  *
  * <p>
  * The class also offers methods to use (and test for the presence of) other input systems like vibration, compass, on-screen
  * keyboards, and cursor capture. Support for simple input dialogs is also provided.
  * </p>
  *
  * @author mzechner */
@JSName("gdx.Input")
@js.native
trait Input extends js.Object {
  /** Sets the {@link InputProcessor} that will receive all touch and key input events. It will be called before the
    * {@link ApplicationListener#render()} method each frame.
    *
    * @param processor the InputProcessor */
  def setInputProcessor(processor: InputProcessor): Unit = js.native
}

