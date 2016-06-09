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
package com.badlogic.gdx.files

import scala.scalajs.js
import scala.scalajs.js.annotation.JSName

/** Represents a file or directory on the filesystem, classpath, Android SD card, or Android assets directory. FileHandles are
  * created via a {@link Files} instance.
  *
  * Because some of the file types are backed by composite files and may be compressed (for example, if they are in an Android .apk
  * or are found via the classpath), the methods for extracting a {@link #path()} or {@link #file()} may not be appropriate for all
  * types. Use the Reader or Stream methods here to hide these dependencies from your platform independent code.
  *
  * @author mzechner
  * @author Nathan Sweet */
@JSName("gdx.files.FileHandle")
@js.native
trait FileHandle extends js.Object {
  /** Reads the entire file into a string using the platform's default charset.
    * @throws GdxRuntimeException if the file handle represents a directory, doesn't exist, or could not be read. */
  def readString(): String = js.native

}