package com.badlogic.gdx.scenes.scene2d

import com.badlogic.gdx.InputProcessor
import org.scalajs.dom.raw._
import scala.scalajs.js
import scala.scalajs.js.annotation._


@JSName("gdx.scenes.scene2d.Stage")
@js.native
class Stage extends InputProcessor {
  def act(): Unit = js.native
  def draw(): Unit = js.native
}
