package com.badlogic.gdx.graphics.g2d

import com.badlogic.gdx.files.FileHandle

import scala.scalajs.js
import scala.scalajs.js.annotation.JSName

@JSName("gdx.graphics.g2d.TextureAtlas")
@js.native
class TextureAtlas extends js.Object {
  def this(file: FileHandle) = this()
  def createSprite(name:String): Sprite = js.native
}
