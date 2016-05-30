package com.badlogic.gdx

import com.badlogic.gdx.graphics.GL20

import scala.scalajs.js
import scala.scalajs.js.annotation.JSName

@JSName("gdx.Gdx")
@js.native
object Gdx extends js.Object {

  val app:JsApplication = js.native
  val graphics: Graphics = js.native
  val audio: Audio = js.native
  val input: Input = js.native
  val files: Files = js.native
  val gl: GL20 = js.native
}

