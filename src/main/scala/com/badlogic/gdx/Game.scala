package com.badlogic.gdx

import scala.scalajs.js
import scala.scalajs.js.annotation.JSName

@JSName("gdx.Game")
@js.native
class Game extends js.Object {
  var screen: Screen = js.native
  def dispose(): Unit = js.native
  def pause(): Unit = js.native
  def resume(): Unit = js.native
  def render(): Unit = js.native
  def resize(): Unit = js.native
  def setScreen(screen:Screen): Unit = js.native
  def getScreen: Screen = js.native
  def create(): Unit = js.native
}

