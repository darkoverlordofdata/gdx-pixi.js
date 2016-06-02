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
