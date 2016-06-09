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

import com.badlogic.gdx.files.FileHandle

import scala.scalajs.js
import scala.scalajs.js.annotation.JSName

/** Provides standard access to the filesystem, classpath, Android SD card, and Android assets directory.
  * @author mzechner
  * @author Nathan Sweet */
@JSName("gdx.Files")
@js.native
trait Files extends js.Object {

  /** Convenience method that returns a {@link FileType#Internal} file handle. */
  def internal(path: String): FileHandle = js.native
}
