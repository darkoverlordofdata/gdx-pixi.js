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

import com.badlogic.gdx.audio.Sound
import com.badlogic.gdx.files.FileHandle

import scala.scalajs.js
import scala.scalajs.js.annotation.JSName

/** This interface encapsulates the creation and management of audio resources. It allows you to get direct access to the audio
  * hardware via the {@link AudioDevice} and {@link AudioRecorder} interfaces, create sound effects via the {@link Sound} interface
  * and play music streams via the {@link Music} interface.
  *
  * <p>
  * All resources created via this interface have to be disposed as soon as they are no longer used.
  * </p>
  *
  * <p>
  * Note that all {@link Music} instances will be automatically paused when the {@link ApplicationListener#pause()} method is
  * called, and automatically resumed when the {@link ApplicationListener#resume()} method is called.
  * </p>
  *
  * @author mzechner */
@JSName("gdx.Audio")
@js.native
trait Audio extends js.Object {

  /** <p>
    * Creates a new {@link Sound} which is used to play back audio effects such as gun shots or explosions. The Sound's audio data
    * is retrieved from the file specified via the {@link FileHandle}. Note that the complete audio data is loaded into RAM. You
    * should therefore not load big audio files with this methods. The current upper limit for decoded audio is 1 MB.
    * </p>
    *
    * <p>
    * Currently supported formats are WAV, MP3 and OGG.
    * </p>
    *
    * <p>
    * The Sound has to be disposed if it is no longer used via the {@link Sound#dispose()} method.
    * </p>
    *
    * @return the new Sound
    * @throws GdxRuntimeException in case the sound could not be loaded */
  def newSound(raw: FileHandle):Sound = js.native
}
