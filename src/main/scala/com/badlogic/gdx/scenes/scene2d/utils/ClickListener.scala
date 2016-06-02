package com.badlogic.gdx.scenes.scene2d.utils

import com.badlogic.gdx.scenes.scene2d.{InputListener, InputEvent}

import scala.scalajs.js
import scala.scalajs.js.annotation.JSName

@JSName("gdx.scenes.scene2d.utils.ClickListener")
@js.native
class ClickListener extends InputListener {

  def clicked(event:InputEvent, x: Float, y: Float): Unit = js.native
}
