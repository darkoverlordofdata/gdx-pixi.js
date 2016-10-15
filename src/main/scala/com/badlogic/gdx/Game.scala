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
  * An {@link ApplicationListener} that delegates to a {@link Screen}. This allows an application to easily have multiple screens.
  * </p>
  * <p>
  * Screens are not disposed automatically. You must handle whether you want to keep screens around or dispose of them when another
  * screen is set.
  * </p> */
abstract class Game extends ApplicationListener {
  protected var screen: Screen = null

  override def dispose(): Unit = {
    if (screen != null) screen.hide()
  }
  override def pause(): Unit = {
    if (screen != null) screen.pause()
  }

  override def resume(): Unit = {
    if (screen != null) screen.resume()
  }

  override def render(): Unit = {
    if (screen != null) screen.render(Gdx.graphics.getDeltaTime())
  }

  override def resize(width: Int, height: Int): Unit = {
    if (screen != null) screen.resize(width, height)
  }

  /** Sets the current screen. {@link Screen#hide()} is called on any old screen, and {@link Screen#show()} is called on the new
    * screen, if any.
    * @param screen may be {@code null} */
  def setScreen(screen:Screen): Unit = {
    if (this.screen != null) this.screen.hide()
    this.screen = screen
    if (this.screen != null) {
      this.screen.show()
      this.screen.resize(Gdx.graphics.getWidth(), Gdx.graphics.getHeight())
    }
  }

  /** @return the currently active {@link Screen}. */
  def getScreen: Screen = screen
}

