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

/** 2D scene graph node. An actor has a position, rectangular size, origin, scale, rotation, Z index, and color. The position
  * corresponds to the unrotated, unscaled bottom left corner of the actor. The position is relative to the actor's parent. The
  * origin is relative to the position and is used for scale and rotation.
  * <p>
  * An actor has a list of in progress {@link Action actions} that are applied to the actor (often over time). These are generally
  * used to change the presentation of the actor (moving it, resizing it, etc). See {@link #act(float)}, {@link Action} and its
  * many subclasses.
  * <p>
  * An actor has two kinds of listeners associated with it: "capture" and regular. The listeners are notified of events the actor
  * or its children receive. The regular listeners are designed to allow an actor to respond to events that have been delivered.
  * The capture listeners are designed to allow a parent or container actor to handle events before child actors. See {@link #fire}
  * for more details.
  * <p>
  * An {@link InputListener} can receive all the basic input events. More complex listeners (like {@link ClickListener} and
  * {@link ActorGestureListener}) can listen for and combine primitive events and recognize complex interactions like multi-touch
  * or pinch.
  * @author mzechner
  * @author Nathan Sweet */
@JSName("gdx.scenes.scene2d.Actor")
@js.native
class Actor extends js.Object {

  def setX(x: Float): Unit = js.native
  def setY(y: Float): Unit = js.native
  def getWidth(): Int = js.native
  def getHeight(): Int = js.native

  /** Sets the scale for both X and Y */
  def setScale(scaleXY: Float): Unit = js.native

  /** Add a listener to receive events that {@link #hit(float, float, boolean) hit} this actor. See {@link #fire(Event)}.
    * @see InputListener
    * @see ClickListener */
  def addListener(listener: EventListener): Unit = js.native


}
