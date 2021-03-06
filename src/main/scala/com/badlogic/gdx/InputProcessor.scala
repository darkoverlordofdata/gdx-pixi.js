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

/** An InputProcessor is used to receive input events from the keyboard and the touch screen (mouse on the desktop). For this it
  * has to be registered with the {@link Input#setInputProcessor(InputProcessor)} method. It will be called each frame before the
  * call to {@link ApplicationListener#render()}. Each method returns a boolean in case you want to use this with the
  * {@link InputMultiplexer} to chain input processors.
  *
  * @author mzechner */
trait InputProcessor {
  /** Called when a key was pressed
    *
    * @param keycode one of the constants in {@link Input.Keys}
    * @return whether the input was processed */
  def keyDown(keycode: Int): Boolean

  /** Called when a key was released
    *
    * @param keycode one of the constants in {@link Input.Keys}
    * @return whether the input was processed */
  def keyUp(keycode: Int): Boolean

  /** Called when a key was typed
    *
    * @param character The character
    * @return whether the input was processed */
  def keyTyped(keycode: Char): Boolean

  /** Called when the screen was touched or a mouse button was pressed. The button parameter will be {@link Buttons#LEFT} on iOS.
    * @param screenX The x coordinate, origin is in the upper left corner
    * @param screenY The y coordinate, origin is in the upper left corner
    * @param pointer the pointer for the event.
    * @param button the button
    * @return whether the input was processed */
  def touchDown(screenX: Int, screenY: Int, pointer: Int, button: Int): Boolean

  /** Called when a finger was lifted or a mouse button was released. The button parameter will be {@link Buttons#LEFT} on iOS.
    * @param pointer the pointer for the event.
    * @param button the button
    * @return whether the input was processed */
  def touchUp(screenX: Int, screenY: Int, pointer: Int, button: Int): Boolean

  /** Called when a finger or the mouse was dragged.
    * @param pointer the pointer for the event.
    * @return whether the input was processed */
  def touchDragged(screenX: Int, screenY: Int, pointer: Int): Boolean

  /** Called when the mouse was moved without any buttons being pressed. Will not be called on iOS.
    * @return whether the input was processed */
  def mouseMoved(screenX: Int, screenY: Int): Boolean

  /** Called when the mouse wheel was scrolled. Will not be called on iOS.
    * @param amount the scroll amount, -1 or 1 depending on the direction the wheel was scrolled.
    * @return whether the input was processed. */
  def scrolled(amount: Int): Boolean
}

