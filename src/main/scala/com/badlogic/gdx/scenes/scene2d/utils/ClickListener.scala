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
package com.badlogic.gdx.scenes.scene2d.utils

import com.badlogic.gdx.scenes.scene2d.{InputListener, InputEvent}

import scala.scalajs.js
import scala.scalajs.js.annotation.JSName

/** Detects mouse over, mouse or finger touch presses, and clicks on an actor. A touch must go down over the actor and is
  * considered pressed as long as it is over the actor or within the {@link #setTapSquareSize(float) tap square}. This behavior
  * makes it easier to press buttons on a touch interface when the initial touch happens near the edge of the actor. Double clicks
  * can be detected using {@link #getTapCount()}. Any touch (not just the first) will trigger this listener. While pressed, other
  * touch downs are ignored.
  * @author Nathan Sweet */
@JSName("gdx.scenes.scene2d.utils.ClickListener")
@js.native
class ClickListener extends InputListener {

  def clicked(event:InputEvent, x: Float, y: Float): Unit = js.native
}
