package com.badlogic.gdx

import com.badlogic.gdx.audio.Sound
import com.badlogic.gdx.files.FileHandle

import scala.scalajs.js
import scala.scalajs.js.annotation.JSName

@JSName("gdx.Audio")
@js.native
trait Audio extends js.Object {

  def newSound(raw: FileHandle):Sound = js.native
}
