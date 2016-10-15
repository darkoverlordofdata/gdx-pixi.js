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

/** An adapter class for {@link InputProcessor}. You can derive from this and only override what you are interested in.
  *
  * @author mzechner */
class InputAdapter extends InputProcessor {
  override def keyDown(keycode: Int): Boolean = {
    false
  }
  override def keyUp(keycode: Int): Boolean = {
    false
  }
  override def keyTyped(keycode: Char): Boolean = {
    false
  }
  override def touchDown(screenX: Int, screenY: Int, pointer: Int, button: Int): Boolean = {
    false
  }
  override def touchUp(screenX: Int, screenY: Int, pointer: Int, button: Int): Boolean = {
    false
  }
  override def touchDragged(screenX: Int, screenY: Int, pointer: Int): Boolean = {
    false
  }
  override def mouseMoved(screenX: Int, screenY: Int): Boolean = {
    false
  }
  override def scrolled(amount: Int): Boolean = {
    false
  }
}

