package com.badlogic.gdx

import scala.scalajs.js
import scala.scalajs.js.annotation._

@JSName("gdx.Input.Buttons")
@js.native
class Buttons extends js.Object {
  val LEFT: Double = js.native
  val RIGHT: Double = js.native
  val MIDDLE: Double = js.native
  val BACK: Double = js.native
  val FORWARD: Double = js.native
}

@JSName("gdx.Input.Keys")
@js.native
class Keys extends js.Object {
  val A: Double = js.native
  val Z: Double = js.native
}

@JSName("gdx.Input")
@js.native
object Input extends js.Object {
  val Buttons : Buttons = js.native
  val Keys : Keys = js.native
}

@JSName("gdx.Input")
@js.native
class Input extends js.Object {
  def setInputProcessor(processor: InputProcessor): Unit = js.native
}

