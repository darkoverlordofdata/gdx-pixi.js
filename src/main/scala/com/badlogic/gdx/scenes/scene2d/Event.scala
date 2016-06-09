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
package com.badlogic.gdx.scenes.scene2d

import scala.scalajs.js
import scala.scalajs.js.annotation.JSName

/** The base class for all events.
  * <p>
  * By default an event will "bubble" up through an actor's parent's handlers (see {@link #setBubbles(boolean)}).
  * <p>
  * An actor's capture listeners can {@link #stop()} an event to prevent child actors from seeing it.
  * <p>
  * An Event may be marked as "handled" which will end its propagation outside of the Stage (see {@link #handle()}). The default
  * {@link Actor#fire(Event)} will mark events handled if an {@link EventListener} returns true.
  * <p>
  * A cancelled event will be stopped and handled. Additionally, many actors will undo the side-effects of a canceled event. (See
  * {@link #cancel()}.)
  *
  * @see InputEvent
  * @see Actor#fire(Event) */
@JSName("gdx.scenes.scene2d.Event")
@js.native
class Event extends js.Object {

}
