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
package com.badlogic.gdx.graphics

import com.badlogic.gdx.files.FileHandle

import scala.scalajs.js
import scala.scalajs.js.annotation.JSName

@JSName("gdx.graphics.Texture.TextureFilter")
@js.native
class TextureFilter extends js.Object {
  val Linear: Int = js.native
  val MipMapLinearLinear: Int = js.native
}

/** A Texture wraps a standard OpenGL ES texture.
  * <p>
  * A Texture can be managed. If the OpenGL context is lost all managed textures get invalidated. This happens when a user switches
  * to another application or receives an incoming call. Managed textures get reloaded automatically.
  * <p>
  * A Texture has to be bound via the {@link Texture#bind()} method in order for it to be applied to geometry. The texture will be
  * bound to the currently active texture unit specified via {@link GL20#glActiveTexture(int)}.
  * <p>
  * You can draw {@link Pixmap}s to a texture at any time. The changes will be automatically uploaded to texture memory. This is of
  * course not extremely fast so use it with care. It also only works with unmanaged textures.
  * <p>
  * A Texture must be disposed when it is no longer used
  * @author badlogicgames@gmail.com */
@JSName("gdx.graphics.Texture")
@js.native
class Texture extends js.Object {
  def this(raw: FileHandle) = this()
  def this(path: String) = this()
  def setFilter(minFilter: Int, magFilter: Int): Unit = js.native
}

@JSName("gdx.graphics.Texture")
@js.native
object Texture extends js.Object {
  val TextureFilter:TextureFilter = js.native
}
