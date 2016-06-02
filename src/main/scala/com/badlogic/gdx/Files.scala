package com.badlogic.gdx

import com.badlogic.gdx.files.FileHandle

import scala.scalajs.js
import scala.scalajs.js.annotation.JSName

@JSName("gdx.Files")
@js.native
class Files extends js.Object {

  def internal(path: String): FileHandle = js.native
}
