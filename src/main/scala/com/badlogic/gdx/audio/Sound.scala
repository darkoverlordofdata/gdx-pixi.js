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
package com.badlogic.gdx.audio

import scala.scalajs.js
import scala.scalajs.js.annotation.JSName

/** <p>
  * A Sound is a short audio clip that can be played numerous times in parallel. It's completely loaded into memory so only load
  * small audio files. Call the {@link #dispose()} method when you're done using the Sound.
  * </p>
  *
  * <p>
  * Sound instances are created via a call to {@link Audio#newSound(FileHandle)}.
  * </p>
  *
  * <p>
  * Calling the {@link #play()} or {@link #play(float)} method will return a long which is an id to that instance of the sound. You
  * can use this id to modify the playback of that sound instance.
  * </p>
  *
  * <p>
  * <b>Note</b>: any values provided will not be clamped, it is the developer's responsibility to do so
  * </p>
  *
  * @author badlogicgames@gmail.com */
@JSName("gdx.audio.Sound")
@js.native
trait Sound extends js.Object {

  /** Plays the sound. If the sound is already playing, it will be played again, concurrently.
    * @return the id of the sound instance if successful, or -1 on failure. */
  def play(): Unit = js.native
}
