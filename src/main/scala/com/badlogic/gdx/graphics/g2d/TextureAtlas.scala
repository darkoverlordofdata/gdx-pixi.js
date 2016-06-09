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
package com.badlogic.gdx.graphics.g2d

import com.badlogic.gdx.files.FileHandle

import scala.scalajs.js
import scala.scalajs.js.annotation.JSName

/** Loads images from texture atlases created by TexturePacker.<br>
  * <br>
  * A TextureAtlas must be disposed to free up the resources consumed by the backing textures.
  * @author Nathan Sweet */
@JSName("gdx.graphics.g2d.TextureAtlas")
@js.native
class TextureAtlas extends js.Object {
  /** Loads the specified pack file, using the parent directory of the pack file to find the page images. */
  def this(file: FileHandle) = this()

  /** Returns the first region found with the specified name as a sprite. If whitespace was stripped from the region when it was
    * packed, the sprite is automatically positioned as if whitespace had not been stripped. This method uses string comparison to
    * find the region and constructs a new sprite, so the result should be cached rather than calling this method multiple times.
    * @return The sprite, or null. */
  def createSprite(name:String): Sprite = js.native
}
