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

import com.badlogic.gdx.{Gdx, InputAdapter}

import scala.scalajs.js
import scala.scalajs.js.annotation.JSName

/** A 2D scene graph containing hierarchies of {@link Actor actors}. Stage handles the viewport and distributes input events.
  * <p>
  * {@link #setViewport(Viewport)} controls the coordinates used within the stage and sets up the camera used to convert between
  * stage coordinates and screen coordinates.
  * <p>
  * A stage must receive input events so it can distribute them to actors. This is typically done by passing the stage to
  * {@link Input#setInputProcessor(com.badlogic.gdx.InputProcessor) Gdx.input.setInputProcessor}. An {@link InputMultiplexer} may be
  * used to handle input events before or after the stage does. If an actor handles an event by returning true from the input
  * method, then the stage's input method will also return true, causing subsequent InputProcessors to not receive the event.
  * <p>
  * The Stage and its constituents (like Actors and Listeners) are not thread-safe and should only be updated and queried from a
  * single thread (presumably the main render thread). Methods should be reentrant, so you can update Actors and Stages from within
  * callbacks and handlers.
  *
  * @author mzechner
  * @author Nathan Sweet */
class Stage extends InputAdapter {

  val height = Gdx.graphics.getHeight()
  val width = Gdx.graphics.getWidth()

  def act(): Unit = {}
  def draw(): Unit = {}

  def getWidth(): Float = height
  def getHeight(): Float = width

  def addActor(actor: Actor): Unit = {}
}
